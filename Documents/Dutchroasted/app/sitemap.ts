import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";
import { publishedSeoV2Pages } from "@/data/seo-v2-pages";

const siteUrl = "https://www.outfitroaster.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/outfit-check", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/outfit-checks", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/pricing", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.75, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/voorwaarden", priority: 0.3, changeFrequency: "yearly" as const },
    ...publishedSeoV2Pages.map((seoPage) => ({
      path: `/outfit-check/${seoPage.slug}`,
      priority: 0.85,
      changeFrequency: "monthly" as const,
      lastModified: seoPage.lastModified,
    })),
    ...blogPosts.map((post) => ({
      path: `/blog/${post.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
      lastModified: post.updatedAt,
    })),
  ];

  return pages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: "lastModified" in page ? new Date(page.lastModified) : new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
