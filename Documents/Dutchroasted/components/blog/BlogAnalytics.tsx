"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics";

type BlogViewProps = {
  slug: string;
  articleCategory: string;
};

type BlogCtaLinkProps = {
  slug: string;
  ctaPosition: "top" | "middle" | "bottom";
  target: string;
  className: string;
  children: React.ReactNode;
};

export function BlogView({ slug, articleCategory }: BlogViewProps) {
  useEffect(() => {
    analytics.blogViewed({ slug, articleCategory });
  }, [articleCategory, slug]);

  return null;
}

export function BlogCtaLink({
  slug,
  ctaPosition,
  target,
  className,
  children,
}: BlogCtaLinkProps) {
  return (
    <a
      href={target}
      className={className}
      onClick={() => {
        analytics.blogCtaClicked({ slug, ctaPosition, target });
      }}
    >
      {children}
    </a>
  );
}
