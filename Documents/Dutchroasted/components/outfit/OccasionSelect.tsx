import { OUTFIT_OCCASIONS, type OutfitOccasion } from "@/lib/outfitTypes";

type OccasionSelectProps = {
  value: OutfitOccasion;
  onChange: (value: OutfitOccasion) => void;
};

const occasionLabels: Record<OutfitOccasion, string> = {
  Date: "Date",
  Werk: "Werk",
  School: "School",
  Sportschool: "Sportschool",
  Festival: "Festival",
};

export function OccasionSelect({ value, onChange }: OccasionSelectProps) {
  return (
    <fieldset>
      <legend className="dr-kicker">
        Waar draag je dit?
      </legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {OUTFIT_OCCASIONS.map((occasion) => (
          <button
            key={occasion}
            type="button"
            onClick={() => onChange(occasion)}
            aria-pressed={occasion === value}
            className={`dr-card-hover min-h-12 rounded-2xl border px-3 py-3 text-sm font-black transition ${
              occasion === value
                ? "border-orange-300/70 bg-[linear-gradient(135deg,#ff9a4f,#ff6a00)] text-black shadow-[0_18px_50px_rgba(255,106,0,0.2)]"
                : "border-white/10 bg-black/25 text-zinc-200 hover:border-orange-400/45 hover:bg-white/[0.075]"
            }`}
          >
            {occasionLabels[occasion]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
