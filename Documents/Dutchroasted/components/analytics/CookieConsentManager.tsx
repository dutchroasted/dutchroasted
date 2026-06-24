"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_PREFERENCES_EVENT,
  type CookieConsentChoice,
  readCookieConsent,
  saveCookieConsent,
} from "@/lib/cookieConsent";
import { GoogleAnalytics } from "./GoogleAnalytics";
import { MicrosoftClarity } from "./MicrosoftClarity";

type CookieConsentManagerProps = {
  measurementId?: string;
  clarityProjectId?: string;
};

export function CookieConsentManager({
  measurementId,
  clarityProjectId,
}: CookieConsentManagerProps) {
  const [choice, setChoice] = useState<CookieConsentChoice | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    setChoice(readCookieConsent());
    setIsReady(true);

    const openPreferences = () => setIsPreferencesOpen(true);
    window.addEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);
    return () => {
      window.removeEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);
    };
  }, []);

  function updateChoice(nextChoice: CookieConsentChoice) {
    saveCookieConsent(nextChoice);
    setChoice(nextChoice);
    setIsPreferencesOpen(false);

    if (nextChoice === "accepted") {
      grantTrackingConsent();
    } else {
      revokeTrackingConsent();
    }
  }

  const showBanner = isReady && (choice === null || isPreferencesOpen);

  return (
    <>
      {choice === "accepted" && measurementId ? (
        <GoogleAnalytics measurementId={measurementId} />
      ) : null}
      {choice === "accepted" && clarityProjectId ? (
        <MicrosoftClarity projectId={clarityProjectId} />
      ) : null}

      {showBanner ? (
        <div
          className="fixed inset-x-0 bottom-0 z-[100] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-description"
        >
          <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-white/15 bg-zinc-950/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-300">
              Jouw privacy
            </p>
            <h2 id="cookie-title" className="mt-2 text-2xl font-black text-white">
              Mogen we gebruik meten?
            </h2>
            <p id="cookie-description" className="mt-3 leading-7 text-zinc-300">
              Met jouw toestemming gebruiken we Google Analytics en Microsoft
              Clarity om OutfitRoaster te verbeteren. We laden deze diensten
              niet voordat je accepteert. Weigeren heeft geen invloed op de
              outfitcheck.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => updateChoice("rejected")}
                className="min-h-12 rounded-2xl border border-white/20 bg-white/5 px-5 py-3 font-black text-white transition hover:bg-white/10"
              >
                Weigeren
              </button>
              <button
                type="button"
                onClick={() => updateChoice("accepted")}
                className="min-h-12 rounded-2xl bg-orange-500 px-5 py-3 font-black text-black transition hover:bg-orange-400"
              >
                Accepteren
              </button>
            </div>
            <a
              href="/privacy"
              className="mt-4 inline-flex text-sm font-bold text-zinc-400 underline decoration-zinc-600 underline-offset-4 transition hover:text-white"
            >
              Lees de privacy- en cookie-informatie
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}

function grantTrackingConsent() {
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  window.clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: "granted",
  });
}

function revokeTrackingConsent() {
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  window.clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: "denied",
  });

  deleteFirstPartyTrackingCookies();
}

function deleteFirstPartyTrackingCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (!name || !/^(_ga|_gid|_gat|_clck|_clsk)/.test(name)) {
      return;
    }

    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.outfitroaster.com; SameSite=Lax`;
  });
}
