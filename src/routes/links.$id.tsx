import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuth, useMyProfile, useMyLinks, FREE_LINK_LIMIT, type LinkType, type LinkItem } from "@/lib/store";
import { ArrowLeft, Save, Link2, Youtube, Music2, ShoppingBag, Images, Quote, Mail, MessageCircle, CreditCard, Calendar, Type } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/links/$id")({
  component: EditLink,
  head: () => ({ meta: [{ title: "Edit block — QRLinkSpot" }] }),
});

const BLOCK_TYPES: { id: LinkType; name: string; icon: any; hint: string; placeholderUrl?: string }[] = [
  { id: "link", name: "Link button", icon: Link2, hint: "Any URL — website, social, etc.", placeholderUrl: "https://..." },
  { id: "header", name: "Section header", icon: Type, hint: "Group your links with a label." },
  { id: "youtube", name: "YouTube embed", icon: Youtube, hint: "Paste a YouTube video URL.", placeholderUrl: "https://youtube.com/watch?v=..." },
  { id: "tiktok", name: "TikTok embed", icon: Music2, hint: "Paste a TikTok video URL.", placeholderUrl: "https://tiktok.com/@user/video/..." },
  { id: "spotify", name: "Spotify embed", icon: Music2, hint: "Track, album, or playlist URL.", placeholderUrl: "https://open.spotify.com/..." },
  { id: "product", name: "Product card", icon: ShoppingBag, hint: "Showcase a product with image + price.", placeholderUrl: "https://yourstore.com/product" },
  { id: "gallery", name: "Image gallery", icon: Images, hint: "Up to 6 images." },
  { id: "testimonial", name: "Testimonial", icon: Quote, hint: "Customer quote with author." },
  { id: "email_capture", name: "Email capture", icon: Mail, hint: "Collect emails into your dashboard." },
  { id: "whatsapp", name: "WhatsApp button", icon: MessageCircle, hint: "Quick chat link.", placeholderUrl: "+1234567890" },
  { id: "payment", name: "Payment link", icon: CreditCard, hint: "Stripe / Paddle / PayPal URL.", placeholderUrl: "https://buy.stripe.com/..." },
  { id: "booking", name: "Booking link", icon: Calendar, hint: "Calendly / Cal.com URL.", placeholderUrl: "https://calendly.com/you" },
];

function EditLink() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/links/$id" });
  const isNew = id === "new";

  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useMyProfile();
  const { links, add, update } = useMyLinks(profile?.id);

  const existing = links.find((l) => l.id === id);
  const [linkType, setLinkType] = useState<LinkType>("link");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [color, setColor] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [meta, setMeta] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (existing) {
      setLinkType(existing.link_type ?? "link");
      setTitle(existing.title);
      setUrl(existing.url);
      setIcon(existing.icon ?? "");
      setThumbnail(existing.thumbnail_url ?? "");
      setColor(existing.color ?? "");
      setIsFeatured(!!existing.is_featured);
      setIsPinned(!!existing.is_pinned);
      setMeta(existing.metadata ?? {});
    }
  }, [existing?.id]);

  if (authLoading || profileLoading || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground sm:px-6">Loading…</div>
      </div>
    );
  }

  const atLimit = !profile.is_pro && isNew && links.length >= FREE_LINK_LIMIT;
  const cfg = BLOCK_TYPES.find((b) => b.id === linkType)!;
  const needsUrl = !["header", "gallery", "testimonial", "email_capture"].includes(linkType);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (atLimit) return;
    setSubmitting(true);
    try {
      const payload = {
        title,
        url: needsUrl ? url : "",
        link_type: linkType,
        icon,
        thumbnail_url: thumbnail,
        color,
        is_featured: isFeatured,
        is_pinned: isPinned,
        metadata: meta,
      };
      if (isNew) await add(payload);
      else await update(id, payload as Partial<LinkItem>);
      toast.success(isNew ? "Block added" : "Block updated");
      navigate({ to: "/dashboard", search: { checkout: undefined } });
    } catch {
      toast.error("Save failed");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Link to="/dashboard" search={{ checkout: undefined }} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Add a block" : "Edit block"}</h1>
        <p className="mt-1 text-muted-foreground">Build your bio page out of blocks — links, embeds, products, gallery, and more.</p>

        {atLimit ? (
          <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
            <p className="text-lg font-semibold">You've reached the free plan limit</p>
            <p className="mt-1 text-sm text-muted-foreground">Upgrade to Pro for unlimited blocks.</p>
            <Button asChild variant="brand" className="mt-4">
              <Link to="/pricing">Upgrade to Pro</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={save} className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
            {isNew && (
              <div className="space-y-2">
                <Label>Block type</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {BLOCK_TYPES.map((b) => {
                    const Icon = b.icon;
                    const active = linkType === b.id;
                    return (
                      <button
                        type="button"
                        key={b.id}
                        onClick={() => setLinkType(b.id)}
                        className={`flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-all ${active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-semibold">{b.name}</span>
                        <span className="text-xs text-muted-foreground">{b.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">{linkType === "header" ? "Header text" : linkType === "testimonial" ? "Quote" : "Title"}</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={linkType === "header" ? "My Services" : "📅 Book Appointment"} required maxLength={140} />
            </div>

            {needsUrl && (
              <div className="space-y-2">
                <Label htmlFor="url">{linkType === "whatsapp" ? "Phone number (with country code)" : "URL"}</Label>
                <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={cfg.placeholderUrl ?? "https://..."} required />
              </div>
            )}

            {linkType === "product" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input value={meta.price ?? ""} onChange={(e) => setMeta({ ...meta, price: e.target.value })} placeholder="$29" />
                </div>
                <div className="space-y-2">
                  <Label>CTA text</Label>
                  <Input value={meta.cta ?? ""} onChange={(e) => setMeta({ ...meta, cta: e.target.value })} placeholder="Buy now" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Image URL</Label>
                  <Input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://..." />
                </div>
              </div>
            )}

            {linkType === "testimonial" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Author name</Label>
                  <Input value={meta.author ?? ""} onChange={(e) => setMeta({ ...meta, author: e.target.value })} placeholder="Jane D." />
                </div>
                <div className="space-y-2">
                  <Label>Author role</Label>
                  <Input value={meta.role ?? ""} onChange={(e) => setMeta({ ...meta, role: e.target.value })} placeholder="Verified customer" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Avatar URL</Label>
                  <Input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://..." />
                </div>
              </div>
            )}

            {linkType === "gallery" && (
              <div className="space-y-2">
                <Label>Image URLs (one per line, up to 6)</Label>
                <Textarea
                  rows={6}
                  value={(meta.images ?? []).join("\n")}
                  onChange={(e) => setMeta({ ...meta, images: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 6) })}
                  placeholder="https://image1.jpg&#10;https://image2.jpg"
                />
              </div>
            )}

            {linkType === "email_capture" && (
              <div className="space-y-2">
                <Label>Subhead (optional)</Label>
                <Input value={meta.subhead ?? ""} onChange={(e) => setMeta({ ...meta, subhead: e.target.value })} placeholder="Get monthly tips and offers" />
              </div>
            )}

            {linkType === "link" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Icon (emoji)</Label>
                  <Input value={icon} onChange={(e) => setIcon(e.target.value)} maxLength={4} placeholder="🔗" />
                </div>
                <div className="space-y-2">
                  <Label>Thumbnail URL (optional)</Label>
                  <Input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label>Custom button color</Label>
                  <input type="color" value={color || "#ffffff"} onChange={(e) => setColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-md border border-border bg-background" />
                </div>
                <div className="flex items-end">
                  {color && <Button type="button" variant="ghost" size="sm" onClick={() => setColor("")}>Reset color</Button>}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-6 border-t border-border pt-4">
              <label className="flex items-center gap-2">
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                <span className="text-sm font-medium">Featured (larger button)</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch checked={isPinned} onCheckedChange={setIsPinned} />
                <span className="text-sm font-medium">Pin to top</span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="brand" size="lg" className="flex-1" disabled={submitting}>
                <Save className="mr-2 h-4 w-4" /> {submitting ? "Saving…" : "Save block"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => navigate({ to: "/dashboard", search: { checkout: undefined } })}>Cancel</Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
