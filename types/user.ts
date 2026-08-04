// ============================================================
// XFLIX — TypeScript Types
// User Types
// ============================================================

export type UserRole = "user" | "creator" | "admin";
export type UserPlan = "free" | "basic" | "premium";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  plan: UserPlan;
  isVerified: boolean;
  createdAt: string;
  // Future: will be linked to Supabase Auth
  supabaseId?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
