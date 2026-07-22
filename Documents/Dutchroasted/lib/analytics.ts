"use client";

import { hasAnalyticsConsent } from "./cookieConsent";

export type AnalyticsEventName =
  | "photo_uploaded"
  | "roast_started"
  | "roast_completed"
  | "share_card_downloaded"
  | "share_card_shared"
  | "tiktok_video_downloaded"
  | "premium_clicked"
  | "checkout_started"
  | "checkout_completed"
  | "login_started"
  | "login_completed"
  | "signup_completed"
  | "quote_changed"
  | "shop_item_clicked"
  | "seo_cta_clicked"
  | "seo_landing_view"
  | "blog_view"
  | "blog_cta_clicked"
  | "press_page_view"
  | "press_asset_download"
  | "press_contact_click";

type AnalyticsParameters = Record<string, string | number | boolean | undefined>;

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const analyticsDebugMode =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_GA_DEBUG === "true";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...arguments_: unknown[]) => void;
    clarity?: (...arguments_: unknown[]) => void;
  }
}

export function trackPageView(activeMeasurementId: string, pagePath: string) {
  sendGoogleAnalyticsCommand("event", "page_view", {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
    send_to: activeMeasurementId,
  });
}

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  parameters: AnalyticsParameters = {},
) {
  if (
    !measurementId ||
    typeof window === "undefined" ||
    !hasAnalyticsConsent()
  ) {
    return;
  }

  sendGoogleAnalyticsCommand(
    "event",
    eventName,
    removeUndefinedValues({
      ...parameters,
      debug_mode: analyticsDebugMode,
    }),
  );
}

export const analytics = {
  photoUploaded({
    fileType,
    deviceType,
    loggedIn,
  }: {
    fileType: string;
    deviceType: string;
    loggedIn: boolean;
  }) {
    trackAnalyticsEvent("photo_uploaded", {
      file_type: fileType || "unknown",
      device_type: deviceType,
      logged_in: loggedIn,
    });
  },
  roastStarted({
    gender,
    occasion,
    tone,
  }: {
    gender: string;
    occasion: string;
    tone: string;
  }) {
    trackAnalyticsEvent("roast_started", {
      gender,
      occasion,
      tone,
    });
  },
  roastCompleted({
    score,
    tone,
    processingTime,
  }: {
    score: number;
    tone: string;
    processingTime: number;
  }) {
    trackAnalyticsEvent("roast_completed", {
      score,
      tone,
      processing_time: processingTime,
    });
  },
  shareCardDownloaded(score: number) {
    trackAnalyticsEvent("share_card_downloaded", { score });
  },
  shareCardShared(score: number) {
    trackAnalyticsEvent("share_card_shared", { score });
  },
  quoteChanged(quoteIndex: number) {
    trackAnalyticsEvent("quote_changed", { quote_index: quoteIndex });
  },
  tiktokVideoDownloaded(score: number) {
    trackAnalyticsEvent("tiktok_video_downloaded", { score });
  },
  premiumClicked(location: "homepage" | "pricing" | "modal" | "resultaatpagina") {
    trackAnalyticsEvent("premium_clicked", { location });
  },
  checkoutStarted() {
    trackAnalyticsEvent("checkout_started");
  },
  checkoutCompleted() {
    trackAnalyticsEvent("checkout_completed");
  },
  loginStarted() {
    trackAnalyticsEvent("login_started");
  },
  loginCompleted() {
    trackAnalyticsEvent("login_completed");
  },
  signupCompleted() {
    trackAnalyticsEvent("signup_completed");
  },
  shopItemClicked(category: string, searchQuery: string) {
    trackAnalyticsEvent("shop_item_clicked", {
      category,
      search_query: searchQuery,
    });
  },
  seoLandingViewed({
    slug,
    pageCategory,
  }: {
    slug: string;
    pageCategory: string;
  }) {
    trackAnalyticsEventOnce(`seo_landing_view_${slug}`, "seo_landing_view", {
      slug,
      page_category: pageCategory,
    });
  },
  seoCtaClicked({
    slug,
    ctaPosition,
    pageCategory,
  }: {
    slug: string;
    ctaPosition: string;
    pageCategory: string;
  }) {
    trackAnalyticsEvent("seo_cta_clicked", {
      slug,
      cta_position: ctaPosition,
      page_category: pageCategory,
    });
  },
  blogViewed({
    slug,
    articleCategory,
  }: {
    slug: string;
    articleCategory: string;
  }) {
    trackAnalyticsEventOnce(`blog_view_${slug}`, "blog_view", {
      slug,
      article_category: articleCategory,
    });
  },
  blogCtaClicked({
    slug,
    ctaPosition,
    target,
  }: {
    slug: string;
    ctaPosition: string;
    target: string;
  }) {
    trackAnalyticsEvent("blog_cta_clicked", {
      slug,
      cta_position: ctaPosition,
      target,
    });
  },
  pressPageViewed() {
    trackAnalyticsEventOnce("press_page_view", "press_page_view");
  },
  pressAssetDownloaded(assetName: string) {
    trackAnalyticsEvent("press_asset_download", {
      asset_name: assetName,
    });
  },
  pressContactClicked(location: string) {
    trackAnalyticsEvent("press_contact_click", {
      location,
    });
  },
};

export function trackAnalyticsEventOnce(
  dedupeKey: string,
  eventName: AnalyticsEventName,
  parameters: AnalyticsParameters = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = `outfitroaster_analytics_${dedupeKey}`;
  if (window.sessionStorage.getItem(storageKey)) {
    return;
  }

  window.sessionStorage.setItem(storageKey, "true");
  trackAnalyticsEvent(eventName, parameters);
}

export function getAnalyticsDeviceType() {
  if (typeof window === "undefined") {
    return "unknown";
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  if (/ipad|tablet/.test(userAgent)) {
    return "tablet";
  }

  if (/mobi|iphone|android/.test(userAgent)) {
    return "mobile";
  }

  return "desktop";
}

function removeUndefinedValues(parameters: AnalyticsParameters) {
  return Object.fromEntries(
    Object.entries(parameters).filter(
      (entry): entry is [string, string | number | boolean] => entry[1] !== undefined,
    ),
  );
}

function sendGoogleAnalyticsCommand(...command: unknown[]) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) {
    return;
  }

  if (window.gtag) {
    window.gtag(...command);
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  const queueCommand: (...arguments_: unknown[]) => void = function () {
    window.dataLayer?.push(arguments);
  };
  queueCommand(...command);
}
