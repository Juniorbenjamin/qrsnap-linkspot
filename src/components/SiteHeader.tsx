import { Link, useRouterState } from "@tanstack/react-router";
import { QrCode, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/store";

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const navItem = (to: string, label: string) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`text-sm font-medium transition-colors hover:text-foreground ${
        path === to ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
            <QrCode className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">QRLinkSpot</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItem("/", "Home")}
          {navItem("/pricing", "Pricing")}
          {user && navItem("/dashboard", "Dashboard")}
          {user && navItem("/analytics", "Analytics")}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild variant="brand" size="sm">
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            {navItem("/", "Home")}
            {navItem("/pricing", "Pricing")}
            {user && navItem("/dashboard", "Dashboard")}
            {user && navItem("/analytics", "Analytics")}
            <div className="flex gap-2 pt-2">
              {user ? (
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { signOut(); setOpen(false); }}>
                  Sign out
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/login" onClick={() => setOpen(false)}>Sign in</Link>
                  </Button>
                  <Button asChild variant="brand" size="sm" className="flex-1">
                    <Link to="/signup" onClick={() => setOpen(false)}>Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
