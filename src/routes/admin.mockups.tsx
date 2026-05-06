import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2, ArrowUp, ArrowDown, Upload, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/mockups")({
  component: AdminMockups,
  head: () => ({ meta: [{ title: "Manage Mockups — Admin" }] }),
});

type Slide = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  position: number;
  is_active: boolean;
};

function AdminMockups() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [user]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("mockup_slides")
      .select("*")
      .order("position", { ascending: true });
    setSlides((data as Slide[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const addSlide = async () => {
    if (!user) return;
    const nextPos = slides.length ? Math.max(...slides.map((s) => s.position)) + 1 : 0;
    const { error } = await supabase.from("mockup_slides").insert({
      title: "New slide",
      description: "Short description",
      image_url: "",
      position: nextPos,
      is_active: true,
    });
    if (error) return toast.error(error.message);
    toast.success("Slide added");
    load();
  };

  const updateSlide = async (id: string, patch: Partial<Slide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    const { error } = await supabase.from("mockup_slides").update(patch).eq("id", id);
    if (error) toast.error(error.message);
  };

  const deleteSlide = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    const { error } = await supabase.from("mockup_slides").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = slides.findIndex((s) => s.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= slides.length) return;
    const a = slides[idx];
    const b = slides[swap];
    const next = [...slides];
    next[idx] = { ...b, position: a.position };
    next[swap] = { ...a, position: b.position };
    setSlides(next);
    await Promise.all([
      supabase.from("mockup_slides").update({ position: b.position }).eq("id", a.id),
      supabase.from("mockup_slides").update({ position: a.position }).eq("id", b.id),
    ]);
  };

  const onUpload = async (id: string, file: File) => {
    setUploadingId(id);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("mockups").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("mockups").getPublicUrl(path);
      await updateSlide(id, { image_url: pub.publicUrl });
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  if (authLoading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Admins only</h1>
          <p className="mt-2 text-muted-foreground">
            You need the admin role to manage landing-page mockups.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Landing mockups</h1>
            <p className="text-sm text-muted-foreground">
              Upload, reorder and manage the screenshots in the homepage carousel.
            </p>
          </div>
          <Button onClick={addSlide} variant="brand">
            <Plus className="mr-1 h-4 w-4" /> Add slide
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading…</div>
        ) : slides.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No slides yet. Click "Add slide" to create one.
          </div>
        ) : (
          <div className="space-y-4">
            {slides.map((s, i) => (
              <div key={s.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex w-full flex-shrink-0 items-center justify-center sm:w-40">
                    <div className="relative aspect-[9/16] w-32 overflow-hidden rounded-2xl border-2 border-neutral-900 bg-neutral-100">
                      {s.image_url ? (
                        <img src={s.image_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <Label htmlFor={`title-${s.id}`}>Title</Label>
                      <Input
                        id={`title-${s.id}`}
                        value={s.title}
                        onChange={(e) =>
                          setSlides((prev) =>
                            prev.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)),
                          )
                        }
                        onBlur={(e) => updateSlide(s.id, { title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`desc-${s.id}`}>Description</Label>
                      <Textarea
                        id={`desc-${s.id}`}
                        rows={2}
                        value={s.description}
                        onChange={(e) =>
                          setSlides((prev) =>
                            prev.map((x) =>
                              x.id === s.id ? { ...x, description: e.target.value } : x,
                            ),
                          )
                        }
                        onBlur={(e) => updateSlide(s.id, { description: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted">
                        {uploadingId === s.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {s.image_url ? "Replace image" : "Upload image"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingId === s.id}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) onUpload(s.id, f);
                            e.target.value = "";
                          }}
                        />
                      </label>

                      <div className="ml-auto flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={s.is_active}
                            onCheckedChange={(v) => updateSlide(s.id, { is_active: v })}
                          />
                          <span className="text-xs text-muted-foreground">
                            {s.is_active ? "Visible" : "Hidden"}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={i === 0}
                          onClick={() => move(s.id, -1)}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={i === slides.length - 1}
                          onClick={() => move(s.id, 1)}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteSlide(s.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
          Tip: Use tall portrait screenshots (9:19.5 ratio) for the best fit inside the iPhone frame.
        </div>
      </div>
    </div>
  );
}
