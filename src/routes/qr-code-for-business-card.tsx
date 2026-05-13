import { createFileRoute } from "@tanstack/react-router";
import { UseCaseLanding, faqJsonLd } from "@/components/UseCaseLanding";

const SITE = "https://qrcodegenerator.life";
const URL = `${SITE}/qr-code-for-business-card`;
const TITLE = "Business Card QR Code — Free vCard Generator | QRLinkSpot";
const DESC = "Add a custom QR code to your business card so contacts save your info, book you, or follow you in one tap. Free, branded, and editable forever.";

const faqs = [
  { q: "What does a QR code on a business card do?", a: "When scanned, it opens your link-in-bio page with all your contact info, social links, booking calendar, and portfolio. Way more useful than a phone number alone." },
  { q: "Can I update the card without reprinting?", a: "Yes. The QR is dynamic — change your phone, email, or links anytime and the printed card keeps working forever." },
  { q: "Does it work with iPhone and Android?", a: "Yes. Both natively scan QR codes from the camera app. No special scanner needed." },
  { q: "Will the QR scan if it's small on the card?", a: "Our QR codes use high error correction, so they remain scannable down to about 0.8 inches (2 cm). We auto-test legibility when you add a logo." },
  { q: "Can I add my logo to the QR?", a: "Yes — and our system automatically verifies it still scans. If your logo is too big, we shrink it to keep the code reliable." },
];

export const Route = createFileRoute("/qr-code-for-business-card")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "qr code business card, vcard qr code, digital business card, qr code for networking, business card qr generator" },
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
      badge="For freelancers & professionals"
      title={<>Make Your Business Card <span className="text-gradient-brand">Actually Memorable</span></>}
      subtitle="Stop losing leads to cards that get lost. One QR = your contact info, calendar, portfolio, and socials — all saved with one tap."
      qrSampleUrl="https://qrcodegenerator.life/u/demo-pro"
      qrSampleLabel="Sample digital business card"
      benefits={[
        { title: "Save contact in one tap", desc: "Scan opens your card and lets people add you to contacts instantly." },
        { title: "All your links, one card", desc: "LinkedIn, calendar, portfolio, WhatsApp — no more cramming on paper." },
        { title: "Editable forever", desc: "Change your phone or email and reprint zero cards. The QR keeps pointing to the latest." },
        { title: "Looks senior", desc: "Modern, branded design that signals you take your work seriously." },
        { title: "Track who scanned", desc: "See which events and contacts actually convert into work." },
        { title: "Add logo & brand color", desc: "Match your QR to your card design with a center logo and custom colors." },
      ]}
      steps={[
        { title: "Build your link page", desc: "Add contact info, calendar, portfolio links — takes 90 seconds." },
        { title: "Generate branded QR", desc: "Pick colors, add your logo, download high-res PNG." },
        { title: "Print on your card", desc: "Send the PNG to your card printer or paste in Canva." },
      ]}
      testimonial={{
        quote: "I added the QR to the back of my card and now every networking event turns into actual booked calls. Best $0 I've ever spent.",
        name: "Daniel M.",
        role: "Freelance designer, NYC",
      }}
      faqs={faqs}
      ctaHref="/signup"
    />
  ),
});
