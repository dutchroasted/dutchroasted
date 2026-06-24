export const COOKIE_CONSENT_STORAGE_KEY = "outfitroaster_cookie_consent";
export const COOKIE_PREFERENCES_EVENT = "outfitroaster:open-cookie-preferences";

export type CookieConsentChoice = "accepted" | "rejected";

export function readCookieConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function hasAnalyticsConsent() {
  return readCookieConsent() === "accepted";
}

export function saveCookieConsent(choice: CookieConsentChoice) {
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(COOKIE_PREFERENCES_EVENT));
}
