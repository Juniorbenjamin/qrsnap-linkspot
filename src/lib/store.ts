// Lightweight client-side store using localStorage. Replace with Lovable Cloud later.
import { useEffect, useState } from "react";

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  icon?: string;
};

export type Theme = "midnight" | "sunset" | "ocean" | "forest" | "minimal";

export type Profile = {
  username: string;
  displayName: string;
  bio: string;
  avatarEmoji: string;
  theme: Theme;
  qrColor: string;
  qrBg: string;
  logoText: string;
  links: LinkItem[];
  isPro: boolean;
};

export type AuthUser = { email: string } | null;

const PROFILE_KEY = "qrls_profile";
const AUTH_KEY = "qrls_auth";
const ANALYTICS_KEY = "qrls_analytics";

export const FREE_LINK_LIMIT = 4;

export const defaultProfile: Profile = {
  username: "yourname",
  displayName: "Your Name",
  bio: "Tap a link to connect with me ✨",
  avatarEmoji: "✨",
  theme: "midnight",
  qrColor: "#1a1a2e",
  qrBg: "#ffffff",
  logoText: "",
  links: [
    { id: "1", title: "My Website", url: "https://example.com" },
    { id: "2", title: "Instagram", url: "https://instagram.com" },
  ],
  isPro: false,
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
  window.dispatchEvent(new CustomEvent("qrls:update", { detail: { key } }));
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(() => read(PROFILE_KEY, defaultProfile));
  useEffect(() => {
    const handler = () => setProfile(read(PROFILE_KEY, defaultProfile));
    window.addEventListener("qrls:update", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("qrls:update", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  const update = (patch: Partial<Profile>) => {
    const next = { ...profile, ...patch };
    write(PROFILE_KEY, next);
    setProfile(next);
  };
  return { profile, update, setProfile: (p: Profile) => { write(PROFILE_KEY, p); setProfile(p); } };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser>(() => read<AuthUser>(AUTH_KEY, null));
  useEffect(() => {
    const handler = () => setUser(read<AuthUser>(AUTH_KEY, null));
    window.addEventListener("qrls:update", handler);
    return () => window.removeEventListener("qrls:update", handler);
  }, []);
  return {
    user,
    signIn: (email: string) => { write(AUTH_KEY, { email }); setUser({ email }); },
    signOut: () => { write(AUTH_KEY, null); setUser(null); },
  };
}

export type AnalyticsEvent = { type: "view" | "click"; linkId?: string; ts: number };

export function getAnalytics(): AnalyticsEvent[] {
  return read<AnalyticsEvent[]>(ANALYTICS_KEY, []);
}

export function trackEvent(ev: Omit<AnalyticsEvent, "ts">) {
  const events = getAnalytics();
  events.push({ ...ev, ts: Date.now() });
  write(ANALYTICS_KEY, events);
}

export function useAnalytics() {
  const [events, setEvents] = useState<AnalyticsEvent[]>(() => getAnalytics());
  useEffect(() => {
    const handler = () => setEvents(getAnalytics());
    window.addEventListener("qrls:update", handler);
    return () => window.removeEventListener("qrls:update", handler);
  }, []);
  return events;
}

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
