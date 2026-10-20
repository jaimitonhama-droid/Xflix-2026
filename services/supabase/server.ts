// ============================================================
// XFLIX — Supabase
// Server Client (for Server Components, Route Handlers, Middleware)
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Creates a Supabase client for use in Server Components and Route Handlers.
 * Reads and writes cookies automatically for persistent session management.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : "https://gvcliwdhgqpbrbvehpsa.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Y2xpd2RoZ3FwYnJidmVocHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMzIwMDYsImV4cCI6MjA5ODgwODAwNn0.VssLQPC7jjkGPgHkHdn3_tYYfHtljDw-A2Kfp6pEqLA";

  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll can be called from a Server Component where cookies are read-only.
            // This is safe to ignore if session is being refreshed via middleware.
          }
        },
      },
    }
  );
}

