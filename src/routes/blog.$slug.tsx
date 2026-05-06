import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";

const SITE = "https://qrcodegenerator.life";

type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  body: { type: "h2" | "h3" | "p" | "ul" | "quote"; text?: string; items?: string[] }[];
};

const POSTS: Record<string, Post> = {
  "how-to-make-a-qr-code-for-your-business": {
    slug: "how-to-make-a-qr-code-for-your-business",
    title: "How to Make a QR Code for Your Business in 2026 (Free Guide)",
    description: "Step-by-step guide to creating a branded QR code that drives real bookings, follows, and sales for your small business.",
    date: "2026-04-15",
    readTime: "6 min read",
    category: "Guide",
    body: [
      { type: "p", text: "QR codes are everywhere in 2026 — on menus, business cards, packaging, storefronts, even tattoos. But most small businesses still use generic black-and-white codes that point to a single boring link. In this guide we'll show you how to make a branded QR code that actually grows your business." },
      { type: "h2", text: "Step 1: Decide what your QR code should do" },
      { type: "p", text: "Before you generate anything, decide on the goal. Is it to grow Instagram followers? Drive bookings? Show your menu? Your QR code should open a page that helps the visitor take that action in one tap." },
      { type: "ul", items: [
        "Restaurants → menu, reservations, reviews",
        "Barbers / salons → booking page, Instagram, reviews",
        "Creators → all socials, latest drop, newsletter",
        "Freelancers → portfolio, calendar, contact",
      ]},
      { type: "h2", text: "Step 2: Use a link-in-bio page, not a single URL" },
      { type: "p", text: "If your QR points to a single URL like your Instagram, you waste the opportunity to capture other actions. Use a free link-in-bio page (like the one QRLinkSpot creates for you) to give visitors 4–6 options on one screen." },
      { type: "h2", text: "Step 3: Brand your QR code" },
      { type: "p", text: "A custom-branded QR code gets up to 30% more scans than a generic one (source: Scanova 2024 report). Add your logo in the center, use your brand colors, and pick a clean shape." },
      { type: "h2", text: "Step 4: Test before you print" },
      { type: "p", text: "Always test your QR with multiple phones (iPhone & Android) before printing 500 of them. Our generator auto-tests scannability when you add a logo and shrinks it if needed." },
      { type: "h2", text: "Step 5: Track scans" },
      { type: "p", text: "Without analytics you're flying blind. Free QRLinkSpot accounts include scan tracking so you know which campaign actually worked." },
      { type: "quote", text: "We added a branded QR to our shop window and got 200+ Instagram follows in two weeks. That's real ROI from a free tool." },
      { type: "h2", text: "Ready to make yours?" },
      { type: "p", text: "Create a free branded QR code in 90 seconds — no signup, no credit card, no watermark." },
    ],
  },
  "qr-code-best-practices": {
    slug: "qr-code-best-practices",
    title: "10 QR Code Design Best Practices (So They Actually Get Scanned)",
    description: "Most QR codes fail because of small mistakes. Here's how to design QR codes people actually scan — sizing, contrast, placement, and more.",
    date: "2026-04-02",
    readTime: "5 min read",
    category: "Design",
    body: [
      { type: "p", text: "A QR code that nobody scans is just an ugly square. Here are 10 design principles that separate working QR codes from decorative ones." },
      { type: "h2", text: "1. Maintain strong contrast" },
      { type: "p", text: "Dark code on light background works best. Avoid inverted (light on dark) — many older phones struggle. Never use low-contrast color pairs." },
      { type: "h2", text: "2. Keep it big enough" },
      { type: "p", text: "Minimum 0.8 inches (2 cm) on print. For posters and signs, aim for 4+ inches. Bigger = more scan distance." },
      { type: "h2", text: "3. Leave a quiet zone" },
      { type: "p", text: "Always leave white space (at least 4 modules) around the QR. Without it, scanners can't find the boundaries." },
      { type: "h2", text: "4. Add a clear call-to-action" },
      { type: "p", text: "'Scan to book' beats a naked QR every time. Tell people exactly what they get." },
      { type: "h2", text: "5. Use high error correction with logos" },
      { type: "p", text: "If you embed a logo, switch to error correction level H (30%). Our generator does this automatically." },
      { type: "h2", text: "6. Test on multiple devices" },
      { type: "p", text: "iPhone, Android, old phones, new phones, dim lighting, glossy paper. Don't trust just one test." },
      { type: "h2", text: "7. Use dynamic QR codes" },
      { type: "p", text: "Static QRs encode the URL directly — change the URL, the QR is dead. Dynamic QRs point to a redirect you control. Always go dynamic." },
      { type: "h2", text: "8. Place it where people will scan" },
      { type: "p", text: "Eye-level, well-lit, on a flat surface. Avoid wrinkled stickers or curved bottles unless the QR is huge." },
      { type: "h2", text: "9. Don't print on reflective material" },
      { type: "p", text: "Glossy laminate + bright lights = unreadable QR. Matte finish scans every time." },
      { type: "h2", text: "10. Match the QR to your brand" },
      { type: "p", text: "Branded QRs get more scans because they look trustworthy. Add your logo, use your brand colors, keep it on-style." },
    ],
  },
  "linktree-alternatives": {
    slug: "linktree-alternatives",
    title: "5 Best Linktree Alternatives in 2026 (Free & Paid Compared)",
    description: "We compared 5 link-in-bio tools side-by-side: features, pricing, customization, and analytics. Here's which one deserves your bio.",
    date: "2026-03-20",
    readTime: "8 min read",
    category: "Comparison",
    body: [
      { type: "p", text: "Linktree was first but it's no longer the best. In 2026 there are several link-in-bio tools that look better, customize deeper, and cost less. We compared the top 5." },
      { type: "h2", text: "1. QRLinkSpot — Best free option with built-in QR" },
      { type: "p", text: "QRLinkSpot bundles a fully branded link-in-bio page + custom QR generator + analytics, all for free. The QR auto-verifies that it's scannable when you add a logo. Ideal for small businesses, creators, and freelancers." },
      { type: "h2", text: "2. Linktree — The original" },
      { type: "p", text: "Still the most recognized brand. Free plan is limited (Linktree branding shown). Paid starts at $5/mo for custom themes." },
      { type: "h2", text: "3. Beacons" },
      { type: "p", text: "Creator-focused with built-in storefront features. Free tier with watermark, $10+/mo for full branding." },
      { type: "h2", text: "4. Bio.site (by Squarespace)" },
      { type: "p", text: "Clean design, free without watermark, but limited customization on the free plan and tied to the Squarespace ecosystem." },
      { type: "h2", text: "5. Carrd" },
      { type: "p", text: "Closer to a one-page website builder than a link-in-bio tool. Powerful but requires more setup." },
      { type: "h2", text: "Verdict" },
      { type: "p", text: "If you need a clean, branded link page plus a QR code that actually works — QRLinkSpot is the best free option in 2026. If you need a full storefront, Beacons is worth the $10/mo. Linktree is fine but feels dated next to newer tools." },
    ],
  },
};

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = POSTS[params.slug];
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `${SITE}/blog/${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.title} | QRLinkSpot Blog` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: loaderData.date },
        { name: "twitter:title", content: loaderData.title },
        { name: "twitter:description", content: loaderData.description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: loaderData.title,
          description: loaderData.description,
          datePublished: loaderData.date,
          author: { "@type": "Organization", name: "QRLinkSpot" },
          publisher: { "@type": "Organization", name: "QRLinkSpot", logo: { "@type": "ImageObject", url: `${SITE}/favicon.ico` } },
          mainEntityOfPage: url,
        }),
      }],
    };
  },
  errorComponent: ({ error }) => (
    <div className="p-12 text-center text-muted-foreground">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <h1 className="text-2xl font-bold">Article not found</h1>
      <Link to="/blog" className="mt-4 inline-block text-primary">← Back to blog</Link>
    </div>
  ),
  component: BlogPost,
});

function BlogPost() {
  const post = Route.useLoaderData();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <Link to="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{post.category}</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{post.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
            {post.body.map((b: any, i: number) => {
              if (b.type === "h2") return <h2 key={i} className="mt-8 text-2xl font-bold tracking-tight">{b.text}</h2>;
              if (b.type === "h3") return <h3 key={i} className="mt-6 text-xl font-semibold">{b.text}</h3>;
              if (b.type === "p") return <p key={i} className="mt-4 leading-relaxed text-foreground/90">{b.text}</p>;
              if (b.type === "quote") return <blockquote key={i} className="my-6 border-l-4 border-primary pl-4 italic text-muted-foreground">{b.text}</blockquote>;
              if (b.type === "ul") return (
                <ul key={i} className="mt-4 space-y-2 pl-5 text-foreground/90">
                  {b.items?.map((it) => <li key={it} className="list-disc">{it}</li>)}
                </ul>
              );
              return null;
            })}
          </div>

          <div className="mt-14 rounded-2xl border border-border bg-gradient-card p-8 text-center shadow-soft">
            <h3 className="text-xl font-bold">Ready to put this into practice?</h3>
            <p className="mt-2 text-sm text-muted-foreground">Create a free branded QR code in 90 seconds.</p>
            <Button asChild variant="brand" size="lg" className="mt-5 shadow-glow">
              <Link to="/qr-code">
                Create my free QR <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
