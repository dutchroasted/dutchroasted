const categories = [
  ["Casual", "Check of je dagelijkse outfit relaxed of vooral per ongeluk is."],
  ["Werk", "Professioneel zonder dat je eruitziet alsof je in een spreadsheet woont."],
  ["Date", "Eerlijk advies voor outfits met intentie, niet met paniek."],
  ["Sportschool", "Van trainingsset naar een sportlook met een duidelijk plan."],
  ["Festival", "Praktisch, uitgesproken en niet alsof je verdwaald bent bij de glitterkraam."],
  ["Bruiloft", "Netjes, feestelijk en zonder de bruid visueel te tackelen."],
  ["Sollicitatie", "Sterk, verzorgd en geloofwaardig voor de eerste indruk."],
  ["Anders", "Voor alle outfitmomenten waar je zelf even blind op bent geworden."],
];

export function RoastCategories() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
              Checks voor elke gelegenheid
            </p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
              Waar kun je je outfit voor checken?
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-zinc-400">
            Van date tot sollicitatie. Outfit Roaster kijkt naar kleding, styling, kleur,
            pasvorm, accessoires en de setting.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(([title, description]) => (
            <article
              key={title}
              className="rounded-lg border border-white/10 bg-zinc-950/70 p-5 transition hover:-translate-y-1 hover:border-orange-500/50 hover:bg-zinc-900"
            >
              <h3 className="text-lg font-black text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
