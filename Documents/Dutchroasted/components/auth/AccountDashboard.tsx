"use client";

import { useAuthProfile } from "@/hooks/useAuthProfile";
import { LoginForm } from "./LoginForm";

export function AccountDashboard() {
  const auth = useAuthProfile();

  if (!auth.isReady) {
    return <p className="text-zinc-300">Account laden...</p>;
  }

  if (!auth.isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">
          Ingelogd
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">Mijn OutfitRoaster account</h1>
        <div className="mt-7 grid gap-4">
          <InfoRow label="E-mailadres" value={auth.session?.user.email || "-"} />
          <InfoRow
            label="Premium Verdict"
            value="Beta · tijdelijk gratis te testen"
          />
        </div>
        {auth.error ? <p className="mt-5 font-bold text-red-300">{auth.error}</p> : null}
      </div>

      <aside className="rounded-3xl border border-orange-500/30 bg-orange-500/[0.08] p-6 sm:p-8">
        <h2 className="text-2xl font-black text-white">Premium Verdict Beta</h2>
        <p className="mt-3 leading-7 text-zinc-300">
          Tijdelijk gratis te testen. Later onderdeel van Premium.
        </p>
        <a
          href="/outfit-check"
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 font-black text-black"
        >
          Test Premium Verdict Beta
        </a>
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
