import { OUTFIT_PROFILES, type OutfitProfile } from "@/lib/outfitTypes";

type ProfileSelectProps = {
  value: OutfitProfile;
  onChange: (value: OutfitProfile) => void;
};

export function ProfileSelect({ value, onChange }: ProfileSelectProps) {
  return (
    <fieldset>
      <legend className="text-sm font-black uppercase tracking-[0.16em] text-zinc-400">
        Profiel <span className="normal-case tracking-normal text-zinc-600">(optioneel)</span>
      </legend>
      <p className="mt-2 text-sm leading-6 text-zinc-500">
        We leiden gender nooit af uit je foto. Met “Verras me” blijft alle feedback neutraal.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {OUTFIT_PROFILES.map((profile) => (
          <button
            key={profile}
            type="button"
            onClick={() => onChange(profile)}
            aria-pressed={profile === value}
            className={`dr-card-hover min-h-12 rounded-xl border px-3 py-3 text-sm font-black transition ${
              profile === value
                ? "border-orange-500 bg-orange-500 text-black shadow-[0_18px_50px_rgba(255,106,0,0.2)]"
                : "border-white/10 bg-white/[0.04] text-zinc-200 hover:border-orange-500/45 hover:bg-white/[0.075]"
            }`}
          >
            {profile}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
