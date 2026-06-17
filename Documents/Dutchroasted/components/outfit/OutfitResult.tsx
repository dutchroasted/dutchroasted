"use client";

import { useMemo, useRef, useState } from "react";
import { toBlob } from "html-to-image";
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
  const shareCardRef = useRef<HTMLDivElement>(null);

  const adviceText = useMemo(() => formatAdvice(result), [result]);
  const shareText = useMemo(() => formatShareText(result), [result]);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2200);
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
      const imageBlob = await createShareImage(shareCardRef.current);
      const file = new File([imageBlob], "dutchroasted-outfit-verdict.png", {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Mijn DutchRoasted outfit verdict",
          text: shareText,
          files: [file],
        });
        showFeedback("Deelbeeld geopend");
        return;
      }

      downloadBlob(imageBlob, "dutchroasted-outfit-verdict.png");
      try {
        await navigator.clipboard.writeText(shareText);
        showFeedback("Deelbeeld gedownload en tekst gekopieerd.");
      } catch {
        showFeedback("Deelbeeld gedownload.");
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

      <div className="relative">
        <SharePreviewCard shareRef={shareCardRef} result={result} originalImage={originalImage} />
        <button
          type="button"
          onClick={handleShare}
          className="absolute bottom-4 right-4 min-h-12 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-black shadow-[0_18px_60px_rgba(0,0,0,0.45)] transition hover:bg-orange-400 hover:shadow-[0_18px_70px_rgba(255,106,0,0.28)]"
        >
          Deel dit beeld
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ResultList title="👀 Wat werkt goed" items={result.worksWell} />
        <ResultList title="⚠️ Wat kan beter" items={result.canImprove} />
      </div>
      <ResultList title="✨ Stylingtips" items={result.stylingTips} featured />
      <ShopSuggestions suggestions={result.shoppingSuggestions} />

      <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-zinc-400">
        DutchRoasted gebruikt AI voor stylingfeedback. De feedback is bedoeld als inspiratie en
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
  result,
  originalImage,
  shareRef,
}: {
  result: OutfitResultData;
  originalImage: string;
  shareRef: React.RefObject<HTMLDivElement | null>;
}) {
  const verdict = getScoreVerdict(result.score);
  const strongestPoints = getStrongestSharePoints(result);

  return (
    <div
      ref={shareRef}
      className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-[#080808] shadow-2xl shadow-black/40"
    >
      <img
        src={originalImage}
        alt=""
        className="absolute inset-0 size-full object-cover opacity-95"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.04)_44%,rgba(0,0,0,0.82))]" />
      <div className="relative flex h-full flex-col justify-between p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-black leading-none text-white">
              Dutch<span className="text-orange-500">Roasted</span>
            </p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-200">
              Outfit rating
            </p>
          </div>
          <div className="rounded-3xl bg-orange-500 px-5 py-4 text-right text-black shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
            <p className="text-[10px] font-black uppercase tracking-[0.18em]">Score</p>
            <p className="text-6xl font-black leading-none">{result.score}</p>
            <p className="text-sm font-black leading-none">/10</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/15 bg-black/70 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-5">
          <p className="inline-flex rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black">
            {verdict}
          </p>
          <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-orange-300">
            Roast
          </p>
          <p className="mt-2 text-xl font-black leading-7 text-white sm:text-2xl sm:leading-8">
            “{result.roast}”
          </p>
          <ul className="mt-4 space-y-1.5">
            {strongestPoints.map((point) => (
              <li key={point} className="flex gap-2 text-sm font-bold leading-5 text-zinc-100">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
            DutchRoasted.nl
          </p>
        </div>
      </div>
    </div>
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

function getStrongestSharePoints(result: OutfitResultData) {
  const points = [
    ...result.worksWell.slice(0, 1),
    ...result.canImprove.slice(0, 1),
    ...result.stylingTips.slice(0, 1),
  ];

  return points.map(shortenSharePoint).filter(Boolean).slice(0, 3);
}

function shortenSharePoint(point: string) {
  const cleanedPoint = point.replace(/^[-•\s]+/, "").trim();
  if (cleanedPoint.length <= 92) {
    return cleanedPoint;
  }

  return `${cleanedPoint.slice(0, 89).trim()}...`;
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

async function createShareImage(element: HTMLElement | null) {
  if (!element) {
    throw new Error("Share card is not available");
  }

  const blob = await toBlob(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#050505",
  });

  if (!blob) {
    throw new Error("Could not create share image");
  }

  return blob;
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

function formatShareText(result: OutfitResultData) {
  return [
    "Ik liet mijn outfit checken door DutchRoasted 🔥",
    "",
    `Score: ${result.score}/10`,
    "",
    "🔥 Roast:",
    result.roast,
    "",
    "✨ Stylingtip:",
    result.stylingTips[0] || "Kijk naar kleur, pasvorm en één sterk accessoire.",
    "",
    "Check jouw outfit op DutchRoasted.nl",
  ].join("\n");
}

function formatAdvice(result: OutfitResultData) {
  return [
    "Mijn DutchRoasted outfit check:",
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
    "Gemaakt met DutchRoasted.nl",
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
  doc.text("DutchRoasted", margin, y);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("AI outfit checker - dutchroasted.nl", margin, y + 7);

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
  doc.text("Gemaakt met DutchRoasted.nl", margin, y);

  const fileName = `dutchroasted-outfit-check-${new Date().toISOString().slice(0, 10)}.pdf`;
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
