import { useState } from "react";
import { ExternalLink, MessageCircle, CreditCard, Calendar, Mail, Star, Check } from "lucide-react";
import type { LinkItem } from "@/lib/store";
import { subscribeEmail } from "@/lib/store";
import { toast } from "sonner";

type Style = {
  buttonBg: string;
  buttonText: string;
  borderRadius: string;
  isOutline: boolean;
  fontWeightClass: string;
  accent: string;
  muted: string;
};

const youTubeId = (url: string) => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  return m?.[1];
};
const tiktokEmbed = (url: string) => {
  const m = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  return m?.[1];
};
const spotifyEmbed = (url: string) => {
  // open.spotify.com/track/... or playlist or album
  const m = url.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([\w]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : null;
};

export function LinkButton({
  link,
  style,
  onClick,
  mostClicked,
}: { link: LinkItem; style: Style; onClick?: () => void; mostClicked?: boolean }) {
  const featured = link.is_featured;
  const customColor = link.color;
  const bg = customColor || style.buttonBg;
  const isOutline = style.isOutline && !customColor;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      onAuxClick={onClick}
      className={`group tap-bounce relative flex w-full items-center gap-3 px-5 ${featured ? "py-5" : "py-4"} text-base ${style.fontWeightClass} transition-all hover:-translate-y-0.5 hover:shadow-elevated`}
      style={{
        background: isOutline ? "transparent" : bg,
        color: style.buttonText,
        border: isOutline ? `2px solid ${style.buttonText}` : "none",
        borderRadius: style.borderRadius,
        backdropFilter: isOutline ? "none" : "blur(10px)",
      }}
    >
      {link.thumbnail_url ? (
        <img src={link.thumbnail_url} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
      ) : link.icon ? (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-xl">{link.icon}</span>
      ) : null}
      <span className="flex-1 truncate text-left">{link.title}</span>
      {mostClicked && (
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-yellow-400/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
          <Star className="h-3 w-3 fill-current" /> Top
        </span>
      )}
      <ExternalLink className="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100" />
    </a>
  );
}

export function HeaderBlock({ link, color }: { link: LinkItem; color: string }) {
  return (
    <div className="px-1 pb-1 pt-3 text-center">
      <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color, opacity: 0.85 }}>{link.title}</h3>
    </div>
  );
}

export function YouTubeBlock({ link, style }: { link: LinkItem; style: Style }) {
  const id = youTubeId(link.url);
  if (!id) return <LinkButton link={link} style={style} />;
  return (
    <div className="overflow-hidden rounded-2xl shadow-elevated">
      {link.title && <p className="px-1 pb-2 text-sm font-semibold" style={{ color: style.buttonText }}>{link.title}</p>}
      <div className="aspect-video w-full">
        <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${id}`} title={link.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    </div>
  );
}

export function TikTokBlock({ link, style }: { link: LinkItem; style: Style }) {
  const id = tiktokEmbed(link.url);
  if (!id) return <LinkButton link={link} style={style} />;
  return (
    <div className="overflow-hidden rounded-2xl bg-black shadow-elevated">
      {link.title && <p className="px-3 py-2 text-sm font-semibold text-white">{link.title}</p>}
      <iframe src={`https://www.tiktok.com/embed/v2/${id}`} className="h-[600px] w-full" allow="autoplay; encrypted-media" />
    </div>
  );
}

export function SpotifyBlock({ link, style }: { link: LinkItem; style: Style }) {
  const src = spotifyEmbed(link.url);
  if (!src) return <LinkButton link={link} style={style} />;
  return (
    <div className="overflow-hidden rounded-2xl shadow-elevated">
      <iframe src={src} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
    </div>
  );
}

export function ProductBlock({ link, style, onClick }: { link: LinkItem; style: Style; onClick?: () => void }) {
  const price = link.metadata?.price ?? "";
  const cta = link.metadata?.cta ?? "Buy now";
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="group block overflow-hidden rounded-2xl shadow-elevated transition-transform hover:-translate-y-0.5"
      style={{ background: style.buttonBg, color: style.buttonText, backdropFilter: "blur(10px)" }}
    >
      {link.thumbnail_url && (
        <img src={link.thumbnail_url} alt={link.title} className="h-44 w-full object-cover" />
      )}
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate font-semibold">{link.title}</p>
          {price && <p className="text-sm opacity-80">{price}</p>}
        </div>
        <span className="rounded-full px-3 py-1.5 text-sm font-semibold" style={{ background: style.accent, color: style.buttonBg }}>{cta}</span>
      </div>
    </a>
  );
}

export function GalleryBlock({ link }: { link: LinkItem }) {
  const images: string[] = link.metadata?.images ?? [];
  if (images.length === 0) return null;
  return (
    <div className="space-y-2">
      {link.title && <p className="px-1 text-sm font-semibold" style={{ opacity: 0.8 }}>{link.title}</p>}
      <div className="grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-xl">
            <img src={src} alt="" loading="lazy" className="h-full w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function TestimonialBlock({ link, style }: { link: LinkItem; style: Style }) {
  return (
    <div className="rounded-2xl p-5 shadow-elevated" style={{ background: style.buttonBg, color: style.buttonText, backdropFilter: "blur(10px)" }}>
      <div className="mb-2 flex">
        {[0,1,2,3,4].map((i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
      </div>
      <p className="text-base leading-relaxed">"{link.title}"</p>
      <div className="mt-3 flex items-center gap-3">
        {link.thumbnail_url && <img src={link.thumbnail_url} alt="" className="h-9 w-9 rounded-full object-cover" />}
        <div>
          {link.metadata?.author && <p className="text-sm font-semibold">{link.metadata.author}</p>}
          {link.metadata?.role && <p className="text-xs opacity-70">{link.metadata.role}</p>}
        </div>
      </div>
    </div>
  );
}

export function EmailCaptureBlock({ link, style, profileId }: { link: LinkItem; style: Style; profileId: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    try {
      await subscribeEmail(profileId, email, name);
      setDone(true);
      toast.success("Thanks! You're subscribed.");
    } catch (err: any) {
      const msg = err?.message?.includes("duplicate") ? "You're already subscribed!" : "Could not subscribe";
      toast.error(msg);
    } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl p-5 shadow-elevated" style={{ background: style.buttonBg, color: style.buttonText, backdropFilter: "blur(10px)" }}>
      <div className="mb-3 flex items-start gap-3">
        <Mail className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">{link.title}</p>
          {link.metadata?.subhead && <p className="text-sm opacity-80">{link.metadata.subhead}</p>}
        </div>
      </div>
      {done ? (
        <div className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm">
          <Check className="h-4 w-4" /> You're on the list.
        </div>
      ) : (
        <div className="space-y-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (optional)" className="w-full rounded-xl border-0 bg-white/15 px-4 py-3 text-sm placeholder:text-current/60 focus:outline-none" style={{ color: style.buttonText }} />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="w-full rounded-xl border-0 bg-white/15 px-4 py-3 text-sm placeholder:text-current/60 focus:outline-none" style={{ color: style.buttonText }} />
          <button type="submit" disabled={busy} className="w-full rounded-xl px-4 py-3 text-sm font-semibold transition-transform hover:scale-[1.01] disabled:opacity-60" style={{ background: style.accent, color: style.buttonBg }}>
            {busy ? "Subscribing…" : "Subscribe"}
          </button>
        </div>
      )}
    </form>
  );
}

export function WhatsAppBlock({ link, style, onClick }: { link: LinkItem; style: Style; onClick?: () => void }) {
  const phone = link.url.replace(/[^0-9]/g, "");
  const href = `https://wa.me/${phone}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}
      className="tap-bounce flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-semibold shadow-elevated transition-transform hover:-translate-y-0.5"
      style={{ background: "#25D366", color: "#0a3d23" }}>
      <MessageCircle className="h-5 w-5" /> {link.title || "Chat on WhatsApp"}
    </a>
  );
}

export function PaymentBlock({ link, style, onClick }: { link: LinkItem; style: Style; onClick?: () => void }) {
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" onClick={onClick}
      className="tap-bounce flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-semibold shadow-elevated transition-transform hover:-translate-y-0.5"
      style={{ background: style.accent, color: style.buttonBg }}>
      <CreditCard className="h-5 w-5" /> {link.title || "Pay now"}
    </a>
  );
}

export function BookingBlock({ link, style, onClick }: { link: LinkItem; style: Style; onClick?: () => void }) {
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" onClick={onClick}
      className="tap-bounce flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-semibold shadow-elevated transition-transform hover:-translate-y-0.5"
      style={{ background: style.buttonBg, color: style.buttonText, backdropFilter: "blur(10px)" }}>
      <Calendar className="h-5 w-5" /> {link.title || "Book a time"}
    </a>
  );
}
