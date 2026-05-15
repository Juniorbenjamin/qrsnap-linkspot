import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-brand">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-95"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

const SITE_URL = "https://qrcodegenerator.life";
const OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6926bcd1-8732-41ae-8bf5-0c9ce840b610/id-preview-898c6460--c0acd155-84e1-495c-be73-91e23f2f9733.lovable.app-1777661840589.png";
const SITE_TITLE = "QRLinkSpot — Free QR Code & Link-in-Bio Generator";
const SITE_DESC = "Free branded QR codes and a link-in-bio page for creators and small businesses. Made in 90 seconds — no signup, no credit card.";
const SITE_KEYWORDS = "qr code generator, free qr code, qr code with logo, custom qr code, link in bio, linktree alternative, qr code for business, qr code for restaurant, qr code for barber, dynamic qr code, branded qr code, qr code maker, qrcodegenerator, qr generator online, qr code for instagram, vcard qr code, menu qr code, scan qr, qr analytics";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESC },
      { name: "keywords", content: SITE_KEYWORDS },
      { name: "author", content: "QRLinkSpot" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "googlebot", content: "index, follow" },
      { name: "msvalidate.01", content: "89DBE98A945ECCB35BA26CEA4998F254" },
      { name: "google-site-verification", content: "z8vNrb60E3ng77luq0kaPpZSsrWZ_2pT7T_zLhMcGsQ" },
      
      { name: "theme-color", content: "#6366f1" },
      { name: "application-name", content: "QRLinkSpot" },
      { name: "apple-mobile-web-app-title", content: "QRLinkSpot" },
      // Open Graph
      { property: "og:site_name", content: "QRLinkSpot" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESC },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "QRLinkSpot — Free QR code generator and link-in-bio for small businesses" },
      // Twitter / X
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESC },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: "QRLinkSpot — Free QR code generator and link-in-bio" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "QRLinkSpot",
              url: SITE_URL,
              logo: `${SITE_URL}/favicon.ico`,
              founder: { "@type": "Person", name: "junior rivas" },
              sameAs: [],
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: "QRLinkSpot",
              description: SITE_DESC,
              publisher: { "@id": `${SITE_URL}/#organization` },
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/qr-code?url={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@type": "SoftwareApplication",
              name: "QRLinkSpot",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description: SITE_DESC,
              url: SITE_URL,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "2140",
              },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});


function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <PaymentTestModeBanner />
      <Outlet />
      <Toaster />
    </>
  );
}
