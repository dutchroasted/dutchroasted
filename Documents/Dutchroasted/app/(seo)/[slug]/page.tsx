import { permanentRedirect } from "next/navigation";
import { legacySeoSlugRedirects } from "@/data/seo-redirects";
import { getSeoV2Page, publishedSeoV2Pages } from "@/data/seo-v2-pages";

type SeoPageRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...publishedSeoV2Pages.map((page) => ({
      slug: page.slug,
    })),
    ...Object.keys(legacySeoSlugRedirects).map((slug) => ({ slug })),
  ];
}

export default async function SeoPageRoute({ params }: SeoPageRouteProps) {
  const { slug } = await params;
  const targetSlug = getSeoV2Page(slug)?.slug ?? legacySeoSlugRedirects[slug];

  permanentRedirect(targetSlug ? `/outfit-check/${targetSlug}` : "/outfit-check");
}
