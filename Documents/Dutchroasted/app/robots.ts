import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/account", "/auth/", "/offline"],
    },
    sitemap: "https://www.outfitroaster.com/sitemap.xml",
    host: "https://www.outfitroaster.com",
  };
}
