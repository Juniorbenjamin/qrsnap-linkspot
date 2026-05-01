import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { QRPreview } from "@/components/QRPreview";
import { ArrowRight, Check, Palette, BarChart3, Smartphone, Zap, Scissors, Wrench, Camera, UtensilsCrossed, Sparkles, Home as HomeIcon, Briefcase } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "QRLinkSpot — One QR Code. All Your Links." },
      { name: "description", content: "Build a free link-in-bio page and a branded QR code in under 2 minutes. For barbers, restaurants, creators, and freelancers." },
    ],
  }),
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center lg:py-32">
            <div className="flex flex-col items-start gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Launch your QR in under 2 minutes
              </span>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                One QR Code.
                <br />
                <span className="text-gradient-brand">All Your Links.</span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
                The easiest way to share everything about your business with a single scan. Built for barbers, restaurants, creators, and freelancers who want to look professional fast.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="brand" size="xl">
                  <Link to="/qr-code">
                    Get a free QR code <ArrowRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <Link to="/signup">Create Socials Hub</Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Just need a QR for one link? <Link to="/qr-code" className="font-medium text-foreground underline-offset-4 hover:underline">No signup required</Link>.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> No credit card</div>
                <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> Free forever plan</div>
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
              </div>
            </div>
          </div>
        </section>

        {/* AUDIENCE */}
        <section className="border-y border-border/60 bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Loved by 10,000+ small businesses & creators
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

        {/* FEATURES */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything you need to <span className="text-gradient-brand">stand out</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Powerful tools, zero friction. Set it up once, share it everywhere.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { Icon: Zap, title: "Set up in 2 minutes", desc: "Sign up, add your links, done. No design skills needed." },
                { Icon: Palette, title: "Custom branded QR", desc: "Match your brand colors and add your logo to the QR code." },
                { Icon: Smartphone, title: "Mobile-first pages", desc: "Beautiful link-in-bio pages that look great on every screen." },
                { Icon: BarChart3, title: "Real-time analytics", desc: "See scans, clicks, and which links your audience loves." },
                { Icon: Sparkles, title: "Beautiful themes", desc: "Choose from premium themes that fit your vibe." },
                { Icon: Check, title: "Unlimited links (Pro)", desc: "Add every link, social profile, and contact you have." },
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

        {/* CTA */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-brand p-10 text-center shadow-elevated md:p-16">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
              Ready to share everything with one scan?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/85">
              Join thousands of pros who turned a simple QR code into more bookings, sales, and followers.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/signup">Start free <ArrowRight className="ml-1 h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/pricing">View plans</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
