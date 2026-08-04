"use client";

// ============================================================
// XFLIX — Hook
// useProfile: Manage the authenticated user's profile
// ============================================================

import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { updateProfile, isUsernameAvailable } from "@/services/supabase/profile";
import type { ProfileUpdate } from "@/services/supabase/types";

export function useProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  /**
   * Update the current user's profile.
   * Refreshes the profile in context after a successful update.
   */
  const update = useCallback(
    async (
      updates: Omit<ProfileUpdate, "user_id" | "id" | "created_at">
    ): Promise<{ success: boolean; error: string | null }> => {
      if (!user) {
        return { success: false, error: "Utilizador não autenticado." };
      }

      setIsSaving(true);
      setSaveError(null);

      const { error } = await updateProfile(user.id, updates);

      if (error) {
        setSaveError(error);
        setIsSaving(false);
        return { success: false, error };
      }

      await refreshProfile();
      setIsSaving(false);
      return { success: true, error: null };
    },
    [user, refreshProfile]
  );

  /**
   * Check if a given username is already taken.
   */
  const checkUsername = useCallback(
    async (username: string): Promise<boolean> => {
      return isUsernameAvailable(username, user?.id);
    },
    [user]
  );

  return {
    profile,
    isSaving,
    saveError,
    update,
    checkUsername,
  };
}
