import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { QRPreview } from "@/components/QRPreview";
import { useAuth, useMyProfile, useMyLinks, useMyAnalytics, FREE_LINK_LIMIT, themes, type Theme, type ButtonStyle, type FontWeight, type FontFamily, type LinkItem, type SocialLinks } from "@/lib/store";
import { useSubscription } from "@/hooks/useSubscription";
import { createCustomerPortalSession } from "@/server/payments.functions";
import { getPaddleEnvironment } from "@/lib/paddle";
import { publicProfileUrl } from "@/lib/public-url";
import { Plus, ExternalLink, Trash2, Eye, MousePointerClick, Crown, Pencil, QrCode, CreditCard, Loader2, Upload, X, GripVertical, Pin, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  validateSearch: (s: Record<string, unknown>) => ({ checkout: typeof s.checkout === "string" ? s.checkout : undefined }),
  head: () => ({ meta: [{ title: "Dashboard — QRLinkSpot" }] }),
});

function Dashboard() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/dashboard" });
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, update, refresh } = useMyProfile();
  const { links, remove } = useMyLinks(profile?.id);
  const { events } = useMyAnalytics(profile?.id);
  const { subscription, isActive, cancelAtPeriodEnd, isPastDue } = useSubscription();
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  // After successful checkout, poll for the webhook to write the subscription row.
  useEffect(() => {
    if (search.checkout !== "success" || !user) return;
    toast.success("Welcome to Pro! Your features are unlocking…");
    let attempts = 0;
    const id = setInterval(async () => {
      attempts++;
      await refresh();
      if (attempts >= 8) clearInterval(id);
    }, 1500);
    return () => clearInterval(id);
  }, [search.checkout, user?.id]);

  const openPortal = async () => {
    if (!user) return;
    setPortalLoading(true);
    try {
      const { url } = await createCustomerPortalSession({
        data: { userId: user.id, environment: getPaddleEnvironment() },
      });
      window.open(url, "_blank");
    } catch (e: any) {
      toast.error(e?.message ?? "Could not open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

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
            {subscription ? (
              <Button variant="outline" onClick={openPortal} disabled={portalLoading}>
                {portalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                Manage subscription
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link to="/pricing"><Crown className="mr-2 h-4 w-4" /> Upgrade to Pro</Link>
              </Button>
            )}
            <Button asChild variant="brand">
              <Link to="/links/$id" params={{ id: "new" }}><Plus className="mr-2 h-4 w-4" /> Add link</Link>
            </Button>
          </div>
        </div>

        {isPastDue && (
          <div className="mb-6 rounded-xl border border-orange-300 bg-orange-50 p-4 text-sm text-orange-900">
            <strong>Payment failed.</strong> Update your card in the billing portal to keep Pro features.
          </div>
        )}
        {isActive && cancelAtPeriodEnd && subscription?.current_period_end && (
          <div className="mb-6 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Your Pro plan is set to cancel on {new Date(subscription.current_period_end).toLocaleDateString()}. You'll keep Pro features until then.
          </div>
        )}

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
                <div className="space-y-2 sm:col-span-2">
                  <Label>Logo (shown on your link page & QR)</Label>
                  <LogoUploader
                    userId={profile.id}
                    currentUrl={profile.logo_url}
                    onChange={(url) => update({ logo_url: url }).catch(() => toast.error("Save failed"))}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Customize your link page</h2>
                <a href={`/u/${profile.username}`} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                  Preview ↗
                </a>
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {(Object.keys(themes) as Theme[]).map((key) => {
                    const th = themes[key];
                    const active = profile.theme === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => update({ theme: key }).catch(() => toast.error("Save failed"))}
                        className={`group relative overflow-hidden rounded-xl border-2 p-2 text-left transition-all ${active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"}`}
                      >
                        <div className="h-12 w-full rounded-md" style={{ background: th.bg }} />
                        <p className="mt-2 text-xs font-medium">{th.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <ColorField label="Background color" value={profile.bg_color} onSave={(v) => update({ bg_color: v }).catch(() => toast.error("Save failed"))} />
                <ColorField label="Button color" value={profile.button_color} onSave={(v) => update({ button_color: v }).catch(() => toast.error("Save failed"))} />
                <ColorField label="Text color" value={profile.button_text_color} onSave={(v) => update({ button_text_color: v }).catch(() => toast.error("Save failed"))} />
              </div>

              <div className="mt-6 space-y-2">
                <Label>Button style</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(["rounded", "pill", "square", "outline"] as ButtonStyle[]).map((style) => {
                    const active = profile.button_style === style;
                    const radius = style === "pill" ? "9999px" : style === "square" ? "6px" : "16px";
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => update({ button_style: style }).catch(() => toast.error("Save failed"))}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"}`}
                      >
                        <div
                          className="h-8 w-full bg-primary"
                          style={{
                            background: style === "outline" ? "transparent" : undefined,
                            border: style === "outline" ? "2px solid hsl(var(--primary))" : "none",
                            borderRadius: radius,
                          }}
                        />
                        <span className="text-xs font-medium capitalize">{style}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label>Text boldness</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["normal", "semibold", "bold"] as FontWeight[]).map((fw) => {
                    const active = profile.font_weight === fw;
                    return (
                      <button
                        key={fw}
                        type="button"
                        onClick={() => update({ font_weight: fw }).catch(() => toast.error("Save failed"))}
                        className={`rounded-xl border-2 p-3 text-center transition-all ${active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"} ${fw === "bold" ? "font-bold" : fw === "normal" ? "font-normal" : "font-semibold"}`}
                      >
                        Aa <span className="ml-1 text-xs capitalize text-muted-foreground">{fw}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Custom colors override the theme. Leave a color empty to use the theme default.
              </p>
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
                logoUrl={profile.is_pro ? profile.logo_url : ""}
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

function ColorField({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => void }) {
  const [local, setLocal] = useState(value);
  useEffect(() => { setLocal(value); }, [value]);
  const isValid = local === "" || /^#[0-9A-Fa-f]{6}$/.test(local);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={local || "#ffffff"}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={() => isValid && local !== value && onSave(local)}
          className="h-10 w-12 cursor-pointer rounded-md border border-border bg-background"
        />
        <Input
          value={local}
          placeholder="Use theme"
          onChange={(e) => setLocal(e.target.value)}
          onBlur={() => isValid && local !== value && onSave(local)}
          className="flex-1"
        />
        {local && (
          <Button type="button" variant="ghost" size="sm" onClick={() => { setLocal(""); onSave(""); }}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}

function LogoUploader({ userId, currentUrl, onChange }: { userId: string; currentUrl: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${userId}/logo.${ext}`;

      // Remove any previous logo files (different extensions)
      await supabase.storage.from("profile-logos").remove([
        `${userId}/logo.png`,
        `${userId}/logo.jpg`,
        `${userId}/logo.jpeg`,
        `${userId}/logo.webp`,
        `${userId}/logo.svg`,
        `${userId}/logo.gif`,
      ]);

      const { error } = await supabase.storage
        .from("profile-logos")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;

      const { data } = supabase.storage.from("profile-logos").getPublicUrl(path);
      // Cache-bust so the new logo shows immediately
      onChange(`${data.publicUrl}?v=${Date.now()}`);
      toast.success("Logo uploaded");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    try {
      await supabase.storage.from("profile-logos").remove([
        `${userId}/logo.png`,
        `${userId}/logo.jpg`,
        `${userId}/logo.jpeg`,
        `${userId}/logo.webp`,
        `${userId}/logo.svg`,
        `${userId}/logo.gif`,
      ]);
      onChange("");
      toast.success("Logo removed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
        {currentUrl ? (
          <img src={currentUrl} alt="Logo preview" className="h-full w-full object-contain" />
        ) : (
          <span className="text-xs text-muted-foreground">No logo</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
            <span className="cursor-pointer">
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {currentUrl ? "Replace" : "Upload"}
            </span>
          </Button>
        </label>
        {currentUrl && (
          <Button type="button" variant="ghost" size="sm" disabled={uploading} onClick={handleRemove}>
            <X className="mr-2 h-4 w-4" /> Remove
          </Button>
        )}
        <p className="text-xs text-muted-foreground">PNG, JPG, WebP or SVG · max 2MB</p>
      </div>
    </div>
  );
}
