import { OUTFIT_ROAST_LEVELS, type OutfitRoastLevel } from "@/lib/outfitTypes";

const levelDescriptions: Record<OutfitRoastLevel, string> = {
  Complimenten: "Warm, positief en zelfvertrouwen gevend.",
  Pittig: "Scherp, grappig en direct.",
  Genadeloos: "Volle roastenergie, nooit hatelijk.",
};
const levelLabels: Record<OutfitRoastLevel, string> = {
  Complimenten: "😇 Complimenten",
  Pittig: "😏 Pittig",
  Genadeloos: "🔥 Genadeloos",
};

type RoastLevelSelectProps = {
  value: OutfitRoastLevel;
  onChange: (value: OutfitRoastLevel) => void;
};

export function RoastLevelSelect({ value, onChange }: RoastLevelSelectProps) {
  return (
    <fieldset>
      <legend className="dr-kicker">🔥 Roast level</legend>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {OUTFIT_ROAST_LEVELS.map((level) => {
          const isSelected = level === value;

          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              aria-pressed={isSelected}
              className={`dr-card-hover min-h-24 rounded-2xl border p-3 text-left transition sm:min-h-28 sm:p-4 ${
                isSelected
                  ? "border-orange-300/70 bg-[linear-gradient(135deg,#ff9a4f,#ff6a00)] text-black shadow-[0_18px_50px_rgba(255,106,0,0.2)]"
                  : "border-white/10 bg-black/25 text-white hover:border-orange-400/50 hover:bg-white/[0.075]"
              }`}
            >
              <span className="block text-sm font-black sm:text-base">
                {levelLabels[level]}
              </span>
              <span
                className={`mt-1.5 block text-xs leading-5 sm:text-sm ${
                  isSelected ? "text-black/70" : "text-zinc-500"
                }`}
              >
                {levelDescriptions[level]}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
