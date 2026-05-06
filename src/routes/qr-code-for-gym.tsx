import { createFileRoute } from "@tanstack/react-router";
import { UseCaseLanding, faqJsonLd } from "@/components/UseCaseLanding";

const SITE = "https://qrcodegenerator.life";
const URL = `${SITE}/qr-code-for-gym`;
const TITLE = "Gym QR Code — Memberships, Class Booking & Reviews | QRLinkSpot";
const DESC = "Free gym QR code for the front desk, mirrors, and class boards. One scan opens membership signup, class booking, and trainer profiles. Grow faster.";

const faqs = [
  { q: "What should a gym QR code link to?", a: "Membership signup, class schedule, trainer profiles, free trial form, Google reviews, and your Instagram — all on one page." },
  { q: "Where do I put it inside the gym?", a: "Front desk, locker room mirrors, class boards, equipment posters, and on staff t-shirts. The more touchpoints, the more signups." },
  { q: "Can members book classes from the QR?", a: "Yes. Link to Mindbody, ClassPass, or any booking system. Members tap once to reserve a spot." },
  { q: "Does it help with personal training sales?", a: "Add a 'Book a free PT session' button. Trainers wear the QR on their shirts — clients scan and book on the spot." },
  { q: "Is it good for franchise locations?", a: "Yes. Each location gets its own QR with location-specific schedule, trainers, and offers." },
];

export const Route = createFileRoute("/qr-code-for-gym")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "gym qr code, fitness qr code, qr code for gym signup, qr code for personal trainer, class booking qr" },
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
      badge="For gyms & studios"
      title={<>Gym QR Code That <span className="text-gradient-brand">Closes Memberships Faster</span></>}
      subtitle="One QR at the front desk opens signup, class booking, and trainer profiles. Walk-ins become members before they leave."
      qrSampleUrl="https://qrcodegenerator.life/u/demo-gym"
      qrSampleLabel="Sample gym QR"
      benefits={[
        { title: "Convert walk-ins on the spot", desc: "Prospects scan, see pricing, and sign up before the tour ends." },
        { title: "Class booking in one tap", desc: "Direct link to Mindbody, ClassPass, or your booking system." },
        { title: "Sell PT sessions", desc: "Trainers wear the QR — members scan to book a free session instantly." },
        { title: "Show off your facility", desc: "Add tour video, equipment photos, and member transformations." },
        { title: "Collect reviews automatically", desc: "Happy members tap once to leave a Google review and boost your local rank." },
        { title: "Track conversions per location", desc: "See which posters and locations drive the most signups." },
      ]}
      steps={[
        { title: "Build your gym page", desc: "Pricing, classes, trainers, free-trial form, reviews, and Instagram." },
        { title: "Brand your QR", desc: "Logo in the center, gym colors, bold and visible from across the room." },
        { title: "Display everywhere", desc: "Front desk, mirrors, class boards, staff shirts, equipment posters." },
      ]}
      testimonial={{
        quote: "Added 38 new members the first month after putting the QR at the front desk. Walk-ins sign up before they even leave.",
        name: "Marcus T.",
        role: "Gym owner, Denver CO",
      }}
      faqs={faqs}
      ctaHref="/qr-code"
    />
  ),
});
