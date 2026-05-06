import { createFileRoute } from "@tanstack/react-router";
import { UseCaseLanding, faqJsonLd } from "@/components/UseCaseLanding";

const SITE = "https://qrcodegenerator.life";
const URL = `${SITE}/qr-code-for-real-estate`;
const TITLE = "Real Estate QR Code — For Yard Signs, Listings & Open Houses | QRLinkSpot";
const DESC = "Free real estate QR code for yard signs, flyers, and open houses. One scan opens listing photos, virtual tour, and your contact info. Capture every lead.";

const faqs = [
  { q: "Why do realtors use QR codes on yard signs?", a: "Drive-by buyers scan the QR to instantly see photos, price, virtual tour, and contact you — without typing a URL or calling during off hours." },
  { q: "Can each listing have its own QR?", a: "Yes. Create a unique QR per property. Each one opens that listing's photos, tour, and contact form." },
  { q: "Do I get a lead notification when someone scans?", a: "You see real-time scan analytics and any contact form submissions go straight to your email." },
  { q: "Will the QR work after the listing sells?", a: "Yes. You can redirect the same QR to a 'Just Sold' page or your next listing — no need to reprint signs." },
  { q: "Is it good for open houses?", a: "Perfect. Print on table tents and the sign-in sheet. Visitors scan to get the listing and your contact card sent to their phone." },
];

export const Route = createFileRoute("/qr-code-for-real-estate")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "real estate qr code, qr code for yard sign, realtor qr code, open house qr, qr code for listing" },
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
      badge="For realtors & agents"
      title={<>Real Estate QR Code That <span className="text-gradient-brand">Captures Every Drive-By</span></>}
      subtitle="One QR on the yard sign opens listing photos, virtual tour, and your contact card. Turn 2 a.m. drive-bys into qualified leads."
      qrSampleUrl="https://qrcodegenerator.life/u/demo-realtor"
      qrSampleLabel="Sample listing QR"
      benefits={[
        { title: "Sell while you sleep", desc: "Drive-by buyers get full listing details at 11 p.m. — no missed opportunities." },
        { title: "One QR per listing", desc: "Each property gets its own page with photos, price, video tour, and a contact form." },
        { title: "Instant contact card", desc: "Visitors save your number, email, and headshot to their phone in one tap." },
        { title: "Reuse signs after a sale", desc: "Redirect the QR to your next listing — no reprinting." },
        { title: "Open house sign-ins", desc: "Skip paper sheets. Visitors scan to register and instantly receive listing info." },
        { title: "Track every lead source", desc: "See exactly which yard sign or flyer drove the most scans." },
      ]}
      steps={[
        { title: "Add your listing", desc: "Photos, price, virtual tour link, and a 'Schedule a tour' form." },
        { title: "Brand your QR", desc: "Add your headshot or brokerage logo. Match your sign colors." },
        { title: "Print on signs & flyers", desc: "High-resolution PNG for yard signs, riders, and open house tents." },
      ]}
      testimonial={{
        quote: "I get scan notifications at midnight. Followed up next morning, sold the house in 9 days. The QR paid for the entire MLS year.",
        name: "Karen P.",
        role: "Realtor, Tampa FL",
      }}
      faqs={faqs}
      ctaHref="/qr-code"
    />
  ),
});
