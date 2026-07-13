import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";
import { seoPages } from "@/data/seo-pages";

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
    ...seoPages.map((seoPage) => ({
      path: `/${seoPage.slug}`,
      priority: 0.85,
      changeFrequency: "monthly" as const,
    })),
    ...blogPosts.map((post) => ({
      path: `/blog/${post.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
  ];

  return pages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
