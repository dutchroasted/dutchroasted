import { ROAST_CATEGORIES, type RoastCategory } from "@/lib/roastTypes";

type CategorySelectProps = {
  value: RoastCategory;
  onChange: (value: RoastCategory) => void;
};

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-zinc-400">
        Categorie
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as RoastCategory)}
        className="mt-3 w-full rounded-md border border-white/10 bg-black px-4 py-4 text-base font-bold text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
      >
        {ROAST_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  );
}
