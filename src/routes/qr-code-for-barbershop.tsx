import { createFileRoute } from "@tanstack/react-router";
import { UseCaseLanding, faqJsonLd } from "@/components/UseCaseLanding";

const SITE = "https://qrcodegenerator.life";
const URL = `${SITE}/qr-code-for-barbershop`;
const TITLE = "Barbershop QR Code — Bookings, Tips & Reviews in One Scan | QRLinkSpot";
const DESC = "Free barbershop QR code for mirrors, business cards, and Instagram. One scan opens booking, tip link, Instagram, and reviews. Loved by barbers worldwide.";

const faqs = [
  { q: "What goes on a barbershop QR code?", a: "Booking link, Instagram, tip link (Cash App / Venmo / Zelle), price list, and a 'Leave a review' button — everything in one tap." },
  { q: "Where should I put it in my shop?", a: "On the mirror at each station, on business cards, on the front door, and on receipts. Many barbers also put it on their Instagram bio." },
  { q: "Can clients tip me through the QR?", a: "Yes. Add Cash App, Venmo, Zelle, or Apple Pay buttons to your link page. Clients tap and tip — no cash needed." },
  { q: "Will it work for my booking app (Booksy, Square, etc.)?", a: "Yes. Add your booking app link as the main button. Clients tap once to book their next cut." },
  { q: "Can I track which clients scan it?", a: "Free analytics show total scans, peak hours, and which links get tapped most so you know what your clients want." },
];

export const Route = createFileRoute("/qr-code-for-barbershop")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "barbershop qr code, qr code for barber, barber business card qr, salon qr code, qr code for tips" },
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
      badge="For barbers & salons"
      title={<>Barbershop QR Code for <span className="text-gradient-brand">Bookings & Tips</span></>}
      subtitle="One QR on the mirror opens booking, Instagram, tips, and reviews. Clients book the next cut before they leave the chair."
      qrSampleUrl="https://qrcodegenerator.life/u/demo-barber"
      qrSampleLabel="Sample barbershop QR"
      benefits={[
        { title: "Book the next cut instantly", desc: "Client scans, taps, and books before standing up — no missed rebookings." },
        { title: "Tips without cash", desc: "Cash App, Venmo, Zelle buttons on one page. More tips, zero awkwardness." },
        { title: "Grow your Instagram", desc: "Direct follow button — every chair turns into a follower funnel." },
        { title: "Get 5-star reviews", desc: "One-tap link to your Google reviews. Watch your local rank climb." },
        { title: "Match your shop's brand", desc: "Your logo, your colors, your style — not generic black squares." },
        { title: "Works on every phone", desc: "Native scan on iPhone & Android. No app, no friction." },
      ]}
      steps={[
        { title: "Add your links", desc: "Booking, Instagram, tip apps, reviews — all in one beautiful page." },
        { title: "Customize your QR", desc: "Logo in the center, colors that match your shop." },
        { title: "Stick it on the mirror", desc: "Download and print. Done in 90 seconds." },
      ]}
      testimonial={{
        quote: "Tips went up 40% in the first month. Half my clients didn't carry cash — now they tap and tip from their phone.",
        name: "Jay D.",
        role: "Barber, Brooklyn NY",
      }}
      faqs={faqs}
      ctaHref="/qr-code"
    />
  ),
});
