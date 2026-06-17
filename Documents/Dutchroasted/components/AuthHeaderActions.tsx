"use client";

import { useAuthProfile } from "@/hooks/useAuthProfile";

export function AuthHeaderActions() {
  const auth = useAuthProfile();

  if (!auth.isReady) {
    return (
      <a
        href="/login"
        className="rounded-md bg-white px-4 py-2 text-sm font-black text-black transition hover:bg-orange-500"
      >
        Start gratis
      </a>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <a
          href="/account"
          className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/10"
        >
          Account
        </a>
        <button
          type="button"
          onClick={() => void auth.signOut()}
          className="rounded-md bg-white px-4 py-2 text-sm font-black text-black transition hover:bg-orange-500"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href="/login"
        className="hidden rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/10 sm:inline-flex"
      >
        Login
      </a>
      <a
        href="/login"
        className="rounded-md bg-white px-4 py-2 text-sm font-black text-black transition hover:bg-orange-500"
      >
        Start gratis
      </a>
    </div>
  );
}
