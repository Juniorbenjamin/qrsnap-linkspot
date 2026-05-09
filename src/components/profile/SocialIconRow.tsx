import { Instagram, Youtube, Facebook, Linkedin, Mail, Music2, Globe, MessageCircle } from "lucide-react";
import type { SocialLinks } from "@/lib/store";

const buildHref = (key: keyof SocialLinks, val: string): string => {
  const v = val.trim();
  if (!v) return "";
  if (v.startsWith("http")) return v;
  switch (key) {
    case "instagram": return `https://instagram.com/${v.replace(/^@/, "")}`;
    case "tiktok":    return `https://tiktok.com/@${v.replace(/^@/, "")}`;
    case "youtube":   return `https://youtube.com/${v.startsWith("@") ? v : "@" + v}`;
    case "x":         return `https://x.com/${v.replace(/^@/, "")}`;
    case "linkedin":  return `https://linkedin.com/in/${v}`;
    case "facebook":  return `https://facebook.com/${v}`;
    case "spotify":   return `https://open.spotify.com/user/${v}`;
    case "whatsapp":  return `https://wa.me/${v.replace(/[^0-9]/g, "")}`;
    case "email":     return `mailto:${v}`;
    case "website":   return v.startsWith("http") ? v : `https://${v}`;
    default: return v;
  }
};

const ICONS: { key: keyof SocialLinks; Icon: any; label: string }[] = [
  { key: "instagram", Icon: Instagram, label: "Instagram" },
  { key: "tiktok",    Icon: Music2,    label: "TikTok" },
  { key: "youtube",   Icon: Youtube,   label: "YouTube" },
  { key: "x",         Icon: XIcon,     label: "X" },
  { key: "facebook",  Icon: Facebook,  label: "Facebook" },
  { key: "linkedin",  Icon: Linkedin,  label: "LinkedIn" },
  { key: "spotify",   Icon: Music2,    label: "Spotify" },
  { key: "whatsapp",  Icon: MessageCircle, label: "WhatsApp" },
  { key: "email",     Icon: Mail,      label: "Email" },
  { key: "website",   Icon: Globe,     label: "Website" },
];

function XIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

export function SocialIconRow({
  links,
  color,
  whatsappNumber,
}: { links: SocialLinks; color: string; whatsappNumber?: string }) {
  const merged: SocialLinks = { ...links };
  if (whatsappNumber && !merged.whatsapp) merged.whatsapp = whatsappNumber;

  const visible = ICONS.filter(({ key }) => merged[key] && merged[key]!.trim());
  if (visible.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {visible.map(({ key, Icon, label }) => (
        <a
          key={key}
          href={buildHref(key, merged[key]!)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="tap-bounce flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ background: "rgba(255,255,255,0.10)", color, backdropFilter: "blur(10px)" }}
        >
          <Icon className="h-[18px] w-[18px]" />
        </a>
      ))}
    </div>
  );
}
