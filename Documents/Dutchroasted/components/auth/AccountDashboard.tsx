"use client";

import { useEffect, useState } from "react";
import { useAuthProfile } from "@/hooks/useAuthProfile";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { LoginForm } from "./LoginForm";

export function AccountDashboard() {
  const auth = useAuthProfile();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [loginRequired, setLoginRequired] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCheckoutSuccess(params.get("checkout") === "success");
    setLoginRequired(params.get("login") === "required");

    if (params.get("checkout") === "success" && auth.isAuthenticated) {
      void auth.refresh();
    }
  }, [auth.isAuthenticated]);

  if (!auth.isReady) {
    return <p className="text-zinc-300">Account laden...</p>;
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="space-y-5">
        {loginRequired ? (
          <p className="rounded-2xl border border-orange-400/30 bg-orange-400/10 p-4 font-bold text-orange-100">
            Log eerst in om Premium te activeren.
          </p>
        ) : null}
        <LoginForm />
      </div>
    );
  }

  const isPremium = auth.profile?.subscription_status === "active";

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8">
        {checkoutSuccess ? (
          <p className="mb-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 font-bold text-emerald-100">
            Je betaling is gelukt. Premium wordt geactiveerd zodra Stripe dit verwerkt heeft.
          </p>
        ) : null}
        <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">
          Ingelogd
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">Mijn OutfitRoaster account</h1>
        <div className="mt-7 grid gap-4">
          <InfoRow label="E-mailadres" value={auth.session?.user.email || "-"} />
          <InfoRow
            label="Premiumstatus"
            value={isPremium ? "Premium actief" : "Geen actief abonnement"}
          />
        </div>
        {auth.error ? <p className="mt-5 font-bold text-red-300">{auth.error}</p> : null}
      </div>

      <aside className="rounded-3xl border border-orange-500/30 bg-orange-500/[0.08] p-6 sm:p-8">
        <h2 className="text-2xl font-black text-white">
          {isPremium ? "Premium actief" : "Activeer Premium"}
        </h2>
        <p className="mt-3 leading-7 text-zinc-300">
          {isPremium
            ? "Je hebt toegang tot Pro Analyse."
            : "Premium is nodig voor de diepe Pro Analyse."}
        </p>
        {isPremium ? (
          <a
            href="/outfit-check"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 font-black text-black"
          >
            Start Pro Analyse
          </a>
        ) : (
          <CheckoutButton />
        )}
        <button
          type="button"
          onClick={() => void auth.signOut().then(() => window.location.reload())}
          className="mt-3 min-h-12 w-full rounded-2xl border border-white/15 px-5 py-3 font-black text-white"
        >
          Uitloggen
        </button>
      </aside>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}
