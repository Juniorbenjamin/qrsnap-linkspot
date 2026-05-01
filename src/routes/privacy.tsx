import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const SELLER = "Junior Rivas";
const BRAND = "QRLinkSpot";
const EFFECTIVE = "May 1, 2026";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: `Privacy Notice — ${BRAND}` },
      { name: "description", content: `How ${BRAND} (operated by ${SELLER}) collects, uses, and protects your personal data.` },
      { property: "og:title", content: `Privacy Notice — ${BRAND}` },
      { property: "og:description", content: `How ${BRAND} collects, uses, and protects your personal data.` },
    ],
  }),
});

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Notice</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: {EFFECTIVE}</p>

          <Section title="1. Who we are">
            <p>{BRAND} is operated by <strong>{SELLER}</strong> (“we”, “us”, “our”). For all personal data you provide to or that is collected through {BRAND}, {SELLER} acts as the <strong>data controller</strong>.</p>
          </Section>

          <Section title="2. Personal data we collect">
            <p>We collect the following categories of personal data:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Account data</strong>: email address, login credentials, display name, username.</li>
              <li><strong>Profile content</strong>: bio, avatar emoji, links you add, theme and QR customization choices.</li>
              <li><strong>Support communications</strong>: messages you send us.</li>
              <li><strong>Usage and telemetry</strong>: which pages you view, when you log in, basic device and browser information.</li>
              <li><strong>Visitor analytics for your public page</strong>: aggregate counts of page views, QR scans, and link clicks. We do not store visitor IP addresses or build profiles of your visitors.</li>
              <li><strong>Payment-related data</strong>: when you subscribe, our payment provider Paddle collects billing details directly from you. We receive only the information needed to manage your subscription (e.g. customer ID, plan, status, billing period).</li>
            </ul>
          </Section>

          <Section title="3. How we use your data and our legal basis">
            <ul className="ml-6 list-disc space-y-1">
              <li>To create and operate your account and provide the Service — <em>performance of a contract</em>.</li>
              <li>To process subscriptions and manage entitlements — <em>performance of a contract</em>.</li>
              <li>To respond to support requests — <em>performance of a contract / legitimate interests</em>.</li>
              <li>To monitor for abuse, fraud, and security incidents — <em>legitimate interests</em>.</li>
              <li>To improve the Service (analytics, debugging) — <em>legitimate interests</em>.</li>
              <li>To send service-related emails (e.g. billing notifications, account changes) — <em>performance of a contract / legal obligation</em>.</li>
              <li>To send marketing emails, where applicable — <em>consent</em>, which you can withdraw at any time.</li>
            </ul>
          </Section>

          <Section title="4. Who we share data with">
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Paddle.com</strong> — our Merchant of Record. Paddle handles checkout, payments, tax, invoicing, subscription billing, and refund processing on our behalf.</li>
              <li><strong>Hosting and infrastructure providers</strong> that store and serve {BRAND} (database, file storage, edge functions).</li>
              <li><strong>Email and support tooling</strong> used to communicate with you.</li>
              <li><strong>Professional advisers</strong> (legal, accounting), where necessary.</li>
              <li><strong>Authorities</strong>, where required by law or to protect rights, property, or safety.</li>
            </ul>
            <p>We do not sell your personal data.</p>
          </Section>

          <Section title="5. International transfers">
            <p>Your personal data may be processed in countries outside your own, including by our service providers. Where such transfers happen from the UK or EEA, we rely on appropriate safeguards such as Standard Contractual Clauses or adequacy decisions.</p>
          </Section>

          <Section title="6. Data retention">
            <p>We keep your personal data for as long as your account is active and for a reasonable period afterwards to comply with legal, accounting, or reporting obligations. When data is no longer needed, we delete or anonymize it. You can ask us to delete your account at any time.</p>
          </Section>

          <Section title="7. Your rights">
            <p>Depending on your location, you may have the right to:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>access the personal data we hold about you;</li>
              <li>correct inaccurate or incomplete data;</li>
              <li>request deletion of your data;</li>
              <li>restrict or object to certain processing;</li>
              <li>request a portable copy of your data;</li>
              <li>withdraw consent where processing is based on consent;</li>
              <li>lodge a complaint with your local data protection authority.</li>
            </ul>
            <p>To exercise these rights, contact us through your {BRAND} account. We will respond within one month.</p>
          </Section>

          <Section title="8. Security">
            <p>We use appropriate technical and organisational measures to protect your data, including encryption in transit, access controls, and secure authentication. No system is 100% secure, but we work to keep your data safe.</p>
          </Section>

          <Section title="9. Cookies">
            <p>We use a small number of strictly necessary cookies and similar technologies to keep you signed in, remember your preferences, and operate the Service securely. We do not use advertising cookies. Where we use analytics cookies to understand how the Service is used, we do so on the basis of your consent or legitimate interests, depending on your jurisdiction.</p>
          </Section>

          <Section title="10. Children">
            <p>{BRAND} is not directed to children under 13 (or the equivalent minimum age in your country). We do not knowingly collect personal data from children. If you believe a child has provided us data, please contact us so we can remove it.</p>
          </Section>

          <Section title="11. Changes to this notice">
            <p>We may update this Privacy Notice from time to time. The date at the top reflects the latest version. We will notify you of material changes through the Service.</p>
          </Section>

          <Section title="12. Contact">
            <p>For privacy questions, contact {SELLER} through your {BRAND} account. For billing-related data handled by Paddle, see Paddle's <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Privacy Notice</a>. See also our <Link to="/terms" className="text-primary underline">Terms of Service</Link> and <Link to="/refund-policy" className="text-primary underline">Refund Policy</Link>.</p>
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
