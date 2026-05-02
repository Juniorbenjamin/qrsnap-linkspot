import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowRight, Calendar } from "lucide-react";

const SITE = "https://qrcodegenerator.life";
const URL = `${SITE}/blog`;
const TITLE = "QR Code & Link-in-Bio Blog — Tips for Small Business | QRLinkSpot";
const DESC = "Practical guides on using QR codes and link-in-bio pages to grow your small business: marketing tips, design tutorials, and real-world case studies.";

export const posts = [
  {
    slug: "how-to-make-a-qr-code-for-your-business",
    title: "How to Make a QR Code for Your Business in 2026 (Free Guide)",
    excerpt: "Step-by-step guide to creating a branded QR code that actually drives bookings, follows, and sales — with real examples.",
    date: "2026-04-15",
    readTime: "6 min read",
    category: "Guide",
  },
  {
    slug: "qr-code-best-practices",
    title: "10 QR Code Design Best Practices (So They Actually Get Scanned)",
    excerpt: "Most QR codes fail because of small mistakes. Here's how to design QR codes people will actually scan — sizing, contrast, placement, and more.",
    date: "2026-04-02",
    readTime: "5 min read",
    category: "Design",
  },
  {
    slug: "linktree-alternatives",
    title: "5 Best Linktree Alternatives in 2026 (Free & Paid Compared)",
    excerpt: "We compared 5 link-in-bio tools side-by-side: features, pricing, customization, and analytics. Here's which one actually deserves your bio.",
    date: "2026-03-20",
    readTime: "8 min read",
    category: "Comparison",
  },
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border/60 bg-gradient-hero py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              The <span className="text-gradient-brand">QRLinkSpot</span> Blog
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Practical tips on QR codes, link-in-bio, and growing your small business online.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link
                  key={p.slug}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
                >
                  <span className="self-start rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {p.category}
                  </span>
                  <h2 className="mt-4 text-lg font-semibold leading-tight group-hover:text-primary">
                    {p.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.date}</span>
                    <span>·</span>
                    <span>{p.readTime}</span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
