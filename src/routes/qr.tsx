import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRPreview } from "@/components/QRPreview";
import { useProfile, themes, type Theme } from "@/lib/store";
import { publicProfileUrl } from "@/lib/public-url";
import { Crown, Lock } from "lucide-react";

export const Route = createFileRoute("/qr")({
  component: QRPage,
  head: () => ({ meta: [{ title: "QR Generator — QRLinkSpot" }] }),
});

function QRPage() {
  const { profile, update } = useProfile();
  // QR codes are printed on flyers, signs, business cards — they need a stable
  // public URL that survives renames and points at the published deployment.
  const publicUrl = publicProfileUrl(profile.username);
  const qrTarget = `${publicUrl}?src=qr`;
  const isPro = profile.isPro;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">QR Code Generator</h1>
          <p className="mt-1 text-muted-foreground">Customize your QR to match your brand.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Preview */}
          <div className="rounded-2xl border border-border bg-gradient-card p-8 shadow-soft">
            <div className="flex justify-center">
              <QRPreview
                value={publicUrl}
                fgColor={isPro ? profile.qrColor : "#1a1a2e"}
                bgColor={isPro ? profile.qrBg : "#ffffff"}
                logoText={isPro ? profile.logoText : ""}
                size={280}
              />
            </div>
            <p className="mt-6 break-all text-center text-sm text-muted-foreground">
              Scans go to <span className="font-medium text-foreground">{publicUrl}</span>
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Customize</h2>
                {!isPro && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    <Crown className="h-3 w-3" /> Pro feature
                  </span>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>QR color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={profile.qrColor}
                      onChange={(e) => update({ qrColor: e.target.value })}
                      disabled={!isPro}
                      className="h-10 w-14 cursor-pointer rounded-md border border-border bg-background disabled:opacity-50"
                    />
                    <Input value={profile.qrColor} onChange={(e) => update({ qrColor: e.target.value })} disabled={!isPro} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Background</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={profile.qrBg}
                      onChange={(e) => update({ qrBg: e.target.value })}
                      disabled={!isPro}
                      className="h-10 w-14 cursor-pointer rounded-md border border-border bg-background disabled:opacity-50"
                    />
                    <Input value={profile.qrBg} onChange={(e) => update({ qrBg: e.target.value })} disabled={!isPro} />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="logo">Logo text (center of QR)</Label>
                  <Input
                    id="logo"
                    placeholder="e.g. MIKE"
                    value={profile.logoText}
                    onChange={(e) => update({ logoText: e.target.value })}
                    disabled={!isPro}
                    maxLength={4}
                  />
                </div>
              </div>

              {!isPro && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Lock className="h-4 w-4 text-primary" />
                    <span>Unlock colors, logo & themes</span>
                  </div>
                  <Button asChild variant="brand" size="sm">
                    <Link to="/pricing">Upgrade</Link>
                  </Button>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Page theme</h2>
                {!isPro && <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"><Crown className="h-3 w-3" /> Pro</span>}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {(Object.keys(themes) as Theme[]).map((key) => {
                  const t = themes[key];
                  const active = profile.theme === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={!isPro && key !== "midnight"}
                      onClick={() => update({ theme: key })}
                      className={`group relative flex h-20 flex-col items-center justify-end overflow-hidden rounded-xl border-2 p-2 text-xs font-medium transition-all disabled:opacity-50 ${
                        active ? "border-primary shadow-glow" : "border-border hover:border-primary/40"
                      }`}
                      style={{ background: t.bg, color: t.text }}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
