import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StyledQR, type DotStyle, type EyeStyle } from "@/components/StyledQR";
import { ArrowRight, Download, Printer, Sparkles, Upload, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export const Route = createFileRoute("/qr-code")({
  component: FreeQRPage,
  head: () => ({
    meta: [
      { title: "Free QR Code Generator — Make a QR Code in Seconds | QRLinkSpot" },
      {
        name: "description",
        content:
          "Free online QR code generator. Paste any URL and download a high-resolution PNG QR code instantly — no signup, no watermark, no credit card. Works for websites, Instagram, menus, WiFi, and business cards.",
      },
      {
        name: "keywords",
        content:
          "free qr code generator, qr code maker, create qr code, qr code online, qr generator no signup, download qr code png, qr code for url, qr code for instagram, qr code for menu, qr code for business card",
      },
      { property: "og:title", content: "Free QR Code Generator — Make a QR Code in Seconds" },
      {
        property: "og:description",
        content: "Paste any link, get a downloadable PNG QR code instantly. 100% free, no account needed.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://qrcodegenerator.life/qr-code" },
      { name: "twitter:title", content: "Free QR Code Generator — QRLinkSpot" },
      { name: "twitter:description", content: "Paste any link, get a downloadable PNG QR code instantly." },
    ],
    links: [{ rel: "canonical", href: "https://qrcodegenerator.life/qr-code" }],
  }),

});

function isValidUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

type Preset = {
  id: string;
  name: string;
  fg: string;
  bg: string;
  frame: "none" | "scan" | "rounded" | "dotted";
  accent?: string;
  gradient?: { from: string; to: string; angle?: number };
};

const PRESETS: Preset[] = [
  { id: "midnight", name: "Midnight", fg: "#0F172A", bg: "#FFFFFF", frame: "rounded" },
  { id: "ocean", name: "Ocean", fg: "#0E7490", bg: "#ECFEFF", frame: "scan", accent: "#0E7490", gradient: { from: "#0EA5E9", to: "#0E7490", angle: 135 } },
  { id: "sunset", name: "Sunset", fg: "#9A3412", bg: "#FFF7ED", frame: "scan", accent: "#EA580C", gradient: { from: "#F59E0B", to: "#DC2626", angle: 135 } },
  { id: "forest", name: "Forest", fg: "#14532D", bg: "#F0FDF4", frame: "rounded" },
  { id: "berry", name: "Berry", fg: "#581C87", bg: "#FAF5FF", frame: "dotted", accent: "#7E22CE", gradient: { from: "#A855F7", to: "#581C87", angle: 135 } },
  { id: "rose", name: "Rose", fg: "#9F1239", bg: "#FFF1F2", frame: "scan", accent: "#E11D48", gradient: { from: "#FB7185", to: "#9F1239", angle: 135 } },
  { id: "mono", name: "Mono", fg: "#000000", bg: "#FFFFFF", frame: "none" },
  { id: "ink", name: "Ink", fg: "#1E293B", bg: "#F8FAFC", frame: "dotted", accent: "#334155" },
];

const DOT_STYLES: { id: DotStyle; name: string }[] = [
  { id: "square", name: "Square" },
  { id: "rounded", name: "Rounded" },
  { id: "dots", name: "Dots" },
  { id: "classy", name: "Classy" },
  { id: "diamond", name: "Diamond" },
];

const EYE_STYLES: { id: EyeStyle; name: string }[] = [
  { id: "square", name: "Square" },
  { id: "rounded", name: "Rounded" },
  { id: "circle", name: "Circle" },
  { id: "leaf", name: "Leaf" },
];

function FreeQRPage() {
  const [url, setUrl] = useState("");
  const [preset, setPreset] = useState<Preset>(PRESETS[0]);
  const [caption, setCaption] = useState("SCAN ME");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number>(0.20);
  const [logoPad, setLogoPad] = useState<number>(8);
  const [dotStyle, setDotStyle] = useState<DotStyle>("rounded");
  const [eyeStyle, setEyeStyle] = useState<EyeStyle>("rounded");
  const [useGradient, setUseGradient] = useState<boolean>(true);
  const trimmed = url.trim();
  const valid = isValidUrl(trimmed);
  const qrWrapRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCanvas = () =>
    qrWrapRef.current?.querySelector("canvas") as HTMLCanvasElement | null;

  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const renderDesignToCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const src = getCanvas();
    if (!src) return null;
    const PAD = 80;
    const HEADER = preset.frame !== "none" ? 70 : 0;
    const FOOTER = preset.frame !== "none" && caption ? 90 : 0;
    const w = src.width + PAD * 2;
    const h = src.height + PAD * 2 + HEADER + FOOTER;
    const out = document.createElement("canvas");
    out.width = w;
    out.height = h;
    const ctx = out.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = preset.bg;
    roundRect(ctx, 0, 0, w, h, 48);
    ctx.fill();

    const accent = preset.accent || preset.fg;
    if (preset.frame === "rounded") {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 8;
      roundRect(ctx, 16, 16, w - 32, h - 32, 36);
      ctx.stroke();
    } else if (preset.frame === "dotted") {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 6;
      ctx.setLineDash([2, 14]);
      ctx.lineCap = "round";
      roundRect(ctx, 20, 20, w - 40, h - 40, 32);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (preset.frame === "scan") {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      const L = 60;
      const m = 24;
      const corners: Array<[number, number, number, number]> = [
        [m, m, 1, 1],
        [w - m, m, -1, 1],
        [m, h - m, 1, -1],
        [w - m, h - m, -1, -1],
      ];
      corners.forEach(([x, y, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(x, y + dy * L);
        ctx.lineTo(x, y);
        ctx.lineTo(x + dx * L, y);
        ctx.stroke();
      });
    }

    if (HEADER > 0) {
      ctx.fillStyle = preset.fg;
      ctx.font = "600 26px ui-sans-serif, system-ui, -apple-system";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("QRLinkSpot", w / 2, PAD + 6);
    }

    ctx.drawImage(src, PAD, PAD + HEADER);

    // Draw padding ring + crisp logo on top of the embedded logo for cleaner output
    if (logoUrl) {
      const qrSize = src.width;
      const logoPx = Math.round(qrSize * logoSize);
      const ringPx = logoPx + logoPad * 2;
      const cx = PAD + qrSize / 2;
      const cy = PAD + HEADER + qrSize / 2;
      ctx.fillStyle = preset.bg;
      const rx = cx - ringPx / 2;
      const ry = cy - ringPx / 2;
      roundRect(ctx, rx, ry, ringPx, ringPx, 12);
      ctx.fill();
      try {
        const img = await loadImg(logoUrl);
        ctx.drawImage(img, cx - logoPx / 2, cy - logoPx / 2, logoPx, logoPx);
      } catch {
        /* ignore */
      }
    }

    if (FOOTER > 0 && caption) {
      const cy = PAD + HEADER + src.height + FOOTER / 2 + 4;
      ctx.fillStyle = accent;
      ctx.font = "800 32px ui-sans-serif, system-ui, -apple-system";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(caption.toUpperCase(), w / 2, cy);
    }

    return out;
  };

  const handleDownload = async () => {
    const out = await renderDesignToCanvas();
    if (!out) return;
    try {
      const dataUrl = out.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "qrlinkspot-qr.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("QR code downloaded");
    } catch {
      toast.error("Could not download QR code");
    }
  };

  const handlePrint = async () => {
    const out = await renderDesignToCanvas();
    if (!out) return;
    const dataUrl = out.toDataURL("image/png");
    const w = window.open("", "_blank", "width=600,height=700");
    if (!w) {
      toast.error("Pop-up blocked — allow pop-ups to print");
      return;
    }
    const safeUrl = trimmed.replace(/[<>&"']/g, (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c]!),
    );
    w.document.write(`<!doctype html><html><head><title>Print QR code</title>
      <style>
        body { margin:0; display:flex; align-items:center; justify-content:center; min-height:100vh; font-family: system-ui, sans-serif; }
        .wrap { text-align:center; padding:24px; }
        img { width: 360px; height: auto; image-rendering: pixelated; }
        p { margin-top:16px; font-size:12px; color:#555; word-break:break-all; }
      </style></head><body>
      <div class="wrap">
        <img src="${dataUrl}" alt="QR code" />
        <p>${safeUrl}</p>
      </div>
      <script>window.onload = () => { setTimeout(() => { window.print(); }, 150); };</script>
      </body></html>`);
    w.document.close();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 md:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> No signup required
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Free <span className="text-gradient-brand">QR Code</span> Generator
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Paste any link, pick a design, and download a beautiful QR code as a PNG. Instant, free, no account needed.
            </p>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Label htmlFor="url" className="text-base font-semibold">Your link</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter the full URL (must start with http:// or https://).
              </p>
              <Input
                id="url"
                type="url"
                inputMode="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-4"
              />
              {trimmed && !valid && (
                <p className="mt-2 text-sm text-destructive">
                  Please enter a valid URL starting with http:// or https://
                </p>
              )}

              <div className="mt-6">
                <Label className="text-base font-semibold">Design</Label>
                <p className="mt-1 text-sm text-muted-foreground">Pick a style — frame and colors update instantly.</p>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {PRESETS.map((p) => {
                    const active = preset.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPreset(p)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 transition ${active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-foreground/30"}`}
                        aria-label={p.name}
                      >
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{ background: p.bg, border: `1px solid ${p.fg}20` }}
                        >
                          <span className="h-5 w-5 rounded-sm" style={{ background: p.fg }} />
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="caption" className="text-base font-semibold">Caption</Label>
                <p className="mt-1 text-sm text-muted-foreground">Short text below the QR (or leave empty).</p>
                <Input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value.slice(0, 18))}
                  placeholder="SCAN ME"
                  className="mt-3"
                />
              </div>

              <div className="mt-6">
                <Label className="text-base font-semibold">Logo</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload your logo to embed it in the center. PNG with transparent background works best.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleLogoUpload(f);
                    e.target.value = "";
                  }}
                />
                {!logoUrl ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload logo
                  </Button>
                ) : (
                  <div className="mt-3 space-y-4">
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
                      <img src={logoUrl} alt="Logo preview" className="h-12 w-12 rounded-md object-contain bg-white" />
                      <div className="flex-1 text-sm text-muted-foreground">Logo embedded in QR</div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>Replace</Button>
                      <Button type="button" variant="ghost" size="icon" onClick={() => setLogoUrl(null)} aria-label="Remove logo">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <Label className="text-sm font-medium">Logo size</Label>
                        <span className="text-xs text-muted-foreground">{Math.round(logoSize * 100)}%</span>
                      </div>
                      <Slider value={[logoSize * 100]} min={8} max={30} step={1} onValueChange={(v) => setLogoSize(v[0] / 100)} />
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Larger logos can break scanability — test before printing.
                      </p>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <Label className="text-sm font-medium">Logo padding</Label>
                        <span className="text-xs text-muted-foreground">{logoPad}px</span>
                      </div>
                      <Slider value={[logoPad]} min={0} max={24} step={1} onValueChange={(v) => setLogoPad(v[0])} />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="text-sm font-medium">Want more?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create a free link-in-bio page with all your socials, custom colors, a
                  logo in your QR, and scan analytics.
                </p>
                <Button asChild variant="brand" size="sm" className="mt-3">
                  <Link to="/signup">
                    Create your Socials Hub <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <div
                className="rounded-3xl border border-border p-8 shadow-soft transition-colors"
                style={{ background: preset.bg }}
              >
                <DesignFrame preset={preset} caption={caption}>
                  <div ref={qrWrapRef}>
                    <QRPreview
                      value={valid ? trimmed : "https://qrlinkspot.app"}
                      size={260}
                      fgColor={preset.fg}
                      bgColor={preset.bg}
                      logoUrl={logoUrl ?? undefined}
                      logoSizeRatio={logoUrl ? logoSize : undefined}
                      logoPadding={logoPad}
                      showDownload={false}
                    />
                  </div>
                </DesignFrame>
              </div>
              {valid ? (
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Button onClick={handleDownload} variant="brand" size="lg" className="sm:min-w-[180px]">
                    <Download className="mr-2 h-5 w-5" /> Download PNG
                  </Button>
                  <Button onClick={handlePrint} variant="outline" size="lg">
                    <Printer className="mr-2 h-5 w-5" /> Print
                  </Button>
                </div>
              ) : (
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Your QR code will appear here once you enter a valid URL.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function DesignFrame({
  preset,
  caption,
  children,
}: {
  preset: Preset;
  caption: string;
  children: React.ReactNode;
}) {
  const accent = preset.accent || preset.fg;
  const frameStyle: React.CSSProperties =
    preset.frame === "rounded"
      ? { border: `3px solid ${accent}`, borderRadius: 24 }
      : preset.frame === "dotted"
        ? { border: `3px dashed ${accent}`, borderRadius: 24 }
        : {};

  return (
    <div className="relative mx-auto w-fit p-6" style={frameStyle}>
      {preset.frame === "scan" && <CornerBrackets color={accent} />}
      {preset.frame !== "none" && (
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: preset.fg }}
        >
          QRLinkSpot
        </p>
      )}
      {children}
      {preset.frame !== "none" && caption && (
        <p
          className="mt-3 text-center text-lg font-extrabold uppercase tracking-widest"
          style={{ color: accent }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}

function CornerBrackets({ color }: { color: string }) {
  const base = "absolute h-6 w-6";
  return (
    <span style={{ color }}>
      <span className={`${base} left-0 top-0 border-l-4 border-t-4 rounded-tl-md`} style={{ borderColor: color }} />
      <span className={`${base} right-0 top-0 border-r-4 border-t-4 rounded-tr-md`} style={{ borderColor: color }} />
      <span className={`${base} bottom-0 left-0 border-b-4 border-l-4 rounded-bl-md`} style={{ borderColor: color }} />
      <span className={`${base} bottom-0 right-0 border-b-4 border-r-4 rounded-br-md`} style={{ borderColor: color }} />
    </span>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
