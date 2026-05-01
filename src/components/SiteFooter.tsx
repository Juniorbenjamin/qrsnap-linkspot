import { Link } from "@tanstack/react-router";
import { QrCode } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
              <QrCode className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">QRLinkSpot</span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link to="/signup" className="hover:text-foreground">Sign up</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} QRLinkSpot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
