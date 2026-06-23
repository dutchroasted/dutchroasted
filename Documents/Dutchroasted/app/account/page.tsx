import { Logo } from "@/components/Logo";

type AccountPageProps = {
  searchParams: Promise<{ checkout?: string }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const { checkout } = await searchParams;

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <a href="/" aria-label="Outfit Roaster home">
          <Logo />
        </a>

        <section className="mt-12 rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-300">
            Account
          </p>
          <h1 className="mt-3 text-4xl font-black text-white">
            Mijn OutfitRoaster account
          </h1>

          {checkout === "success" ? (
            <p className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4 font-bold leading-7 text-emerald-100">
              Je betaling is gelukt. Premium wordt geactiveerd zodra Stripe dit verwerkt heeft.
            </p>
          ) : (
            <p className="mt-5 leading-7 text-zinc-300">
              Hier verschijnt straks je Premium-status en abonnementsbeheer.
            </p>
          )}

          <a
            href="/outfit-check"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-black transition hover:bg-orange-400"
          >
            Terug naar Outfit Check
          </a>
        </section>
      </div>
    </main>
  );
}
