import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { useMyProfile } from "@/lib/store";
import { Check, Crown, Sparkles } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  head: () => ({
    meta: [
      { title: "Pricing — QRLinkSpot" },
      { name: "description", content: "Simple pricing. Free forever, or upgrade to Pro for unlimited links, custom QR, and analytics." },
    ],
  }),
});

function Pricing() {
  const { profile, update } = useProfile();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Simple, <span className="text-gradient-brand">honest pricing</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Start free. Upgrade only when you need more.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            <PlanCard
              title="Free"
              price="$0"
              tagline="Perfect to get started"
              features={[
                "Up to 4 links",
                "Basic black & white QR code",
                "1 page theme",
                "Public link-in-bio page",
              ]}
              cta={
                profile.isPro ? (
                  <Button variant="outline" size="lg" className="w-full" onClick={() => update({ isPro: false })}>
                    Switch to Free
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link to="/signup">Get started free</Link>
                  </Button>
                )
              }
            />
            <PlanCard
              title="Pro"
              price="$9"
              priceSub="/month"
              tagline="For serious creators & businesses"
              highlight
              features={[
                "Unlimited links",
                "Custom QR colors",
                "Logo inside your QR",
                "5+ premium themes",
                "Remove QRLinkSpot branding",
                "Scan & click analytics",
                "Priority support",
              ]}
              cta={
                profile.isPro ? (
                  <Button variant="hero" size="lg" className="w-full" disabled>
                    <Check className="mr-2 h-4 w-4" /> You're on Pro
                  </Button>
                ) : (
                  <Button variant="brand" size="lg" className="w-full" onClick={() => update({ isPro: true })}>
                    <Crown className="mr-2 h-4 w-4" /> Upgrade to Pro
                  </Button>
                )
              }
            />
          </div>

          <p className="mx-auto mt-8 max-w-md text-center text-xs text-muted-foreground">
            <Sparkles className="mr-1 inline h-3 w-3" />
            Demo: clicking Upgrade instantly toggles Pro features so you can try them out.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function PlanCard({
  title, price, priceSub, tagline, features, cta, highlight,
}: {
  title: string; price: string; priceSub?: string; tagline: string; features: string[]; cta: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div className={`relative rounded-3xl border p-8 shadow-soft ${highlight ? "border-primary bg-gradient-card shadow-glow" : "border-border bg-card"}`}>
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-brand px-3 py-1 text-xs font-semibold text-primary-foreground shadow-glow">
          Most popular
        </span>
      )}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-5xl font-bold tracking-tight">{price}</span>
        {priceSub && <span className="text-muted-foreground">{priceSub}</span>}
      </div>
      <div className="mt-8">{cta}</div>
      <ul className="mt-8 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${highlight ? "text-primary" : "text-success"}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
