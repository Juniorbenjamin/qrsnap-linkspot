import { useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Slide = {
  id: string;
  title: string;
  description: string;
  image_url: string;
};

const FALLBACK_SLIDES: Slide[] = [
  {
    id: "f1",
    title: "Your link-in-bio, beautifully branded",
    description: "Match your colors, fonts and logo in seconds.",
    image_url: "",
  },
  {
    id: "f2",
    title: "Custom QR codes that convert",
    description: "Add your logo. Track every scan in real time.",
    image_url: "",
  },
  {
    id: "f3",
    title: "Real-time analytics",
    description: "See which links your audience actually taps.",
    image_url: "",
  },
];

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[260px] sm:w-[300px]">
      {/* Phone body */}
      <div className="relative aspect-[9/19.5] rounded-[2.75rem] border-[10px] border-neutral-900 bg-neutral-900 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35),0_18px_36px_-18px_rgba(0,0,0,0.25)]">
        {/* Notch */}
        <div className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-neutral-900" />
        {/* Screen */}
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

function SlideContent({ slide }: { slide: Slide }) {
  return (
    <PhoneFrame>
      {slide.image_url ? (
        <img
          src={slide.image_url}
          alt={slide.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 text-center">
          <span className="text-xs font-medium text-muted-foreground">
            Upload screenshot
          </span>
        </div>
      )}
    </PhoneFrame>
  );
}

export function MockupCarousel() {
  const [slides, setSlides] = useState<Slide[]>(FALLBACK_SLIDES);
  const autoplay = useRef(Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", containScroll: "trimSnaps" },
    [autoplay.current],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("mockup_slides")
        .select("id,title,description,image_url")
        .eq("is_active", true)
        .order("position", { ascending: true });
      if (!cancelled && data && data.length > 0) {
        setSlides(data);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, slides.length]);

  return (
    <section className="bg-gradient-to-b from-white to-neutral-50 py-20 dark:from-background dark:to-muted/20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Product tour
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Designed to look <span className="text-gradient-brand">premium</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            A peek inside QRLinkSpot — built mobile-first, beautifully simple.
          </p>
        </div>

        <div className="relative mt-14">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((s) => (
                <div
                  key={s.id}
                  className="min-w-0 shrink-0 grow-0 basis-full px-3 sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="flex flex-col items-center gap-6">
                    <SlideContent slide={s} />
                    <div className="max-w-xs text-center">
                      <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows (desktop) */}
          <button
            type="button"
            aria-label="Previous"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-2 top-[40%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-soft backdrop-blur transition hover:bg-card md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-2 top-[40%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-soft backdrop-blur transition hover:bg-card md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  selectedIndex === i ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
