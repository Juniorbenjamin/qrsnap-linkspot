import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRPreview } from "@/components/QRPreview";
import { Plus, Trash2, QrCode, Sparkles, Pencil, Crown, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth, useMyProfile } from "@/lib/store";

const FREE_QR_LIMIT = 2;

export const Route = createFileRoute("/qr-studio")({
  component: QRStudio,
  head: () => ({
    meta: [
      { title: "QR Studio — Create & Customize Personal QR Codes | QRLinkSpot" },
      { name: "description", content: "Create unlimited personal QR codes for any link. Customize colors, add a logo, and download high-res PNGs — all in one place." },
    ],
  }),
});

type CustomQR = {
  id: string;
  label: string;
  url: string;
  fgColor: string;
  bgColor: string;
  logoText: string;
  logoUrl: string;
  size: number;
  createdAt: number;
};

const STORAGE_KEY = "linkspot.custom_qrs.v1";

const PRESETS: { name: string; fg: string; bg: string }[] = [
  { name: "Classic", fg: "#1a1a2e", bg: "#ffffff" },
  { name: "Ocean", fg: "#0c2340", bg: "#e8f4f8" },
  { name: "Sunset", fg: "#e85d3a", bg: "#fff8f3" },
  { name: "Forest", fg: "#1a3c2a", bg: "#f0f7ec" },
  { name: "Royal", fg: "#4f46e5", bg: "#f5f3ff" },
  { name: "Ink", fg: "#000000", bg: "#fbbf24" },
];

function loadAll(): CustomQR[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAll(items: CustomQR[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function newQR(): CustomQR {
  return {
    id: crypto.randomUUID(),
    label: "My QR code",
    url: "https://",
    fgColor: "#1a1a2e",
    bgColor: "#ffffff",
    logoText: "",
    logoUrl: "",
    size: 280,
    createdAt: Date.now(),
  };
}

function QRStudio() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useMyProfile();
  const [items, setItems] = useState<CustomQR[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const all = loadAll();
    setItems(all);
    if (all.length) setActiveId(all[0].id);
  }, []);

  const isPro = !!profile?.is_pro;
  const active = items.find((q) => q.id === activeId) ?? null;
  const atLimit = !isPro && items.length >= FREE_QR_LIMIT;

  const persist = (next: CustomQR[]) => {
    setItems(next);
    saveAll(next);
  };

  const addNew = () => {
    if (atLimit) {
      toast.error(`Free plan is limited to ${FREE_QR_LIMIT} QR codes. Upgrade to Pro for unlimited.`);
      return;
    }
    const q = newQR();
    persist([q, ...items]);
    setActiveId(q.id);
  };

  const update = (patch: Partial<CustomQR>) => {
    if (!active) return;
    persist(items.map((q) => (q.id === active.id ? { ...q, ...patch } : q)));
  };

  const remove = (id: string) => {
    const next = items.filter((q) => q.id !== id);
    persist(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
    toast.success("QR deleted");
  };

  const onLogoUpload = (file: File) => {
    if (!active) return;
    if (file.size > 1024 * 1024) {
      toast.error("Logo must be under 1MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update({ logoUrl: String(reader.result || "") });
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex h-6 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> QR Studio
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Personal QR codes</h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Create unlimited QR codes for any link — websites, menus, WiFi, contact cards. Customize and download.
            </p>
          </div>
          <Button onClick={addNew} variant="brand" size="lg">
            <Plus className="mr-1.5 h-4 w-4" /> New QR code
          </Button>
        </div>

        {items.length === 0 ? (
          <EmptyState onCreate={addNew} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Sidebar list */}
            <aside className="space-y-2">
              <p className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Your QR codes ({items.length})
              </p>
              <ul className="space-y-1.5">
                {items.map((q) => (
                  <li key={q.id}>
                    <button
                      onClick={() => setActiveId(q.id)}
                      className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                        q.id === activeId
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: q.bgColor, color: q.fgColor, border: `1px solid ${q.fgColor}20` }}
                      >
                        <QrCode className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{q.label || "Untitled"}</span>
                        <span className="block truncate text-xs text-muted-foreground">{q.url}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Editor */}
            {active && (
              <section className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-soft">
                    <div className="flex justify-center">
                      <QRPreview
                        value={active.url || "https://example.com"}
                        fgColor={active.fgColor}
                        bgColor={active.bgColor}
                        logoText={active.logoText}
                        logoUrl={active.logoUrl}
                        size={active.size}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="flex items-center gap-1.5 text-base font-semibold">
                        <Pencil className="h-4 w-4 text-muted-foreground" /> Edit QR
                      </h2>
                      <Button variant="ghost" size="sm" onClick={() => remove(active.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="mr-1 h-4 w-4" /> Delete
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        value={active.label}
                        onChange={(e) => update({ label: e.target.value })}
                        placeholder="e.g. Restaurant menu"
                        maxLength={60}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="url">Destination URL</Label>
                      <Input
                        id="url"
                        value={active.url}
                        onChange={(e) => update({ url: e.target.value })}
                        placeholder="https://your-link.com"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <ColorField label="Code color" value={active.fgColor} onChange={(v) => update({ fgColor: v })} />
                      <ColorField label="Background" value={active.bgColor} onChange={(v) => update({ bgColor: v })} />
                    </div>

                    <div>
                      <Label className="mb-2 block">Color preset</Label>
                      <div className="flex flex-wrap gap-2">
                        {PRESETS.map((p) => (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => update({ fgColor: p.fg, bgColor: p.bg })}
                            className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs transition hover:border-primary/40"
                          >
                            <span className="flex h-4 w-4 overflow-hidden rounded-full border border-border">
                              <span style={{ background: p.fg }} className="h-full w-1/2" />
                              <span style={{ background: p.bg }} className="h-full w-1/2" />
                            </span>
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logoText">Center text (optional)</Label>
                      <Input
                        id="logoText"
                        value={active.logoText}
                        onChange={(e) => update({ logoText: e.target.value })}
                        placeholder="e.g. WIFI"
                        maxLength={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logoUpload">Center logo image (optional)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="logoUpload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) onLogoUpload(f);
                          }}
                        />
                        {active.logoUrl && (
                          <Button variant="ghost" size="sm" onClick={() => update({ logoUrl: "" })}>
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="size">Size ({active.size}px)</Label>
                      <input
                        id="size"
                        type="range"
                        min={160}
                        max={480}
                        step={20}
                        value={active.size}
                        onChange={(e) => update({ size: Number(e.target.value) })}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          Looking for the QR for your <span className="font-medium text-foreground">LinkSpot profile</span>?
          {" "}
          <Link to="/qr" className="font-medium text-primary hover:underline">Open profile QR →</Link>
        </div>
      </main>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-md border border-border bg-background"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <QrCode className="h-7 w-7" />
      </div>
      <h2 className="text-lg font-semibold">No QR codes yet</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Create your first personal QR code. Link it to any website, menu, contact card, or WiFi network.
      </p>
      <Button onClick={onCreate} variant="brand" size="lg" className="mt-5">
        <Plus className="mr-1.5 h-4 w-4" /> Create your first QR
      </Button>
    </div>
  );
}
