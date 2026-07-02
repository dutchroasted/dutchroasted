const popularChecks = [
  {
    href: "/ai-outfit-checker",
    label: "AI Outfit Checker",
    description: "Laat AI je stijl, kleur, pasvorm en vibe beoordelen.",
  },
  {
    href: "/outfit-roast",
    label: "Outfit Roast",
    description: "Krijg een scherpe Nederlandse roast van je outfit.",
  },
  {
    href: "/date-outfit-check",
    label: "Date Outfit Checker",
    description: "Check of je outfit datewaardig overkomt.",
  },
  {
    href: "/festival-outfit-check",
    label: "Festival Outfit Checker",
    description: "Test je festivalfit op vibe, comfort en kleur.",
  },
  {
    href: "/kleurcombinatie-outfit-check",
    label: "Kleurcombinatie Checker",
    description: "Ontdek of je kleuren samenwerken of ruzie maken.",
  },
  {
    href: "/outfit-checks",
    label: "Alle outfit checks",
    description: "Bekijk alle gratis outfit checks op één plek.",
  },
];

export function PopularOutfitChecks() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
            Populaire outfit checks
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
            Kies je twijfel. Upload je outfit.
          </h2>
          <p className="mt-4 leading-7 text-zinc-400">
            Van date tot festival en van kleur tot roast: deze pagina&apos;s helpen Google én
            gebruikers sneller naar de juiste outfitcheck.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularChecks.map((check) => (
            <a
              key={check.href}
              href={check.href}
              className="dr-card-hover rounded-3xl border border-white/10 bg-white/[0.04] p-5 hover:border-orange-500/40 hover:bg-orange-500/[0.055]"
            >
              <h3 className="text-lg font-black text-white">{check.label}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{check.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
