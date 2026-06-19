"use client";

import { useEffect, useRef, useState } from "react";
import { compressImageToJpegDataUrl } from "@/lib/clientImageCompression";
import { analytics } from "@/lib/analytics";
import type {
  OutfitIntensity,
  OutfitOccasion,
  OutfitProfile,
  OutfitResultData,
  OutfitRoasterPersona,
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
import { RoasterPersonaSelect } from "./RoasterPersonaSelect";

const FREE_CHECK_LIMIT = 3;
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
  const [occasion, setOccasion] = useState<OutfitOccasion>("Date");
  const [intensity, setIntensity] = useState<OutfitIntensity>("roast");
  const [profile, setProfile] = useState<OutfitProfile>("Verras me");
  const [persona, setPersona] = useState<OutfitRoasterPersona>("🔥 Brutale Vriend");
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
    analytics.outfitCheckStarted(occasion, intensity, profile);

    try {
      const response = await runOutfitCheckWithRetry(
        selectedPreviewImage,
        occasion,
        intensity,
        profile,
        persona,
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
      analytics.outfitCheckCompleted(occasion, intensity, data.score);
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
    <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr] xl:items-start">
      <form
        onSubmit={handleSubmit}
        className="dr-glass-card relative rounded-[2rem] p-4 sm:p-6 xl:sticky xl:top-5"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="dr-kicker">Stap 1 · Upload & stijl</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
              Zet je fit in de spotlight.
            </h2>
          </div>
          <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.13em] text-emerald-200 sm:inline-flex">
            Foto niet opgeslagen
          </span>
        </div>

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
          <p className="mt-3 flex items-center gap-2 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-3 text-sm font-bold text-emerald-100">
            <span className="size-2 rounded-full bg-emerald-400" />
            Klaar voor de roast: {fileName}
          </p>
        ) : null}

        <div className="mt-6 grid gap-6">
          <OccasionSelect value={occasion} onChange={setOccasion} />
          <RoasterPersonaSelect value={persona} onChange={setPersona} />
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
          className="dr-primary-button mt-7 min-h-16 w-full px-5 py-4 text-base"
        >
          {isLoading ? "Even kijken..." : isLimitReached ? "3 gratis checks gebruikt" : "Check mijn outfit"}
        </button>

        {isLimitReached ? (
          <div className="mt-4 rounded-2xl border border-orange-500/25 bg-orange-500/[0.08] p-4">
            <p className="text-sm font-bold leading-6 text-orange-100">
              Je 3 gratis outfit checks voor vandaag zijn gebruikt. Premium komt eraan.
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

      <div className="dr-glass-card min-h-[32rem] rounded-[2rem] p-4 sm:p-6">
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
          <div className="relative flex min-h-[30rem] items-center justify-center overflow-hidden rounded-[1.6rem] border border-dashed border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,106,0,0.15),transparent_35%),linear-gradient(145deg,rgba(255,255,255,0.05),rgba(0,0,0,0.3))] p-8 text-center">
            <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />
            <div>
              <div className="relative mx-auto mb-6 flex size-20 items-center justify-center rounded-[1.5rem] border border-orange-400/25 bg-orange-400/10 text-3xl shadow-[0_20px_70px_rgba(255,106,0,0.15)]">
                ✦
              </div>
              <p className="relative text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-4xl">
                Hier landt je verdict.
              </p>
              <p className="mt-4 max-w-md leading-7 text-zinc-500">
                AI kijkt naar kleding, kleur, pasvorm en vibe. Jij krijgt drie scherpe punchlines,
                concrete upgrades en een deelkaart voor je Story.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-2 text-[10px] font-black uppercase tracking-[0.13em] text-zinc-400">
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2">Roast</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2">Score</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2">Story card</span>
              </div>
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
  persona: OutfitRoasterPersona,
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
      persona,
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
  persona: OutfitRoasterPersona,
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
      body: JSON.stringify({ image, occasion, intensity, profile, persona }),
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
