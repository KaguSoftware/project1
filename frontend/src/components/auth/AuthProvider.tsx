"use client";

/**
 * AuthProvider — client component that subscribes to Supabase auth state changes
 * and keeps the Zustand store's `user` field in sync.
 *
 * Must be mounted inside layout.tsx (client boundary).
 * SSR-safe: the initial render sets user from the server session (or null) without
 * any mismatch — the subscription fires only on the client after hydration.
 */

import { useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { useAppStore } from "@/src/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    const supabase = createClient();

    // Sync initial session (resolves immediately from the cookie-based session)
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(
        user ? { id: user.id, email: user.email ?? "" } : null
      );
    });

    // Keep in sync as auth state changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null;
        setUser(u ? { id: u.id, email: u.email ?? "" } : null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return <>{children}</>;
}
