"use client";

import { useState } from "react";
import type { RoastReportData } from "@/lib/roastTypes";

type LeadCaptureProps = {
  result: RoastReportData;
};

export function LeadCapture({ result }: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [wantsUpdates, setWantsUpdates] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading || status === "success") {
      return;
    }

    setIsLoading(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "roast_result",
          category: result.category,
          intensity: result.intensity,
          wantsUpdates,
        }),
      });

      if (!response.ok) {
        throw new Error("Lead save failed");
      }

      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="no-print rounded-lg border border-orange-500/30 bg-orange-500/[0.08] p-5 sm:p-6">
      <div className="max-w-2xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">
          Early access
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">Bewaar je roast</h2>
        <p className="mt-3 leading-7 text-zinc-300">
          Laat je e-mail achter en krijg straks als eerste toegang tot Premium,
          PDF-rapporten en meer roasts.
        </p>
      </div>

      {status === "success" ? (
        <div className="mt-5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 font-bold text-emerald-100">
          Je staat erop. Zodra Premium live is hoor je het als eerste.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <label className="block">
            <span className="text-sm font-black uppercase tracking-[0.16em] text-zinc-400">
              E-mailadres
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setStatus("idle");
              }}
              placeholder="jij@voorbeeld.nl"
              className="mt-3 w-full rounded-md border border-white/10 bg-black px-4 py-4 text-base font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
            />
          </label>

          <label className="flex items-start gap-3 text-sm leading-6 text-zinc-300">
            <input
              type="checkbox"
              checked={wantsUpdates}
              onChange={(event) => setWantsUpdates(event.target.checked)}
              className="mt-1 size-4 accent-orange-500"
            />
            <span>Ik wil updates ontvangen over DutchRoasted.</span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-orange-500 px-5 py-4 text-sm font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              {isLoading ? "Bezig met bewaren..." : "Bewaar mijn roast"}
            </button>
            {status === "error" ? (
              <p className="font-bold text-red-200">Opslaan lukt niet. Probeer het opnieuw.</p>
            ) : null}
          </div>

          <p className="text-sm leading-6 text-zinc-500">
            We gebruiken je e-mail alleen voor DutchRoasted updates. Geen spam.
          </p>
        </form>
      )}
    </section>
  );
}
