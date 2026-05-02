import { createFileRoute } from "@tanstack/react-router";
import { UseCaseLanding, faqJsonLd } from "@/components/UseCaseLanding";

const SITE = "https://qrcodegenerator.life";
const URL = `${SITE}/qr-code-for-instagram`;
const TITLE = "QR Code for Instagram — Grow Followers Fast (Free) | QRLinkSpot";
const DESC = "Create a free Instagram QR code to grow followers in real life. One scan opens your profile + all your links. Perfect for events, flyers, and storefronts.";

const faqs = [
  { q: "How do I make a QR code for my Instagram profile?", a: "Paste your Instagram URL into our generator, brand it with your colors and logo, and download. Or use our link-in-bio page so the QR opens your profile plus other key links." },
  { q: "Why not just use Instagram's built-in nametag?", a: "Nametags only work inside the Instagram app. Our QR opens in any phone camera and lets you also include TikTok, YouTube, your shop, and more — not just one profile." },
  { q: "Can I track how many people scanned?", a: "Yes. With a free account you see total scans, peak hours, and which links visitors actually tap." },
  { q: "Will my QR keep working if I rebrand?", a: "Yes. The QR is dynamic — change your handle, link, or profile anytime, the printed QR keeps working." },
  { q: "What size should I print it?", a: "For posters and storefronts, 4–6 inches works great. For flyers, 1.5 inches minimum. Our PNG is print-ready up to A3." },
];

export const Route = createFileRoute("/qr-code-for-instagram")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "qr code for instagram, instagram qr generator, grow instagram followers, instagram link qr, qr code for social media" },
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
      badge="For creators & brands"
      title={<>Turn Real-World Eyes Into <span className="text-gradient-brand">Instagram Followers</span></>}
      subtitle="Stop telling people 'just search me on Instagram.' One scan opens your profile and follow button. Perfect for events, flyers, packaging, and storefronts."
      qrSampleUrl="https://qrcodegenerator.life/u/demo-creator"
      qrSampleLabel="Sample creator QR"
      benefits={[
        { title: "Instant follow", desc: "One scan, profile opens, they tap follow. Zero friction." },
        { title: "More than just IG", desc: "Add TikTok, YouTube, your shop, latest drop — all on one page." },
        { title: "Branded to your aesthetic", desc: "Custom colors, your logo, button styles — match your IG vibe." },
        { title: "Track your real-world ROI", desc: "Know which event, flyer, or pop-up actually drove follows." },
        { title: "Editable anytime", desc: "New handle? New link? Update once, every printed QR auto-updates." },
        { title: "Free forever", desc: "No credit card. No watermark. No follower limits." },
      ]}
      steps={[
        { title: "Add your IG + links", desc: "Paste your Instagram, plus any other socials or shops." },
        { title: "Style your QR", desc: "Brand colors, center logo, button shape — make it yours." },
        { title: "Print everywhere", desc: "Stickers, flyers, business cards, event signage. Get scanned." },
      ]}
      testimonial={{
        quote: "I put the QR on my product packaging and gained 4,000 followers in 2 months. Best growth hack of the year.",
        name: "Jasmine K.",
        role: "Content creator, LA",
      }}
      faqs={faqs}
      ctaHref="/qr-code"
    />
  ),
});
