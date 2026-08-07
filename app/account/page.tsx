"use client";

import { useEffect, useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { AuthForms } from "@/components/account/AuthForms";
import { Dashboard } from "@/components/account/Dashboard";

const STORAGE_KEY = "qusay_demo_session_v1";

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage, unavailable during SSR
    setEmail(localStorage.getItem(STORAGE_KEY));
    setHydrated(true);
  }, []);

  const handleAuthenticated = (value: string) => {
    localStorage.setItem(STORAGE_KEY, value);
    setEmail(value);
  };

  const handleSignOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEmail(null);
  };

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow={email ? "My Account" : "Members Only"}
        title={email ? "Your Vault" : "Account"}
        description={email ? undefined : "Sign in to track orders, manage addresses, and access your wishlist."}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }]}
        bgImage={encodeURI("/images/Nacklace/Glow dark nacklace/vol 10/vol 10.webp")}
      />

      <section className="w-full px-4 md:px-12 lg:px-24 py-16 pb-24 max-w-5xl">
        {!hydrated ? null : email ? (
          <Dashboard email={email} onSignOut={handleSignOut} />
        ) : (
          <AuthForms onAuthenticated={handleAuthenticated} />
        )}
      </section>
    </main>
  );
}
