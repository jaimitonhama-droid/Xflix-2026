"use client";

// ============================================================
// XFLIX — Auth Provider
// Wraps the app with Supabase Auth state & real-time listener
// ============================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/services/supabase/client";
import { getProfile } from "@/services/supabase/profile";
import type { Profile } from "@/services/supabase/types";

// ──────────────────────────────────────────────────────────
// Context Types
// ──────────────────────────────────────────────────────────

interface AuthContextValue {
  /** Current Supabase session (null if not authenticated) */
  session: Session | null;
  /** Current Supabase auth user (null if not authenticated) */
  user: User | null;
  /** Profile row from public.profiles table */
  profile: Profile | null;
  /** True while the initial session is being resolved */
  isLoading: boolean;
  /** True if the user is authenticated */
  isAuthenticated: boolean;
  /** Refresh the profile from the database */
  refreshProfile: () => Promise<void>;
}

// ──────────────────────────────────────────────────────────
// Create Context
// ──────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  refreshProfile: async () => {},
});

// ──────────────────────────────────────────────────────────
// AuthProvider Component
// ──────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // Fetch profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await getProfile(userId);
    setProfile(data);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    // Get the initial session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      isLoading,
      isAuthenticated: !!session,
      refreshProfile,
    }),
    [session, user, profile, isLoading, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ──────────────────────────────────────────────────────────
// Export context for hooks
// ──────────────────────────────────────────────────────────

export { AuthContext };
