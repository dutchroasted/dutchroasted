"use client";

import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { getAffiliateUrl } from "@/lib/affiliate";
import type { OutfitResultData } from "@/lib/outfitTypes";

type OutfitResultProps = {
  result: OutfitResultData;
  originalImage: string;
  onNewCheck: () => void;
};

export function OutfitResult({ result, originalImage, onNewCheck }: OutfitResultProps) {
  const [feedback, setFeedback] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<string>(result.shareQuote);

  const adviceText = useMemo(() => formatAdvice(result), [result]);

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
    try {
      if (!isProcessedOutfitImage(originalImage)) {
        showFeedback("De outfitfoto ontbreekt. Upload de foto opnieuw voordat je deelt.");
        return;
      }

      const imageBlob = await createShareImage(
        originalImage,
        result.score,
        selectedQuote,
      );
      const file = new File([imageBlob], "outfit-roaster-share-card.png", {
        type: "image/png",
      });
      const caption = formatShareCaption(selectedQuote, window.location.origin);

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Mijn Outfit Roaster verdict",
          text: caption,
          files: [file],
        });
        showFeedback("Delen geopend");
        return;
      }

      downloadBlob(imageBlob, "outfit-roaster-share-card.png");
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
    <section className="dr-fade-in space-y-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200">
          Outfit verdict
        </p>
        <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">
          Je stylingrapport.
        </h2>
      </div>

      {feedback ? (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-100">
          {feedback}
        </div>
      ) : null}

      <div className="space-y-3">
        <SharePreviewCard
          score={result.score}
          quote={selectedQuote}
          originalImage={originalImage}
        />
        <button
          type="button"
          onClick={handleShare}
          className="min-h-12 w-full rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-black transition hover:bg-orange-400 hover:shadow-[0_18px_70px_rgba(255,106,0,0.28)] sm:w-auto"
        >
          Deel deze roast
        </button>
      </div>

      <QuoteOptions
        quotes={result.alternativeQuotes}
        selectedQuote={selectedQuote}
        onSelect={setSelectedQuote}
      />

      <ResultBlock title="🔥 De volledige roast" featured>
        <p className="whitespace-pre-line text-lg font-bold leading-8 text-white">{result.roast}</p>
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
      </ResultBlock>

      <div className="grid gap-4 md:grid-cols-2">
        <ResultList title="👀 Wat werkt goed" items={result.worksWell} />
        <ResultList title="⚠️ Wat kan beter" items={result.canImprove} />
      </div>
      <ResultList title="✨ Stylingtips" items={result.stylingTips} featured />
      <ShopSuggestions suggestions={result.shoppingSuggestions} />

      <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-zinc-400">
        Outfit Roaster gebruikt AI voor stylingfeedback. De feedback is bedoeld als inspiratie en
        advies, niet als professioneel of definitief oordeel.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <button
          type="button"
          onClick={handleCopy}
          className="min-h-12 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/10"
        >
          Kopieer advies
        </button>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="min-h-12 rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-black text-orange-100 transition hover:bg-orange-500 hover:text-black"
        >
          Download PDF
        </button>
        <button
          type="button"
          onClick={onNewCheck}
          className="min-h-12 rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-black shadow-[0_16px_50px_rgba(255,106,0,0.18)] transition hover:bg-orange-400"
        >
          Nieuwe check
        </button>
      </div>
    </section>
  );
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
      className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-[#080808] shadow-2xl shadow-black/40"
    >
      <img
        src={originalImage}
        alt="Outfitfoto in de deelkaart"
        data-share-photo="true"
        className="absolute inset-0 size-full object-cover opacity-95"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.02)_62%,rgba(0,0,0,0.8))]" />
      <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black leading-none text-white">
              Outfit <span className="text-orange-500">Roaster</span>
            </p>
            <p className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-200">
              roast my outfit
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/15 bg-black/74 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-4">
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
    <section className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-300">
        Kies je favoriet
      </p>
      <h3 className="mt-2 text-2xl font-black text-white">Andere roasts</h3>
      <div className="mt-5 space-y-3">
        {quotes.map((quote) => {
          const isSelected = quote === selectedQuote;

          return (
            <div
              key={quote}
              className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                isSelected
                  ? "border-orange-500/60 bg-orange-500/10"
                  : "border-white/10 bg-white/[0.035]"
              }`}
            >
              <p className="font-bold leading-7 text-white">“{quote}”</p>
              <button
                type="button"
                onClick={() => onSelect(quote)}
                disabled={isSelected}
                className="min-h-10 shrink-0 rounded-xl border border-orange-500/40 px-4 py-2 text-sm font-black text-orange-200 transition hover:bg-orange-500 hover:text-black disabled:cursor-default disabled:border-white/10 disabled:bg-white/5 disabled:text-zinc-500"
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
    <ResultBlock title="🛍️ Shop suggesties">
      <div className="grid gap-3 sm:grid-cols-2">
        {suggestions.map((suggestion) => {
          const affiliateUrl = getAffiliateUrl(suggestion.searchQuery);

          return (
            <article
              key={`${suggestion.label}-${suggestion.searchQuery}`}
              className="dr-card-hover rounded-2xl border border-white/10 bg-black/45 p-5 hover:border-orange-500/35 hover:bg-orange-500/[0.06]"
            >
              <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-300">
                Waarom dit helpt
              </p>
              <h4 className="mt-2 text-lg font-black leading-6 text-white">{suggestion.label}</h4>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{suggestion.reason}</p>
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-black text-black transition hover:bg-orange-400 hover:shadow-[0_14px_45px_rgba(255,106,0,0.18)]"
              >
                Zoek dit item
              </a>
              <p className="mt-3 text-xs leading-5 text-zinc-500">
                Affiliate links komen later.
              </p>
            </article>
          );
        })}
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
      className={`dr-card-hover rounded-3xl border p-5 sm:p-6 ${
        featured
          ? "border-orange-500/30 bg-orange-500/[0.08] shadow-[0_22px_80px_rgba(255,106,0,0.1)]"
          : "border-white/10 bg-zinc-950/80 hover:border-white/20"
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
  const height = 1350;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas is not available");
  }

  canvas.width = width;
  canvas.height = height;
  drawImageCover(context, photo, width, height);

  const topShade = context.createLinearGradient(0, 0, 0, 300);
  topShade.addColorStop(0, "rgba(0,0,0,0.62)");
  topShade.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = topShade;
  context.fillRect(0, 0, width, 300);

  const bottomShade = context.createLinearGradient(0, 850, 0, height);
  bottomShade.addColorStop(0, "rgba(0,0,0,0)");
  bottomShade.addColorStop(0.38, "rgba(0,0,0,0.52)");
  bottomShade.addColorStop(1, "rgba(0,0,0,0.96)");
  context.fillStyle = bottomShade;
  context.fillRect(0, 800, width, height - 800);

  context.fillStyle = "#ffffff";
  context.font = "900 38px Arial, sans-serif";
  context.fillText("Outfit", 64, 78);
  context.fillStyle = "#ff6a00";
  context.fillText("Roaster", 178, 78);
  context.fillStyle = "rgba(255,255,255,0.78)";
  context.font = "900 18px Arial, sans-serif";
  context.fillText("ROAST MY OUTFIT", 64, 112);

  context.fillStyle = "#ff6a00";
  roundRect(context, 64, 1100, 220, 150, 28);
  context.fill();
  context.fillStyle = "#090909";
  context.font = "900 20px Arial, sans-serif";
  context.fillText("SCORE", 92, 1142);
  context.font = "900 58px Arial, sans-serif";
  context.fillText(`${score}/10`, 92, 1212);

  context.fillStyle = "#ffffff";
  context.font = "900 44px Arial, sans-serif";
  drawWrappedText(context, `“${selectedQuote}”`, 330, 1128, 680, 54, 3);

  context.fillStyle = "rgba(255,255,255,0.62)";
  context.font = "900 18px Arial, sans-serif";
  context.fillText("OUTFITROASTER.NL", 64, 1300);

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
  return [
    "Mijn outfit is geroast door Outfit Roaster 🔥",
    selectedQuote,
    `Probeer zelf: ${appUrl}`,
  ].join("\n");
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
    "🛍️ Shop suggesties",
    ...result.shoppingSuggestions.map((item) => `- ${item.label}: ${item.reason}`),
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
    "Shop suggesties",
    result.shoppingSuggestions.map((item) => `${item.label}: ${item.reason}`),
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
