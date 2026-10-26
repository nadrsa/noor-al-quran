"use client";

import { useEffect } from "react";
import { useReader } from "@/lib/store";
import { LoginScreen } from "@/components/login-screen";
import { AppShell } from "@/components/app-shell";
import { Toaster as SonnerToaster } from "sonner";

export default function Home() {
  // The reader state hydrates from localStorage via the persist middleware.
  // On the server and first client paint, `reader` is null → render LoginScreen.
  // Once the persist middleware rehydrates on the client, `reader` updates and
  // we re-render to show AppShell. No hydration mismatch because both server
  // and client first render the same LoginScreen.
  const reader = useReader((s) => s.reader);

  // Seed demo data on first mount (no-op if already seeded)
  useEffect(() => {
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);

  return (
    <>
      <SonnerToaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "var(--font-naskh), serif",
            direction: "rtl",
          },
        }}
        richColors
      />
      {reader ? <AppShell /> : <LoginScreen />}
    </>
  );
}
