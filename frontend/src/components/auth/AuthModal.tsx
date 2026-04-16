"use client";

/**
 * AuthModal — magic-link sign-in.
 * User enters their email, Supabase sends a one-time link, done.
 * No password handling.
 */

import { useState } from "react";
import { createClient } from "@/src/lib/supabase/client";

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        // Redirect back to the app after the user clicks the link
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    /* Modal backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Sign in</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {status === "sent" ? (
          <div className="text-center space-y-3">
            <div className="text-3xl">📧</div>
            <p className="text-slate-700 font-medium">Check your email</p>
            <p className="text-sm text-slate-500">
              We sent a sign-in link to <span className="font-medium">{email}</span>.
              Click it to continue.
            </p>
            <button
              onClick={onClose}
              className="mt-4 w-full py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-slate-500">
              Enter your email and we&apos;ll send you a magic sign-in link — no password needed.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="auth-email">
                Email address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            {status === "error" && (
              <p className="text-xs text-red-600">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-2 rounded-lg bg-primary text-primary-content text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === "loading" ? "Sending…" : "Send magic link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
