// Supabase-backed profile/links/auth helpers.
// Replaces the previous localStorage prototype.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const FREE_LINK_LIMIT = 4;

export type LinkType =
  | "link"
  | "header"
  | "youtube"
  | "tiktok"
  | "spotify"
  | "product"
  | "gallery"
  | "testimonial"
  | "email_capture"
  | "whatsapp"
  | "payment"
  | "booking";

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  position: number;
  link_type: LinkType;
  icon: string;
  thumbnail_url: string;
  color: string;
  is_featured: boolean;
  is_pinned: boolean;
  metadata: Record<string, any>;
};

export type Theme = "midnight" | "sunset" | "ocean" | "forest" | "minimal" | "aurora" | "noir" | "candy";
export type ButtonStyle = "rounded" | "pill" | "square" | "outline";
export type FontWeight = "normal" | "semibold" | "bold";
export type FontFamily = "inter" | "system" | "poppins" | "playfair" | "space" | "mono";

export type SocialLinks = {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
  linkedin?: string;
  facebook?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  spotify?: string;
};

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_emoji: string;
  theme: Theme;
  qr_color: string;
  qr_bg: string;
  logo_text: string;
  is_pro: boolean;
  bg_color: string;
  button_color: string;
  button_text_color: string;
  button_style: ButtonStyle;
  font_weight: FontWeight;
  logo_url: string;
  // new
  is_verified: boolean;
  tagline: string;
  cover_url: string;
  bg_video_url: string;
  bg_animated: boolean;
  font_family: FontFamily;
  social_links: SocialLinks;
  whatsapp_number: string;
  booking_url: string;
  accent_color: string;
};

export async function subscribeEmail(profileId: string, email: string, name = "") {
  const { error } = await supabase.from("email_subscribers").insert({
    profile_id: profileId,
    email: email.trim().toLowerCase(),
    name: name.trim(),
    source: "profile",
  });
  if (error) throw error;
}

export type AnalyticsEvent = {
  id: string;
  profile_id: string;
  link_id: string | null;
  event_type: "view" | "scan" | "click";
  source: "qr" | "direct" | null;
  created_at: string;
};

// --------------------------------------------------------------------------
// Auth
// --------------------------------------------------------------------------

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up listener FIRST, then fetch session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    loading,
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };
}

// --------------------------------------------------------------------------
// Profile (current user)
// --------------------------------------------------------------------------

export function useMyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async (uid: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .maybeSingle();
    if (data) setProfile(data as Profile);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) { setProfile(null); setLoading(false); return; }
    setLoading(true);
    refresh(user.id);
  }, [user?.id]);

  const update = async (patch: Partial<Profile>) => {
    if (!profile) return;
    const optimistic = { ...profile, ...patch };
    setProfile(optimistic);
    const { error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", profile.id);
    if (error) {
      // revert on failure
      setProfile(profile);
      throw error;
    }
  };

  return { profile, loading, update, refresh: () => user && refresh(user.id) };
}

// --------------------------------------------------------------------------
// Links (current user)
// --------------------------------------------------------------------------

export function useMyLinks(profileId: string | undefined) {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!profileId) { setLinks([]); setLoading(false); return; }
    const { data } = await supabase
      .from("links")
      .select("*")
      .eq("profile_id", profileId)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    setLinks((data ?? []) as LinkItem[]);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [profileId]);

  return {
    links,
    loading,
    refresh,
    add: async (title: string, url: string) => {
      if (!profileId) return;
      const position = links.length;
      const { error } = await supabase
        .from("links")
        .insert({ profile_id: profileId, title, url, position });
      if (error) throw error;
      await refresh();
    },
    update: async (id: string, patch: { title?: string; url?: string }) => {
      const { error } = await supabase.from("links").update(patch).eq("id", id);
      if (error) throw error;
      await refresh();
    },
    remove: async (id: string) => {
      const { error } = await supabase.from("links").delete().eq("id", id);
      if (error) throw error;
      await refresh();
    },
  };
}

// --------------------------------------------------------------------------
// Public profile lookup (by username) — used by /u/$username and tracking
// --------------------------------------------------------------------------

export async function fetchPublicProfile(username: string): Promise<{ profile: Profile | null; links: LinkItem[] }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (!profile) return { profile: null, links: [] };
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", profile.id)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });
  return { profile: profile as Profile, links: (links ?? []) as LinkItem[] };
}

// --------------------------------------------------------------------------
// Analytics — anyone can insert (RLS allows it), only owner reads
// --------------------------------------------------------------------------

export async function trackEvent(input: {
  profile_id: string;
  link_id?: string | null;
  event_type: "view" | "scan" | "click";
  source?: "qr" | "direct" | null;
}) {
  // Fire and forget; any error is silently swallowed so it never blocks a
  // user navigating to a link.
  try {
    await supabase.from("scan_events").insert({
      profile_id: input.profile_id,
      link_id: input.link_id ?? null,
      event_type: input.event_type,
      source: input.source ?? null,
    });
  } catch {
    /* ignore */
  }
}

export function useMyAnalytics(profileId: string | undefined) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    if (!profileId) { setEvents([]); setLoading(false); return; }
    setLoading(true);
    supabase
      .from("scan_events")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(1000)
      .then(({ data }) => {
        if (!alive) return;
        setEvents((data ?? []) as AnalyticsEvent[]);
        setLoading(false);
      });
    return () => { alive = false; };
  }, [profileId]);

  return { events, loading };
}

// --------------------------------------------------------------------------
// Themes
// --------------------------------------------------------------------------

export const themes: Record<Theme, { name: string; bg: string; card: string; text: string; muted: string; accent: string }> = {
  midnight: {
    name: "Midnight",
    bg: "linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%)",
    card: "rgba(255,255,255,0.08)",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.7)",
    accent: "#7c84ff",
  },
  sunset: {
    name: "Sunset",
    bg: "linear-gradient(180deg, #ff7e5f 0%, #feb47b 100%)",
    card: "rgba(255,255,255,0.2)",
    text: "#fff",
    muted: "rgba(255,255,255,0.85)",
    accent: "#fff",
  },
  ocean: {
    name: "Ocean",
    bg: "linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)",
    card: "rgba(255,255,255,0.18)",
    text: "#fff",
    muted: "rgba(255,255,255,0.85)",
    accent: "#fff",
  },
  forest: {
    name: "Forest",
    bg: "linear-gradient(180deg, #134e5e 0%, #71b280 100%)",
    card: "rgba(255,255,255,0.15)",
    text: "#fff",
    muted: "rgba(255,255,255,0.85)",
    accent: "#fff",
  },
  minimal: {
    name: "Minimal",
    bg: "#fafafa",
    card: "#ffffff",
    text: "#111111",
    muted: "#666",
    accent: "#111",
  },
};
