"use client";

import { useEffect } from "react";

let isInitialized = false;

type MicrosoftClarityProps = {
  projectId: string;
};

export function MicrosoftClarity({ projectId }: MicrosoftClarityProps) {
  useEffect(() => {
    if (!projectId) {
      return;
    }

    const initialize = async () => {
      const { default: Clarity } = await import("@microsoft/clarity");
      if (!isInitialized) {
        isInitialized = true;
        Clarity.init(projectId);
      }
      Clarity.consentV2({
        ad_Storage: "denied",
        analytics_Storage: "granted",
      });
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => void initialize());
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(() => void initialize(), 1);
    return () => clearTimeout(timeoutId);
  }, [projectId]);

  return null;
}
