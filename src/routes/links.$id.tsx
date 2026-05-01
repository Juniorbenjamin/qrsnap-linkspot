import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile, FREE_LINK_LIMIT } from "@/lib/store";
import { ArrowLeft, Save } from "lucide-react";

export const Route = createFileRoute("/links/$id")({
  component: EditLink,
  head: () => ({ meta: [{ title: "Edit link — QRLinkSpot" }] }),
});

function EditLink() {
  const { id } = useParams({ from: "/links/$id" });
  const isNew = id === "new";
  const { profile, update } = useProfile();
  const navigate = useNavigate();

  const existing = profile.links.find((l) => l.id === id);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [url, setUrl] = useState(existing?.url ?? "");

  useEffect(() => {
    if (existing) { setTitle(existing.title); setUrl(existing.url); }
  }, [existing]);

  const atLimit = !profile.isPro && isNew && profile.links.length >= FREE_LINK_LIMIT;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (atLimit) return;
    if (isNew) {
      update({ links: [...profile.links, { id: Date.now().toString(), title, url }] });
    } else {
      update({ links: profile.links.map((l) => (l.id === id ? { ...l, title, url } : l)) });
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Add a new link" : "Edit link"}</h1>
        <p className="mt-1 text-muted-foreground">Add anything: a website, social profile, booking page, menu, etc.</p>

        {atLimit ? (
          <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
            <p className="text-lg font-semibold">You've reached the free plan limit</p>
            <p className="mt-1 text-sm text-muted-foreground">Upgrade to Pro to add unlimited links.</p>
            <Button asChild variant="brand" className="mt-4">
              <Link to="/pricing">Upgrade to Pro</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={save} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="space-y-2">
              <Label htmlFor="title">Link title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="📅 Book Appointment" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." required />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="brand" size="lg" className="flex-1">
                <Save className="mr-2 h-4 w-4" /> Save link
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => navigate({ to: "/dashboard" })}>Cancel</Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
