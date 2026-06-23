import type { Metadata } from "next";

export const SITE_URL = "https://www.outfitroaster.com";
const SOCIAL_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Outfit Roaster - Upload je outfit. Krijg je verdict.",
};

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: path || "/",
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Outfit Roaster",
      locale: "nl_NL",
      type: "website",
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE.url],
    },
  };
}
