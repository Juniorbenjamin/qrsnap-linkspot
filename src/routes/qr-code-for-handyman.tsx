import { createFileRoute } from "@tanstack/react-router";
import { UseCaseLanding, faqJsonLd } from "@/components/UseCaseLanding";

const SITE = "https://qrcodegenerator.life";
const URL = `${SITE}/qr-code-for-handyman`;
const TITLE = "Handyman QR Code — Get More Local Jobs from One Scan | QRLinkSpot";
const DESC = "Free handyman QR code for trucks, business cards, and yard signs. One scan shows your phone, services, reviews, and booking link. No app, no signup.";

const faqs = [
  { q: "Where should a handyman put a QR code?", a: "Put it on your truck door, business cards, invoices, yard signs, and door hangers. One scan opens your phone number, services, reviews, and a 'Get a Quote' form." },
  { q: "Can customers call me directly from the QR?", a: "Yes. Your QRLinkSpot page includes a tap-to-call button so homeowners reach you in one tap — no typing the number." },
  { q: "Do I need a website to use a handyman QR code?", a: "No. Your free link page acts as a mini website with services, photos, reviews, and a contact button. You can be live in under 5 minutes." },
  { q: "Can I show before/after photos?", a: "Yes. Add a gallery of recent jobs so prospects see your work quality before they call." },
  { q: "Does the same QR work after I update my info?", a: "Yes. The QR is permanent — change your phone, hours, or services anytime and the printed code keeps working." },
];

export const Route = createFileRoute("/qr-code-for-handyman")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "handyman qr code, qr code for handyman business, handyman business card qr, contractor qr code, qr code for truck" },
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
      badge="For handymen & contractors"
      title={<>Handyman QR Code That <span className="text-gradient-brand">Books More Jobs</span></>}
      subtitle="One QR on your truck, card, or invoice opens your phone, services, photos, and reviews. Homeowners book you instead of scrolling Google."
      qrSampleUrl="https://qrcodegenerator.life/u/demo-handyman"
      qrSampleLabel="Sample handyman QR"
      benefits={[
        { title: "Tap-to-call in one scan", desc: "Customers don't type your number — they tap it. Fewer missed leads, faster bookings." },
        { title: "Show your best work", desc: "Add before/after photos so homeowners see quality before they call." },
        { title: "Look pro on every job", desc: "Branded QR with your logo on truck doors, magnets, and yard signs." },
        { title: "Collect Google reviews fast", desc: "Add a 'Leave a review' button so happy clients click straight to your Google profile." },
        { title: "Update services anytime", desc: "Change pricing, hours, or services — the printed QR keeps working." },
        { title: "Track every scan", desc: "See which truck, sign, or card brings in the most leads." },
      ]}
      steps={[
        { title: "Build your link page", desc: "Add phone, services, photos, reviews, and a quote form in minutes." },
        { title: "Brand your QR", desc: "Add your logo and pick colors that match your truck wrap." },
        { title: "Print on everything", desc: "Stick it on your truck, business cards, invoices, and door hangers." },
      ]}
      testimonial={{
        quote: "Put the QR on my truck door and started getting calls from neighbors who saw me parked. Easiest marketing I've ever done.",
        name: "Mike R.",
        role: "Handyman, Phoenix AZ",
      }}
      faqs={faqs}
      ctaHref="/qr-code"
    />
  ),
});
