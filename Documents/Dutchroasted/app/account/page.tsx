import { Logo } from "@/components/Logo";
import { AccountDashboard } from "@/components/auth/AccountDashboard";

export default function AccountPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <a href="/" aria-label="Outfit Roaster home">
          <Logo />
        </a>

        <div className="mt-12">
          <AccountDashboard />
        </div>
      </div>
    </main>
  );
}
