"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import type { RoastUsage, UserProfile } from "@/lib/authServer";

type AuthState = {
  isReady: boolean;
  isConfigured: boolean;
  session: Session | null;
  profile: UserProfile | null;
  usage: RoastUsage | null;
  error: string;
};

export function useAuthProfile() {
  const [state, setState] = useState<AuthState>({
    isReady: false,
    isConfigured: false,
    session: null,
    profile: null,
    usage: null,
    error: "",
  });

  async function loadProfile(session: Session | null) {
    if (!session) {
      setState((current) => ({
        ...current,
        isReady: true,
        session: null,
        profile: null,
        usage: null,
        error: "",
      }));
      return;
    }

    try {
      const response = await fetch("/api/account/profile", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not load profile");
      }

      const data = (await response.json()) as {
        profile: UserProfile;
        usage: RoastUsage;
      };

      setState((current) => ({
        ...current,
        isReady: true,
        session,
        profile: data.profile,
        usage: data.usage,
        error: "",
      }));
    } catch {
      setState((current) => ({
        ...current,
        isReady: true,
        session,
        profile: null,
        usage: null,
        error: "Profiel laden lukt niet.",
      }));
    }
  }

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setState((current) => ({
        ...current,
        isReady: true,
        isConfigured: false,
      }));
      return;
    }

    setState((current) => ({ ...current, isConfigured: true }));

    supabase.auth.getSession().then(({ data }) => {
      void loadProfile(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadProfile(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function refresh() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    const { data } = await supabase.auth.getSession();
    await loadProfile(data.session);
  }

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setState((current) => ({
      ...current,
      session: null,
      profile: null,
      usage: null,
    }));
  }

  return {
    ...state,
    isAuthenticated: Boolean(state.session),
    accessToken: state.session?.access_token ?? null,
    refresh,
    signOut,
  };
}
