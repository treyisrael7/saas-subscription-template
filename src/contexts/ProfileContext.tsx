"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";

interface ProfileContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  mutate: (optimistic?: Partial<Profile>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

interface ProfileProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
  initialProfile?: Profile | null;
}

export function ProfileProvider({
  children,
  initialUser = null,
  initialProfile = null,
}: ProfileProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [profile, setProfile] = useState<Profile | null>(initialProfile ?? null);
  const [loading, setLoading] = useState(!initialProfile);

  useEffect(() => {
    if (initialProfile) setProfile(initialProfile);
    if (initialUser) setUser(initialUser);
  }, [initialProfile, initialUser]);

  const fetchProfile = useCallback(async (optimistic?: Partial<Profile>) => {
    const supabase = createClient();

    if (optimistic?.subscription_tier !== undefined) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setProfile((prev) => {
        if (prev) return { ...prev, ...optimistic };
        if (authUser) {
          return {
            id: authUser.id,
            email: authUser.email ?? null,
            full_name: null,
            avatar_url: null,
            stripe_customer_id: null,
            subscription_tier: "free",
            subscription_id: null,
            subscription_status: null,
            subscription_current_period_end: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...optimistic,
          } as Profile;
        }
        return prev;
      });
      return;
    }

    if (optimistic) {
      setProfile((prev) => (prev ? { ...prev, ...optimistic } : prev));
    }

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser ?? null);

      if (!authUser) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error) {
        console.error("ProfileContext fetch error:", error);
        return;
      }
      setProfile(data as Profile);
    } catch (err) {
      console.error("ProfileContext fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialProfile) fetchProfile();

    const timeout = setTimeout(() => setLoading(false), 3000);

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await fetchProfile();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        }
      }
    );

    const channel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          setProfile((prev) => {
            if (!prev || prev.id !== payload.new?.id) return prev;
            return { ...prev, ...(payload.new as Partial<Profile>) };
          });
        }
      )
      .subscribe();

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [fetchProfile]);

  const value: ProfileContextValue = {
    user,
    profile,
    loading,
    mutate: fetchProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfileContext must be used within ProfileProvider");
  }
  return ctx;
}
