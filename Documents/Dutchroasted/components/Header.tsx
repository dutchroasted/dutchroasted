"use client";

import { useState } from "react";
import { Logo } from "./Logo";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Outfit Check", href: "/outfit-check" },
  { label: "Premium Beta", href: "/pricing" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <a href="/" className="group" aria-label="Outfit Roaster home">
          <Logo />
        </a>

        <nav className="hidden items-center rounded-xl border border-white/10 bg-white/[0.035] p-1 text-sm font-black text-zinc-300 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-lg px-4 py-2 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/outfit-check"
            className="min-h-11 rounded-xl bg-white px-4 py-3 text-center text-xs font-black text-black transition hover:bg-orange-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black sm:text-sm"
          >
            Check mijn outfit
          </a>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label="Menu openen"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-xl text-white md:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {menuOpen ? (
          <nav className="grid w-full gap-1 border-t border-white/10 py-3 md:hidden">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="min-h-11 rounded-xl px-4 py-3 text-sm font-black text-zinc-200 transition hover:bg-white/10"
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
