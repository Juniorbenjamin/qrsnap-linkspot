import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchPublicProfile, themes, trackEvent, type Profile, type LinkItem } from "@/lib/store";
import { CheckCircle2 } from "lucide-react";
import { SocialIconRow } from "@/components/profile/SocialIconRow";
import {
  LinkButton, HeaderBlock, YouTubeBlock, TikTokBlock, SpotifyBlock,
  ProductBlock, GalleryBlock, TestimonialBlock, EmailCaptureBlock,
  WhatsAppBlock, PaymentBlock, BookingBlock,
} from "@/components/profile/Blocks";

export const Route = createFileRoute("/u/$username")({
  component: PublicProfile,
  validateSearch: (search: Record<string, unknown>) => ({
    src: search.src === "qr" ? ("qr" as const) : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — LinkSpot` },
      { name: "description", content: `All of @${params.username}'s links in one place.` },
      { property: "og:title", content: `@${params.username} on LinkSpot` },
      { property: "og:description", content: `Links and socials for @${params.username}.` },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
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
      if (p) {
        trackEvent({ profile_id: p.id, event_type: "view", source: src === "qr" ? "qr" : "direct" });
        if (src === "qr") trackEvent({ profile_id: p.id, event_type: "scan", source: "qr" });
      }
    });
    return () => { alive = false; };
  }, [username, src]);

  const sortedLinks = useMemo(() => {
    return [...links].sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return a.position - b.position;
    });
  }, [links]);

  const themeKey = (profile?.theme && profile.theme in themes ? profile.theme : "midnight") as keyof typeof themes;
  const t = themes[themeKey];

  const bg = profile?.bg_color || t.bg;
  const buttonBg = profile?.button_color || t.card;
  const buttonText = profile?.button_text_color || t.text;
  const textColor = profile?.button_text_color || t.text;
  const muted = t.muted;
  const accent = profile?.accent_color || t.accent;

  const buttonStyle = profile?.button_style || "rounded";
  const borderRadius =
    buttonStyle === "pill" ? "9999px" :
    buttonStyle === "square" ? "10px" : "18px";
  const isOutline = buttonStyle === "outline";

  const fontWeight = profile?.font_weight || "semibold";
  const fontWeightClass =
    fontWeight === "bold" ? "font-bold" :
    fontWeight === "normal" ? "font-normal" : "font-semibold";

  const fontFamily = profile?.font_family || "inter";
  const fontClass =
    fontFamily === "poppins"  ? "font-poppins"  :
    fontFamily === "playfair" ? "font-playfair" :
    fontFamily === "space"    ? "font-space"    :
    fontFamily === "mono"     ? "font-mono-display" : "";

  const style = { buttonBg, buttonText, borderRadius, isOutline, fontWeightClass, accent, muted };

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
    <div className={`relative min-h-screen w-full overflow-hidden ${fontClass}`} style={{ background: bg, color: textColor }}>
      {profile?.bg_video_url && (
        <video src={profile.bg_video_url} autoPlay loop muted playsInline className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70" />
      )}
      {profile?.cover_url && !profile?.bg_video_url && (
        <img src={profile.cover_url} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />
      )}
      {profile?.bg_animated && !profile?.cover_url && !profile?.bg_video_url && (
        <div className="pointer-events-none absolute inset-0 bg-animated-gradient opacity-90" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center px-5 pb-16 pt-14">
        {loading ? (
          <ProfileSkeleton />
        ) : !profile ? (
          <div className="text-center text-foreground">
            <p className="text-lg font-semibold">@{username}</p>
            <p className="mt-2 text-sm opacity-70">This profile does not exist yet.</p>
          </div>
        ) : (
          <>
            {/* Profile photo */}
            <div className="animate-pop mb-1 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full ring-4 ring-white/20 shadow-elevated"
              style={{ background: profile.logo_url ? "transparent" : "rgba(255,255,255,0.1)" }}>
              {profile.logo_url ? (
                <img src={profile.logo_url} alt={profile.display_name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-5xl">{profile.avatar_emoji}</span>
              )}
            </div>

            {/* Username */}
            <div className="animate-rise mt-5 flex items-center gap-1.5">
              <h1 className={`text-2xl tracking-tight ${fontWeight === "normal" ? "font-semibold" : "font-bold"}`}>
                {profile.display_name}
              </h1>
              {profile.is_verified && (
                <CheckCircle2 className="h-5 w-5 fill-blue-500 text-white" aria-label="Verified" />
              )}
            </div>
            <p className="mt-0.5 text-sm font-medium" style={{ color: muted }}>@{profile.username}</p>

            {/* Bio */}
            {profile.bio && (
              <p className="animate-rise mt-3 max-w-sm text-center text-sm leading-relaxed" style={{ color: textColor, opacity: 0.9 }}>
                {profile.bio}
              </p>
            )}

            {/* Social icons */}
            <SocialIconRow links={profile.social_links || {}} color={textColor} whatsappNumber={profile.whatsapp_number} />

            {/* Link buttons */}
            <div className="mt-7 flex w-full flex-col gap-3">
              {sortedLinks.length === 0 && (
                <p className="text-center text-sm" style={{ color: muted }}>No links yet.</p>
              )}
              {sortedLinks.map((link, i) => (
                <div key={link.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                  {renderBlock(link, style, profile.id, () => handleClick(link))}
                </div>
              ))}
            </div>

            {!profile.is_pro && (
              <div className="mt-auto pt-12 text-xs opacity-70">
                <a href="/" style={{ color: muted }}>Powered by ✨ LinkSpot</a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function renderBlock(link: LinkItem, style: any, profileId: string, onClick: () => void) {
  switch (link.link_type) {
    case "header":        return <HeaderBlock link={link} color={style.buttonText} />;
    case "youtube":       return <YouTubeBlock link={link} style={style} />;
    case "tiktok":        return <TikTokBlock link={link} style={style} />;
    case "spotify":       return <SpotifyBlock link={link} style={style} />;
    case "product":       return <ProductBlock link={link} style={style} onClick={onClick} />;
    case "gallery":       return <GalleryBlock link={link} />;
    case "testimonial":   return <TestimonialBlock link={link} style={style} />;
    case "email_capture": return <EmailCaptureBlock link={link} style={style} profileId={profileId} />;
    case "whatsapp":      return <WhatsAppBlock link={link} style={style} onClick={onClick} />;
    case "payment":       return <PaymentBlock link={link} style={style} onClick={onClick} />;
    case "booking":       return <BookingBlock link={link} style={style} onClick={onClick} />;
    case "link":
    default:              return <LinkButton link={link} style={style} onClick={onClick} />;
  }
}

function ProfileSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="mx-auto h-28 w-28 rounded-full bg-white/10" />
      <div className="mx-auto mt-5 h-6 w-40 rounded bg-white/10" />
      <div className="mx-auto mt-2 h-4 w-24 rounded bg-white/10" />
      <div className="mt-8 space-y-3">
        {[0,1,2,3].map((i) => <div key={i} className="h-14 w-full rounded-2xl bg-white/10" />)}
      </div>
    </div>
  );
}
function renderBlock(link: LinkItem, style: any, profileId: string, onClick: () => void, isTop: boolean) {
  switch (link.link_type) {
    case "header":        return <HeaderBlock link={link} color={style.buttonText} />;
    case "youtube":       return <YouTubeBlock link={link} style={style} />;
    case "tiktok":        return <TikTokBlock link={link} style={style} />;
    case "spotify":       return <SpotifyBlock link={link} style={style} />;
    case "product":       return <ProductBlock link={link} style={style} onClick={onClick} />;
    case "gallery":       return <GalleryBlock link={link} />;
    case "testimonial":   return <TestimonialBlock link={link} style={style} />;
    case "email_capture": return <EmailCaptureBlock link={link} style={style} profileId={profileId} />;
    case "whatsapp":      return <WhatsAppBlock link={link} style={style} onClick={onClick} />;
    case "payment":       return <PaymentBlock link={link} style={style} onClick={onClick} />;
    case "booking":       return <BookingBlock link={link} style={style} onClick={onClick} />;
    case "link":
    default:              return <LinkButton link={link} style={style} onClick={onClick} mostClicked={isTop} />;
  }
}

function ProfileSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="mx-auto h-28 w-28 rounded-full bg-white/10" />
      <div className="mx-auto mt-5 h-6 w-40 rounded bg-white/10" />
      <div className="mx-auto mt-2 h-4 w-24 rounded bg-white/10" />
      <div className="mt-8 space-y-3">
        {[0,1,2,3].map((i) => <div key={i} className="h-14 w-full rounded-2xl bg-white/10" />)}
      </div>
    </div>
  );
}
