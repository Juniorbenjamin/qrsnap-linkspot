import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QRPreview } from "@/components/QRPreview";
import { useProfile, FREE_LINK_LIMIT, useAnalytics } from "@/lib/store";
import { Plus, ExternalLink, Trash2, Eye, MousePointerClick, Crown, Pencil } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — QRLinkSpot" }] }),
});

function Dashboard() {
  const { profile, update } = useProfile();
  const events = useAnalytics();
  const views = events.filter((e) => e.type === "view").length;
  const clicks = events.filter((e) => e.type === "click").length;

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/u/${profile.username}`;
  const linksLeft = profile.isPro ? "∞" : Math.max(0, FREE_LINK_LIMIT - profile.links.length);

  const removeLink = (id: string) => {
    update({ links: profile.links.filter((l) => l.id !== id) });
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
              <Link to="/u/$username" params={{ username: profile.username }}>
                <ExternalLink className="mr-2 h-4 w-4" /> View public page
              </Link>
            </Button>
            <Button asChild variant="brand">
              <Link to="/links/$id" params={{ id: "new" }}><Plus className="mr-2 h-4 w-4" /> Add link</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard icon={<Eye className="h-5 w-5" />} label="Page views" value={views} />
          <StatCard icon={<MousePointerClick className="h-5 w-5" />} label="Link clicks" value={clicks} />
          <StatCard icon={<Crown className="h-5 w-5" />} label="Plan" value={profile.isPro ? "Pro" : "Free"} sub={profile.isPro ? "Unlimited" : `${linksLeft} links left`} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Profile + Links */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="mb-4 text-lg font-semibold">Profile</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="display">Display name</Label>
                  <Input id="display" value={profile.displayName} onChange={(e) => update({ displayName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={profile.username} onChange={(e) => update({ username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={profile.bio} onChange={(e) => update({ bio: e.target.value })} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emoji">Avatar emoji</Label>
                  <Input id="emoji" value={profile.avatarEmoji} onChange={(e) => update({ avatarEmoji: e.target.value })} maxLength={2} />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your links</h2>
                <span className="text-sm text-muted-foreground">{profile.links.length} {!profile.isPro && `/ ${FREE_LINK_LIMIT}`}</span>
              </div>
              {profile.links.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No links yet. <Link to="/links/$id" params={{ id: "new" }} className="font-medium text-primary hover:underline">Add your first one</Link>
                </div>
              ) : (
                <ul className="space-y-2">
                  {profile.links.map((link) => (
                    <li key={link.id} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{link.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{link.url}</p>
                      </div>
                      <Button asChild variant="ghost" size="icon">
                        <Link to="/links/$id" params={{ id: link.id }}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeLink(link.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              {!profile.isPro && profile.links.length >= FREE_LINK_LIMIT && (
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

          {/* QR Preview */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-soft">
              <h2 className="mb-4 text-lg font-semibold">Your QR code</h2>
              <QRPreview
                value={publicUrl}
                fgColor={profile.isPro ? profile.qrColor : "#1a1a2e"}
                bgColor={profile.isPro ? profile.qrBg : "#ffffff"}
                logoText={profile.isPro ? profile.logoText : ""}
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
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
