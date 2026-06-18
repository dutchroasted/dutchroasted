"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

type GoogleAnalyticsPageViewsProps = {
  measurementId: string;
};

export function GoogleAnalyticsPageViews({
  measurementId,
}: GoogleAnalyticsPageViewsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  useEffect(() => {
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;
    trackPageView(measurementId, pagePath);
  }, [measurementId, pathname, queryString]);

  return null;
}
