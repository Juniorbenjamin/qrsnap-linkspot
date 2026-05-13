import { createFileRoute } from "@tanstack/react-router";
import { UseCaseLanding, faqJsonLd } from "@/components/UseCaseLanding";

const SITE = "https://qrcodegenerator.life";
const URL = `${SITE}/qr-code-for-restaurant`;
const TITLE = "Restaurant QR Menu Generator — Free with Logo | QRLinkSpot";
const DESC = "Create a free QR code menu for your restaurant in 90 seconds. Add your logo, update the menu anytime without reprinting, and track scans. No app, no signup.";

const faqs = [
  { q: "Is the QR code menu really free?", a: "Yes. You can create a branded QR menu with your logo and download a high-resolution PNG for free, with no credit card required." },
  { q: "Can I update the menu without reprinting the QR?", a: "Absolutely. The QR points to your QRLinkSpot link page, so you can change items, prices, or specials anytime and the same printed QR keeps working." },
  { q: "Will the QR work without WiFi for guests?", a: "Guests need internet to open the link, but QR codes themselves scan offline. Most diners use mobile data. Many restaurants also offer a guest WiFi link on the same page." },
  { q: "How big should I print the QR for tables?", a: "We recommend at least 1.2 inches (3 cm) on table tents and 4+ inches on posters. Our PNG export is high-resolution and works for both." },
  { q: "Can I track how many people scan it?", a: "Yes. Free accounts include scan analytics so you can see peak hours, total scans, and which menu sections get the most clicks." },
];

export const Route = createFileRoute("/qr-code-for-restaurant")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "qr code for restaurant, qr menu, restaurant qr code, digital menu qr, qr code menu free, contactless menu qr" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd(faqs)) }],
  }),
  component: () => (
    <UseCaseLanding
      badge="For restaurants & cafés"
      title={<>QR Code Menu That <span className="text-gradient-brand">Actually Looks Pro</span></>}
      subtitle="Replace plastic-sleeve menus with one branded QR. Update prices and specials in real time. Track which dishes get the most attention."
      qrSampleUrl="https://qrcodegenerator.life/u/demo-restaurant"
      qrSampleLabel="Sample restaurant menu QR"
      benefits={[
        { title: "Update menu live", desc: "Change prices, hide sold-out items, push specials — without reprinting a single sheet." },
        { title: "Branded with your logo", desc: "QR matches your restaurant brand: colors, logo in the center, no generic black squares." },
        { title: "Hygienic & contactless", desc: "Guests scan from their own phone. No shared menus, no sticky pages." },
        { title: "Multilingual menus", desc: "Add menus in multiple languages on one page. Tourists love it." },
        { title: "Real scan analytics", desc: "See peak hours and which menu sections get the most opens — make data-driven decisions." },
        { title: "Works on any phone", desc: "Native camera scanning on iPhone & Android. No app download required." },
      ]}
      steps={[
        { title: "Add your menu link", desc: "Paste your existing online menu or build a free link page in minutes." },
        { title: "Brand your QR", desc: "Drop in your logo, pick your colors, choose a button style." },
        { title: "Print on table tents", desc: "Download a print-ready PNG. Stick it on tables, doors, takeout bags." },
      ]}
      testimonial={{
        quote: "We swapped our laminated menus for a single QR code on every table. Saved us $400/month in printing and we update the menu in seconds.",
        name: "Sofia L.",
        role: "Restaurant owner, Austin TX",
      }}
      faqs={faqs}
      ctaHref="/qr-code"
    />
  ),
});
