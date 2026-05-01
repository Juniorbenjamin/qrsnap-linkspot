import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QRPreview } from "@/components/QRPreview";
import { useAuth, useMyProfile, useMyLinks, useMyAnalytics, FREE_LINK_LIMIT } from "@/lib/store";
import { useSubscription } from "@/hooks/useSubscription";
import { createCustomerPortalSession } from "@/server/payments.functions";
import { getPaddleEnvironment } from "@/lib/paddle";
import { publicProfileUrl } from "@/lib/public-url";
import { Plus, ExternalLink, Trash2, Eye, MousePointerClick, Crown, Pencil, QrCode, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  validateSearch: (s: Record<string, unknown>) => ({ checkout: typeof s.checkout === "string" ? s.checkout : undefined }),
  head: () => ({ meta: [{ title: "Dashboard — QRLinkSpot" }] }),
});

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, update } = useMyProfile();
  const { links, remove } = useMyLinks(profile?.id);
  const { events } = useMyAnalytics(profile?.id);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  if (authLoading || profileLoading || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-muted-foreground sm:px-6">Loading…</div>
      </div>
    );
  }

  const views = events.filter((e) => e.event_type === "view").length;
  const scans = events.filter((e) => e.event_type === "scan").length;
  const clicks = events.filter((e) => e.event_type === "click").length;

  const publicUrl = publicProfileUrl(profile.username);
  const qrTarget = `${publicUrl}?src=qr`;
  const linksLeft = profile.is_pro ? "∞" : Math.max(0, FREE_LINK_LIMIT - links.length);

  const handleRemove = async (id: string) => {
    try { await remove(id); toast.success("Link removed"); }
    catch (e) { toast.error("Could not remove link"); }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Manage your links, QR, and profile.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <a href={`/u/${profile.username}`} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> View public page
              </a>
            </Button>
            <Button asChild variant="brand">
              <Link to="/links/$id" params={{ id: "new" }}><Plus className="mr-2 h-4 w-4" /> Add link</Link>
            </Button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<QrCode className="h-5 w-5" />} label="QR scans" value={scans} />
          <StatCard icon={<Eye className="h-5 w-5" />} label="Page views" value={views} />
          <StatCard icon={<MousePointerClick className="h-5 w-5" />} label="Link clicks" value={clicks} />
          <StatCard icon={<Crown className="h-5 w-5" />} label="Plan" value={profile.is_pro ? "Pro" : "Free"} sub={profile.is_pro ? "Unlimited" : `${linksLeft} links left`} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="mb-4 text-lg font-semibold">Profile</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="display">Display name</Label>
                  <Input id="display" defaultValue={profile.display_name} onBlur={(e) => update({ display_name: e.target.value }).catch(() => toast.error("Save failed"))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={profile.username} onBlur={(e) => {
                    const v = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                    if (v && v !== profile.username) update({ username: v }).catch(() => toast.error("Username taken"));
                  }} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" defaultValue={profile.bio} rows={2} onBlur={(e) => update({ bio: e.target.value }).catch(() => toast.error("Save failed"))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emoji">Avatar emoji</Label>
                  <Input id="emoji" defaultValue={profile.avatar_emoji} maxLength={2} onBlur={(e) => update({ avatar_emoji: e.target.value || "✨" }).catch(() => {})} />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your links</h2>
                <span className="text-sm text-muted-foreground">{links.length} {!profile.is_pro && `/ ${FREE_LINK_LIMIT}`}</span>
              </div>
              {links.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No links yet. <Link to="/links/$id" params={{ id: "new" }} className="font-medium text-primary hover:underline">Add your first one</Link>
                </div>
              ) : (
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.id} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{link.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{link.url}</p>
                      </div>
                      <Button asChild variant="ghost" size="icon">
                        <Link to="/links/$id" params={{ id: link.id }}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRemove(link.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              {!profile.is_pro && links.length >= FREE_LINK_LIMIT && (
                <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
                  <p className="font-medium">You've hit the free limit of {FREE_LINK_LIMIT} links.</p>
                  <p className="mt-1 text-muted-foreground">Upgrade to Pro for unlimited links and more.</p>
                  <Button asChild variant="brand" size="sm" className="mt-3">
                    <Link to="/pricing">Upgrade to Pro</Link>
                  </Button>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-soft">
              <h2 className="mb-4 text-lg font-semibold">Your QR code</h2>
              <QRPreview
                value={qrTarget}
                fgColor={profile.is_pro ? profile.qr_color : "#1a1a2e"}
                bgColor={profile.is_pro ? profile.qr_bg : "#ffffff"}
                logoText={profile.is_pro ? profile.logo_text : ""}
              />
              <p className="mt-4 break-all text-center text-xs text-muted-foreground">{publicUrl}</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/qr">Customize QR</Link>
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-card p-5 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-sm font-medium">{label}</span></div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
