import type { OutfitCheckMode } from "@/lib/outfitTypes";

type ModeSelectorProps = {
  value: OutfitCheckMode;
  onChange: (value: OutfitCheckMode) => void;
};

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <section className="mb-5">
      <p className="dr-kicker">Kies je check</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChange("roast")}
          aria-pressed={value === "roast"}
          className={`min-h-28 rounded-3xl border p-4 text-left transition ${
            value === "roast"
              ? "border-orange-300/70 bg-[linear-gradient(135deg,#ff9a4f,#ff6a00)] text-black shadow-[0_18px_50px_rgba(255,106,0,0.2)]"
              : "border-white/10 bg-black/25 text-white"
          }`}
        >
          <span className="block text-lg font-black">🔥 Outfit Roast</span>
          <span className={`mt-2 block text-sm ${value === "roast" ? "text-black/70" : "text-zinc-400"}`}>
            Gratis snelle roast voor je outfit.
          </span>
        </button>

        <div className="relative min-h-28 rounded-3xl border border-violet-300/20 bg-[linear-gradient(145deg,rgba(139,92,246,0.15),rgba(255,255,255,0.035))] p-4 text-left">
          <span className="absolute right-3 top-3 rounded-full border border-violet-300/20 bg-violet-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-violet-200">
            Premium
          </span>
          <span className="block pr-20 text-lg font-black text-white">💎 Pro Analyse</span>
          <span className="mt-2 block text-sm leading-5 text-zinc-400">
            Diepe stijlanalyse met kleur, pasvorm, samenhang en trendcheck.
          </span>
          <button
            type="button"
            disabled
            className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-zinc-400"
          >
            Binnenkort beschikbaar
          </button>
        </div>
      </div>
    </section>
  );
}
