import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { blogPosts } from "@/data/blog-posts";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Blog | Outfit Roaster",
  description:
    "Evergreen gidsen over outfits, pasvorm, kleur, schoenen, gelegenheden en AI-outfitchecks.",
  path: "/blog",
});

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 pb-20 pt-28 sm:px-6 sm:pt-36 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">
            OutfitRoaster blog
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-7xl">
            Gidsen voor betere outfits.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Praktische, evergreen uitleg over stijl, pasvorm, kleur en outfitkeuzes. Geen
            ingewikkelde modepraat, wel duidelijke checks die je meteen kunt gebruiken.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="/outfit-check"
              className="dr-primary-button inline-flex min-h-14 items-center justify-center px-6 py-4"
            >
              Check mijn outfit
            </a>
            <a
              href="/outfit-checks"
              className="dr-secondary-button inline-flex min-h-14 items-center justify-center px-6 py-4"
            >
              Bekijk alle checks
            </a>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="dr-card-hover rounded-3xl border border-white/10 bg-zinc-950/70 p-6 hover:border-orange-500/40 hover:bg-orange-500/[0.06]"
              >
                <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-300">
                  {post.readingTime}
                </p>
                <h2 className="mt-4 text-2xl font-black leading-8 text-white">{post.title}</h2>
                <p className="mt-4 leading-7 text-zinc-400">{post.excerpt}</p>
                <span className="mt-6 inline-flex text-sm font-black text-orange-300">
                  Lees gids →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
