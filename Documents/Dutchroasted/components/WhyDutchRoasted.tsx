const reasons = [
  "Niet alleen grappig, maar ook stijlvol nuttig",
  "Je krijgt concrete stylingtips",
  "Je ziet wat werkt aan kleur, pasvorm en accessoires",
  "Je krijgt algemene shop suggesties zonder affiliate gedoe",
];

export function WhyDutchRoasted() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
            Waarom Outfit Roaster?
          </p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
            Flamboyant genoeg om eerlijk te zijn. Slim genoeg om bruikbaar te blijven.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {reasons.map((reason) => (
            <div key={reason} className="rounded-lg border border-white/10 bg-black/45 p-5">
              <div className="mb-5 h-1 w-12 rounded-full bg-orange-500" />
              <p className="text-lg font-black leading-7 text-white">{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
