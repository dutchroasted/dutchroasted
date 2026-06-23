"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is nog niet geconfigureerd.");
      setIsLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: "https://www.outfitroaster.com/auth/callback",
      },
    });

    if (signInError) {
      setError("De loginlink versturen lukt niet. Probeer het opnieuw.");
    } else {
      setMessage("Check je e-mail en open de loginlink.");
      setEmail("");
    }

    setIsLoading(false);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5 sm:p-6">
      <h2 className="text-2xl font-black text-white">Inloggen met magic link</h2>
      <p className="mt-3 leading-7 text-zinc-300">
        Vul je e-mailadres in. Je ontvangt een veilige link zonder wachtwoord.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <label>
          <span className="text-sm font-black uppercase tracking-[0.14em] text-zinc-400">
            E-mailadres
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="jij@voorbeeld.nl"
            className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 font-bold text-white outline-none focus:border-orange-500"
          />
        </label>
        {message ? <p className="font-bold text-emerald-300">{message}</p> : null}
        {error ? <p className="font-bold text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={isLoading}
          className="min-h-12 rounded-2xl bg-orange-500 px-5 py-3 font-black text-black transition hover:bg-orange-400 disabled:opacity-60"
        >
          {isLoading ? "Loginlink versturen..." : "Stuur magic link"}
        </button>
      </form>
    </div>
  );
}
