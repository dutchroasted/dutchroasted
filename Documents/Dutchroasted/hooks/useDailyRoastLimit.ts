"use client";

import { useEffect, useState } from "react";
import { FREE_DAILY_ROAST_LIMIT } from "@/lib/roastTypes";

const STORAGE_KEY = "dutchroasted-free-roast-limit";

// TODO: Replace localStorage limit with server-side rate limiting and user accounts before production.

type StoredLimit = {
  date: string;
  used: number;
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readStoredLimit(): StoredLimit {
  if (typeof window === "undefined") {
    return { date: getTodayKey(), used: 0 };
  }

  try {
    const today = getTodayKey();
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { date: today, used: 0 };
    }

    const parsed = JSON.parse(stored) as Partial<StoredLimit>;
    if (parsed.date !== today || typeof parsed.used !== "number") {
      return { date: today, used: 0 };
    }

    return {
      date: today,
      used: Math.max(0, Math.min(FREE_DAILY_ROAST_LIMIT, parsed.used)),
    };
  } catch {
    return { date: getTodayKey(), used: 0 };
  }
}

export function useDailyRoastLimit() {
  const [limit, setLimit] = useState<StoredLimit>({ date: getTodayKey(), used: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedLimit = readStoredLimit();
    setLimit(storedLimit);
    setIsReady(true);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedLimit));

    const interval = window.setInterval(() => {
      const refreshedLimit = readStoredLimit();
      setLimit(refreshedLimit);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshedLimit));
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  function increment() {
    setLimit((current) => {
      const today = getTodayKey();
      const baseUsed = current.date === today ? current.used : 0;
      const next = {
        date: today,
        used: Math.min(FREE_DAILY_ROAST_LIMIT, baseUsed + 1),
      };

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return {
    isReady,
    used: limit.used,
    limit: FREE_DAILY_ROAST_LIMIT,
    remaining: Math.max(0, FREE_DAILY_ROAST_LIMIT - limit.used),
    isLimitReached: limit.used >= FREE_DAILY_ROAST_LIMIT,
    increment,
  };
}
