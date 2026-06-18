"use client";

export type AnalyticsEventName =
  | "outfit_upload"
  | "outfit_check_started"
  | "outfit_check_completed"
  | "share_card_downloaded"
  | "share_card_shared"
  | "quote_changed"
  | "shop_item_clicked";

type AnalyticsParameters = Record<string, string | number | boolean | undefined>;

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...arguments_: unknown[]) => void;
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
  if (!measurementId || typeof window === "undefined") {
    return;
  }

  sendGoogleAnalyticsCommand(
    "event",
    eventName,
    removeUndefinedValues(parameters),
  );
}

export const analytics = {
  outfitUpload(fileType: string, fileSizeBytes: number) {
    trackAnalyticsEvent("outfit_upload", {
      file_type: fileType || "unknown",
      file_size_bytes: fileSizeBytes,
    });
  },
  outfitCheckStarted(occasion: string, intensity: string, profile: string) {
    trackAnalyticsEvent("outfit_check_started", { occasion, intensity, profile });
  },
  outfitCheckCompleted(occasion: string, intensity: string, score: number) {
    trackAnalyticsEvent("outfit_check_completed", { occasion, intensity, score });
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
  shopItemClicked(category: string, searchQuery: string) {
    trackAnalyticsEvent("shop_item_clicked", {
      category,
      search_query: searchQuery,
    });
  },
};

function removeUndefinedValues(parameters: AnalyticsParameters) {
  return Object.fromEntries(
    Object.entries(parameters).filter(
      (entry): entry is [string, string | number | boolean] => entry[1] !== undefined,
    ),
  );
}

function sendGoogleAnalyticsCommand(...command: unknown[]) {
  if (typeof window === "undefined") {
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
