"use client";

import { useState } from "react";
import type { OutfitOccasion } from "@/lib/outfitTypes";

type EarlyAccessFormProps = {
  occasion: OutfitOccasion;
  score: number;
};

const CONSENT_TEXT =
  "Ik wil updates ontvangen over Outfit Roaster en geef toestemming om mij hierover te mailen.";

export function EarlyAccessForm({ occasion, score }: EarlyAccessFormProps) {
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Vul een geldig e-mailadres in.");
      return;
    }

    if (!marketingConsent) {
      setError("Vink toestemming aan als je updates wilt ontvangen.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          source: "outfit_check",
          occasion,
          score,
          marketingConsent,
          consentText: CONSENT_TEXT,
        }),
      });

      if (!response.ok) {
        throw new Error("Lead save failed");
      }

      setEmail("");
      setMarketingConsent(false);
      setMessage("Je staat erop 🔥");
    } catch {
      setError("Opslaan lukt niet. Probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="dr-card-hover rounded-3xl border border-orange-500/30 bg-[linear-gradient(145deg,rgba(255,106,0,0.13),rgba(255,255,255,0.035))] p-5 shadow-[0_22px_80px_rgba(255,106,0,0.09)] sm:p-6">
      <h3 className="text-2xl font-black text-white">Wil je onbeperkt outfit checks?</h3>
      <p className="mt-3 leading-7 text-zinc-300">
        Laat je e-mail achter en krijg als eerste toegang tot Premium, style history en
        persoonlijke outfit tips.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-black uppercase tracking-[0.16em] text-zinc-400">
            E-mailadres
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="jij@voorbeeld.nl"
            className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-base font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
          />
        </label>

        <label className="flex items-start gap-3 text-sm leading-6 text-zinc-300">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(event) => setMarketingConsent(event.target.checked)}
            className="mt-1 size-4 accent-orange-500"
          />
          <span>{CONSENT_TEXT}</span>
        </label>

        {message ? <p className="font-black text-orange-200">{message}</p> : null}
        {error ? <p className="font-bold text-red-300">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-black transition hover:bg-orange-400 hover:shadow-[0_16px_50px_rgba(255,106,0,0.18)] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 sm:w-auto"
        >
          {isSubmitting ? "Even opslaan..." : "Zet mij op de lijst"}
        </button>
      </form>
      <p className="mt-4 text-xs leading-5 text-zinc-500">
        We gebruiken je e-mail alleen voor updates van Outfit Roaster. Geen spam. Afmelden kan altijd.
      </p>
    </article>
  );
}
