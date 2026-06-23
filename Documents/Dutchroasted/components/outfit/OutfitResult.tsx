"use client";

import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { analytics } from "@/lib/analytics";
import type { OutfitResultData } from "@/lib/outfitTypes";
import { ProAnalysisTeaser } from "./ProAnalysisTeaser";

const FALLBACK_QUOTE_OPTIONS = [
  "Je schoenen en kleding zitten duidelijk niet in dezelfde groepsapp.",
  "De basis staat, maar de styling mist nog een eindredacteur.",
  "Deze look heeft potentie, maar wacht nog op een duidelijke beslissing.",
];

type OutfitResultProps = {
  result: OutfitResultData;
  originalImage: string;
  disabled: boolean;
  onNewCheck: () => void;
};

export function OutfitResult({ result, originalImage, disabled, onNewCheck }: OutfitResultProps) {
  const [feedback, setFeedback] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<string>(result.shareQuote);
  const [isSharing, setIsSharing] = useState(false);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);

  const adviceText = useMemo(() => formatAdvice(result), [result]);
  const quoteOptions = useMemo(
    () => getQuoteOptions(result.shareQuote, result.alternativeQuotes),
    [result],
  );

  useEffect(() => {
    setSelectedQuote(result.shareQuote);
  }, [result]);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 4500);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(adviceText);
      showFeedback("Advies gekopieerd");
    } catch {
      showFeedback("Kopiëren lukt niet");
    }
  }

  async function handleShare() {
    if (
      disabled ||
      isSharing ||
      isCreatingVideo ||
      !result ||
      !isProcessedOutfitImage(originalImage)
    ) {
      showFeedback("De deelkaart is nog niet klaar. Wacht tot foto en analyse volledig geladen zijn.");
      return;
    }

    setIsSharing(true);
    try {
      const imageBlob = await createShareImage(
        originalImage,
        result.score,
        selectedQuote,
      );
      const file = new File([imageBlob], "outfit-roaster-instagram-story.png", {
        type: "image/png",
      });
      const caption = formatShareCaption(selectedQuote, window.location.origin);

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Mijn Outfit Roaster verdict",
          text: caption,
          files: [file],
        });
        analytics.shareCardShared(result.score);
        showFeedback("Delen geopend");
        return;
      }

      downloadBlob(imageBlob, "outfit-roaster-instagram-story.png");
      analytics.shareCardDownloaded(result.score);
      try {
        await navigator.clipboard.writeText(caption);
        showFeedback(
          "Afbeelding gedownload en tekst gekopieerd. Plaats hem nu in Instagram, WhatsApp of TikTok.",
        );
      } catch {
        showFeedback("Afbeelding gedownload. De caption kon niet worden gekopieerd.");
      }
    } catch {
      showFeedback("Delen lukt niet. Probeer opnieuw.");
    } finally {
      setIsSharing(false);
    }
  }

  async function handleCreateVideo() {
    if (
      disabled ||
      isSharing ||
      isCreatingVideo ||
      !isProcessedOutfitImage(originalImage)
    ) {
      showFeedback("De video is nog niet klaar. Wacht tot foto en analyse volledig geladen zijn.");
      return;
    }

    setIsCreatingVideo(true);
    setFeedback("Video wordt gemaakt…");

    try {
      const video = await createOutfitVideo(
        originalImage,
        result.score,
        selectedQuote || result.roast.split("\n")[0] || result.shareQuote,
      );
      downloadBlob(video.blob, `outfitroaster-tiktok.${video.extension}`);
      showFeedback(`Video gedownload als ${video.extension.toUpperCase()}.`);
    } catch (error) {
      console.error("Outfit video generation failed:", error);
      showFeedback("Video maken lukt niet, probeer opnieuw.");
    } finally {
      setIsCreatingVideo(false);
    }
  }

  function handleDownloadPdf() {
    try {
      showFeedback("PDF wordt gemaakt");
      const openedInTab = downloadResultPdf(result);
      showFeedback(
        openedInTab
          ? "PDF geopend en download gestart"
          : "PDF-download gestart. Check je Downloads-map.",
      );
    } catch {
      showFeedback("Download lukt niet. Probeer het opnieuw.");
    }
  }

  return (
    <section className="dr-fade-in space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="dr-kicker">AI styling verdict</p>
          <h2 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl">
            Je fit. <span className="text-orange-400">Ongefilterd.</span>
          </h2>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-300/20 bg-orange-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-orange-100">
          <span className="size-2 rounded-full bg-orange-400 shadow-[0_0_16px_rgba(251,146,60,0.9)]" />
          Klaar om te delen
        </div>
      </div>

      {feedback ? (
        <div className="rounded-2xl border border-orange-400/30 bg-orange-400/10 px-4 py-3 text-sm font-bold text-orange-100 backdrop-blur-xl">
          {feedback}
        </div>
      ) : null}

      <div className="dr-glass-card space-y-4 rounded-[2rem] p-3 sm:p-4">
        <SharePreviewCard
          score={result.score}
          quote={selectedQuote}
          originalImage={originalImage}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleShare}
            disabled={
              disabled ||
              isSharing ||
              isCreatingVideo ||
              !isProcessedOutfitImage(originalImage)
            }
            className="dr-primary-button min-h-12 w-full px-6 py-3 text-sm"
          >
            {isSharing ? "Deelkaart maken..." : "Deel deze roast"}
          </button>
          <button
            type="button"
            onClick={handleCreateVideo}
            disabled={
              disabled ||
              isSharing ||
              isCreatingVideo ||
              !isProcessedOutfitImage(originalImage)
            }
            className="dr-secondary-button min-h-12 w-full px-6 py-3 text-sm"
          >
            {isCreatingVideo ? "Video wordt gemaakt…" : "Maak TikTok-video"}
          </button>
        </div>
      </div>

      <QuoteOptions
        quotes={quoteOptions}
        selectedQuote={selectedQuote}
        onSelect={(quote) => {
          setSelectedQuote(quote);
          analytics.quoteChanged(quoteOptions.indexOf(quote));
        }}
      />

      <ResultBlock title="🔥 De volledige roast" featured>
        <p className="whitespace-pre-line text-lg font-bold leading-8 text-white">{result.roast}</p>
        {result.stylingTips.length > 0 ? (
          <div className="mt-5 border-t border-orange-400/20 pt-5">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-orange-300">
              De snelste upgrades
            </p>
            <ul className="space-y-2 text-zinc-200">
              {result.stylingTips.slice(0, 3).map((tip) => (
                <li key={tip} className="flex gap-3 leading-7">
                  <span className="mt-3 size-1.5 shrink-0 rounded-full bg-orange-500" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </ResultBlock>

      <div className="grid gap-4 md:grid-cols-2">
        <ResultList title="👀 Wat werkt goed" items={result.worksWell} />
        {result.canImprove.length > 0 ? (
          <ResultList title="⚠️ Wat kan beter" items={result.canImprove} />
        ) : null}
      </div>
      {result.stylingTips.length > 0 ? (
        <ResultList title="✨ Stylingtips" items={result.stylingTips} featured />
      ) : null}
      <ShopSuggestions suggestions={result.shoppingSuggestions} />
      <ProAnalysisTeaser />

      <p className="dr-glass-card rounded-2xl p-4 text-sm leading-6 text-zinc-400">
        Outfit Roaster gebruikt AI voor stylingfeedback. De feedback is bedoeld als inspiratie en
        advies, niet als professioneel of definitief oordeel.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <button
          type="button"
          onClick={handleCopy}
          className="dr-secondary-button min-h-12 px-4 py-3 text-sm"
        >
          Kopieer advies
        </button>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="dr-secondary-button min-h-12 px-4 py-3 text-sm"
        >
          Download PDF
        </button>
        <button
          type="button"
          onClick={onNewCheck}
          className="dr-primary-button min-h-12 px-4 py-3 text-sm"
        >
          Nieuwe check
        </button>
      </div>
    </section>
  );
}

function getQuoteOptions(shareQuote: string, alternativeQuotes: string[]) {
  return [shareQuote, ...alternativeQuotes, ...FALLBACK_QUOTE_OPTIONS]
    .map((quote) => quote.trim())
    .filter(
      (quote, index, quotes) =>
        quote &&
        quotes.findIndex(
          (candidate) => candidate.toLowerCase() === quote.toLowerCase(),
        ) === index,
    )
    .slice(0, 3);
}

function SharePreviewCard({
  score,
  quote,
  originalImage,
}: {
  score: number;
  quote: string;
  originalImage: string;
}) {
  return (
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-[1.65rem] border border-white/10 bg-[#080808] shadow-[0_32px_100px_rgba(0,0,0,0.55)]"
    >
      <img
        src={originalImage}
        alt="Outfitfoto in de deelkaart"
        data-share-photo="true"
        className="absolute inset-0 size-full object-cover opacity-95"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.36),rgba(0,0,0,0.02)_45%,rgba(0,0,0,0.92))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(255,106,0,0.22),transparent_30%)]" />
      <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black leading-none text-white">
              Outfit <span className="text-orange-500">Roaster</span>
            </p>
            <p className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-200">
              jouw outfit verdict
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/15 bg-black/70 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-4">
          <div className="grid grid-cols-[5.9rem_1fr] items-center gap-3 sm:grid-cols-[6.6rem_1fr] sm:gap-4">
            <div className="rounded-2xl bg-orange-500 px-3 py-2 text-black">
              <p className="text-[9px] font-black uppercase tracking-[0.16em]">Score</p>
              <p className="mt-1 whitespace-nowrap text-2xl font-black leading-none sm:text-3xl">
                {score}/10
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-300">
                Roast
              </p>
              <p className="mt-1 text-xl font-black leading-6 text-white sm:text-2xl sm:leading-7">
                “{quote}”
              </p>
              <p className="mt-2 text-[10px] font-black tracking-[0.12em] text-orange-300">
                #outfitroaster
              </p>
            </div>
          </div>
          <p className="mt-2 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-400">
            OutfitRoaster.nl
          </p>
        </div>
      </div>
    </div>
  );
}

function QuoteOptions({
  quotes,
  selectedQuote,
  onSelect,
}: {
  quotes: string[];
  selectedQuote: string;
  onSelect: (quote: string) => void;
}) {
  return (
    <section className="dr-glass-card rounded-[2rem] p-5 sm:p-6">
      <p className="dr-kicker">
        Kies je favoriet
      </p>
      <h3 className="mt-2 text-2xl font-black text-white">Kies je roast</h3>
      <div className="mt-5 space-y-3">
        {quotes.map((quote) => {
          const isSelected = quote === selectedQuote;

          return (
            <div
              key={quote}
              className={`flex flex-col gap-3 rounded-2xl border p-4 transition sm:flex-row sm:items-center sm:justify-between ${
                isSelected
                  ? "border-orange-400/60 bg-orange-400/10 shadow-[0_14px_45px_rgba(255,106,0,0.1)]"
                  : "border-white/10 bg-black/25 hover:border-white/20 hover:bg-white/[0.05]"
              }`}
            >
              <p className="font-bold leading-7 text-white">“{quote}”</p>
              <button
                type="button"
                onClick={() => onSelect(quote)}
                disabled={isSelected}
                className="min-h-10 shrink-0 rounded-xl border border-orange-400/40 px-4 py-2 text-sm font-black text-orange-100 transition hover:bg-orange-400 hover:text-black disabled:cursor-default disabled:border-white/10 disabled:bg-white/5 disabled:text-zinc-500"
              >
                {isSelected ? "In gebruik" : "Gebruik deze"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ShopSuggestions({ suggestions }: { suggestions: OutfitResultData["shoppingSuggestions"] }) {
  return (
    <ResultBlock title="🛍️ Shop de upgrade">
      <div className="grid gap-3 sm:grid-cols-2">
        {suggestions.map((suggestion) => (
            <article
              key={`${suggestion.title}-${suggestion.productUrl}`}
              className="dr-card-hover group overflow-hidden rounded-3xl border border-white/10 bg-black/35 hover:border-orange-400/35 hover:bg-orange-400/[0.06]"
            >
              {suggestion.imageUrl ? (
                <img
                  src={suggestion.imageUrl}
                  alt=""
                  className="aspect-[4/3] w-full bg-zinc-900 object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : null}
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-300">
                  {suggestion.category}
                </p>
                <h4 className="mt-2 text-lg font-black leading-6 text-white">{suggestion.title}</h4>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{suggestion.reason}</p>
                <a
                  href={suggestion.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() =>
                    analytics.shopItemClicked(suggestion.category, suggestion.searchQuery)
                  }
                  className="dr-primary-button mt-5 inline-flex min-h-11 items-center px-4 py-2 text-sm"
                >
                  Bekijk bij Zalando
                </a>
              </div>
            </article>
          ))}
      </div>
    </ResultBlock>
  );
}

function ResultList({ title, items, featured = false }: { title: string; items: string[]; featured?: boolean }) {
  return (
    <ResultBlock title={title} featured={featured}>
      <ul className="space-y-3 text-zinc-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-7">
            <span className="mt-3 size-1.5 shrink-0 rounded-full bg-orange-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </ResultBlock>
  );
}

function ResultBlock({ title, children, featured = false }: { title: string; children: React.ReactNode; featured?: boolean }) {
  return (
    <article
      className={`dr-card-hover rounded-[2rem] border p-5 backdrop-blur-xl sm:p-6 ${
        featured
          ? "border-orange-400/30 bg-[linear-gradient(145deg,rgba(255,106,0,0.12),rgba(255,255,255,0.035))] shadow-[0_22px_80px_rgba(255,106,0,0.1)]"
          : "border-white/10 bg-zinc-950/65 hover:border-white/20"
      }`}
    >
      <h3 className="mb-4 text-xl font-black text-white">{title}</h3>
      {children}
    </article>
  );
}

function getScoreVerdict(score: number) {
  if (score <= 4) {
    return "Ai… werk aan de winkel";
  }

  if (score <= 6) {
    return "Niet slecht, maar veilig";
  }

  if (score <= 8) {
    return "Sterke fit";
  }

  return "Catwalkwaardig";
}

function isProcessedOutfitImage(image: string) {
  return image.startsWith("data:image/jpeg;base64,") && image.length > 100;
}

async function createShareImage(
  originalImage: string,
  score: number,
  selectedQuote: string,
) {
  if (!isProcessedOutfitImage(originalImage)) {
    throw new Error("Outfit photo is not available");
  }

  const photo = await loadShareImage(originalImage);
  if (photo.naturalWidth === 0 || photo.naturalHeight === 0) {
    throw new Error("Share card outfit photo could not be decoded");
  }

  const width = 1080;
  const height = 1920;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas is not available");
  }

  canvas.width = width;
  canvas.height = height;
  context.fillStyle = "#050505";
  context.fillRect(0, 0, width, height);
  drawImageCover(context, photo, width, height);

  const topShade = context.createLinearGradient(0, 0, 0, 520);
  topShade.addColorStop(0, "rgba(0,0,0,0.78)");
  topShade.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = topShade;
  context.fillRect(0, 0, width, 520);

  const bottomShade = context.createLinearGradient(0, 1050, 0, height);
  bottomShade.addColorStop(0, "rgba(0,0,0,0)");
  bottomShade.addColorStop(0.35, "rgba(0,0,0,0.64)");
  bottomShade.addColorStop(1, "rgba(0,0,0,0.98)");
  context.fillStyle = bottomShade;
  context.fillRect(0, 1050, width, height - 1050);

  // Instagram safe area: keep key content between y=250 and y=1670.
  context.fillStyle = "#ffffff";
  context.font = "900 42px Arial, sans-serif";
  context.fillText("Outfit", 72, 316);
  context.fillStyle = "#ff6a00";
  context.fillText("Roaster", 198, 316);
  context.fillStyle = "rgba(255,255,255,0.78)";
  context.font = "900 19px Arial, sans-serif";
  context.fillText("AI FASHION VERDICT", 72, 354);

  context.fillStyle = "rgba(8,8,8,0.82)";
  roundRect(context, 56, 1280, 968, 360, 44);
  context.fill();
  context.strokeStyle = "rgba(255,255,255,0.18)";
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = "#ff6a00";
  roundRect(context, 92, 1340, 218, 176, 30);
  context.fill();
  context.fillStyle = "#090909";
  context.font = "900 20px Arial, sans-serif";
  context.fillText("SCORE", 122, 1388);
  context.font = "900 62px Arial, sans-serif";
  context.fillText(`${score}/10`, 122, 1475);

  context.fillStyle = "#ffffff";
  context.font = "900 46px Arial, sans-serif";
  drawWrappedText(context, `“${selectedQuote}”`, 354, 1368, 610, 58, 4);

  context.fillStyle = "#ff9a4f";
  context.font = "900 22px Arial, sans-serif";
  context.fillText("#outfitroaster", 354, 1590);

  context.fillStyle = "rgba(255,255,255,0.62)";
  context.font = "900 19px Arial, sans-serif";
  context.fillText("OUTFITROASTER.NL", 92, 1620);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        reject(new Error("Could not create share image"));
      },
      "image/png",
      1,
    );
  });
}

const VIDEO_WIDTH = 1080;
const VIDEO_HEIGHT = 1920;
const VIDEO_DURATION_MS = 9500;

async function createOutfitVideo(
  originalImage: string,
  score: number,
  quote: string,
) {
  if (
    typeof MediaRecorder === "undefined" ||
    typeof HTMLCanvasElement.prototype.captureStream !== "function"
  ) {
    throw new Error("Video export is not supported in this browser");
  }

  const photo = await loadShareImage(originalImage);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas is not available");
  }

  canvas.width = VIDEO_WIDTH;
  canvas.height = VIDEO_HEIGHT;

  const stream = canvas.captureStream(30);
  const format = getSupportedVideoFormat();
  const chunks: Blob[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType: format.mimeType,
    videoBitsPerSecond: 8_000_000,
  });

  const recording = new Promise<Blob>((resolve, reject) => {
    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    });
    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, { type: format.mimeType });
      if (blob.size === 0) {
        reject(new Error("Video recorder returned an empty file"));
        return;
      }
      resolve(blob);
    });
    recorder.addEventListener("error", () => {
      reject(new Error("Video recorder failed"));
    });
  });

  recorder.start(250);
  const startedAt = performance.now();

  await new Promise<void>((resolve) => {
    function renderFrame(now: number) {
      const elapsed = Math.min(now - startedAt, VIDEO_DURATION_MS);
      drawOutfitVideoFrame(context!, photo, score, quote, elapsed);

      if (elapsed >= VIDEO_DURATION_MS) {
        resolve();
        return;
      }

      requestAnimationFrame(renderFrame);
    }

    requestAnimationFrame(renderFrame);
  });

  recorder.stop();
  const blob = await recording;
  stream.getTracks().forEach((track) => track.stop());

  return {
    blob,
    extension: format.extension,
  };
}

function getSupportedVideoFormat() {
  const formats = [
    { mimeType: "video/mp4;codecs=h264", extension: "mp4" },
    { mimeType: "video/mp4", extension: "mp4" },
    { mimeType: "video/webm;codecs=vp9", extension: "webm" },
    { mimeType: "video/webm;codecs=vp8", extension: "webm" },
    { mimeType: "video/webm", extension: "webm" },
  ];
  const supported = formats.find((format) =>
    MediaRecorder.isTypeSupported(format.mimeType),
  );

  if (!supported) {
    throw new Error("No supported video format is available");
  }

  return supported;
}

function drawOutfitVideoFrame(
  context: CanvasRenderingContext2D,
  photo: HTMLImageElement,
  score: number,
  quote: string,
  elapsedMs: number,
) {
  const elapsedSeconds = elapsedMs / 1000;
  const zoom = 1 + (elapsedMs / VIDEO_DURATION_MS) * 0.045;

  context.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
  context.fillStyle = "#050505";
  context.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
  drawImageCoverWithZoom(context, photo, VIDEO_WIDTH, VIDEO_HEIGHT, zoom);

  const fullShade = context.createLinearGradient(0, 0, 0, VIDEO_HEIGHT);
  fullShade.addColorStop(0, "rgba(0,0,0,0.48)");
  fullShade.addColorStop(0.45, "rgba(0,0,0,0.10)");
  fullShade.addColorStop(1, "rgba(0,0,0,0.78)");
  context.fillStyle = fullShade;
  context.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

  context.fillStyle = "#ffffff";
  context.font = "900 38px Arial, sans-serif";
  context.fillText("Outfit", 72, 154);
  context.fillStyle = "#ff6a00";
  context.fillText("Roaster", 188, 154);

  context.textAlign = "right";
  context.fillStyle = "rgba(255,255,255,0.82)";
  context.font = "900 20px Arial, sans-serif";
  context.fillText("OUTFITROASTER.COM", 1008, 150);
  context.textAlign = "left";

  if (elapsedSeconds >= 1.5 && elapsedSeconds < 3) {
    drawVideoPanel(context, phaseOpacity(elapsedSeconds, 1.5, 3));
    drawCenteredVideoText(
      context,
      "OutfitRoaster checkt…",
      960,
      78,
      870,
      1,
      "#ffffff",
    );
  } else if (elapsedSeconds >= 3 && elapsedSeconds < 5) {
    drawVideoPanel(context, phaseOpacity(elapsedSeconds, 3, 5));
    context.textAlign = "center";
    context.fillStyle = "#ff6a00";
    context.font = "900 190px Arial, sans-serif";
    context.fillText(`${score}/10`, VIDEO_WIDTH / 2, 1000);
    context.fillStyle = "#ffffff";
    context.font = "900 30px Arial, sans-serif";
    context.fillText("JOUW OUTFIT VERDICT", VIDEO_WIDTH / 2, 1070);
    context.textAlign = "left";
  } else if (elapsedSeconds >= 5 && elapsedSeconds < 8.5) {
    drawVideoPanel(context, phaseOpacity(elapsedSeconds, 5, 8.5));
    drawCenteredVideoText(context, `“${quote}”`, 870, 70, 860, 5, "#ffffff");
    context.textAlign = "center";
    context.fillStyle = "#ff9a4f";
    context.font = "900 27px Arial, sans-serif";
    context.fillText("#outfitroaster", VIDEO_WIDTH / 2, 1260);
    context.textAlign = "left";
  } else if (elapsedSeconds >= 8.5) {
    context.fillStyle = `rgba(5,5,5,${0.82 * phaseOpacity(elapsedSeconds, 8.5, 9.5)})`;
    context.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    context.textAlign = "center";
    context.fillStyle = "#ff6a00";
    context.font = "900 34px Arial, sans-serif";
    context.fillText("OUTFIT ROASTER", VIDEO_WIDTH / 2, 790);
    drawCenteredVideoText(
      context,
      "Roast jouw outfit op OutfitRoaster.com",
      900,
      68,
      870,
      3,
      "#ffffff",
    );
    context.textAlign = "left";
  }

  context.fillStyle = "rgba(0,0,0,0.58)";
  roundRect(context, 60, 1720, 960, 104, 28);
  context.fill();
  context.fillStyle = "#ffffff";
  context.font = "900 26px Arial, sans-serif";
  context.fillText("OutfitRoaster.com", 98, 1785);
  context.textAlign = "right";
  context.fillStyle = "#ff9a4f";
  context.fillText("#outfitroaster", 982, 1785);
  context.textAlign = "left";
}

function drawVideoPanel(context: CanvasRenderingContext2D, opacity: number) {
  context.fillStyle = `rgba(5,5,5,${0.72 * opacity})`;
  roundRect(context, 55, 650, 970, 650, 48);
  context.fill();
  context.strokeStyle = `rgba(255,255,255,${0.18 * opacity})`;
  context.lineWidth = 2;
  context.stroke();
}

function drawCenteredVideoText(
  context: CanvasRenderingContext2D,
  text: string,
  centerY: number,
  fontSize: number,
  maxWidth: number,
  maxLines: number,
  color: string,
) {
  context.font = `900 ${fontSize}px Arial, sans-serif`;
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
      return;
    }
    lines.push(line);
    line = word;
  });
  if (line) {
    lines.push(line);
  }

  const visibleLines = lines.slice(0, maxLines);
  const lineHeight = fontSize * 1.15;
  const startY = centerY - ((visibleLines.length - 1) * lineHeight) / 2;
  context.textAlign = "center";
  context.fillStyle = color;
  visibleLines.forEach((visibleLine, index) => {
    context.fillText(visibleLine, VIDEO_WIDTH / 2, startY + index * lineHeight);
  });
  context.textAlign = "left";
}

function drawImageCoverWithZoom(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  zoom: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * zoom;
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(
    image,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );
}

function phaseOpacity(current: number, start: number, end: number) {
  const fadeDuration = Math.min(0.35, (end - start) / 3);
  if (current < start + fadeDuration) {
    return Math.max(0, (current - start) / fadeDuration);
  }
  if (current > end - fadeDuration) {
    return Math.max(0, (end - current) / fadeDuration);
  }
  return 1;
}

function loadShareImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const timeout = window.setTimeout(
      () => reject(new Error("Outfit photo did not load in time")),
      8000,
    );

    image.onload = () => {
      window.clearTimeout(timeout);
      resolve(image);
    };
    image.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error("Outfit photo could not be loaded"));
    };
    image.src = source;
  });
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;
  context.drawImage(image, x, y, drawWidth, drawHeight);
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
      return;
    }

    lines.push(line);
    line = word;
  });

  if (line) {
    lines.push(line);
  }

  lines.slice(0, maxLines).forEach((visibleLine, index) => {
    context.fillText(visibleLine, x, y + index * lineHeight);
  });
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

function formatShareCaption(selectedQuote: string, appUrl: string) {
  const shareText = [
    "Mijn outfit is geroast door Outfit Roaster 🔥",
    "",
    `“${selectedQuote}”`,
    "",
    "#outfitroaster",
    "",
    `Probeer zelf: ${appUrl}`,
  ].join("\n");

  return /(^|\s)#outfitroaster(\s|$)/i.test(shareText)
    ? shareText
    : `${shareText.trim()}\n\n#outfitroaster`;
}

function formatAdvice(result: OutfitResultData) {
  return [
    "Mijn Outfit Roaster outfitcheck:",
    "",
    `⭐ Outfit score: ${result.score}/10`,
    "",
    "🔥 De roast",
    result.roast,
    "",
    "👀 Wat werkt goed",
    ...result.worksWell.map((item) => `- ${item}`),
    "",
    "⚠️ Wat kan beter",
    ...result.canImprove.map((item) => `- ${item}`),
    "",
    "✨ Stylingtips",
    ...result.stylingTips.map((item) => `- ${item}`),
    "",
    "🛍️ Shopsuggesties",
    ...result.shoppingSuggestions.map((item) => `- ${item.title}: ${item.reason}`),
    "",
    "Gemaakt met OutfitRoaster.nl",
  ].join("\n");
}

function downloadResultPdf(result: OutfitResultData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 16;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;
  let y = 18;

  function addWrappedText(text: string, fontSize = 11, lineHeight = 6) {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 18;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
  }

  function addSection(title: string, body: string | string[]) {
    if (y > 260) {
      doc.addPage();
      y = 18;
    }
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(title, margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");

    if (Array.isArray(body)) {
      body.forEach((item) => addWrappedText(`- ${item}`));
    } else {
      addWrappedText(body);
    }
  }

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Outfit Roaster", margin, y);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("AI outfit checker - outfitroaster.nl", margin, y + 7);

  doc.setFillColor(255, 106, 0);
  doc.roundedRect(pageWidth - 48, 14, 32, 20, 2, 2, "F");
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`${result.score}/10`, pageWidth - 42, 27);
  doc.setTextColor(0, 0, 0);
  y = 42;

  addSection("Roast", result.roast);
  addSection("Belangrijkste stylingtips", result.stylingTips.slice(0, 3));
  addSection("Wat werkt goed", result.worksWell);
  addSection("Wat kan beter", result.canImprove);
  addSection(
    "Shopsuggesties",
    result.shoppingSuggestions.map((item) => `${item.title}: ${item.reason}`),
  );

  y += 8;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Gemaakt met OutfitRoaster.nl", margin, y);

  const fileName = `outfit-roaster-check-${new Date().toISOString().slice(0, 10)}.pdf`;
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");

  link.href = pdfUrl;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();

  const openedWindow = window.open(pdfUrl, "_blank", "noopener,noreferrer");
  window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 60_000);

  return Boolean(openedWindow);
}
