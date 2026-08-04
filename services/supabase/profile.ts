// ============================================================
// XFLIX — Supabase Service
// profile.ts: Profile CRUD operations
// ============================================================

import { createClient } from "./client";
import type { Profile, ProfileUpdate } from "./types";

export interface ProfileResult<T = Profile> {
  data: T | null;
  error: string | null;
}

// ──────────────────────────────────────────────────────────
// Get a single profile by user_id
// ──────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<ProfileResult> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ──────────────────────────────────────────────────────────
// Update own profile
// ──────────────────────────────────────────────────────────

export async function updateProfile(
  userId: string,
  updates: Omit<ProfileUpdate, "user_id" | "id" | "created_at">
): Promise<ProfileResult> {
  const supabase = createClient();

  const payload: ProfileUpdate = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ──────────────────────────────────────────────────────────
// Get all profiles (Admin only — RLS enforces this)
// ──────────────────────────────────────────────────────────

export async function getAllProfiles(): Promise<ProfileResult<Profile[]>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ──────────────────────────────────────────────────────────
// Check if a username is available
// ──────────────────────────────────────────────────────────

export async function isUsernameAvailable(
  username: string,
  excludeUserId?: string
): Promise<boolean> {
  const supabase = createClient();

  let query = supabase
    .from("profiles")
    .select("id")
    .eq("username", username);

  if (excludeUserId) {
    query = query.neq("user_id", excludeUserId);
  }

  const { data } = await query;
  return !data || data.length === 0;
}
