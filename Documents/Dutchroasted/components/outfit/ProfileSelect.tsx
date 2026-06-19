import { OUTFIT_PROFILES, type OutfitProfile } from "@/lib/outfitTypes";

type ProfileSelectProps = {
  value: OutfitProfile;
  onChange: (value: OutfitProfile) => void;
};

export function ProfileSelect({ value, onChange }: ProfileSelectProps) {
  return (
    <fieldset>
      <legend className="dr-kicker">👤 Voor wie?</legend>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {OUTFIT_PROFILES.map((profile) => (
          <button
            key={profile}
            type="button"
            onClick={() => onChange(profile)}
            aria-pressed={profile === value}
            className={`dr-card-hover min-h-16 rounded-2xl border px-2 py-3 text-sm font-black leading-5 transition sm:px-3 ${
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
