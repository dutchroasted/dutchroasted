import { OUTFIT_PROFILES, type OutfitProfile } from "@/lib/outfitTypes";

type ProfileSelectProps = {
  value: OutfitProfile;
  onChange: (value: OutfitProfile) => void;
};

export function ProfileSelect({ value, onChange }: ProfileSelectProps) {
  return (
    <fieldset>
      <legend className="dr-kicker">
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
            className={`dr-card-hover min-h-12 rounded-2xl border px-3 py-3 text-sm font-black transition ${
              profile === value
                ? "border-orange-300/70 bg-[linear-gradient(135deg,#ff9a4f,#ff6a00)] text-black shadow-[0_18px_50px_rgba(255,106,0,0.2)]"
                : "border-white/10 bg-black/25 text-zinc-200 hover:border-orange-400/45 hover:bg-white/[0.075]"
            }`}
          >
            {profile}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
