import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRPreview } from "@/components/QRPreview";
import { ArrowRight, Download, Printer, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/qr-code")({
  component: FreeQRPage,
  head: () => ({
    meta: [
      { title: "Free QR Code Generator — QRLinkSpot" },
      {
        name: "description",
        content:
          "Generate a free QR code for any URL — no signup required. Download as PNG in seconds.",
      },
      { property: "og:title", content: "Free QR Code Generator — QRLinkSpot" },
      {
        property: "og:description",
        content:
          "Paste any link, get a downloadable QR code instantly. No account needed.",
      },
    ],
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

function FreeQRPage() {
  const [url, setUrl] = useState("");
  const trimmed = url.trim();
  const valid = isValidUrl(trimmed);

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
              Paste any link and download your QR code as a PNG. Instant, free, no account needed.
            </p>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Label htmlFor="url" className="text-base font-semibold">
                Your link
              </Label>
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

            <div className="rounded-2xl border border-border bg-gradient-card p-8 shadow-soft">
              <div className="flex justify-center">
                <QRPreview
                  value={valid ? trimmed : "https://qrlinkspot.app"}
                  size={280}
                  showDownload={valid}
                />
              </div>
              {!valid && (
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
