import { createFileRoute } from "@tanstack/react-router";
import { UseCaseLanding, faqJsonLd } from "@/components/UseCaseLanding";

const SITE = "https://qrcodegenerator.life";
const URL = `${SITE}/qr-code-for-wifi`;
const TITLE = "WiFi QR Code Generator — Share WiFi in One Scan (Free) | QRLinkSpot";
const DESC = "Create a free WiFi QR code so guests connect in one tap — no typing passwords. Perfect for cafés, AirBnBs, salons, and offices. Fully branded.";

const faqs = [
  { q: "How does a WiFi QR code work?", a: "Guests scan with their phone camera and tap 'Join network'. The phone connects automatically using the encoded SSID and password — no typing." },
  { q: "Is sharing WiFi via QR safe?", a: "Yes. The QR encodes your guest network credentials. We recommend using a guest WiFi network (separate from your private one) for best security." },
  { q: "What types of WiFi security are supported?", a: "WPA, WPA2, WPA3, and open networks. We recommend at least WPA2." },
  { q: "Will it work on iPhone and Android?", a: "Yes. iOS 11+ and modern Android phones handle WiFi QR codes natively from the camera app." },
  { q: "Can I rebrand the QR with my logo?", a: "Yes. Add your logo and brand colors so the QR matches your café, hotel, or salon decor." },
];

export const Route = createFileRoute("/qr-code-for-wifi")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "wifi qr code, wifi qr generator, share wifi password qr, qr code for guest wifi, wifi qr code free" },
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
      badge="For cafés, hotels & offices"
      title={<>Share Your WiFi in <span className="text-gradient-brand">One Scan</span></>}
      subtitle="Stop spelling out 'CapitalP-zero-passw0rd' to every guest. One QR connects them automatically — no typing, no awkwardness."
      qrSampleUrl="https://qrcodegenerator.life/u/demo-wifi"
      qrSampleLabel="Sample WiFi access QR"
      benefits={[
        { title: "One-tap connect", desc: "Guests scan, tap join, online. Zero typing of long passwords." },
        { title: "Looks polished", desc: "Branded QR with your logo on a printable card — way better than handwritten signs." },
        { title: "Update password anytime", desc: "Change credentials and regenerate — same printed card stays useful (when paired with a link page)." },
        { title: "Safer than shouting it out", desc: "Use a guest network and rotate the password without disturbing guests." },
        { title: "Print-ready files", desc: "High-res PNG ready for table tents, room cards, or posters." },
        { title: "Works everywhere", desc: "iPhone, Android, modern laptops — all support WiFi QR scanning natively." },
      ]}
      steps={[
        { title: "Enter network details", desc: "Add your SSID, password, and security type (WPA/WPA2)." },
        { title: "Brand the QR", desc: "Drop in your logo and pick colors that match your venue." },
        { title: "Print & display", desc: "Place on tables, reception, or guest rooms. Done." },
      ]}
      testimonial={{
        quote: "We put a WiFi QR on every table. Customers love it, staff stopped getting interrupted with password questions all day.",
        name: "Marco T.",
        role: "Café owner, Brooklyn",
      }}
      faqs={faqs}
      ctaHref="/qr-code"
    />
  ),
});
