"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics";
import type { SeoV2PageCategory } from "@/data/seo-v2-pages";

type SeoLandingViewProps = {
  slug: string;
  pageCategory: SeoV2PageCategory;
};

type SeoCtaLinkProps = SeoLandingViewProps & {
  ctaPosition: "hero" | "middle" | "bottom";
  className: string;
  children: React.ReactNode;
};

export function SeoLandingView({ slug, pageCategory }: SeoLandingViewProps) {
  useEffect(() => {
    analytics.seoLandingViewed({ slug, pageCategory });
  }, [pageCategory, slug]);

  return null;
}

export function SeoCtaLink({
  slug,
  pageCategory,
  ctaPosition,
  className,
  children,
}: SeoCtaLinkProps) {
  return (
    <a
      href="/outfit-check"
      className={className}
      onClick={() => {
        analytics.seoCtaClicked({ slug, pageCategory, ctaPosition });
      }}
    >
      {children}
    </a>
  );
}
