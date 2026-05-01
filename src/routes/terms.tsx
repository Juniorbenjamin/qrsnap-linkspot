import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const SELLER = "Junior Rivas";
const BRAND = "QRLinkSpot";
const EFFECTIVE = "May 1, 2026";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: `Terms of Service — ${BRAND}` },
      { name: "description", content: `Terms governing your use of ${BRAND}, operated by ${SELLER}.` },
      { property: "og:title", content: `Terms of Service — ${BRAND}` },
      { property: "og:description", content: `Terms governing your use of ${BRAND}.` },
    ],
  }),
});

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: {EFFECTIVE}</p>

          <Section title="1. Who we are">
            <p>{BRAND} (the “Service”) is operated by <strong>{SELLER}</strong> (“we”, “us”, “our”). By using the Service you are entering into an agreement with {SELLER}.</p>
          </Section>

          <Section title="2. Acceptance of these Terms">
            <p>By creating an account or otherwise using {BRAND}, you confirm that you have read, understood and agree to be bound by these Terms. If you do not agree, do not use the Service. If you are using the Service on behalf of an organization, you confirm that you have authority to bind that organization. Individual users must be of legal age in their jurisdiction.</p>
          </Section>

          <Section title="3. The Service">
            <p>{BRAND} lets you create a public link-in-bio page and generate QR codes that point to it. We may add, remove, or modify features at any time. We do not guarantee that the Service will be uninterrupted, error-free, or available at any particular time.</p>
          </Section>

          <Section title="4. Your account">
            <p>You are responsible for keeping your login credentials confidential and for all activity under your account. You must provide accurate information and keep it up to date. You must not impersonate any person or organization.</p>
          </Section>

          <Section title="5. Acceptable use">
            <p>You agree not to misuse the Service. In particular, you must not:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>use the Service for any unlawful, fraudulent, deceptive, or abusive purpose;</li>
              <li>send spam, malware, phishing links, or content that infringes another person's rights;</li>
              <li>infringe intellectual property, privacy, or publicity rights of others;</li>
              <li>interfere with or attempt to compromise the security or integrity of the Service (including probing, scanning, scraping, or reverse engineering);</li>
              <li>resell, sublicense, or redistribute the Service without our written consent.</li>
            </ul>
          </Section>

          <Section title="6. Your content">
            <p>You retain ownership of the links, text, images, and other content you add to your {BRAND} page (“User Content”). You grant {SELLER} a worldwide, non-exclusive, royalty-free license to host, store, reproduce, and display your User Content solely so we can provide the Service to you and your visitors. You are responsible for your User Content and confirm you have the rights to share it.</p>
          </Section>

          <Section title="7. Intellectual property">
            <p>The Service, including its software, design, branding, and documentation, is owned by {SELLER} and is protected by intellectual property laws. We grant you a limited, non-exclusive, non-transferable right to use the Service in accordance with these Terms and your selected plan. All rights not expressly granted are reserved.</p>
          </Section>

          <Section title="8. Plans, payments, and billing">
            <p>{BRAND} is offered on a free plan and on paid subscription plans. Pricing is shown on our <Link to="/pricing" className="text-primary underline">Pricing page</Link>. Paid plans renew automatically until canceled.</p>
            <p>Our order process is conducted by our online reseller <strong>Paddle.com</strong>. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns. Payments, billing, taxes, currency conversion, cancellations, and refunds are handled by Paddle in accordance with the Paddle <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className="text-primary underline">Checkout Buyer Terms</a>.</p>
            <p>See our <Link to="/refund-policy" className="text-primary underline">Refund Policy</Link> for refund details.</p>
          </Section>

          <Section title="9. Suspension and termination">
            <p>We may suspend or terminate your access to all or part of the Service at any time, with or without notice, if (a) you materially breach these Terms, (b) payment fails or is not made, (c) we believe your account poses a security or fraud risk, or (d) you repeatedly or seriously violate our acceptable use rules. You may cancel your account at any time. On termination, your right to use the Service ends and we may delete your User Content after a reasonable export window.</p>
          </Section>

          <Section title="10. Disclaimers">
            <p>To the fullest extent permitted by law, the Service is provided “as is” and “as available”, without warranties of any kind, express or implied, including any implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Service will be uninterrupted, secure, or error-free.</p>
          </Section>

          <Section title="11. Limitation of liability">
            <p>To the fullest extent permitted by law, {SELLER}'s total liability for any claim arising out of or relating to the Service is limited to the amounts you paid for the Service in the 12 months preceding the event giving rise to the claim. We are not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, revenue, data, or goodwill. Nothing in these Terms excludes liability that cannot lawfully be excluded (such as for fraud, death, or personal injury caused by negligence).</p>
          </Section>

          <Section title="12. Indemnity">
            <p>You agree to indemnify and hold harmless {SELLER} from any claims arising out of (a) your User Content, (b) your unlawful use of the Service, or (c) your breach of these Terms.</p>
          </Section>

          <Section title="13. Changes to the Service or Terms">
            <p>We may update these Terms from time to time. If we make material changes, we will notify you (for example, by email or in-app notice). Continued use of the Service after changes take effect means you accept the updated Terms.</p>
          </Section>

          <Section title="14. Governing law and disputes">
            <p>These Terms are governed by the laws of the jurisdiction in which {SELLER} is established, without regard to its conflict-of-laws rules. The courts of that jurisdiction will have exclusive authority over any dispute, except where mandatory consumer-protection laws give you the right to bring a claim in your country of residence.</p>
          </Section>

          <Section title="15. Force majeure">
            <p>We are not responsible for any failure to perform caused by events beyond our reasonable control, including acts of God, network failures, or actions of third-party providers.</p>
          </Section>

          <Section title="16. Contact">
            <p>Questions about these Terms? Contact {SELLER} through your {BRAND} account. For billing or refund support, contact Paddle at <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-primary underline">paddle.net</a>.</p>
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
