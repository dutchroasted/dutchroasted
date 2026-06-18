import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-[#050505] px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col justify-between">
        <Logo />

        <section className="py-20">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-[#ff6a00]">
            Offline
          </p>
          <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">
            Je outfit krijgt even geen bereik.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
            Outfit Roaster heeft internet nodig om je outfit te checken. Zodra je
            verbinding terug is, kun je gewoon weer verder.
          </p>
          <Link
            href="/outfit-check"
            className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff6a00] px-6 text-sm font-black text-black shadow-[0_0_32px_rgba(255,106,0,0.32)] transition hover:-translate-y-0.5 hover:bg-white"
          >
            Terug naar outfit check
          </Link>
        </section>

        <p className="text-sm text-white/45">OutfitRoaster.nl</p>
      </div>
    </main>
  );
}
