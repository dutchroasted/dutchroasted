"use client";

import { useEffect, useRef, useState } from "react";
import { compressImageToJpegDataUrl } from "@/lib/clientImageCompression";
import { analytics } from "@/lib/analytics";
import { useAuthProfile } from "@/hooks/useAuthProfile";
import type {
  OutfitCheckMode,
  OutfitOccasion,
  OutfitProfile,
  ProAnalysisResult as ProAnalysisResultData,
  OutfitResultData,
  OutfitRoastLevel,
} from "@/lib/outfitTypes";
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
const PREMIUM_BETA_ENABLED = process.env.NEXT_PUBLIC_PREMIUM_BETA !== "false";
const FREE_LIMIT_STORAGE_KEY = "dutchroasted_outfit_daily_limit";
const RECENT_QUOTES_STORAGE_KEY = "outfitroaster_recent_quotes";
const RECENT_SCORES_STORAGE_KEY = "outfitroaster_recent_scores";
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
  const auth = useAuthProfile();
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
  const canSubmit =
    Boolean(selectedPreviewImage) &&
    !isProcessing &&
    (mode === "pro-analysis" || !isLimitReached);

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
    const checkStartedAt = performance.now();
    setLoadingMessage((currentMessage) => getRandomLoadingMessage(currentMessage));
    setError("");
    const analyticsTone = mode === "pro-analysis" ? "Premium Verdict Beta" : roastLevel;
    analytics.roastStarted({
      gender: profile,
      occasion,
      tone: analyticsTone,
    });

    try {
      const response = await runOutfitCheckWithRetry(
        selectedPreviewImage,
        mode,
        occasion,
        roastLevel,
        profile,
        auth.accessToken,
        readRecentQuotes(),
        readRecentScores(),
      );

      let data: OutfitResultData | { proAnalysis: ProAnalysisResultData };
      try {
        data = (await response.json()) as OutfitResultData | { proAnalysis: ProAnalysisResultData };
      } catch {
        throw new Error("De outfitcheck gaf een onleesbaar antwoord terug. Probeer het opnieuw.");
      }

      if (mode === "pro-analysis") {
        if (!("proAnalysis" in data)) {
          throw new Error("Premium Verdict gaf geen geldig resultaat terug.");
        }
        setProAnalysis(data.proAnalysis);
        setResult(null);
        analytics.roastCompleted({
          score: data.proAnalysis.overallScore,
          tone: analyticsTone,
          processingTime: getProcessingTimeSeconds(checkStartedAt),
        });
      } else {
        if ("proAnalysis" in data) {
          throw new Error("De outfit roast gaf een onverwacht resultaat terug.");
        }
        setResult(data);
        setProAnalysis(null);
        rememberRecentQuotes([
          data.shareQuote,
          ...data.alternativeQuotes,
          ...data.roast.split("\n"),
        ]);
        rememberRecentScore(data.score);
        setDailyLimit(incrementDailyLimit());
        analytics.roastCompleted({
          score: data.score,
          tone: analyticsTone,
          processingTime: getProcessingTimeSeconds(checkStartedAt),
        });
      }
      setResultImage(selectedPreviewImage);
      setResultMeta({ occasion });
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
            if (nextMode === "pro-analysis") {
              analytics.premiumClicked("modal");
            }
            if (
              !PREMIUM_BETA_ENABLED &&
              nextMode === "pro-analysis" &&
              !auth.isAuthenticated
            ) {
              window.location.assign("/account?login=required");
              return;
            }
            if (
              !PREMIUM_BETA_ENABLED &&
              nextMode === "pro-analysis" &&
              auth.profile?.subscription_status !== "active"
            ) {
              window.location.assign("/pricing");
              return;
            }
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
            {PREMIUM_BETA_ENABLED
              ? "Beta: tijdelijk gratis te testen. Later onderdeel van Premium."
              : "Premium Verdict is alleen beschikbaar met een actief abonnement."}
          </div>
        )}

        <ImageUpload
          previewUrl={selectedPreviewImage}
          disabled={isProcessing}
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
          loggedIn={auth.isAuthenticated}
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
              ? PREMIUM_BETA_ENABLED
                ? "Start Premium Verdict Beta"
                : "Start Premium Verdict"
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
        {isLoading ? <LoadingState message={loadingMessage} mode={mode} /> : null}
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
                score={result.score}
              />
            ) : null}
          </div>
        ) : null}
        {!isLoading && proAnalysis ? (
          <ProAnalysisResult result={proAnalysis} onNewCheck={handleNewCheck} />
        ) : null}
        {!isLoading && !result && !proAnalysis ? (
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
                {mode === "pro-analysis"
                  ? "Je krijgt een diepe analyse van kleur, pasvorm, samenhang, gelegenheid en trends."
                  : "AI kijkt naar kleding, kleur, pasvorm en vibe. Jij krijgt drie scherpe punchlines, concrete verbeteringen en een deelkaart."}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-2 text-[10px] font-black uppercase tracking-[0.13em] text-zinc-400">
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2">Roast</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2">Score</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2">Deelkaart</span>
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
  accessToken: string | null,
  recentQuotes: string[],
  recentScores: number[],
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
      accessToken,
      recentQuotes,
      recentScores,
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
  accessToken: string | null,
  recentQuotes: string[],
  recentScores: number[],
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
        ...(!PREMIUM_BETA_ENABLED && mode === "pro-analysis" && accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {}),
      },
      body: JSON.stringify({
        image,
        mode,
        occasion,
        roastLevel,
        profile,
        recentQuotes,
        recentScores,
      }),
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

function readRecentQuotes() {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(RECENT_QUOTES_STORAGE_KEY) ?? "[]",
    ) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((quote): quote is string => typeof quote === "string").slice(0, 12)
      : [];
  } catch {
    return [];
  }
}

function readRecentScores() {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(RECENT_SCORES_STORAGE_KEY) ?? "[]",
    ) as unknown;
    return Array.isArray(parsed)
      ? parsed
          .map((score) => (typeof score === "number" ? score : Number(score)))
          .filter((score) => Number.isFinite(score) && score >= 1 && score <= 10)
          .slice(0, 20)
      : [];
  } catch {
    return [];
  }
}

function getProcessingTimeSeconds(startedAt: number) {
  return Number(((performance.now() - startedAt) / 1000).toFixed(2));
}

function rememberRecentQuotes(quotes: string[]) {
  const recentQuotes = [...quotes, ...readRecentQuotes()]
    .filter(
      (quote, index, allQuotes) =>
        allQuotes.findIndex(
          (candidate) => candidate.toLowerCase() === quote.toLowerCase(),
        ) === index,
    )
    .slice(0, 12);

  window.localStorage.setItem(
    RECENT_QUOTES_STORAGE_KEY,
    JSON.stringify(recentQuotes),
  );
}

function rememberRecentScore(score: number) {
  const recentScores = [score, ...readRecentScores()]
    .filter((value) => Number.isFinite(value) && value >= 1 && value <= 10)
    .slice(0, 20);

  window.localStorage.setItem(
    RECENT_SCORES_STORAGE_KEY,
    JSON.stringify(recentScores),
  );
}

function getApiErrorMessage(status: number) {
  if (status === 401) {
    return "Log eerst in om Premium Verdict te gebruiken.";
  }
  if (status === 403) {
    return "Je hebt een actief Premium-abonnement nodig voor Premium Verdict.";
  }
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
