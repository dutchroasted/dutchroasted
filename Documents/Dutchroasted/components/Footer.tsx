import { Logo } from "./Logo";
import { CookiePreferencesButton } from "./analytics/CookiePreferencesButton";

const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Voorwaarden", href: "/voorwaarden" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-zinc-500">
            Nederlandse outfitfeedback met humor, zonder bodyshaming.
          </p>
        </div>

        <nav className="flex flex-wrap gap-5 text-sm font-semibold text-zinc-400">
          {footerLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          ))}
          <CookiePreferencesButton />
        </nav>
      </div>
    </footer>
  );
}
