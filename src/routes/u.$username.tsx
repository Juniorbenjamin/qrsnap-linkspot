import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchPublicProfile, themes, trackEvent, type Profile, type LinkItem } from "@/lib/store";
import { CheckCircle2, QrCode, X } from "lucide-react";
import { SocialIconRow } from "@/components/profile/SocialIconRow";
import {
  LinkButton, HeaderBlock, YouTubeBlock, TikTokBlock, SpotifyBlock,
  ProductBlock, GalleryBlock, TestimonialBlock, EmailCaptureBlock,
  WhatsAppBlock, PaymentBlock, BookingBlock,
} from "@/components/profile/Blocks";
import { QRPreview } from "@/components/QRPreview";
import { publicProfileUrl } from "@/lib/public-url";

export const Route = createFileRoute("/u/$username")({
  component: PublicProfile,
  validateSearch: (search: Record<string, unknown>) => ({
    src: search.src === "qr" ? ("qr" as const) : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — QRLinkSpot` },
      { name: "description", content: `Discover all of @${params.username}'s links, content, and contact options in one place.` },
      { property: "og:title", content: `@${params.username}` },
      { property: "og:description", content: `Links, social, and contact for @${params.username}.` },
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
  const [showQr, setShowQr] = useState(false);

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

  // Sort: pinned first (preserving position), then by position
  const sortedLinks = useMemo(() => {
    return [...links].sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return a.position - b.position;
    });
  }, [links]);

  const themeKey = (profile?.theme && profile.theme in themes ? profile.theme : "midnight") as keyof typeof themes;
  const t = themes[themeKey];

  const animated = profile?.bg_animated;
  const coverUrl = profile?.cover_url;
  const videoUrl = profile?.bg_video_url;
  const bg = profile?.bg_color || t.bg;
  const buttonBg = profile?.button_color || t.card;
  const buttonText = profile?.button_text_color || t.text;
  const textColor = profile?.button_text_color || t.text;
  const muted = t.muted;
  const accent = profile?.accent_color || t.accent;

  const buttonStyle = profile?.button_style || "rounded";
  const borderRadius =
    buttonStyle === "pill" ? "9999px" :
    buttonStyle === "square" ? "10px" :
    "18px";
  const isOutline = buttonStyle === "outline";

  const fontWeight = profile?.font_weight || "semibold";
  const fontWeightClass =
    fontWeight === "bold" ? "font-bold" :
    fontWeight === "normal" ? "font-normal" :
    "font-semibold";

  const fontFamily = profile?.font_family || "inter";
  const fontClass =
    fontFamily === "poppins"  ? "font-poppins"  :
    fontFamily === "playfair" ? "font-playfair" :
    fontFamily === "space"    ? "font-space"    :
    fontFamily === "mono"     ? "font-mono-display" :
    "";

  const style = { buttonBg, buttonText, borderRadius, isOutline, fontWeightClass, accent, muted };

  // Most-clicked badge: simple heuristic — pick the first non-pinned regular link as "Top" if more than 1 link.
  // (Real click counts would come from analytics; we surface featured + first link badge for now.)
  const topLinkId = useMemo(() => {
    const reg = sortedLinks.filter((l) => l.link_type === "link" && !l.is_pinned);
    return reg[0]?.id;
  }, [sortedLinks]);

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
      {/* Animated / video / cover backgrounds */}
      {videoUrl && (
        <video src={videoUrl} autoPlay loop muted playsInline className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70" />
      )}
      {coverUrl && !videoUrl && (
        <img src={coverUrl} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />
      )}
      {animated && !coverUrl && !videoUrl && (
        <div className="pointer-events-none absolute inset-0 bg-animated-gradient opacity-90" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

      {/* Floating QR button */}
      {profile && (
        <button
          onClick={() => setShowQr(true)}
          aria-label="Show QR code"
          className="tap-bounce fixed right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full shadow-elevated backdrop-blur-md transition-transform hover:scale-105"
          style={{ background: "rgba(255,255,255,0.15)", color: textColor, border: "1px solid rgba(255,255,255,0.18)" }}
        >
          <QrCode className="h-5 w-5" />
        </button>
      )}

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center px-5 pb-16 pt-12 sm:pt-14">
        {loading ? (
          <ProfileSkeleton />
        ) : !profile ? (
          <div className="text-center text-foreground">
            <p className="text-lg font-semibold">@{username}</p>
            <p className="mt-2 text-sm opacity-70">This profile does not exist yet.</p>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div className="animate-pop mb-1 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full ring-4 ring-white/20 shadow-elevated"
              style={{ background: profile.logo_url ? "transparent" : "rgba(255,255,255,0.1)" }}>
              {profile.logo_url ? (
                <img src={profile.logo_url} alt={`${profile.display_name} logo`} className="h-full w-full object-cover" />
              ) : (
                <span className="text-5xl">{profile.avatar_emoji}</span>
              )}
            </div>

            <div className="animate-rise mt-5 flex items-center gap-1.5">
              <h1 className={`text-2xl tracking-tight ${fontWeight === "normal" ? "font-semibold" : "font-bold"}`}>
                {profile.display_name}
              </h1>
              {profile.is_verified && (
                <CheckCircle2 className="h-5 w-5 fill-blue-500 text-white" aria-label="Verified" />
              )}
            </div>
            <p className="mt-0.5 text-sm font-medium" style={{ color: muted }}>@{profile.username}</p>

            {profile.tagline && (
              <p className="animate-rise mt-2 text-center text-sm font-medium" style={{ color: textColor, opacity: 0.95 }}>
                {profile.tagline}
              </p>
            )}
            {profile.bio && (
              <p className="animate-rise mt-2 max-w-sm text-center text-sm leading-relaxed" style={{ color: muted }}>
                {profile.bio}
              </p>
            )}

            <SocialIconRow links={profile.social_links || {}} color={textColor} whatsappNumber={profile.whatsapp_number} />

            {/* Quick action row: WhatsApp + Booking */}
            {(profile.whatsapp_number || profile.booking_url) && (
              <div className="mt-5 flex w-full gap-2">
                {profile.whatsapp_number && (
                  <a href={`https://wa.me/${profile.whatsapp_number.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
                    className="tap-bounce flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-elevated"
                    style={{ background: "#25D366", color: "#0a3d23" }}>
                    Chat
                  </a>
                )}
                {profile.booking_url && (
                  <a href={profile.booking_url} target="_blank" rel="noopener noreferrer"
                    className="tap-bounce flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-elevated"
                    style={{ background: accent, color: buttonBg }}>
                    Book
                  </a>
                )}
              </div>
            )}

            {/* Blocks */}
            <div className="mt-7 flex w-full flex-col gap-3">
              {sortedLinks.length === 0 && (
                <p className="text-center text-sm" style={{ color: muted }}>No links yet.</p>
              )}
              {sortedLinks.map((link, i) => (
                <div key={link.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                  {renderBlock(link, style, profile.id, () => handleClick(link), link.id === topLinkId)}
                </div>
              ))}
            </div>

            {!profile.is_pro && (
              <div className="mt-auto pt-12 text-xs opacity-70">
                <a href="/" style={{ color: muted }}>Powered by ✨ QRLinkSpot</a>
              </div>
            )}
          </>
        )}
      </div>

      {/* QR sheet */}
      {showQr && profile && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm" onClick={() => setShowQr(false)}>
          <div className="animate-pop relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-elevated" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowQr(false)} aria-label="Close" className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-black/5">
              <X className="h-5 w-5 text-black" />
            </button>
            <h2 className="mb-1 text-lg font-bold text-black">Scan to share</h2>
            <p className="mb-4 text-xs text-black/60">@{profile.username}</p>
            <div className="mx-auto w-full max-w-[260px]">
              <QRPreview value={`${publicProfileUrl(profile.username)}?src=qr`} fgColor="#0a0a23" bgColor="#ffffff" logoUrl={profile.logo_url} />
            </div>
          </div>
        </div>
      )}
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
