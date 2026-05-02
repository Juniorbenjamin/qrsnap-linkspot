import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { QRPreview } from "@/components/QRPreview";
import { ArrowRight, Check, Star, Shield, Zap, Clock } from "lucide-react";

export type UseCaseFAQ = { q: string; a: string };

export interface UseCaseLandingProps {
  badge: string;
  title: React.ReactNode;
  subtitle: string;
  qrSampleUrl: string;
  qrSampleLabel: string;
  benefits: { title: string; desc: string }[];
  steps: { title: string; desc: string }[];
  testimonial: { quote: string; name: string; role: string };
  faqs: UseCaseFAQ[];
  ctaHref: "/qr-code" | "/signup";
}

export function UseCaseLanding(p: UseCaseLandingProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
            <div className="flex flex-col items-start gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
                {p.badge}
              </span>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {p.title}
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">{p.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="brand" size="xl" className="shadow-glow">
                  <Link to={p.ctaHref}>
                    Create my free QR <ArrowRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <Link to="/pricing">See pricing</Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> No credit card</div>
                <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> Free forever plan</div>
                <div className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-warning text-warning" /> 4.9/5 (2,140 reviews)</div>
              </div>
            </div>

            <div className="relative mx-auto flex items-center justify-center">
              <div className="absolute -inset-8 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
              <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-border bg-card/80 p-8 shadow-elevated backdrop-blur-xl">
                <QRPreview value={p.qrSampleUrl} size={200} showDownload={false} />
                <p className="text-sm font-medium text-muted-foreground">{p.qrSampleLabel}</p>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why thousands choose <span className="text-gradient-brand">QRLinkSpot</span>
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {p.benefits.map((b) => (
                <div key={b.title} className="rounded-2xl border border-border bg-gradient-card p-6 shadow-soft">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                    <Check className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW */}
        <section className="border-y border-border/60 bg-muted/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
              <p className="mt-3 text-muted-foreground">Three steps. Ninety seconds. Done.</p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {p.steps.map((s, i) => (
                <div key={s.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-lg font-bold text-primary-foreground shadow-glow">
                      {i + 1}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                      <Clock className="h-3 w-3" /> 30 sec
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="mb-3 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-warning text-warning" />
              ))}
            </div>
            <p className="text-xl italic text-foreground sm:text-2xl">"{p.testimonial.quote}"</p>
            <p className="mt-4 text-sm font-semibold">{p.testimonial.name}</p>
            <p className="text-xs text-muted-foreground">{p.testimonial.role}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-y border-border/60 bg-muted/30 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mt-10 space-y-4">
              {p.faqs.map((f) => (
                <details key={f.q} className="group rounded-xl border border-border bg-card p-5 shadow-soft">
                  <summary className="cursor-pointer list-none text-base font-semibold">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready in <span className="text-gradient-brand">90 seconds</span>
            </h2>
            <p className="mt-3 text-muted-foreground">Start free. No credit card. No watermark.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="brand" size="xl" className="shadow-glow">
                <Link to={p.ctaHref}>
                  Create my free QR <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> SSL secured</span>
              <span className="inline-flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> 99.9% uptime</span>
              <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-success" /> GDPR ready</span>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function faqJsonLd(faqs: UseCaseFAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
