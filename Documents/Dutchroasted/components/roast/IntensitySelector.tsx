import type { RoastIntensity } from "@/lib/roastTypes";

const options: Array<{ value: RoastIntensity; label: string; description: string }> = [
  { value: "mild", label: "Mild 😇", description: "Eerlijk, maar met zachte landing." },
  { value: "medium", label: "Medium 😏", description: "Scherp, grappig en bruikbaar." },
  { value: "brutal", label: "Brutal 🔥", description: "Harder, maar nog steeds behulpzaam." },
];

type IntensitySelectorProps = {
  value: RoastIntensity;
  onChange: (value: RoastIntensity) => void;
};

export function IntensitySelector({ value, onChange }: IntensitySelectorProps) {
  return (
    <fieldset>
      <legend className="text-sm font-black uppercase tracking-[0.16em] text-zinc-400">
        Intensiteit
      </legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-md border p-4 text-left transition ${
                isSelected
                  ? "border-orange-500 bg-orange-500 text-black shadow-[0_18px_50px_rgba(255,106,0,0.2)]"
                  : "border-white/10 bg-white/[0.04] text-white hover:border-orange-500/50 hover:bg-white/[0.07]"
              }`}
              aria-pressed={isSelected}
            >
              <span className="block text-base font-black">{option.label}</span>
              <span
                className={`mt-2 block text-sm leading-5 ${
                  isSelected ? "text-black/70" : "text-zinc-500"
                }`}
              >
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
