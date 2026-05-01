import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import jsQR from "jsqr";

type Props = {
  value: string;
  fgColor?: string;
  bgColor?: string;
  logoText?: string;
  logoUrl?: string;
  size?: number;
  showDownload?: boolean;
};

// Logo size ratios to try, from largest to smallest. Stops at the first one
// that produces a scannable QR.
const LOGO_RATIOS = [0.24, 0.20, 0.16, 0.12, 0.08, 0];

type ScanStatus = "checking" | "ok" | "shrunk" | "failed" | "idle";

export function QRPreview({
  value,
  fgColor = "#1a1a2e",
  bgColor = "#ffffff",
  logoText,
  logoUrl,
  size = 240,
  showDownload = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [logoRatio, setLogoRatio] = useState<number>(LOGO_RATIOS[0]);
  const [status, setStatus] = useState<ScanStatus>("idle");

  // Re-test scannability whenever the QR content, colors, or logo change.
  useEffect(() => {
    if (!logoUrl) {
      setLogoRatio(0);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setStatus("checking");

    // Try each ratio, biggest first. Render off-screen, then decode.
    const test = async () => {
      for (let i = 0; i < LOGO_RATIOS.length; i++) {
        const ratio = LOGO_RATIOS[i];
        const ok = await canDecodeQR({
          value: value || "https://qrlinkspot.app",
          fgColor,
          bgColor,
          size: 320, // test at higher resolution for reliable decode
          logoUrl,
          ratio,
        });
        if (cancelled) return;
        if (ok) {
          setLogoRatio(ratio);
          setStatus(ratio === LOGO_RATIOS[0] ? "ok" : ratio === 0 ? "failed" : "shrunk");
          return;
        }
      }
      if (!cancelled) {
        setLogoRatio(0);
        setStatus("failed");
      }
    };

    test();
    return () => {
      cancelled = true;
    };
  }, [value, fgColor, bgColor, logoUrl]);

  const download = () => {
    const canvas = ref.current?.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrlinkspot-qr.png";
    a.click();
  };

  const imageSettings =
    logoUrl && logoRatio > 0
      ? {
          src: logoUrl,
          height: Math.round(size * logoRatio),
          width: Math.round(size * logoRatio),
          excavate: true,
        }
      : undefined;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={ref}
        className="relative rounded-2xl p-4 shadow-soft"
        style={{ background: bgColor }}
      >
        <QRCodeCanvas
          value={value || "https://qrlinkspot.app"}
          size={size}
          fgColor={fgColor}
          bgColor={bgColor}
          level="H"
          marginSize={2}
          imageSettings={imageSettings}
        />
        {logoText && !logoUrl && (
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg px-2 py-1 text-xs font-bold shadow-soft"
            style={{ background: bgColor, color: fgColor, border: `2px solid ${fgColor}` }}
          >
            {logoText.slice(0, 4).toUpperCase()}
          </div>
        )}
      </div>

      {logoUrl && <ScanStatusBadge status={status} />}

      {showDownload && (
        <Button onClick={download} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Download PNG
        </Button>
      )}
    </div>
  );
}

function ScanStatusBadge({ status }: { status: ScanStatus }) {
  if (status === "idle") return null;
  if (status === "checking") {
    return (
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking scannability…
      </p>
    );
  }
  if (status === "ok") {
    return (
      <p className="flex items-center gap-1.5 text-xs text-green-600">
        <CheckCircle2 className="h-3.5 w-3.5" /> Scannable — logo at full size
      </p>
    );
  }
  if (status === "shrunk") {
    return (
      <p className="flex items-center gap-1.5 text-xs text-amber-600">
        <AlertTriangle className="h-3.5 w-3.5" /> Logo auto-shrunk to keep QR scannable
      </p>
    );
  }
  return (
    <p className="flex items-center gap-1.5 text-xs text-destructive">
      <AlertTriangle className="h-3.5 w-3.5" /> Logo hidden — QR was unscannable
    </p>
  );
}

// --- Off-screen scannability test --------------------------------------------

async function canDecodeQR({
  value,
  fgColor,
  bgColor,
  size,
  logoUrl,
  ratio,
}: {
  value: string;
  fgColor: string;
  bgColor: string;
  size: number;
  logoUrl: string;
  ratio: number;
}): Promise<boolean> {
  try {
    // Render the QR onto an off-screen canvas using qrcode.react's same algo
    // by leveraging a hidden DOM node would be complex; instead use the
    // `qrcode` package isn't available — so we re-render into a detached
    // canvas via a temporary React-free path: draw a QR using qrcode.react
    // by mounting a hidden element is heavy. Simpler: ask qrcode.react for
    // a canvas by using the `qrcode` from `qrcode.react`'s peer? It does
    // not expose one. Use the `qrcode` package fallback if present, else
    // generate via a temporary hidden mount.
    //
    // Strategy: generate the matrix ourselves via the `qrcode-generator`
    // shipped inside qrcode.react is not exported. Easiest robust path:
    // create a hidden <canvas> by drawing through an OffscreenCanvas using
    // the same `qrcode.react` rendering logic is not exposed. So we use
    // a tiny manual approach: draw via `QRCodeCanvas` to a hidden div.
    const { default: QRCode } = await import("qrcode");
    const canvas = document.createElement("canvas");
    await QRCode.toCanvas(canvas, value, {
      errorCorrectionLevel: "H",
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
    });

    if (ratio > 0) {
      // Composite the logo on top with excavated background, mimicking
      // qrcode.react's `excavate: true` behavior.
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;
      const img = await loadImage(logoUrl);
      const logoSize = Math.round(size * ratio);
      const x = Math.round((size - logoSize) / 2);
      const y = Math.round((size - logoSize) / 2);
      // Excavate (paint background square first)
      ctx.fillStyle = bgColor;
      ctx.fillRect(x, y, logoSize, logoSize);
      ctx.drawImage(img, x, y, logoSize, logoSize);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const decoded = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    return !!decoded && decoded.data === value;
  } catch {
    return false;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
