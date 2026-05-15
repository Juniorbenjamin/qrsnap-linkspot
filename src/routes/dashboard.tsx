import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QRPreview } from "@/components/QRPreview";
import { useAuth, useMyProfile, useMyLinks, useMyAnalytics, FREE_LINK_LIMIT, themes, type Theme, type ButtonStyle, type FontWeight, type FontFamily, type LinkItem, type SocialLinks } from "@/lib/store";
import { useSubscription } from "@/hooks/useSubscription";
import { createCustomerPortalSession } from "@/server/payments.functions";
import { getPaddleEnvironment } from "@/lib/paddle";
import { publicProfileUrl, shortProfileLabel } from "@/lib/public-url";
import { Plus, ExternalLink, Trash2, Eye, MousePointerClick, Crown, Pencil, QrCode, CreditCard, Loader2, Upload, X, GripVertical, Pin, Star, CheckCircle2, Copy, Link2, Palette, User, BarChart3, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  validateSearch: (s: Record<string, unknown>) => ({
    checkout: typeof s.checkout === "string" ? s.checkout : undefined,
    tab: typeof s.tab === "string" ? s.tab : undefined,
  }),
  head: () => ({ meta: [{ title: "Dashboard — LinkSpot" }] }),
});

function Dashboard() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/dashboard" });
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, update, refresh } = useMyProfile();
  const { links, remove, reorder, update: updateLink } = useMyLinks(profile?.id);
  const { events } = useMyAnalytics(profile?.id);
  const { subscription, isActive, cancelAtPeriodEnd, isPastDue } = useSubscription();
  const [portalLoading, setPortalLoading] = useState(false);
  const [tab, setTab] = useState<string>(search.tab ?? "links");

  const clicksByLink = useMemo(() => {
    const map: Record<string, number> = {};
    events.forEach((e) => {
      if (e.event_type === "click" && e.link_id) map[e.link_id] = (map[e.link_id] || 0) + 1;
    });
    return map;
  }, [events]);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

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
  const shortLabel = shortProfileLabel(profile.username);
  const linksLeft = profile.is_pro ? "∞" : Math.max(0, FREE_LINK_LIMIT - links.length);

  const handleRemove = async (id: string) => {
    try { await remove(id); toast.success("Link removed"); }
    catch (e) { toast.error("Could not remove link"); }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link copied");
    } catch { toast.error("Could not copy"); }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Header card */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-border bg-gradient-card p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 items-center rounded-full bg-primary/10 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Your LinkSpot
                </span>
                {profile.is_pro && (
                  <span className="inline-flex h-6 items-center gap-1 rounded-full bg-amber-100 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                    <Crown className="h-3 w-3" /> Pro
                  </span>
                )}
              </div>

              <button
                onClick={copyLink}
                className="group mt-3 flex w-full items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-left backdrop-blur transition hover:border-primary/40 hover:bg-background sm:w-auto"
                aria-label="Copy your LinkSpot URL"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-[11px] font-bold text-primary-foreground">
                  L
                </span>
                <span className="min-w-0 flex-1 truncate font-mono text-sm sm:text-base">
                  <span className="text-muted-foreground">linkspot.site/</span>
                  <span className="font-semibold text-foreground">{profile.username}</span>
                </span>
                <Copy className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
              </button>

              <p className="mt-2 text-xs text-muted-foreground">{profile.display_name}</p>
            </div>

            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <Button asChild variant="outline" size="sm">
                <a href={`/u/${profile.username}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-1.5 h-4 w-4" /> View
                </a>
              </Button>
              <Button asChild variant="brand" size="sm">
                <Link to="/links/$id" params={{ id: "new" }}><Plus className="mr-1.5 h-4 w-4" /> Add link</Link>
              </Button>
            </div>
          </div>
        </div>

        {isPastDue && (
          <div className="mb-4 rounded-2xl border border-orange-300 bg-orange-50 p-4 text-sm text-orange-900">
            <strong>Payment failed.</strong> Update your card in the billing portal to keep Pro features.
          </div>
        )}
        {isActive && cancelAtPeriodEnd && subscription?.current_period_end && (
          <div className="mb-4 rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Your Pro plan cancels on {new Date(subscription.current_period_end).toLocaleDateString()}.
          </div>
        )}

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex h-11 w-auto gap-1 rounded-2xl bg-muted/60 p-1">
              <TabTrig value="links"      icon={<Link2 className="h-4 w-4" />}      label="Links" />
              <TabTrig value="appearance" icon={<Palette className="h-4 w-4" />}    label="Appearance" />
              <TabTrig value="profile"    icon={<User className="h-4 w-4" />}       label="Profile" />
              <TabTrig value="analytics"  icon={<BarChart3 className="h-4 w-4" />}  label="Analytics" />
              <TabTrig value="settings"   icon={<SettingsIcon className="h-4 w-4" />} label="Settings" />
            </TabsList>
          </div>

          {/* LINKS */}
          <TabsContent value="links" className="space-y-4">
            <Section
              title="Your links"
              description="Drag to reorder. Pinned links always stay on top."
              right={<span className="text-xs text-muted-foreground">{links.length}{!profile.is_pro && ` / ${FREE_LINK_LIMIT}`}</span>}
            >
              {links.length === 0 ? (
                <EmptyLinks />
              ) : (
                <SortableLinks
                  links={links}
                  clicksByLink={clicksByLink}
                  onReorder={reorder}
                  onRemove={handleRemove}
                  onTogglePin={(id, v) => updateLink(id, { is_pinned: v }).catch(() => toast.error("Save failed"))}
                  onToggleFeatured={(id, v) => updateLink(id, { is_featured: v }).catch(() => toast.error("Save failed"))}
                />
              )}
              {!profile.is_pro && links.length >= FREE_LINK_LIMIT && (
                <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
                  <p className="font-medium">You've hit the free limit of {FREE_LINK_LIMIT} links.</p>
                  <p className="mt-1 text-muted-foreground">Upgrade to Pro for unlimited links and more.</p>
                  <Button asChild variant="brand" size="sm" className="mt-3">
                    <Link to="/pricing">Upgrade to Pro</Link>
                  </Button>
                </div>
              )}
            </Section>
          </TabsContent>

          {/* APPEARANCE */}
          <TabsContent value="appearance" className="space-y-4">
            <AppearanceTab profile={profile} update={update} />
          </TabsContent>

          {/* PROFILE */}
          <TabsContent value="profile" className="space-y-4">
            <ProfileTab profile={profile} update={update} />
          </TabsContent>

          {/* ANALYTICS */}
          <TabsContent value="analytics" className="space-y-4">
            <Section title="Your stats" description="Last 30 days of activity.">
              <div className="grid gap-3 sm:grid-cols-3">
                <StatCard icon={<Eye className="h-4 w-4" />} label="Page views" value={views} />
                <StatCard icon={<MousePointerClick className="h-4 w-4" />} label="Link clicks" value={clicks} />
                <StatCard icon={<QrCode className="h-4 w-4" />} label="QR scans" value={scans} />
              </div>
            </Section>
            <Section title="Top links">
              {links.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No links yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {links
                    .map((l) => ({ ...l, clicks: clicksByLink[l.id] || 0 }))
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, 8)
                    .map((l) => (
                      <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                        <span className="truncate text-sm">{l.title || <span className="italic text-muted-foreground">(untitled)</span>}</span>
                        <span className="shrink-0 text-sm font-semibold tabular-nums">{l.clicks}</span>
                      </li>
                    ))}
                </ul>
              )}
            </Section>
          </TabsContent>

          {/* SETTINGS */}
          <TabsContent value="settings" className="space-y-4">
            <Section title="Plan" description={profile.is_pro ? "You're on Pro — unlimited everything." : `Free plan · ${linksLeft} links left.`}>
              <div className="flex flex-wrap items-center gap-2">
                {subscription ? (
                  <Button variant="outline" onClick={openPortal} disabled={portalLoading}>
                    {portalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                    Manage subscription
                  </Button>
                ) : (
                  <Button asChild variant="brand">
                    <Link to="/pricing"><Crown className="mr-2 h-4 w-4" /> Upgrade to Pro</Link>
                  </Button>
                )}
              </div>
            </Section>

            <Section title="QR codes" description="QR Studio is now its own space — create unlimited custom QR codes for any link.">
              <div className="flex flex-wrap items-center gap-2">
                <Button asChild variant="brand" size="sm">
                  <Link to="/qr-studio"><QrCode className="mr-1.5 h-4 w-4" /> Open QR Studio</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/qr">QR for this LinkSpot</Link>
                </Button>
              </div>
            </Section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function TabTrig({ value, icon, label }: { value: string; icon: React.ReactNode; label: string }) {
  return (
    <TabsTrigger value={value} className="gap-1.5 rounded-xl px-3 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
      {icon}
      <span>{label}</span>
    </TabsTrigger>
  );
}

function Section({ title, description, right, children }: { title: string; description?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{description}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function EmptyLinks() {
  return (
    <div className="rounded-2xl border border-dashed border-border py-12 text-center">
      <Link2 className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">No links yet</p>
      <p className="mt-1 text-xs text-muted-foreground">Add your first link to get started.</p>
      <Button asChild variant="brand" size="sm" className="mt-4">
        <Link to="/links/$id" params={{ id: "new" }}><Plus className="mr-1.5 h-4 w-4" /> Add link</Link>
      </Button>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-xs font-medium">{label}</span></div>
      <p className="mt-1.5 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

/* ---------------- Profile tab ---------------- */

function ProfileTab({ profile, update }: { profile: any; update: (patch: any) => Promise<void> }) {
  const social: SocialLinks = profile.social_links || {};
  const setSocial = (key: keyof SocialLinks, val: string) =>
    update({ social_links: { ...social, [key]: val } }).catch(() => toast.error("Save failed"));

  return (
    <>
      <Section title="Profile" description="What people see at the top of your page.">
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
            <p className="text-xs text-muted-foreground">{shortProfileLabel(profile.username)}</p>
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
            <Label>Profile photo</Label>
            <LogoUploader
              userId={profile.id}
              currentUrl={profile.logo_url}
              onChange={(url) => update({ logo_url: url }).catch(() => toast.error("Save failed"))}
            />
          </div>
        </div>
      </Section>

      <Section title="Social handles" description="Shown as icons under your name.">
        <div className="grid gap-3 sm:grid-cols-2">
          {SOCIAL_KEYS.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1">
              <Label className="text-xs">{label}</Label>
              <Input defaultValue={social[key] ?? ""} placeholder={placeholder}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v !== (social[key] ?? "")) setSocial(key, v);
                }} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Verified badge" description="Show a blue check next to your name.">
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 fill-blue-500 text-white" />
            <p className="text-sm font-medium">Verified {!profile.is_pro && <span className="ml-1 text-xs text-primary">(Pro)</span>}</p>
          </div>
          <Switch
            checked={!!profile.is_verified}
            disabled={!profile.is_pro}
            onCheckedChange={(v) => update({ is_verified: v }).catch(() => toast.error("Save failed"))}
          />
        </div>
      </Section>
    </>
  );
}

/* ---------------- Appearance tab ---------------- */

function AppearanceTab({ profile, update }: { profile: any; update: (patch: any) => Promise<void> }) {
  return (
    <>
      <Section title="Theme">
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
      </Section>

      <Section title="Colors" description="Override the theme. Leave empty to use defaults.">
        <div className="grid gap-4 sm:grid-cols-3">
          <ColorField label="Background" value={profile.bg_color} onSave={(v) => update({ bg_color: v }).catch(() => toast.error("Save failed"))} />
          <ColorField label="Button" value={profile.button_color} onSave={(v) => update({ button_color: v }).catch(() => toast.error("Save failed"))} />
          <ColorField label="Text" value={profile.button_text_color} onSave={(v) => update({ button_text_color: v }).catch(() => toast.error("Save failed"))} />
        </div>
      </Section>

      <Section title="Buttons">
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
                  className="h-7 w-full bg-primary"
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
      </Section>

      <Section title="Font">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {FONT_OPTIONS.map((f) => {
            const active = profile.font_family === f.id;
            return (
              <button key={f.id} type="button"
                onClick={() => update({ font_family: f.id }).catch(() => toast.error("Save failed"))}
                className={`rounded-xl border-2 p-3 text-center transition-all ${f.className} ${active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"}`}>
                <span className="text-base">Aa</span>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{f.name}</p>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Text weight">
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
      </Section>

      <Section title="Background effects">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Background image URL (optional)</Label>
            <Input defaultValue={profile.cover_url} placeholder="https://..."
              onBlur={(e) => e.target.value !== profile.cover_url && update({ cover_url: e.target.value }).catch(() => toast.error("Save failed"))} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Animated gradient</p>
              <p className="text-xs text-muted-foreground">Subtle moving color wash.</p>
            </div>
            <Switch checked={!!profile.bg_animated} onCheckedChange={(v) => update({ bg_animated: v }).catch(() => toast.error("Save failed"))} />
          </div>
        </div>
      </Section>
    </>
  );
}

/* ---------------- Helpers (unchanged) ---------------- */

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
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Photo must be under 2MB"); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${userId}/logo.${ext}`;
      await supabase.storage.from("profile-logos").remove([
        `${userId}/logo.png`, `${userId}/logo.jpg`, `${userId}/logo.jpeg`,
        `${userId}/logo.webp`, `${userId}/logo.svg`, `${userId}/logo.gif`,
      ]);
      const { error } = await supabase.storage.from("profile-logos").upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("profile-logos").getPublicUrl(path);
      onChange(`${data.publicUrl}?v=${Date.now()}`);
      toast.success("Photo uploaded");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally { setUploading(false); }
  };

  const handleRemove = async () => {
    setUploading(true);
    try {
      await supabase.storage.from("profile-logos").remove([
        `${userId}/logo.png`, `${userId}/logo.jpg`, `${userId}/logo.jpeg`,
        `${userId}/logo.webp`, `${userId}/logo.svg`, `${userId}/logo.gif`,
      ]);
      onChange("");
      toast.success("Photo removed");
    } finally { setUploading(false); }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
        {currentUrl ? (
          <img src={currentUrl} alt="Profile preview" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground">No photo</span>
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
        <p className="text-xs text-muted-foreground">PNG, JPG or WebP · max 2MB</p>
      </div>
    </div>
  );
}

function SortableLinks({
  links, clicksByLink, onReorder, onRemove, onTogglePin, onToggleFeatured,
}: {
  links: LinkItem[];
  clicksByLink: Record<string, number>;
  onReorder: (orderedIds: string[]) => Promise<void>;
  onRemove: (id: string) => void;
  onTogglePin: (id: string, v: boolean) => void;
  onToggleFeatured: (id: string, v: boolean) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const ids = links.map((l) => l.id);
  const maxClicks = Math.max(0, ...Object.values(clicksByLink));

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = ids.indexOf(String(active.id));
    const newIdx = ids.indexOf(String(over.id));
    if (oldIdx < 0 || newIdx < 0) return;
    const next = arrayMove(ids, oldIdx, newIdx);
    onReorder(next);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {links.map((link) => (
            <SortableLinkRow
              key={link.id}
              link={link}
              clicks={clicksByLink[link.id] || 0}
              isTop={maxClicks > 0 && (clicksByLink[link.id] || 0) === maxClicks}
              onRemove={onRemove}
              onTogglePin={onTogglePin}
              onToggleFeatured={onToggleFeatured}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableLinkRow({
  link, clicks, isTop, onRemove, onTogglePin, onToggleFeatured,
}: {
  link: LinkItem;
  clicks: number;
  isTop: boolean;
  onRemove: (id: string) => void;
  onTogglePin: (id: string, v: boolean) => void;
  onToggleFeatured: (id: string, v: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-3">
      <button {...attributes} {...listeners} className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing" aria-label="Drag to reorder">
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {link.icon && <span className="text-sm">{link.icon}</span>}
          <p className="truncate text-sm font-medium">{link.title || <span className="italic text-muted-foreground">(untitled)</span>}</p>
          {link.is_pinned && <Pin className="h-3 w-3 text-primary" />}
          {link.is_featured && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />}
          {isTop && <span className="rounded-full bg-yellow-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-yellow-900">Top</span>}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {link.link_type !== "link" && <span className="mr-1.5 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide">{link.link_type.replace("_", " ")}</span>}
          {link.url || <span className="italic">no url</span>}
          {clicks > 0 && <span className="ml-2 text-foreground">· {clicks} click{clicks === 1 ? "" : "s"}</span>}
        </p>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onTogglePin(link.id, !link.is_pinned)} aria-label="Pin">
        <Pin className={`h-4 w-4 ${link.is_pinned ? "fill-primary text-primary" : ""}`} />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onToggleFeatured(link.id, !link.is_featured)} aria-label="Feature">
        <Star className={`h-4 w-4 ${link.is_featured ? "fill-yellow-500 text-yellow-500" : ""}`} />
      </Button>
      <Button asChild variant="ghost" size="icon">
        <Link to="/links/$id" params={{ id: link.id }}><Pencil className="h-4 w-4" /></Link>
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onRemove(link.id)}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </li>
  );
}

const FONT_OPTIONS: { id: FontFamily; name: string; className: string }[] = [
  { id: "inter",    name: "Inter",     className: "" },
  { id: "system",   name: "System",    className: "font-sans" },
  { id: "poppins",  name: "Poppins",   className: "font-poppins" },
  { id: "playfair", name: "Playfair",  className: "font-playfair" },
  { id: "space",    name: "Space",     className: "font-space" },
  { id: "mono",     name: "Mono",      className: "font-mono-display" },
];

const SOCIAL_KEYS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "yourhandle" },
  { key: "tiktok",    label: "TikTok",    placeholder: "yourhandle" },
  { key: "youtube",   label: "YouTube",   placeholder: "@yourchannel" },
  { key: "x",         label: "X",         placeholder: "yourhandle" },
  { key: "facebook",  label: "Facebook",  placeholder: "yourpage" },
  { key: "linkedin",  label: "LinkedIn",  placeholder: "yourname" },
  { key: "spotify",   label: "Spotify",   placeholder: "spotify-id" },
  { key: "website",   label: "Website",   placeholder: "yoursite.com" },
  { key: "email",     label: "Email",     placeholder: "you@email.com" },
];
