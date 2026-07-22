import { permanentRedirect } from "next/navigation";
import { legacySeoSlugRedirects } from "@/data/seo-redirects";
import { getSeoV2Page, publishedSeoV2Pages } from "@/data/seo-v2-pages";

type SeoPageRouteProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

export default async function SeoPageRoute({ params, searchParams }: SeoPageRouteProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const targetSlug = getSeoV2Page(slug)?.slug ?? legacySeoSlugRedirects[slug];
  const targetPath = targetSlug?.startsWith("/")
    ? targetSlug
    : targetSlug
      ? `/outfit-check/${targetSlug}`
      : "/outfit-check";
  const queryString = createQueryString(resolvedSearchParams);

  permanentRedirect(queryString ? `${targetPath}?${queryString}` : targetPath);
}

function createQueryString(searchParams: Record<string, string | string[] | undefined>) {
  const parameters = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => parameters.append(key, item));
    } else if (value !== undefined) {
      parameters.set(key, value);
    }
  }

  return parameters.toString();
}
