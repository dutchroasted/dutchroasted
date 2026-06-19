"use client";

import { useEffect, useRef, useState } from "react";
<<<<<<< HEAD
import { compressImageToJpegDataUrl } from "@/lib/clientImageCompression";
import { analytics } from "@/lib/analytics";
import type {
  OutfitCheckMode,
  OutfitOccasion,
  OutfitProfile,
  ProAnalysisResult as ProAnalysisResultData,
  OutfitResultData,
  OutfitRoastLevel,
} from "@/lib/outfitTypes";
=======
import {
  compressImageToJpegDataUrl,
  getDataUrlByteSize,
} from "@/lib/clientImageCompression";
import type { OutfitIntensity, OutfitOccasion, OutfitResultData } from "@/lib/outfitTypes";
>>>>>>> a7da14b (Add Stripe premium subscriptions)
import { EarlyAccessForm } from "./EarlyAccessForm";
import { ErrorMessage } from "./ErrorMessage";
import { FreeCheckLimitNotice } from "./FreeCheckLimitNotice";
import { ImageUpload } from "./ImageUpload";
import { LoadingState } from "./LoadingState";
import { ModeSelector } from "./ModeSelector";
import { OccasionSelect } from "./OccasionSelect";
import { OutfitResult } from "./OutfitResult";
import { ProfileSelect } from "./ProfileSelect";
import { ProAnalysisResult } from "./ProAnalysisResult";
import { RoastLevelSelect } from "./RoastLevelSelect";

const FREE_CHECK_LIMIT = 5;
const FREE_LIMIT_STORAGE_KEY = "dutchroasted_outfit_daily_limit";
<<<<<<< HEAD
const API_TIMEOUT_MS = 45_000;
const RETRY_DELAY_MS = 1_000;
=======
const API_TIMEOUT_MS = 60_000;
>>>>>>> a7da14b (Add Stripe premium subscriptions)
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
  const [mode, setMode] = useState<OutfitCheckMode>("roast");
  const [selectedPreviewImage, setSelectedPreviewImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [occasion, setOccasion] = useState<OutfitOccasion>("Date");
  const [roastLevel, setRoastLevel] = useState<OutfitRoastLevel>("Genadeloos");
  const [profile, setProfile] = useState<OutfitProfile>("Zeg ik liever niet");
  const [result, setResult] = useState<OutfitResultData | null>(null);
  const [proAnalysis, setProAnalysis] = useState<ProAnalysisResultData | null>(null);
  const [resultImage, setResultImage] = useState("");
  const [resultMeta, setResultMeta] = useState<{
    occasion: OutfitOccasion;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD
  const [isUploadProcessing, setIsUploadProcessing] = useState(false);
=======
  const [isImageProcessing, setIsImageProcessing] = useState(false);
>>>>>>> a7da14b (Add Stripe premium subscriptions)
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0]);
  const [error, setError] = useState("");
  const [dailyLimit, setDailyLimit] = useState<DailyLimitState>(() => ({
    date: getTodayKey(),
    used: 0,
  }));
  const submitLockRef = useRef(false);

  const isLimitReached = dailyLimit.used >= FREE_CHECK_LIMIT;
<<<<<<< HEAD
  const isProcessing = isLoading || isUploadProcessing;
  const canSubmit =
    Boolean(selectedPreviewImage) &&
    !isProcessing &&
    (mode === "pro-analysis" || !isLimitReached);
=======
  const canSubmit =
    Boolean(image) && !isLoading && !isImageProcessing && !isLimitReached;
>>>>>>> a7da14b (Add Stripe premium subscriptions)

  useEffect(() => {
    setDailyLimit(readDailyLimit());
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
<<<<<<< HEAD
    if (!canSubmit || submitLockRef.current || isLoading) {
=======
    if (!canSubmit || submitLockRef.current) {
>>>>>>> a7da14b (Add Stripe premium subscriptions)
      return;
    }

    submitLockRef.current = true;
    setIsLoading(true);
    setLoadingMessage((currentMessage) => getRandomLoadingMessage(currentMessage));
    setError("");
    analytics.outfitCheckStarted(
      occasion,
      mode === "pro-analysis" ? "Pro Analyse testmodus" : roastLevel,
      profile,
    );

    try {
<<<<<<< HEAD
      const response = await runOutfitCheckWithRetry(
        selectedPreviewImage,
        mode,
        occasion,
        roastLevel,
        profile,
      );

      let data: OutfitResultData | { proAnalysis: ProAnalysisResultData };
      try {
        data = (await response.json()) as OutfitResultData | { proAnalysis: ProAnalysisResultData };
      } catch {
        throw new Error("De outfitcheck gaf een onleesbaar antwoord terug. Probeer het opnieuw.");
      }

      if (mode === "pro-analysis") {
        if (!("proAnalysis" in data)) {
          throw new Error("De Pro Analyse gaf geen geldig resultaat terug.");
        }
        setProAnalysis(data.proAnalysis);
        setResult(null);
        analytics.outfitCheckCompleted(occasion, "Pro Analyse testmodus", data.proAnalysis.overallScore);
      } else {
        if ("proAnalysis" in data) {
          throw new Error("De outfit roast gaf een onverwacht resultaat terug.");
        }
        setResult(data);
        setProAnalysis(null);
        setDailyLimit(incrementDailyLimit());
        analytics.outfitCheckCompleted(occasion, roastLevel, data.score);
      }
      setResultImage(selectedPreviewImage);
      setResultMeta({ occasion });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "De outfitcheck is onverwacht mislukt. Probeer het opnieuw.",
=======
      const previewImage = image;
      const data = await requestOutfitCheck(previewImage, occasion, intensity);
      setResult(data);
      setResultImage(previewImage);
      setResultMeta({ occasion, intensity });
      setDailyLimit(incrementDailyLimit());
    } catch (requestError) {
      console.error("[Outfit Roaster] Outfitcheck mislukt:", requestError);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "De outfitcheck is op een onbekende stap mislukt. Probeer het opnieuw.",
>>>>>>> a7da14b (Add Stripe premium subscriptions)
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
    setProAnalysis(null);
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

        <ModeSelector
          value={mode}
          onChange={(nextMode) => {
            setMode(nextMode);
            setResult(null);
            setProAnalysis(null);
            setResultMeta(null);
            setError("");
          }}
        />

        {mode === "roast" ? (
          <FreeCheckLimitNotice
            used={Math.min(dailyLimit.used, FREE_CHECK_LIMIT)}
            limit={FREE_CHECK_LIMIT}
            isLimitReached={isLimitReached}
          />
        ) : (
          <div className="mb-5 rounded-2xl border border-violet-300/20 bg-violet-400/10 p-4 text-sm font-bold text-violet-100">
            Pro Analyse testmodus · telt niet mee voor je 5 gratis roasts.
          </div>
        )}

        <ImageUpload
<<<<<<< HEAD
          previewUrl={selectedPreviewImage}
          disabled={isProcessing}
=======
          previewUrl={image}
          disabled={isLoading}
          onProcessingChange={setIsImageProcessing}
>>>>>>> a7da14b (Add Stripe premium subscriptions)
          onChange={(dataUrl, name) => {
            setSelectedPreviewImage(dataUrl);
            setFileName(name);
            setError("");
            setResult(null);
            setProAnalysis(null);
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

        <div className="mt-6 grid gap-5">
          <ProfileSelect value={profile} onChange={setProfile} />
          <OccasionSelect value={occasion} onChange={setOccasion} />
          {mode === "roast" ? (
            <RoastLevelSelect value={roastLevel} onChange={setRoastLevel} />
          ) : null}
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
          {isLoading
            ? "Even kijken..."
            : mode === "pro-analysis"
              ? "Start Pro Analyse"
              : isLimitReached
                ? "5 gratis roasts gebruikt"
                : "Roast mijn outfit"}
        </button>

        {mode === "roast" && isLimitReached ? (
          <div className="mt-4 rounded-2xl border border-orange-500/25 bg-orange-500/[0.08] p-4">
            <p className="text-sm font-bold leading-6 text-orange-100">
              Je hebt vandaag nog 0 van de 5 gratis roasts over.
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
        {!isLoading && result && resultImage ? (
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
                score={result.score}
              />
            ) : null}
          </div>
        ) : null}
<<<<<<< HEAD
        {!isLoading && proAnalysis ? (
          <ProAnalysisResult result={proAnalysis} onNewCheck={handleNewCheck} />
        ) : null}
        {!isLoading && !result && !proAnalysis ? (
          <div className="relative flex min-h-[30rem] items-center justify-center overflow-hidden rounded-[1.6rem] border border-dashed border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,106,0,0.15),transparent_35%),linear-gradient(145deg,rgba(255,255,255,0.05),rgba(0,0,0,0.3))] p-8 text-center">
            <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />
=======
        {!isLoading && (!result || !resultImage) ? (
          <div className="flex min-h-[24rem] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,106,0,0.035))] p-8 text-center">
>>>>>>> a7da14b (Add Stripe premium subscriptions)
            <div>
              <div className="relative mx-auto mb-6 flex size-20 items-center justify-center rounded-[1.5rem] border border-orange-400/25 bg-orange-400/10 text-3xl shadow-[0_20px_70px_rgba(255,106,0,0.15)]">
                ✦
              </div>
              <p className="relative text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-4xl">
                Hier landt je verdict.
              </p>
              <p className="mt-4 max-w-md leading-7 text-zinc-500">
                {mode === "pro-analysis"
                  ? "Je krijgt een diepe analyse van kleur, pasvorm, samenhang, gelegenheid en trends."
                  : "AI kijkt naar kleding, kleur, pasvorm en vibe. Jij krijgt drie scherpe punchlines, concrete upgrades en een deelkaart voor je Story."}
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
  mode: OutfitCheckMode,
  occasion: OutfitOccasion,
  roastLevel: OutfitRoastLevel,
  profile: OutfitProfile,
) {
  let requestImage = selectedPreviewImage;
  let didRetryAfter413 = false;
  let didRetryTransientError = false;
  let attempt = 1;

  while (true) {
    const response = await requestOutfitCheck(
      requestImage,
      mode,
      occasion,
      roastLevel,
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
  mode: OutfitCheckMode,
  occasion: OutfitOccasion,
  roastLevel: OutfitRoastLevel,
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
      body: JSON.stringify({ image, mode, occasion, roastLevel, profile }),
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

async function requestOutfitCheck(
  previewImage: string,
  occasion: OutfitOccasion,
  intensity: OutfitIntensity,
) {
  let requestImage = previewImage;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    console.info(
      `[Outfit Roaster] API-request gestart (poging ${attempt + 1})`,
      formatBytes(getDataUrlByteSize(requestImage)),
    );

    const response = await fetchOutfitCheckWithTimeout(
      requestImage,
      occasion,
      intensity,
    );
    console.info("[Outfit Roaster] API-response status:", response.status);

    if (response.ok) {
      try {
        return (await response.json()) as OutfitResultData;
      } catch (error) {
        console.error("[Outfit Roaster] API-antwoord kon niet worden gelezen:", error);
        throw new Error(
          "De analyse kwam terug, maar het antwoord kon niet worden gelezen. Probeer opnieuw.",
        );
      }
    }

    if (attempt === 0 && response.status === 413) {
      try {
        requestImage = await compressImageToJpegDataUrl(previewImage, {
          maxDimension: 900,
          quality: 0.65,
        });
        console.info(
          "[Outfit Roaster] Kleinere retry-afbeelding:",
          formatBytes(getDataUrlByteSize(requestImage)),
        );
        continue;
      } catch (error) {
        console.error("[Outfit Roaster] Verkleinen na 413 mislukt:", error);
        throw new Error(
          "De foto was te groot voor verzending en kleiner maken is mislukt.",
        );
      }
    }

    if (attempt === 0 && RETRYABLE_API_STATUSES.has(response.status)) {
      console.warn(
        `[Outfit Roaster] Tijdelijke API-fout ${response.status}; nieuwe poging over 1 seconde.`,
      );
      await delay(1000);
      continue;
    }

    throw createApiStatusError(response.status);
  }

  throw new Error("De outfitcheck bleef mislukken na een tweede poging.");
}

async function fetchOutfitCheckWithTimeout(
  image: string,
  occasion: OutfitOccasion,
  intensity: OutfitIntensity,
) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    // Privacy: uploaded outfit images are only used for the AI analysis request and are not stored by this application.
    return await fetch("/api/outfit-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image, occasion, intensity }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "De outfitcheck duurde te lang en is gestopt. Probeer het nog één keer.",
      );
    }

    throw new Error(
      "De API kon niet worden bereikt. Controleer je verbinding en probeer opnieuw.",
    );
  } finally {
    window.clearTimeout(timeout);
  }
}

function createApiStatusError(status: number) {
  if (status === 413) {
    return new Error(
      "De foto blijft te groot voor verzending. Kies een kleinere foto.",
    );
  }

  if (status === 429) {
    return new Error(
      "Het is even druk bij de stylist. Wacht een moment en probeer opnieuw.",
    );
  }

  if ([500, 502, 503, 504].includes(status)) {
    return new Error(
      `De AI-stylist gaf na een tweede poging nog een serverfout (${status}). Probeer later opnieuw.`,
    );
  }

  return new Error(
    `De outfitcheck werd geweigerd door de server (status ${status}).`,
  );
}

function delay(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
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
