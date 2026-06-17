import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Contact | DutchRoasted",
  description: "Neem contact op met DutchRoasted.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-36 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">
              Contact
            </p>
            <h1 className="mt-6 text-5xl font-black leading-tight text-white sm:text-7xl">
              Iets vragen? Roep maar.
            </h1>
            <p className="mt-6 text-lg font-semibold leading-8 text-zinc-300">
              Heb je vragen over DutchRoasted of wil je dat je e-mailadres wordt verwijderd uit
              onze early access lijst? Mail ons via info@dutchroasted.nl.
            </p>
          </div>

          <article className="rounded-3xl border border-white/10 bg-zinc-950/75 p-6 shadow-2xl shadow-black/30 sm:p-8">
            <h2 className="text-2xl font-black text-white">Stuur een bericht</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              Mail naar{" "}
              <a href="mailto:info@dutchroasted.nl" className="font-black text-orange-300">
                info@dutchroasted.nl
              </a>
              .
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-zinc-500">
                  Reactietijd
                </p>
                <p className="mt-2 font-black text-white">Zo snel mogelijk</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-zinc-500">
                  Onderwerp
                </p>
                <p className="mt-2 font-black text-white">Outfit chaos welkom</p>
              </div>
            </div>
          </article>
        </div>
      </section>
      <Footer />
    </main>
  );
}
