import { Footer } from "./Footer";
import { Header } from "./Header";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{
    title: string;
    body: string[];
  }>;
};

export function LegalPage({ eyebrow, title, intro, sections }: LegalPageProps) {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-36 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">
            {eyebrow}
          </p>
          <h1 className="mt-6 text-5xl font-black leading-tight text-white sm:text-7xl">
            {title}
          </h1>
          <p className="mt-6 text-lg font-semibold leading-8 text-zinc-300">{intro}</p>

          <div className="mt-10 space-y-5">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-white/10 bg-zinc-950/75 p-6 shadow-2xl shadow-black/25"
              >
                <h2 className="text-2xl font-black text-white">{section.title}</h2>
                <div className="mt-4 space-y-4 leading-7 text-zinc-300">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
