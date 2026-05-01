import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useProfile, themes, trackEvent } from "@/lib/store";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/u/$username")({
  component: PublicProfile,
  head: () => ({ meta: [{ title: "Profile — QRLinkSpot" }] }),
});

function PublicProfile() {
  const { username } = useParams({ from: "/u/$username" });
  const { profile } = useProfile();
  const t = themes[profile.theme];

  useEffect(() => {
    trackEvent({ type: "view" });
  }, []);

  // In a real app we'd fetch by username — here we just show the local profile
  const matches = profile.username === username;

  return (
    <div className="min-h-screen w-full" style={{ background: t.bg, color: t.text }}>
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center px-5 py-12">
        <div
          className="mb-5 flex h-24 w-24 items-center justify-center rounded-full text-4xl shadow-elevated"
          style={{ background: t.card, backdropFilter: "blur(10px)" }}
        >
          {profile.avatarEmoji}
        </div>
        <h1 className="text-2xl font-bold">{matches ? profile.displayName : `@${username}`}</h1>
        {matches && profile.bio && (
          <p className="mt-1 text-center text-sm" style={{ color: t.muted }}>{profile.bio}</p>
        )}

        <div className="mt-8 flex w-full flex-col gap-3">
          {(matches ? profile.links : []).map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent({ type: "click", linkId: link.id })}
              className="group flex items-center justify-between rounded-2xl px-5 py-4 text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-elevated"
              style={{ background: t.card, color: t.text, backdropFilter: "blur(10px)" }}
            >
              <span>{link.title}</span>
              <ExternalLink className="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100" />
            </a>
          ))}
          {matches && profile.links.length === 0 && (
            <p className="text-center text-sm" style={{ color: t.muted }}>No links yet.</p>
          )}
          {!matches && (
            <p className="text-center text-sm" style={{ color: t.muted }}>This profile does not exist yet.</p>
          )}
        </div>

        {!profile.isPro && (
          <div className="mt-auto pt-12 text-xs opacity-70">
            <a href="/" style={{ color: t.muted }}>Powered by ✨ QRLinkSpot</a>
          </div>
        )}
      </div>
    </div>
  );
}
