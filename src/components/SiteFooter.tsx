import { Link } from "@tanstack/react-router";
import { QrCode } from "lucide-react";

const industries: { to: string; label: string }[] = [
  { to: "/qr-code-for-restaurant", label: "Restaurants" },
  { to: "/qr-code-for-handyman", label: "Handymen" },
  { to: "/qr-code-for-barbershop", label: "Barbershops" },
  { to: "/qr-code-for-real-estate", label: "Real Estate" },
  { to: "/qr-code-for-gym", label: "Gyms" },
  { to: "/qr-code-for-small-business", label: "Small Business" },
  { to: "/qr-code-for-business-card", label: "Business Cards" },
  { to: "/qr-code-for-instagram", label: "Instagram" },
  { to: "/qr-code-for-wifi", label: "WiFi" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
                <QrCode className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">QRLinkSpot</span>
            </div>
            <p className="text-sm text-muted-foreground">Branded QR codes & link pages for modern businesses.</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/qr-code" className="hover:text-foreground">QR Generator</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
              <li><Link to="/signup" className="hover:text-foreground">Sign up</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-3 text-sm font-semibold">QR codes by industry</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground sm:grid-cols-3">
              {industries.map((i) => (
                <li key={i.to}>
                  <Link to={i.to} className="hover:text-foreground">{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/refund-policy" className="hover:text-foreground">Refunds</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Junior Rivas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
