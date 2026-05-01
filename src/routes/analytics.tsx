import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useAnalytics, useProfile } from "@/lib/store";
import { Eye, MousePointerClick, TrendingUp, Crown, Lock } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/analytics")({
  component: Analytics,
  head: () => ({ meta: [{ title: "Analytics — QRLinkSpot" }] }),
});

function Analytics() {
  const events = useAnalytics();
  const { profile } = useProfile();

  const { views, scans, clicks, ctr, last7, perLink } = useMemo(() => {
    const views = events.filter((e) => e.type === "view").length;
    const scans = events.filter((e) => e.type === "scan").length;
    const clicks = events.filter((e) => e.type === "click").length;
    const ctr = views > 0 ? Math.round((clicks / views) * 100) : 0;

    const now = Date.now();
    const last7 = Array.from({ length: 7 }).map((_, i) => {
      const dayStart = now - (6 - i) * 86400000;
      const dayEnd = dayStart + 86400000;
      const v = events.filter((e) => e.type === "view" && e.ts >= dayStart && e.ts < dayEnd).length;
      const c = events.filter((e) => e.type === "click" && e.ts >= dayStart && e.ts < dayEnd).length;
      return { day: new Date(dayStart).toLocaleDateString(undefined, { weekday: "short" }), v, c };
    });

    const perLink = profile.links.map((l) => ({
      ...l,
      clicks: events.filter((e) => e.type === "click" && e.linkId === l.id).length,
    })).sort((a, b) => b.clicks - a.clicks);

    return { views, scans, clicks, ctr, last7, perLink };
  }, [events, profile.links]);

  const max = Math.max(1, ...last7.flatMap((d) => [d.v, d.c]));

  if (!profile.isPro) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-primary/30 bg-gradient-card p-10 text-center shadow-soft">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics is a Pro feature</h1>
            <p className="mt-2 text-muted-foreground">Upgrade to see scans, clicks, and which links your audience loves.</p>
            <Button asChild variant="brand" size="lg" className="mt-6">
              <Link to="/pricing"><Crown className="mr-2 h-4 w-4" /> Upgrade to Pro</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Analytics</h1>
          <p className="mt-1 text-muted-foreground">Track your QR scans and link performance.</p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Stat icon={<Eye className="h-5 w-5" />} label="Page views" value={views} />
          <Stat icon={<MousePointerClick className="h-5 w-5" />} label="Link clicks" value={clicks} />
          <Stat icon={<TrendingUp className="h-5 w-5" />} label="Click-through rate" value={`${ctr}%`} />
        </div>

        <section className="mb-8 rounded-2xl border border-border bg-gradient-card p-6 shadow-soft">
          <h2 className="mb-6 text-lg font-semibold">Last 7 days</h2>
          <div className="flex h-48 items-end justify-between gap-2">
            {last7.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end justify-center gap-1">
                  <div
                    className="w-1/2 rounded-t-md bg-primary/30 transition-all"
                    style={{ height: `${(d.v / max) * 100}%`, minHeight: d.v > 0 ? "4px" : "0" }}
                    title={`${d.v} views`}
                  />
                  <div
                    className="w-1/2 rounded-t-md bg-gradient-brand transition-all"
                    style={{ height: `${(d.c / max) * 100}%`, minHeight: d.c > 0 ? "4px" : "0" }}
                    title={`${d.c} clicks`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-6 text-xs">
            <span className="flex items-center gap-2"><span className="h-2 w-3 rounded bg-primary/30" /> Views</span>
            <span className="flex items-center gap-2"><span className="h-2 w-3 rounded bg-gradient-brand" /> Clicks</span>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold">Top links</h2>
          {perLink.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No links yet.</p>
          ) : (
            <ul className="space-y-2">
              {perLink.map((l) => (
                <li key={l.id} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{l.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{l.url}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{l.clicks}</p>
                    <p className="text-xs text-muted-foreground">clicks</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-card p-5 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}<span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
