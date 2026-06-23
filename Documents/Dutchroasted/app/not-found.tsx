import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <section className="dr-glass-card w-full max-w-2xl rounded-[2rem] p-7 text-center sm:p-10">
        <a href="/" className="inline-flex" aria-label="Outfit Roaster home">
          <Logo />
        </a>
        <p className="mt-10 text-sm font-black uppercase tracking-[0.18em] text-orange-300">
          404 · Verkeerde afslag
        </p>
        <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">
          Deze pagina zit niet in de outfit.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-zinc-400">
          De link klopt niet meer of is ergens onderweg van stijl veranderd.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/" className="dr-secondary-button min-h-12 px-5 py-3">
            Naar home
          </a>
          <a href="/outfit-check" className="dr-primary-button min-h-12 px-5 py-3">
            Check mijn outfit
          </a>
        </div>
      </section>
    </main>
  );
}
