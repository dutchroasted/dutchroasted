"use client";

import { useState } from "react";
import {
  MAX_ROAST_TEXT_LENGTH,
  type RoastCategory,
  type RoastIntensity,
  type RoastReportData,
  type RoastResultData,
} from "@/lib/roastTypes";
import { useDailyRoastLimit } from "@/hooks/useDailyRoastLimit";
import { useAuthProfile } from "@/hooks/useAuthProfile";
import { CategorySelect } from "./CategorySelect";
import { ErrorMessage } from "./ErrorMessage";
import { FreeLimitNotice } from "./FreeLimitNotice";
import { IntensitySelector } from "./IntensitySelector";
import { LoadingState } from "./LoadingState";
import { RoastResult } from "./RoastResult";

export function RoastForm() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<RoastCategory>("LinkedIn-profiel");
  const [intensity, setIntensity] = useState<RoastIntensity>("medium");
  const [result, setResult] = useState<RoastReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const dailyLimit = useDailyRoastLimit();
  const auth = useAuthProfile();
  const authUsage = auth.usage;

  const authenticatedLimitReached =
    auth.isAuthenticated &&
    Boolean(authUsage) &&
    !authUsage?.unlimited &&
    (authUsage?.used ?? 0) >= (authUsage?.limit ?? 5);
  const anonymousLimitReached = !auth.isAuthenticated && dailyLimit.isLimitReached;
  const isLimitReached = authenticatedLimitReached || anonymousLimitReached;
  const limitIsReady = auth.isReady && (auth.isAuthenticated ? Boolean(authUsage) : dailyLimit.isReady);

  const trimmedText = text.trim();
  const isTooLong = text.length > MAX_ROAST_TEXT_LENGTH;
  const canSubmit =
    limitIsReady &&
    Boolean(trimmedText) &&
    !isTooLong &&
    !isLoading &&
    !isLimitReached;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (auth.accessToken) {
        headers.Authorization = `Bearer ${auth.accessToken}`;
      }

      const response = await fetch("/api/roast", {
        method: "POST",
        headers,
        body: JSON.stringify({
          text: trimmedText,
          category,
          intensity,
        }),
      });

      if (!response.ok) {
        throw new Error("Roast request failed");
      }

      const data = (await response.json()) as RoastResultData;
      setResult({
        ...data,
        originalText: trimmedText,
        category,
        intensity,
        createdAt: new Date().toISOString(),
      });
      if (auth.isAuthenticated) {
        await auth.refresh();
      } else {
        dailyLimit.increment();
      }
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewRoast() {
    setText("");
    setResult(null);
    setHasError(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <form
        onSubmit={handleSubmit}
        className="no-print rounded-lg border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/40 sm:p-6"
      >
        <div className="mb-6">
          <FreeLimitNotice
            used={
              auth.isAuthenticated && authUsage
                ? authUsage.used
                : dailyLimit.isReady
                  ? dailyLimit.used
                  : 0
            }
            limit={auth.isAuthenticated && authUsage ? authUsage.limit : dailyLimit.limit}
            isLimitReached={isLimitReached}
            isAuthenticated={auth.isAuthenticated}
            plan={authUsage?.plan ?? "free"}
            unlimited={Boolean(authUsage?.unlimited)}
          />
        </div>

        <div>
          <label htmlFor="roast-text" className="text-sm font-black uppercase tracking-[0.16em] text-zinc-400">
            Jouw input
          </label>
          <textarea
            id="roast-text"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setHasError(false);
            }}
            maxLength={MAX_ROAST_TEXT_LENGTH + 500}
            placeholder="Plak hier je CV, LinkedIn-profiel, business idee, Instagram bio, website tekst of iets anders..."
            className="mt-3 min-h-72 w-full resize-y rounded-md border border-white/10 bg-black px-4 py-4 text-base leading-7 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
          />
          <div className="mt-2 flex items-center justify-between gap-3 text-sm">
            <p className={isTooLong ? "font-bold text-red-300" : "text-zinc-500"}>
              {text.length} / {MAX_ROAST_TEXT_LENGTH} tekens
            </p>
            {isTooLong ? <p className="font-bold text-red-300">Maximaal 5000 tekens</p> : null}
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <CategorySelect value={category} onChange={setCategory} />
          <IntensitySelector value={intensity} onChange={setIntensity} />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-7 w-full rounded-md bg-orange-500 px-6 py-4 text-base font-black text-black shadow-[0_18px_60px_rgba(255,106,0,0.24)] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none"
        >
          {isLimitReached ? "Limiet bereikt" : isLoading ? "Even roasten..." : "Roast me"}
        </button>
      </form>

      <div className="min-h-[28rem] rounded-lg border border-white/10 bg-black/35 p-5 sm:p-6">
        {isLoading ? <LoadingState /> : null}
        {hasError ? <ErrorMessage /> : null}
        {!isLoading && !hasError && result ? (
          <RoastResult
            result={result}
            onNewRoast={handleNewRoast}
          />
        ) : null}
        {!isLoading && !hasError && !result ? (
          <div className="flex min-h-[24rem] items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
            <div>
              <p className="text-2xl font-black text-white">Nog niets geroast.</p>
              <p className="mt-3 max-w-md leading-7 text-zinc-500">
                Vul links je tekst in. Outfit Roaster maakt er daarna een scherpe, nuttige
                reality check van.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
