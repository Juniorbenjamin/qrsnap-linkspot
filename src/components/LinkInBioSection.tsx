import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BadgeCheck,
  Instagram,
  Youtube,
  Music2,
  BarChart3,
  QrCode,
  Globe,
  CreditCard,
  Calendar,
  Video,
  Music,
  ShoppingBag,
  Mail,
  Palette,
  Share2,
  Sparkles,
  Link2,
} from "lucide-react";

/**
 * Premium Link-in-Bio landing section.
 * Apple-style, glassmorphism, soft blue gradients, mobile-first, dark-mode friendly.
 */
export function LinkInBioSection() {
  return (
    <section
      aria-labelledby="link-in-bio-heading"
      className="relative overflow-hidden border-y border-border/60"
    >
      {/* Soft animated gradient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 opacity-40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-accent/30 opacity-30 blur-3xl" />
      </div>

      {/* HERO */}
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start text-left animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Link in Bio — new
          </span>
          <h2
            id="link-in-bio-heading"
            className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          >
            One Link. <span className="text-gradient-brand">All Your Content.</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground sm:text-xl">
            Share your socials, videos, store, booking links, website, and QR code from one
            beautiful page.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="brand" size="xl" className="shadow-glow">
              <Link to="/signup">
                Create Your Page Free <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/qr-code">See an example</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Free forever • No credit card • Yours in 60 seconds
          </p>
        </div>

        {/* PHONE MOCKUP */}
        <div className="relative mx-auto w-full max-w-sm animate-fade-in">
          <PhoneMockup />
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h3>
          <p className="mt-3 text-muted-foreground">
            Three simple steps to your premium link page.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              Icon: Link2,
              title: "Create your page",
              desc: "Add links, profile image, and connect your socials in seconds.",
            },
            {
              n: "02",
              Icon: Palette,
              title: "Customize your brand",
              desc: "Pick themes, colors, fonts and layouts that match your vibe.",
            },
            {
              n: "03",
              Icon: Share2,
              title: "Share everywhere",
              desc: "Share via QR code, social bios, and watch analytics roll in.",
            },
          ].map(({ n, Icon, title, desc }) => (
            <div
              key={n}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-7 shadow-soft backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="absolute -right-6 -top-6 text-7xl font-bold text-primary/10">
                {n}
              </div>
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-semibold">{title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURE GRID */}
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything in <span className="text-gradient-brand">one page</span>
          </h3>
          <p className="mt-3 text-muted-foreground">
            Built for creators, local businesses and modern brands.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { Icon: QrCode, title: "QR Codes", desc: "Branded codes that scan to your page." },
            { Icon: BarChart3, title: "Analytics", desc: "Real-time clicks, scans and devices." },
            { Icon: Globe, title: "Custom Domains", desc: "Use your own .com — fully SSL secured." },
            { Icon: CreditCard, title: "Payment Links", desc: "Accept payments and tips on any link." },
            { Icon: Calendar, title: "Booking Links", desc: "Calendly, Cal.com and direct booking." },
            { Icon: Video, title: "Video Embeds", desc: "Embed YouTube, TikTok and Reels inline." },
            { Icon: Music, title: "Music Embeds", desc: "Spotify, Apple Music and SoundCloud." },
            { Icon: ShoppingBag, title: "Product Showcase", desc: "Highlight products with rich cards." },
            { Icon: Mail, title: "Contact Forms", desc: "Capture leads, emails and inquiries." },
          ].map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border/60 bg-card/60 p-5 shadow-soft backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-gradient-brand group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="text-base font-semibold">{title}</h4>
              <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild variant="brand" size="xl" className="shadow-glow">
            <Link to="/signup">
              Create Your Page Free <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto aspect-[9/19] w-[300px] sm:w-[340px]">
      {/* Glow */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-[3rem] bg-gradient-brand opacity-30 blur-3xl"
      />
      {/* Device */}
      <div className="relative h-full w-full rounded-[2.75rem] border border-border/80 bg-foreground/90 p-3 shadow-elevated">
        <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] bg-gradient-to-b from-primary/20 via-background to-background">
          {/* Notch */}
          <div className="absolute left-1/2 top-2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-foreground/90" />

          {/* Page content */}
          <div className="flex h-full flex-col items-center px-5 pt-12">
            {/* Profile */}
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand text-2xl font-bold text-primary-foreground shadow-glow ring-4 ring-background">
                AM
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-base font-semibold">@alex.morgan</span>
              <BadgeCheck className="h-4 w-4 fill-primary text-primary-foreground" />
            </div>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              Creator • Designer • NYC ✨
            </p>

            {/* Social icons */}
            <div className="mt-3 flex items-center gap-2">
              {[Instagram, Music2, Youtube].map((I, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/70 text-foreground backdrop-blur"
                >
                  <I className="h-3.5 w-3.5" />
                </div>
              ))}
            </div>

            {/* Link cards */}
            <div className="mt-5 w-full space-y-2.5">
              {[
                { t: "🎬 Latest YouTube video" },
                { t: "🛍 Shop my store" },
                { t: "📅 Book a 1:1 call" },
              ].map((l, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-xs font-medium shadow-soft backdrop-blur"
                >
                  <span>{l.t}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              ))}
            </div>

            {/* Mini analytics + QR row */}
            <div className="mt-3 grid w-full grid-cols-5 gap-2">
              <div className="col-span-3 rounded-2xl border border-border/60 bg-card/80 p-2.5 shadow-soft backdrop-blur">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                  <BarChart3 className="h-3 w-3 text-primary" /> This week
                </div>
                <div className="mt-1 text-sm font-bold">12,480</div>
                <div className="mt-1.5 flex items-end gap-0.5">
                  {[30, 50, 35, 70, 55, 85, 65].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-1.5 flex-1 rounded-sm bg-gradient-brand"
                    />
                  ))}
                </div>
              </div>
              <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/80 p-2 shadow-soft backdrop-blur">
                <div
                  aria-hidden
                  className="grid h-10 w-10 grid-cols-5 grid-rows-5 gap-[1px] rounded-[4px] bg-foreground p-[2px]"
                >
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-[1px] ${
                        [0, 2, 3, 5, 7, 8, 11, 12, 14, 15, 17, 19, 20, 22, 24].includes(i)
                          ? "bg-background"
                          : "bg-foreground"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-1 text-[10px] font-medium text-muted-foreground">
                  Scan me
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
