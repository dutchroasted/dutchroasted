"use client";

import { useState } from "react";

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
      });
      const data = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Checkout starten lukt niet.");
      }

      window.location.assign(data.url);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Checkout starten lukt niet. Probeer het opnieuw.",
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={startCheckout}
        disabled={isLoading}
        className="min-h-12 w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-black transition hover:bg-orange-400 disabled:cursor-wait disabled:opacity-60"
      >
        {isLoading ? "Checkout openen..." : "Start Premium"}
      </button>
      {error ? <p className="mt-3 text-sm font-bold text-red-300">{error}</p> : null}
    </div>
  );
}
