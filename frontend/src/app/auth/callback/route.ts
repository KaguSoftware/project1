/**
 * /auth/callback — handles the magic-link redirect from Supabase.
 *
 * Supabase appends `code` (PKCE) or `token_hash` + `type` (OTP/magic-link)
 * query params when redirecting here after the user clicks the email link.
 * We exchange the code/token for a session and redirect the user back to the app.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as string | null;
  // `next` can be set by Supabase to redirect to a specific page after auth
  const next = searchParams.get("next") ?? "/";

  const supabase = await createClient();

  if (code) {
    // PKCE flow
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  } else if (token_hash && type) {
    // OTP / magic-link flow — magic-link type is always "email" or "magiclink"
    // The Supabase email OTP type is a subset; cast via unknown is the correct pattern here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "email",
    } as any);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — redirect to home (app still works, user just isn't signed in)
  return NextResponse.redirect(`${origin}/`);
}
