"use client";

import { useEffect } from "react";
import { useAuthProfile } from "@/hooks/useAuthProfile";

export function AccountDashboard() {
  const auth = useAuthProfile();

  useEffect(() => {
    if (auth.isReady && !auth.isAuthenticated) {
      window.location.href = "/login";
    }
  }, [auth.isAuthenticated, auth.isReady]);

  if (!auth.isReady) {
    return (
      <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 text-zinc-300">
        Account laden...
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 text-zinc-300">
        Je wordt doorgestuurd naar login.
      </div>
    );
  }

  const plan = auth.profile?.plan ?? "free";
  const used = auth.usage?.used ?? 0;
  const limit = auth.usage?.limit ?? 3;

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">
          Account
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">Je DutchRoasted profiel</h1>

        <div className="mt-8 grid gap-4">
          <InfoRow label="E-mailadres" value={auth.profile?.email || auth.session?.user.email || "-"} />
          <InfoRow label="Huidig plan" value={plan} />
          <InfoRow
            label="Roasts vandaag"
            value={auth.usage?.unlimited ? `${used} gebruikt, onbeperkt beschikbaar` : `${used} van ${limit}`}
          />
        </div>

        {auth.error ? <p className="mt-5 font-bold text-red-200">{auth.error}</p> : null}
      </div>

      <aside className="rounded-lg border border-orange-500/30 bg-orange-500/[0.08] p-6 sm:p-8">
        <h2 className="text-2xl font-black text-white">Premium komt eraan.</h2>
        <p className="mt-3 leading-7 text-zinc-300">
          Je account is klaar voor planstatussen. Zodra betaling live gaat, kan dit profiel
          worden gekoppeld aan Premium of Pro.
        </p>
        <div className="mt-6 grid gap-3">
          <a
            href="/pricing"
            className="rounded-md bg-orange-500 px-5 py-4 text-center text-sm font-black text-black transition hover:bg-orange-400"
          >
            Naar pricing
          </a>
          <button
            type="button"
            onClick={() => void auth.signOut().then(() => (window.location.href = "/"))}
            className="rounded-md border border-white/15 bg-white/5 px-5 py-4 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </aside>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}
