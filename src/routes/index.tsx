import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { QRPreview } from "@/components/QRPreview";
import {
  ArrowRight,
  Check,
  Star,
  Zap,
  Scissors,
  Wrench,
  Camera,
  UtensilsCrossed,
  Sparkles,
  Home as HomeIcon,
  Briefcase,
  X,
  TrendingUp,
  Clock,
  Shield,
  Smartphone,
  Palette,
  BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "QRLinkSpot — Turn One QR Into More Customers (Free)" },
      {
        name: "description",
        content:
          "Stop losing customers to bad business cards. Create a free branded QR code + link-in-bio page in 90 seconds. Used by 10,000+ pros to get more bookings, sales & followers.",
      },
      { name: "google-site-verification", content: "z8vNrb60E3ng77luq0kaPpZSsrWZ_2pT7T_zLhMcGsQ" },
    ],
  }),
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* ANNOUNCEMENT BAR */}
        <div className="border-b border-border/60 bg-gradient-brand text-primary-foreground">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium sm:text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              <strong>Limited time:</strong> Free QR + branded link page — no credit card, no signup required
            </span>
          </div>
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
            <div className="flex flex-col items-start gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  427 codes created today
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
                  ))}
                  <span className="ml-1 text-xs font-medium text-muted-foreground">4.9/5 (2,140 reviews)</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Your Business Card Is{" "}
                <span className="text-gradient-brand">Costing You Customers.</span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
                Replace it with one scannable QR code that opens <strong className="text-foreground">your booking page, Instagram, menu, reviews</strong> — everything. Built in 90 seconds. <strong className="text-foreground">100% free</strong> to start.
              </p>

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild variant="brand" size="xl" className="shadow-glow">
                  <Link to="/qr-code">
                    Create my free QR <ArrowRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <Link to="/signup">Build full link page →</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-success" /> No credit card
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-success" /> No signup needed
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-success" /> Ready in 90 seconds
                </div>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="relative mx-auto flex items-center justify-center">
              <div className="absolute -inset-8 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
              <div className="relative flex flex-col items-center gap-6 rounded-3xl border border-border bg-card/80 p-8 shadow-elevated backdrop-blur-xl">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand text-3xl shadow-glow">
                  ✂️
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">Mike's Barber Shop</h3>
                  <p className="text-sm text-muted-foreground">Book your fresh cut today</p>
                </div>
                <div className="flex w-full flex-col gap-2">
                  {["📅 Book Appointment", "📸 Instagram", "📍 Find Us", "⭐ Leave a Review"].map((l) => (
                    <div key={l} className="rounded-xl border border-border bg-background px-4 py-3 text-center text-sm font-medium shadow-soft">
                      {l}
                    </div>
                  ))}
                </div>
                <QRPreview value="https://qrlinkspot.app/mikes-barber" size={140} showDownload={false} />
                <p className="text-xs font-medium text-success">↑ Mike got 38 new bookings this week</p>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF LOGO STRIP */}
        <section className="border-y border-border/60 bg-muted/30 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Trusted by 10,000+ small businesses & creators
            </p>
            <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-7">
              {[
                { Icon: Scissors, label: "Barbers" },
                { Icon: Wrench, label: "Handymen" },
                { Icon: Camera, label: "Creators" },
                { Icon: UtensilsCrossed, label: "Restaurants" },
                { Icon: Sparkles, label: "Cleaners" },
                { Icon: HomeIcon, label: "Realtors" },
                { Icon: Briefcase, label: "Freelancers" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST / SECURITY STRIP */}
        <section className="border-b border-border/60 bg-background py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { Icon: Shield, title: "SSL secured", desc: "Bank-grade encryption on every page and scan." },
                { Icon: Check, title: "GDPR ready", desc: "We never sell your data. Privacy-first analytics." },
                { Icon: Zap, title: "99.9% uptime", desc: "Your QR keeps working — even when you're sleeping." },
                { Icon: Star, title: "4.9/5 rating", desc: "From 2,140+ verified small business reviews." },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASES — internal SEO links */}
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built for <span className="text-gradient-brand">your kind of business</span>
              </h2>
              <p className="mt-3 text-muted-foreground">Free, branded QR codes for every use case.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { to: "/qr-code-for-restaurant", title: "QR Code for Restaurants", desc: "Digital menus, contactless ordering, table tents." },
                { to: "/qr-code-for-business-card", title: "QR for Business Cards", desc: "Your contact info + portfolio in one tap." },
                { to: "/qr-code-for-instagram", title: "QR Code for Instagram", desc: "Grow followers from real-world signage." },
                { to: "/qr-code-for-wifi", title: "WiFi QR Code", desc: "Guests connect with one scan — no typing." },
              ].map((u) => (
                <Link key={u.to} to={u.to} className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated">
                  <h3 className="text-base font-semibold group-hover:text-primary">{u.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{u.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* PROBLEM / AGITATE */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-destructive">
                The painful truth
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Every day you wait, you're <span className="text-destructive">losing money</span>
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-destructive">
                  <X className="h-5 w-5" /> Without QRLinkSpot
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Customers lose your business card in 24 hours",
                    "Your Instagram bio can only fit ONE link",
                    "Potential clients never find your booking page",
                    "You print 500 cards every time your number changes",
                    "No idea which marketing actually works",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-success/30 bg-success/5 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-success">
                  <Check className="h-5 w-5" /> With QRLinkSpot
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "One scan = booking, social, reviews, contact",
                    "Update any link instantly — QR never changes",
                    "Look professional even if you started yesterday",
                    "Print once, use forever",
                    "See exactly which links convert",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="border-y border-border/60 bg-muted/30 py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                From zero to scanning in <span className="text-gradient-brand">90 seconds</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                No design skills. No tech skills. Seriously.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                { step: "1", title: "Drop your links", desc: "Booking, Instagram, menu, reviews — paste them in.", time: "30 sec" },
                { step: "2", title: "Pick your style", desc: "Choose colors and a theme that match your brand.", time: "30 sec" },
                { step: "3", title: "Print & share", desc: "Download your QR. Stick it anywhere. Get scanned.", time: "30 sec" },
              ].map(({ step, title, desc, time }) => (
                <div key={step} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-lg font-bold text-primary-foreground shadow-glow">
                      {step}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                      <Clock className="h-3 w-3" /> {time}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Button asChild variant="brand" size="xl" className="shadow-glow">
                <Link to="/qr-code">
                  Try it free — no signup <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything you need to <span className="text-gradient-brand">stand out</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Powerful tools, zero friction. Set it up once, share it everywhere.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { Icon: Zap, title: "Set up in 90 seconds", desc: "Sign up, add your links, done. No design skills needed." },
                { Icon: Palette, title: "Custom branded QR", desc: "Match your brand colors and add your logo to the QR code." },
                { Icon: Smartphone, title: "Mobile-first pages", desc: "Beautiful link-in-bio pages that look great on every screen." },
                { Icon: BarChart3, title: "Real-time analytics", desc: "See scans, clicks, and which links your audience loves." },
                { Icon: TrendingUp, title: "Convert more visitors", desc: "Built-in CTAs and sticky buttons that turn scans into bookings." },
                { Icon: Shield, title: "Yours forever", desc: "QR never expires, never changes — even when your links do." },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="group rounded-2xl border border-border bg-gradient-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="border-y border-border/60 bg-muted/30 py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Real results from <span className="text-gradient-brand">real businesses</span>
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  quote: "I stuck the QR on my barber chair mirror. Bookings went up 40% in 3 weeks. No exaggeration.",
                  name: "Mike R.",
                  role: "Barber, Miami",
                  emoji: "✂️",
                },
                {
                  quote: "Customers scan the QR on every table and tip directly through it. Game changer for our staff.",
                  name: "Sofia L.",
                  role: "Restaurant owner, Austin",
                  emoji: "🍝",
                },
                {
                  quote: "I had 12 link-in-bio tools before. This one looks 10x better and was free. Done.",
                  name: "Jasmine K.",
                  role: "Content creator, LA",
                  emoji: "📸",
                },
              ].map((t) => (
                <div key={t.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="mb-3 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="flex-1 text-sm text-foreground">"{t.quote}"</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-lg">
                      {t.emoji}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats bar */}
            <div className="mt-14 grid gap-6 rounded-2xl border border-border bg-card p-8 shadow-soft sm:grid-cols-3">
              {[
                { stat: "10,000+", label: "Active businesses" },
                { stat: "2.4M+", label: "QR scans tracked" },
                { stat: "4.9/5", label: "Average rating" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-4xl font-bold text-gradient-brand">{s.stat}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Questions? <span className="text-gradient-brand">Answered.</span>
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { q: "Is it really free?", a: "Yes. The free plan includes unlimited QR scans and a link page — forever. Upgrade only if you want custom branding, analytics, or a custom domain." },
                { q: "Do I need to reprint my QR if I change links?", a: "Never. Update your links anytime — your QR code stays the same and always points to the latest version." },
                { q: "How long does it take?", a: "Most people are scanning their own QR within 90 seconds. No design or tech skills required." },
                { q: "Can I cancel anytime?", a: "Of course. No contracts, no hidden fees. Cancel Pro anytime and keep using the free plan forever." },
              ].map((f) => (
                <details key={f.q} className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-elevated">
                  <summary className="flex cursor-pointer items-center justify-between text-base font-semibold">
                    {f.q}
                    <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-brand p-10 text-center shadow-elevated md:p-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur">
              <Clock className="h-3.5 w-3.5" /> 90 seconds from now
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
              You could have your QR code in your hand.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/85">
              Or you could keep handing out cards that get tossed. Your call.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/qr-code">
                  Create my free QR now <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/pricing">View plans</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-primary-foreground/70">
              No credit card • No signup needed • Free forever plan
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
