import {
  OUTFIT_ROASTER_PERSONAS,
  type OutfitRoasterPersona,
} from "@/lib/outfitTypes";

const personaDescriptions: Record<OutfitRoasterPersona, string> = {
  "🔥 Brutale Vriend": "De scherpste, grappigste roast. Recht voor z’n raap.",
  "❤️ Date Coach": "Date-vibe, eerste indruk en zelfverzekerde styling.",
  "💼 Recruiter": "Professioneel, geloofwaardig en klaar voor de werkvloer.",
};

type RoasterPersonaSelectProps = {
  value: OutfitRoasterPersona;
  onChange: (value: OutfitRoasterPersona) => void;
};

export function RoasterPersonaSelect({
  value,
  onChange,
}: RoasterPersonaSelectProps) {
  return (
    <fieldset>
      <legend className="dr-kicker">Kies je Roaster</legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {OUTFIT_ROASTER_PERSONAS.map((persona) => {
          const isSelected = persona === value;

          return (
            <button
              key={persona}
              type="button"
              onClick={() => onChange(persona)}
              aria-pressed={isSelected}
              className={`dr-card-hover min-h-32 rounded-3xl border p-4 text-left transition ${
                isSelected
                  ? "border-orange-300/70 bg-[linear-gradient(135deg,#ff9a4f,#ff6a00)] text-black shadow-[0_18px_50px_rgba(255,106,0,0.2)]"
                  : "border-white/10 bg-black/25 text-white hover:border-orange-400/50 hover:bg-white/[0.075]"
              }`}
            >
              <span className="block text-base font-black leading-6">{persona}</span>
              <span
                className={`mt-2 block text-sm leading-6 ${
                  isSelected ? "text-black/70" : "text-zinc-500"
                }`}
              >
                {personaDescriptions[persona]}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
