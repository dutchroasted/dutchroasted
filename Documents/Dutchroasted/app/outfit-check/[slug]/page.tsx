import { notFound } from "next/navigation";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { getSeoV2Page, publishedSeoV2Pages } from "@/data/seo-v2-pages";
import { createPageMetadata } from "@/lib/seo";

type SeoPageRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedSeoV2Pages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: SeoPageRouteProps) {
  const { slug } = await params;
  const page = getSeoV2Page(slug);

  if (!page) {
    return {};
  }

  return createPageMetadata({
    title: page.title,
    description: page.description,
    path: `/outfit-check/${page.slug}`,
  });
}

export default async function SeoPageRoute({ params }: SeoPageRouteProps) {
  const { slug } = await params;
  const page = getSeoV2Page(slug);

  if (!page) {
    notFound();
  }

  return <SeoLandingPage page={page} />;
}
