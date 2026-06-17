import type { OutfitIntensity } from "@/lib/outfitTypes";

const options: Array<{ value: OutfitIntensity; label: string; description: string }> = [
  { value: "roast", label: "Roast me 🔥", description: "Flamboyant, scherp en screenshotwaardig." },
  {
    value: "rotterdams",
    label: "Niet lullen, stylen",
    description: "Rotterdamse steek. Kort, direct en met een knipoog.",
  },
];

type IntensitySelectorProps = {
  value: OutfitIntensity;
  onChange: (value: OutfitIntensity) => void;
};

export function IntensitySelector({ value, onChange }: IntensitySelectorProps) {
  return (
    <fieldset>
      <legend className="text-sm font-black uppercase tracking-[0.16em] text-zinc-400">
        Feedback stijl
      </legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isSelected}
              className={`dr-card-hover min-h-28 rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? "border-orange-500 bg-orange-500 text-black shadow-[0_18px_50px_rgba(255,106,0,0.2)]"
                  : "border-white/10 bg-white/[0.04] text-white hover:border-orange-500/50 hover:bg-white/[0.075]"
              }`}
            >
              <span className="block text-base font-black leading-6">{option.label}</span>
              <span className={`mt-2 block text-sm leading-6 ${isSelected ? "text-black/70" : "text-zinc-500"}`}>
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
