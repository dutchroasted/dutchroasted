"use client";

import { useEffect, useState } from "react";
import { analytics } from "@/lib/analytics";

type PressContactLinkProps = {
  href: string;
  location: string;
  className: string;
  children: React.ReactNode;
};

type PressAssetLinkProps = {
  href: string;
  assetName: string;
  className: string;
  children: React.ReactNode;
};

type Screenshot = {
  src: string;
  title: string;
  description: string;
};

export function PressPageView() {
  useEffect(() => {
    analytics.pressPageViewed();
  }, []);

  return null;
}

export function PressContactLink({
  href,
  location,
  className,
  children,
}: PressContactLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        analytics.pressContactClicked(location);
      }}
    >
      {children}
    </a>
  );
}

export function PressAssetLink({
  href,
  assetName,
  className,
  children,
}: PressAssetLinkProps) {
  return (
    <a
      href={href}
      download
      className={className}
      onClick={() => {
        analytics.pressAssetDownloaded(assetName);
      }}
    >
      {children}
    </a>
  );
}

export function PressScreenshotGallery({ screenshots }: { screenshots: Screenshot[] }) {
  const [activeScreenshot, setActiveScreenshot] = useState<Screenshot | null>(null);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {screenshots.map((screenshot) => (
          <button
            key={screenshot.src}
            type="button"
            onClick={() => setActiveScreenshot(screenshot)}
            className="dr-card-hover overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] text-left hover:border-orange-500/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshot.src}
              alt={screenshot.title}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
            <span className="block p-5">
              <span className="block font-black text-white">{screenshot.title}</span>
              <span className="mt-2 block text-sm leading-6 text-zinc-400">
                {screenshot.description}
              </span>
            </span>
          </button>
        ))}
      </div>

      {activeScreenshot ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeScreenshot.title}
          className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setActiveScreenshot(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-zinc-950 p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 p-3">
              <div>
                <h3 className="font-black text-white">{activeScreenshot.title}</h3>
                <p className="text-sm text-zinc-400">{activeScreenshot.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveScreenshot(null)}
                className="size-10 rounded-full border border-white/15 bg-white/5 text-xl text-white"
                aria-label="Close screenshot"
              >
                ×
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeScreenshot.src}
              alt={activeScreenshot.title}
              className="max-h-[75vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
