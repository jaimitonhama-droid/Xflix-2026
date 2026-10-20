// ============================================================
// XFLIX — Supabase
// Browser Client (for Client Components)
// ============================================================

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Creates a Supabase client for use in Browser / Client Components.
 * Call this inside client components or hooks.
 */
export function createClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : "https://gvcliwdhgqpbrbvehpsa.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Y2xpd2RoZ3FwYnJidmVocHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMzIwMDYsImV4cCI6MjA5ODgwODAwNn0.VssLQPC7jjkGPgHkHdn3_tYYfHtljDw-A2Kfp6pEqLA";

  return createBrowserClient<Database>(url, key);
}
