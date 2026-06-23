"use client";

import { useEffect } from "react";

let isInitialized = false;

type MicrosoftClarityProps = {
  projectId: string;
};

export function MicrosoftClarity({ projectId }: MicrosoftClarityProps) {
  useEffect(() => {
    if (isInitialized || !projectId) {
      return;
    }

    const initialize = async () => {
      if (isInitialized) {
        return;
      }

      isInitialized = true;
      const { default: Clarity } = await import("@microsoft/clarity");
      Clarity.init(projectId);
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
