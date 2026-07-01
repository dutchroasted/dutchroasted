"use client";

import { useEffect, useState } from "react";
import { trackAnalyticsEventOnce } from "@/lib/analytics";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function AuthCallbackPage() {
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function completeLogin() {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        setError("Supabase is nog niet geconfigureerd.");
        return;
      }

      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError("De loginlink is ongeldig of verlopen.");
          return;
        }
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !data.session) {
        setError("De loginlink is ongeldig of verlopen.");
        return;
      }

      const response = await fetch("/api/account/profile", {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });

      if (!response.ok) {
        setError("Inloggen is gelukt, maar je profiel kon niet worden geladen.");
        return;
      }

      const userId = data.session.user.id;
      trackAnalyticsEventOnce(`login_completed_${userId}`, "login_completed");
      if (isRecentSignup(data.session.user.created_at)) {
        trackAnalyticsEventOnce(`signup_completed_${userId}`, "signup_completed");
      }

      if (!isCancelled) {
        window.location.replace("/account");
      }
    }

    void completeLogin();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950/80 p-6 text-center">
        <h1 className="text-2xl font-black text-white">Inloggen afronden</h1>
        {error ? (
          <>
            <p className="mt-4 font-bold leading-7 text-red-300">{error}</p>
            <a
              href="/account"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 font-black text-black"
            >
              Opnieuw proberen
            </a>
          </>
        ) : (
          <p className="mt-4 leading-7 text-zinc-300">
            Je veilige login wordt gecontroleerd. Een momentje.
          </p>
        )}
      </section>
    </main>
  );
}

function isRecentSignup(createdAt?: string) {
  if (!createdAt) {
    return false;
  }

  return Date.now() - new Date(createdAt).getTime() < 5 * 60 * 1000;
}
