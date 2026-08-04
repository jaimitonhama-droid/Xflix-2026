"use client";

// ============================================================
// XFLIX — Hook
// useAuth: Access auth state and actions from any client component
// ============================================================

import { useContext, useCallback } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import {
  signInWithEmail,
  signUpWithEmail,
  signOut as supabaseSignOut,
  resetPassword as supabaseResetPassword,
  updatePassword as supabaseUpdatePassword,
} from "@/services/supabase/auth";
import type { SignInPayload, SignUpPayload } from "@/services/supabase/auth";

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  const { session, user, profile, isLoading, isAuthenticated, refreshProfile } =
    ctx;

  // ── Derived role helpers ──────────────────────────────────
  const isAdmin = profile?.role === "admin";
  const isCreator = profile?.role === "creator" || profile?.role === "admin";

  // ── Auth actions ─────────────────────────────────────────

  const signIn = useCallback(
    async (payload: SignInPayload) => signInWithEmail(payload),
    []
  );

  const signUp = useCallback(
    async (payload: SignUpPayload) => signUpWithEmail(payload),
    []
  );

  const signOut = useCallback(async () => supabaseSignOut(), []);

  const resetPassword = useCallback(
    async (email: string) => supabaseResetPassword(email),
    []
  );

  const updatePassword = useCallback(
    async (newPassword: string) => supabaseUpdatePassword(newPassword),
    []
  );

  return {
    // State
    session,
    user,
    profile,
    isLoading,
    isAuthenticated,
    isAdmin,
    isCreator,
    // Actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
  };
}
