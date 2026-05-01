import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchPublicProfile, themes, trackEvent, type Profile, type LinkItem } from "@/lib/store";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/u/$username")({
  component: PublicProfile,
  validateSearch: (search: Record<string, unknown>) => ({
    src: search.src === "qr" ? ("qr" as const) : undefined,
  }),
  head: () => ({ meta: [{ title: "Profile — QRLinkSpot" }] }),
});

function PublicProfile() {
  const { username } = useParams({ from: "/u/$username" });
  const { src } = Route.useSearch();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchPublicProfile(username).then(({ profile: p, links: l }) => {
      if (!alive) return;
      setProfile(p);
      setLinks(l);
      setLoading(false);
      // Record analytics now that we know the profile_id.
      if (p) {
        trackEvent({ profile_id: p.id, event_type: "view", source: src === "qr" ? "qr" : "direct" });
        if (src === "qr") trackEvent({ profile_id: p.id, event_type: "scan", source: "qr" });
      }
    });
    return () => { alive = false; };
  }, [username, src]);

  const themeKey = (profile?.theme && profile.theme in themes ? profile.theme : "midnight") as keyof typeof themes;
  const t = themes[themeKey];

  // Apply per-profile overrides on top of the theme
  const bg = profile?.bg_color || t.bg;
  const buttonBg = profile?.button_color || t.card;
  const buttonText = profile?.button_text_color || t.text;
  const textColor = profile?.button_text_color || t.text;
  const muted = t.muted;

  const buttonStyle = profile?.button_style || "rounded";
  const buttonRadius =
    buttonStyle === "pill" ? "9999px" :
    buttonStyle === "square" ? "6px" :
    "16px"; // rounded / outline default
  const isOutline = buttonStyle === "outline";

  const fontWeight = profile?.font_weight || "semibold";
  const fontWeightClass =
    fontWeight === "bold" ? "font-bold" :
    fontWeight === "normal" ? "font-normal" :
    "font-semibold";

  const handleClick = (link: LinkItem) => {
    if (!profile) return;
    trackEvent({
      profile_id: profile.id,
      link_id: link.id,
      event_type: "click",
      source: src === "qr" ? "qr" : "direct",
    });
  };

  return (
    <div className="min-h-screen w-full" style={{ background: bg, color: textColor }}>
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center px-5 py-12">
        {loading ? (
          <p style={{ color: muted }}>Loading…</p>
        ) : !profile ? (
          <div className="text-center">
            <p className="text-lg font-semibold">@{username}</p>
            <p className="mt-2 text-sm" style={{ color: muted }}>This profile does not exist yet.</p>
          </div>
        ) : (
          <>
            <div
              className="mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full text-4xl shadow-elevated"
              style={{ background: profile.logo_url ? "transparent" : t.card, backdropFilter: profile.logo_url ? "none" : "blur(10px)" }}
            >
              {profile.logo_url ? (
                <img src={profile.logo_url} alt={`${profile.display_name} logo`} className="h-full w-full object-cover" />
              ) : (
                profile.avatar_emoji
              )}
            </div>
            <h1 className={`text-2xl ${fontWeight === "normal" ? "font-semibold" : "font-bold"}`}>{profile.display_name}</h1>
            {profile.bio && (
              <p className="mt-1 text-center text-sm" style={{ color: muted }}>{profile.bio}</p>
            )}

            <div className="mt-8 flex w-full flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleClick(link)}
                  onAuxClick={() => handleClick(link)}
                  className={`group flex items-center justify-between px-5 py-4 text-base ${fontWeightClass} transition-all hover:-translate-y-0.5 hover:shadow-elevated`}
                  style={{
                    background: isOutline ? "transparent" : buttonBg,
                    color: buttonText,
                    border: isOutline ? `2px solid ${buttonText}` : "none",
                    borderRadius: buttonRadius,
                    backdropFilter: isOutline ? "none" : "blur(10px)",
                  }}
                >
                  <span>{link.title}</span>
                  <ExternalLink className="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
              {links.length === 0 && (
                <p className="text-center text-sm" style={{ color: muted }}>No links yet.</p>
              )}
            </div>

            {!profile.is_pro && (
              <div className="mt-auto pt-12 text-xs opacity-70">
                <a href="/" style={{ color: t.muted }}>Powered by ✨ QRLinkSpot</a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
