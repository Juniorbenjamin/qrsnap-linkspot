import { createFileRoute } from "@tanstack/react-router";
import { UseCaseLanding, faqJsonLd } from "@/components/UseCaseLanding";

const SITE = "https://qrcodegenerator.life";
const URL = `${SITE}/qr-code-for-small-business`;
const TITLE = "QR Code for Small Business — Free Generator with Logo & Tracking | QRLinkSpot";
const DESC = "Free QR code for any small business. One scan opens your phone, website, reviews, social, and offers. Branded, trackable, no app needed.";

const faqs = [
  { q: "How do small businesses use QR codes?", a: "On business cards, receipts, packaging, signs, and shop windows. One scan opens your website, phone, social links, reviews, and current offers." },
  { q: "Is the QR code generator really free?", a: "Yes. Create a branded QR with your logo and download a high-resolution PNG free, with no credit card." },
  { q: "Can I edit the QR after printing?", a: "The QR itself stays the same forever. You edit the page it opens — change links, add offers, update hours anytime." },
  { q: "Will the same QR work on packaging and online?", a: "Yes. Same QR works on packaging, receipts, business cards, your website, and email signatures." },
  { q: "Do I get analytics?", a: "Yes. See total scans, peak hours, devices, and which links get tapped most — included free." },
];

export const Route = createFileRoute("/qr-code-for-small-business")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "qr code for small business, small business qr code generator, qr code for business card, free business qr code, branded qr code" },
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
      badge="For small businesses"
      title={<>QR Code for Your <span className="text-gradient-brand">Small Business</span></>}
      subtitle="One branded QR connects everything: website, phone, reviews, social, offers. Print it once — update what it opens forever."
      qrSampleUrl="https://qrcodegenerator.life/u/demo-business"
      qrSampleLabel="Sample small business QR"
      benefits={[
        { title: "All your links in one scan", desc: "Website, phone, reviews, Instagram, Google Maps — one QR, every channel." },
        { title: "Update anytime, no reprint", desc: "Change offers, hours, or links. The printed QR keeps working forever." },
        { title: "Branded, not generic", desc: "Your logo in the center, your colors — looks professional, not spammy." },
        { title: "Drive Google reviews", desc: "One-tap review link — climb the local 3-pack faster." },
        { title: "Real scan analytics", desc: "Know which sign, card, or window decal brings the most customers." },
        { title: "Free forever plan", desc: "Generate, brand, and download high-res QRs without paying a cent." },
      ]}
      steps={[
        { title: "Build your link page", desc: "Add website, phone, reviews, social, offers — in under 5 minutes." },
        { title: "Brand your QR", desc: "Drop your logo in the center, pick brand colors and styles." },
        { title: "Print everywhere", desc: "Cards, packaging, receipts, windows, signs, email signature." },
      ]}
      testimonial={{
        quote: "Put it on receipts and shop window. Walk-in traffic doubled because people scanned and saw our 5-star reviews instantly.",
        name: "Diana K.",
        role: "Boutique owner, Miami FL",
      }}
      faqs={faqs}
      ctaHref="/qr-code"
    />
  ),
});
