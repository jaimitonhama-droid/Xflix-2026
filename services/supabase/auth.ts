// ============================================================
// XFLIX — Supabase Service
// auth.ts: Authentication methods (email/password)
// ============================================================

import { createClient } from "./client";

// ──────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────

export interface SignUpPayload {
  email: string;
  password: string;
  username?: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthResult<T = unknown> {
  data: T | null;
  error: string | null;
}

// ──────────────────────────────────────────────────────────
// Sign Up with Email & Password
// ──────────────────────────────────────────────────────────

export async function signUpWithEmail({
  email,
  password,
  username,
}: SignUpPayload): Promise<AuthResult> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Pass username to user metadata; the trigger will use email instead
      data: { username: username ?? email.split("@")[0] },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ──────────────────────────────────────────────────────────
// Sign In with Email & Password
// ──────────────────────────────────────────────────────────

export async function signInWithEmail({
  email,
  password,
}: SignInPayload): Promise<AuthResult> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ──────────────────────────────────────────────────────────
// Sign Out
// ──────────────────────────────────────────────────────────

export async function signOut(): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: null, error: null };
}

// ──────────────────────────────────────────────────────────
// Reset Password (sends recovery email)
// ──────────────────────────────────────────────────────────

export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ──────────────────────────────────────────────────────────
// Update Password (after reset redirect)
// ──────────────────────────────────────────────────────────

export async function updatePassword(
  newPassword: string
): Promise<AuthResult> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ──────────────────────────────────────────────────────────
// Get Current Session
// ──────────────────────────────────────────────────────────

export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return { session: null, error: error.message };
  }

  return { session: data.session, error: null };
}

// ──────────────────────────────────────────────────────────
// Get Current User
// ──────────────────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}
