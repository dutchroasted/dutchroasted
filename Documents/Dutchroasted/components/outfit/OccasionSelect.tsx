import { OUTFIT_OCCASIONS, type OutfitOccasion } from "@/lib/outfitTypes";

type OccasionSelectProps = {
  value: OutfitOccasion;
  onChange: (value: OutfitOccasion) => void;
};

const occasionLabels: Record<OutfitOccasion, string> = {
  Casual: "Casual",
  Werk: "Werk",
  Date: "Date",
  Feest: "Feest",
  Festival: "Festival",
  Bruiloft: "Bruiloft",
  Sollicitatie: "Sollicitatie",
  Anders: "Anders",
};

export function OccasionSelect({ value, onChange }: OccasionSelectProps) {
  return (
    <fieldset>
      <legend className="text-sm font-black uppercase tracking-[0.16em] text-zinc-400">
        Gelegenheid
      </legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {OUTFIT_OCCASIONS.map((occasion) => (
          <button
            key={occasion}
            type="button"
            onClick={() => onChange(occasion)}
            aria-pressed={occasion === value}
            className={`dr-card-hover min-h-12 rounded-xl border px-3 py-3 text-sm font-black transition ${
              occasion === value
                ? "border-orange-500 bg-orange-500 text-black shadow-[0_18px_50px_rgba(255,106,0,0.2)]"
                : "border-white/10 bg-white/[0.04] text-zinc-200 hover:border-orange-500/45 hover:bg-white/[0.075]"
            }`}
          >
            {occasionLabels[occasion]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
