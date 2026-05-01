import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const SELLER = "Junior Rivas";
const BRAND = "QRLinkSpot";
const EFFECTIVE = "May 1, 2026";

export const Route = createFileRoute("/refund-policy")({
  component: RefundPage,
  head: () => ({
    meta: [
      { title: `Refund Policy — ${BRAND}` },
      { name: "description", content: `${BRAND} offers a 30-day money-back guarantee. Refunds are processed by our payment provider, Paddle.` },
      { property: "og:title", content: `Refund Policy — ${BRAND}` },
      { property: "og:description", content: `30-day money-back guarantee. Refunds processed by Paddle.` },
    ],
  }),
});

function RefundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight">Refund Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: {EFFECTIVE}</p>

          <Section title="30-day money-back guarantee">
            <p>{BRAND}, operated by <strong>{SELLER}</strong>, offers a <strong>30-day money-back guarantee</strong> on paid subscriptions. If you are not satisfied with your purchase, you may request a full refund within <strong>30 days</strong> of your initial order date.</p>
          </Section>

          <Section title="How to request a refund">
            <p>Refunds are processed by our payment provider, <strong>Paddle</strong>, who acts as the Merchant of Record for all {BRAND} purchases.</p>
            <p>To request a refund:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Visit <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-primary underline">paddle.net</a> and look up your order using the email address you used at checkout, or</li>
              <li>Contact {SELLER} through your {BRAND} account and we will help you submit the request to Paddle.</li>
            </ul>
            <p>Approved refunds are returned to your original payment method. Processing times depend on your bank or card issuer.</p>
          </Section>

          <Section title="Subscription renewals and cancellations">
            <p>Paid subscriptions renew automatically. You can cancel your subscription at any time from the “Manage subscription” area in your dashboard, which opens the secure Paddle billing portal. After cancellation, you will keep access to paid features until the end of your current billing period; you will not be charged again.</p>
            <p>If a renewal is charged unintentionally, contact us within the 30-day window above and we will assist with a refund through Paddle where eligible.</p>
          </Section>

          <Section title="Chargebacks">
            <p>Please contact us before initiating a chargeback. Most issues can be resolved quickly with a refund through Paddle.</p>
          </Section>

          <Section title="More information">
            <p>You can also review the Paddle <a href="https://www.paddle.com/legal/refund-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Refund Policy</a>. For our pricing and what's included on each plan, see our <Link to="/pricing" className="text-primary underline">Pricing page</Link>.</p>
          </Section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 space-y-3 text-muted-foreground leading-relaxed">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
