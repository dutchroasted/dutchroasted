"use client";

import { useEffect, useRef, useState } from "react";
import { compressImageToJpegDataUrl } from "@/lib/clientImageCompression";
import type {
  OutfitIntensity,
  OutfitOccasion,
  OutfitProfile,
  OutfitResultData,
} from "@/lib/outfitTypes";
import { EarlyAccessForm } from "./EarlyAccessForm";
import { ErrorMessage } from "./ErrorMessage";
import { FreeCheckLimitNotice } from "./FreeCheckLimitNotice";
import { ImageUpload } from "./ImageUpload";
import { IntensitySelector } from "./IntensitySelector";
import { LoadingState } from "./LoadingState";
import { OccasionSelect } from "./OccasionSelect";
import { OutfitResult } from "./OutfitResult";
import { ProfileSelect } from "./ProfileSelect";

const FREE_CHECK_LIMIT = 1;
const FREE_LIMIT_STORAGE_KEY = "dutchroasted_outfit_daily_limit";
const API_TIMEOUT_MS = 45_000;
const RETRY_DELAY_MS = 1_000;
const RETRYABLE_API_STATUSES = new Set([429, 500, 502, 503, 504]);
const LOADING_MESSAGES: readonly string[] = [
  "Even kijken of dit een fit is... of een kledingcrisis met zelfvertrouwen.",
  "Momentje, ik haal de modebril én de blusdeken erbij.",
  "We checken of dit catwalk is... of retourbalie.",
  "Even zien of deze outfit complimenten krijgt of stilte.",
  "De stof liegt niet, maar wij gaan het netjes zeggen.",
  "Ik zoom even in op de keuzes waar je kapper niets aan kon doen.",
  "Stylist-modus aan. Emoties uit. Spiegel eerlijk.",
  "Even kijken of dit stijl is of gewoon haast met parfum.",
  "De schoenen zijn gehoord. Nu de rest nog.",
  "Modejury zit klaar. Geen zorgen, alleen je outfit wordt aangepakt.",
];

type DailyLimitState = {
  date: string;
  used: number;
};

export function OutfitCheckForm() {
  const [selectedPreviewImage, setSelectedPreviewImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [occasion, setOccasion] = useState<OutfitOccasion>("Casual");
  const [intensity, setIntensity] = useState<OutfitIntensity>("roast");
  const [profile, setProfile] = useState<OutfitProfile>("Verras me");
  const [result, setResult] = useState<OutfitResultData | null>(null);
  const [resultImage, setResultImage] = useState("");
  const [resultMeta, setResultMeta] = useState<{
    occasion: OutfitOccasion;
    intensity: OutfitIntensity;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadProcessing, setIsUploadProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0]);
  const [error, setError] = useState("");
  const [dailyLimit, setDailyLimit] = useState<DailyLimitState>(() => ({
    date: getTodayKey(),
    used: 0,
  }));
  const submitLockRef = useRef(false);

  const isLimitReached = dailyLimit.used >= FREE_CHECK_LIMIT;
  const isProcessing = isLoading || isUploadProcessing;
  const canSubmit = Boolean(selectedPreviewImage) && !isProcessing && !isLimitReached;

  useEffect(() => {
    setDailyLimit(readDailyLimit());
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitLockRef.current || isLoading) {
      return;
    }

    submitLockRef.current = true;
    setIsLoading(true);
    setLoadingMessage((currentMessage) => getRandomLoadingMessage(currentMessage));
    setError("");

    try {
      const response = await runOutfitCheckWithRetry(
        selectedPreviewImage,
        occasion,
        intensity,
        profile,
      );

      let data: OutfitResultData;
      try {
        data = (await response.json()) as OutfitResultData;
      } catch {
        throw new Error("De outfitcheck gaf een onleesbaar antwoord terug. Probeer het opnieuw.");
      }
      setResult(data);
      setResultImage(selectedPreviewImage);
      setResultMeta({ occasion, intensity });
      setDailyLimit(incrementDailyLimit());
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "De outfitcheck is onverwacht mislukt. Probeer het opnieuw.",
      );
    } finally {
      submitLockRef.current = false;
      setIsLoading(false);
    }
  }

  function handleNewCheck() {
    setSelectedPreviewImage("");
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
          previewUrl={selectedPreviewImage}
          disabled={isProcessing}
          onChange={(dataUrl, name) => {
            setSelectedPreviewImage(dataUrl);
            setFileName(name);
            setError("");
            setResult(null);
            setResultImage("");
            setResultMeta(null);
          }}
          onError={setError}
          onProcessingChange={setIsUploadProcessing}
        />

        {fileName ? (
          <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-zinc-300">
            Gekozen: {fileName}
          </p>
        ) : null}

        <div className="mt-6 grid gap-6">
          <OccasionSelect value={occasion} onChange={setOccasion} />
          <ProfileSelect value={profile} onChange={setProfile} />
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
        {isLoading ? <LoadingState message={loadingMessage} /> : null}
        {!isLoading && result ? (
          <div className="space-y-5">
            <OutfitResult
              result={result}
              originalImage={resultImage}
              disabled={isProcessing}
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

async function runOutfitCheckWithRetry(
  selectedPreviewImage: string,
  occasion: OutfitOccasion,
  intensity: OutfitIntensity,
  profile: OutfitProfile,
) {
  let requestImage = selectedPreviewImage;
  let didRetryAfter413 = false;
  let didRetryTransientError = false;
  let attempt = 1;

  while (true) {
    const response = await requestOutfitCheck(
      requestImage,
      occasion,
      intensity,
      profile,
      `poging ${attempt}`,
    );

    if (response.status === 413 && !didRetryAfter413) {
      try {
        console.warn("[Outfit check] API returned 413; recompressing smaller for one retry.");
        requestImage = await compressImageToJpegDataUrl(selectedPreviewImage, {
          maxDimension: 700,
          quality: 0.5,
        });
        console.info(
          "[Outfit check] compressed data URL size after 413:",
          formatDataUrlSize(requestImage),
        );
      } catch {
        throw new Error("De foto was te groot voor de outfitcheck en kleiner maken is mislukt.");
      }
      didRetryAfter413 = true;
      attempt += 1;
      continue;
    }

    if (RETRYABLE_API_STATUSES.has(response.status) && !didRetryTransientError) {
      console.warn(`[Outfit check] API returned ${response.status}; retrying once after 1 second.`);
      await delay(RETRY_DELAY_MS);
      didRetryTransientError = true;
      attempt += 1;
      continue;
    }

    if (!response.ok) {
      throw new Error(getApiErrorMessage(response.status));
    }

    return response;
  }
}

async function requestOutfitCheck(
  image: string,
  occasion: OutfitOccasion,
  intensity: OutfitIntensity,
  profile: OutfitProfile,
  attempt: string,
) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  console.info(`[Outfit check] API request started (${attempt}).`);
  try {
    // Privacy: uploaded outfit images are only used for the AI analysis request and are not stored by this application.
    const response = await fetch("/api/outfit-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image, occasion, intensity, profile }),
      signal: controller.signal,
    });
    console.info(`[Outfit check] API response status (${attempt}):`, response.status);
    return response;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("De outfitcheck duurde te lang en is afgebroken. Probeer het opnieuw.");
    }
    throw new Error("De outfitcheck kon de server niet bereiken. Controleer je verbinding en probeer opnieuw.");
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function getApiErrorMessage(status: number) {
  if (status === 413) {
    return "De foto is nog steeds te groot voor de outfitcheck. Kies een kleinere foto.";
  }
  if (status === 429) {
    return "De outfitcheck is momenteel te druk. Wacht even en probeer opnieuw.";
  }
  if ([500, 502, 503, 504].includes(status)) {
    return `De outfitcheck-server gaf een fout (${status}). Probeer het later opnieuw.`;
  }
  if (status === 400) {
    return "De outfitcheck kon de foto of instellingen niet verwerken. Kies de foto opnieuw.";
  }
  return `De outfitcheck is mislukt bij de API (status ${status}). Probeer het opnieuw.`;
}

function formatDataUrlSize(dataUrl: string) {
  const base64 = dataUrl.split(",", 2)[1] ?? "";
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  const bytes = Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
  return `${(bytes / 1024 / 1024).toFixed(2)} MB (${bytes} bytes)`;
}

function delay(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getRandomLoadingMessage(currentMessage?: string): string {
  const alternatives = LOADING_MESSAGES.filter((message) => message !== currentMessage);
  return alternatives[Math.floor(Math.random() * alternatives.length)] ?? LOADING_MESSAGES[0];
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
