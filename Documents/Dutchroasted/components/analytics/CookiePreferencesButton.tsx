"use client";

import { openCookiePreferences } from "@/lib/cookieConsent";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className="transition hover:text-white"
    >
      Cookievoorkeuren
    </button>
  );
}
