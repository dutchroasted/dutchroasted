"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";

type AuthMode = "login" | "register";

export function LoginForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const supabase = createSupabaseBrowserClient();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!supabase) {
      setError("Supabase is nog niet geconfigureerd.");
      setIsLoading(false);
      return;
    }

    try {
      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (result.error) {
        throw result.error;
      }

      if (mode === "register" && !result.data.session) {
        setMessage("Check je e-mail om je account te bevestigen.");
        return;
      }

      window.location.href = "/account";
    } catch {
      setError(
        mode === "login"
          ? "Inloggen lukt niet. Controleer je gegevens."
          : "Account maken lukt niet. Probeer het opnieuw.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/40 sm:p-7">
      <div className="grid grid-cols-2 gap-2 rounded-md bg-black p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
            setMessage("");
          }}
          className={`rounded-md px-4 py-3 text-sm font-black transition ${
            mode === "login" ? "bg-orange-500 text-black" : "text-zinc-400 hover:text-white"
          }`}
        >
          Inloggen
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setError("");
            setMessage("");
          }}
          className={`rounded-md px-4 py-3 text-sm font-black transition ${
            mode === "register" ? "bg-orange-500 text-black" : "text-zinc-400 hover:text-white"
          }`}
        >
          Account maken
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label className="block">
          <span className="text-sm font-black uppercase tracking-[0.16em] text-zinc-400">
            E-mailadres
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-3 w-full rounded-md border border-white/10 bg-black px-4 py-4 text-base font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
            placeholder="jij@voorbeeld.nl"
          />
        </label>

        <label className="block">
          <span className="text-sm font-black uppercase tracking-[0.16em] text-zinc-400">
            Wachtwoord
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-3 w-full rounded-md border border-white/10 bg-black px-4 py-4 text-base font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
            placeholder="Minimaal 6 tekens"
          />
        </label>

        {error ? (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-100">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-orange-500 px-5 py-4 text-base font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          {isLoading ? "Even bezig..." : mode === "login" ? "Inloggen" : "Account maken"}
        </button>
      </form>
    </div>
  );
}
