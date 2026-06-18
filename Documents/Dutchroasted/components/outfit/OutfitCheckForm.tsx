"use client";

import { useEffect, useState } from "react";
import { compressImageToJpegDataUrl } from "@/lib/clientImageCompression";
import type { OutfitIntensity, OutfitOccasion, OutfitResultData } from "@/lib/outfitTypes";
import { EarlyAccessForm } from "./EarlyAccessForm";
import { ErrorMessage } from "./ErrorMessage";
import { FreeCheckLimitNotice } from "./FreeCheckLimitNotice";
import { ImageUpload } from "./ImageUpload";
import { IntensitySelector } from "./IntensitySelector";
import { LoadingState } from "./LoadingState";
import { OccasionSelect } from "./OccasionSelect";
import { OutfitResult } from "./OutfitResult";

const FREE_CHECK_LIMIT = 1;
const FREE_LIMIT_STORAGE_KEY = "dutchroasted_outfit_daily_limit";

type DailyLimitState = {
  date: string;
  used: number;
};

export function OutfitCheckForm() {
  const [image, setImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [occasion, setOccasion] = useState<OutfitOccasion>("Casual");
  const [intensity, setIntensity] = useState<OutfitIntensity>("roast");
  const [result, setResult] = useState<OutfitResultData | null>(null);
  const [resultImage, setResultImage] = useState("");
  const [resultMeta, setResultMeta] = useState<{
    occasion: OutfitOccasion;
    intensity: OutfitIntensity;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dailyLimit, setDailyLimit] = useState<DailyLimitState>(() => ({
    date: getTodayKey(),
    used: 0,
  }));

  const isLimitReached = dailyLimit.used >= FREE_CHECK_LIMIT;
  const canSubmit = Boolean(image) && !isLoading && !isLimitReached;

  useEffect(() => {
    setDailyLimit(readDailyLimit());
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const compressedImage = await compressImageToJpegDataUrl(image);
      // Privacy: uploaded outfit images are only used for the AI analysis request and are not stored by this application.
      const response = await fetch("/api/outfit-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: compressedImage,
          occasion,
          intensity,
        }),
      });

      if (!response.ok) {
        throw new Error("Outfit check failed");
      }

      const data = (await response.json()) as OutfitResultData;
      setResult(data);
      setResultImage(compressedImage);
      setResultMeta({ occasion, intensity });
      setDailyLimit(incrementDailyLimit());
    } catch {
      setError("Er ging iets mis met comprimeren of checken. Probeer het opnieuw.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewCheck() {
    setImage("");
    setFileName("");
    setResult(null);
    setResultImage("");
    setResultMeta(null);
    setError("");
  }

  function handleResetTestLimit() {
    const resetLimit = { date: getTodayKey(), used: 0 };
    localStorage.setItem(FREE_LIMIT_STORAGE_KEY, JSON.stringify(resetLimit));
    setDailyLimit(resetLimit);
    setError("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/10 bg-zinc-950/75 p-4 shadow-2xl shadow-black/40 backdrop-blur sm:p-6"
      >
        <FreeCheckLimitNotice
          used={Math.min(dailyLimit.used, FREE_CHECK_LIMIT)}
          limit={FREE_CHECK_LIMIT}
          isLimitReached={isLimitReached}
        />

        <ImageUpload
          previewUrl={image}
          onChange={(dataUrl, name) => {
            setImage(dataUrl);
            setFileName(name);
            setError("");
            setResult(null);
            setResultImage("");
            setResultMeta(null);
          }}
          onError={setError}
        />

        {fileName ? (
          <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-zinc-300">
            Gekozen: {fileName}
          </p>
        ) : null}

        <div className="mt-6 grid gap-6">
          <OccasionSelect value={occasion} onChange={setOccasion} />
          <IntensitySelector value={intensity} onChange={setIntensity} />
        </div>

        {error ? (
          <div className="mt-5">
            <ErrorMessage message={error} />
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-7 min-h-14 w-full rounded-2xl bg-orange-500 px-5 py-4 text-base font-black text-black shadow-[0_18px_60px_rgba(255,106,0,0.24)] transition hover:bg-orange-400 hover:shadow-[0_22px_70px_rgba(255,106,0,0.28)] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none"
        >
          {isLoading ? "Even kijken..." : isLimitReached ? "Gratis check gebruikt" : "Check mijn outfit"}
        </button>

        {isLimitReached ? (
          <div className="mt-4 rounded-2xl border border-orange-500/25 bg-orange-500/[0.08] p-4">
            <p className="text-sm font-bold leading-6 text-orange-100">
              Je gratis outfit check voor vandaag is gebruikt. Premium komt eraan.
            </p>
            <button
              type="button"
              onClick={handleResetTestLimit}
              className="mt-3 min-h-10 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-black text-white transition hover:border-orange-500/50 hover:bg-orange-500/10"
            >
              Reset testlimiet
            </button>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Tijdelijke MVP-knop voor testen. Later vervangen door server-side limiet.
            </p>
          </div>
        ) : null}
      </form>

      <div className="min-h-[28rem] rounded-3xl border border-white/10 bg-black/35 p-4 shadow-2xl shadow-black/35 sm:p-6">
        {isLoading ? <LoadingState /> : null}
        {!isLoading && result ? (
          <div className="space-y-5">
            <OutfitResult
              result={result}
              originalImage={resultImage}
              onNewCheck={handleNewCheck}
            />
            {resultMeta ? (
              <EarlyAccessForm
                occasion={resultMeta.occasion}
                intensity={resultMeta.intensity}
                score={result.score}
              />
            ) : null}
          </div>
        ) : null}
        {!isLoading && !result ? (
          <div className="flex min-h-[24rem] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,106,0,0.035))] p-8 text-center">
            <div>
              <p className="text-3xl font-black leading-tight text-white">Je verdict verschijnt hier.</p>
              <p className="mt-4 max-w-md leading-7 text-zinc-500">
                Upload je outfitfoto. Outfit Roaster kijkt naar stijl, kleur, pasvorm, vibe en
                of de gelegenheid je fit verdient.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readDailyLimit() {
  try {
    const today = getTodayKey();
    const rawValue = localStorage.getItem(FREE_LIMIT_STORAGE_KEY);
    if (!rawValue) {
      return { date: today, used: 0 };
    }

    const parsed = JSON.parse(rawValue) as Partial<DailyLimitState>;
    if (parsed.date !== today || typeof parsed.used !== "number") {
      const resetLimit = { date: today, used: 0 };
      localStorage.setItem(FREE_LIMIT_STORAGE_KEY, JSON.stringify(resetLimit));
      return resetLimit;
    }

    return { date: today, used: Math.max(0, parsed.used) };
  } catch {
    return { date: getTodayKey(), used: 0 };
  }
}

function incrementDailyLimit() {
  // TODO: Replace localStorage limit with server-side user accounts before production.
  const currentLimit = readDailyLimit();
  const nextLimit = {
    date: currentLimit.date,
    used: currentLimit.used + 1,
  };

  localStorage.setItem(FREE_LIMIT_STORAGE_KEY, JSON.stringify(nextLimit));
  return nextLimit;
}
