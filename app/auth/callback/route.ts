// ============================================================
// XFLIX — Auth Callback Route
// Handles email confirmation and OAuth redirects from Supabase
// ============================================================

import { NextResponse } from "next/server";
import { createClient } from "@/services/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there's an error or no code, redirect to error page
  return NextResponse.redirect(`${origin}/auth/error`);
}
