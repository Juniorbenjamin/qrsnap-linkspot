import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export type DotStyle = "square" | "dots" | "rounded" | "classy" | "diamond";
export type EyeStyle = "square" | "circle" | "rounded" | "leaf";

export type StyledQRProps = {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  gradient?: { from: string; to: string; angle?: number } | null;
  dotStyle?: DotStyle;
  eyeStyle?: EyeStyle;
  eyeColor?: string;
  logoUrl?: string;
  logoSizeRatio?: number; // 0.05–0.30
  logoPadding?: number;   // px in render-space
  className?: string;
};

/**
 * Custom-styled QR renderer using the `qrcode` matrix and 2D canvas.
 * Supports module shapes, finder-eye shapes, gradients, and embedded logos.
 */
export function StyledQR({
  value,
  size = 280,
  fgColor = "#0F172A",
  bgColor = "#FFFFFF",
  gradient = null,
  dotStyle = "square",
  eyeStyle = "square",
  eyeColor,
  logoUrl,
  logoSizeRatio = 0.2,
  logoPadding = 8,
  className,
}: StyledQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    let cancelled = false;

    const render = async () => {
      const qr = QRCode.create(value || "https://qrlinkspot.app", { errorCorrectionLevel: "H" });
      if (cancelled) return;
      const modules = qr.modules;
      const count = modules.size;
      const data = modules.data as Uint8Array;

      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      cvs.width = size * dpr;
      cvs.height = size * dpr;
      cvs.style.width = `${size}px`;
      cvs.style.height = `${size}px`;
      const ctx = cvs.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      // background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);

      const margin = 2;
      const cell = size / (count + margin * 2);
      const offset = margin * cell;

      // foreground style (fill with gradient or solid)
      let fillStyle: string | CanvasGradient = fgColor;
      if (gradient) {
        const angle = ((gradient.angle ?? 135) * Math.PI) / 180;
        const x1 = size / 2 - (Math.cos(angle) * size) / 2;
        const y1 = size / 2 - (Math.sin(angle) * size) / 2;
        const x2 = size / 2 + (Math.cos(angle) * size) / 2;
        const y2 = size / 2 + (Math.sin(angle) * size) / 2;
        const g = ctx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, gradient.from);
        g.addColorStop(1, gradient.to);
        fillStyle = g;
      }

      const isFinder = (r: number, c: number) => {
        const inBox = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
        return inBox(0, 0) || inBox(0, count - 7) || inBox(count - 7, 0);
      };

      // Draw modules (skip finders — we'll draw them styled separately)
      ctx.fillStyle = fillStyle;
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (!data[r * count + c]) continue;
          if (isFinder(r, c)) continue;
          const x = offset + c * cell;
          const y = offset + r * cell;
          drawModule(ctx, x, y, cell, dotStyle, data, r, c, count);
        }
      }

      // Draw the three finder eyes
      const eyeFill = eyeColor || (typeof fillStyle === "string" ? fillStyle : fgColor);
      const eyePositions: Array<[number, number]> = [
        [0, 0],
        [0, count - 7],
        [count - 7, 0],
      ];
      for (const [r, c] of eyePositions) {
        const x = offset + c * cell;
        const y = offset + r * cell;
        drawEye(ctx, x, y, cell * 7, eyeStyle, eyeFill, bgColor);
      }

      // Logo
      if (logoUrl) {
        const logoPx = Math.round(size * logoSizeRatio);
        const ringPx = logoPx + logoPadding * 2;
        const cx = size / 2;
        const cy = size / 2;
        ctx.fillStyle = bgColor;
        roundRect(ctx, cx - ringPx / 2, cy - ringPx / 2, ringPx, ringPx, Math.min(12, ringPx / 4));
        ctx.fill();
        try {
          const img = await loadImg(logoUrl);
          if (cancelled) return;
          ctx.drawImage(img, cx - logoPx / 2, cy - logoPx / 2, logoPx, logoPx);
        } catch {
          /* ignore */
        }
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [value, size, fgColor, bgColor, gradient, dotStyle, eyeStyle, eyeColor, logoUrl, logoSizeRatio, logoPadding]);

  return <canvas ref={canvasRef} className={className} />;
}

function drawModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  style: DotStyle,
  data: Uint8Array,
  r: number,
  c: number,
  count: number,
) {
  const has = (rr: number, cc: number) =>
    rr >= 0 && rr < count && cc >= 0 && cc < count && !!data[rr * count + cc];

  if (style === "dots") {
    ctx.beginPath();
    ctx.arc(x + s / 2, y + s / 2, s * 0.45, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (style === "diamond") {
    ctx.beginPath();
    ctx.moveTo(x + s / 2, y + s * 0.05);
    ctx.lineTo(x + s * 0.95, y + s / 2);
    ctx.lineTo(x + s / 2, y + s * 0.95);
    ctx.lineTo(x + s * 0.05, y + s / 2);
    ctx.closePath();
    ctx.fill();
    return;
  }
  if (style === "rounded") {
    roundRect(ctx, x, y, s, s, s * 0.3);
    ctx.fill();
    return;
  }
  if (style === "classy") {
    // rounded only on corners with no neighbour
    const tl = !has(r - 1, c) && !has(r, c - 1);
    const tr = !has(r - 1, c) && !has(r, c + 1);
    const br = !has(r + 1, c) && !has(r, c + 1);
    const bl = !has(r + 1, c) && !has(r, c - 1);
    drawCornerRect(ctx, x, y, s, s, s * 0.45, { tl, tr, br, bl });
    ctx.fill();
    return;
  }
  // square
  ctx.fillRect(x, y, s + 0.5, s + 0.5);
}

function drawEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number, // 7 modules
  style: EyeStyle,
  fg: string | CanvasGradient,
  bg: string,
) {
  const m = s / 7;
  const outer = { x, y, w: s, h: s };
  const innerHole = { x: x + m, y: y + m, w: s - 2 * m, h: s - 2 * m };
  const dot = { x: x + 2 * m, y: y + 2 * m, w: s - 4 * m, h: s - 4 * m };

  ctx.fillStyle = fg;
  if (style === "circle") {
    circle(ctx, outer.x + outer.w / 2, outer.y + outer.h / 2, outer.w / 2);
    ctx.fill();
    ctx.fillStyle = bg;
    circle(ctx, innerHole.x + innerHole.w / 2, innerHole.y + innerHole.h / 2, innerHole.w / 2);
    ctx.fill();
    ctx.fillStyle = fg;
    circle(ctx, dot.x + dot.w / 2, dot.y + dot.h / 2, dot.w / 2);
    ctx.fill();
    return;
  }
  if (style === "rounded") {
    roundRect(ctx, outer.x, outer.y, outer.w, outer.h, m * 1.6);
    ctx.fill();
    ctx.fillStyle = bg;
    roundRect(ctx, innerHole.x, innerHole.y, innerHole.w, innerHole.h, m * 1.1);
    ctx.fill();
    ctx.fillStyle = fg;
    roundRect(ctx, dot.x, dot.y, dot.w, dot.h, m * 0.7);
    ctx.fill();
    return;
  }
  if (style === "leaf") {
    drawCornerRect(ctx, outer.x, outer.y, outer.w, outer.h, m * 2.4, { tl: true, br: true, tr: false, bl: false });
    ctx.fill();
    ctx.fillStyle = bg;
    drawCornerRect(ctx, innerHole.x, innerHole.y, innerHole.w, innerHole.h, m * 1.6, { tl: true, br: true, tr: false, bl: false });
    ctx.fill();
    ctx.fillStyle = fg;
    drawCornerRect(ctx, dot.x, dot.y, dot.w, dot.h, m * 1, { tl: true, br: true, tr: false, bl: false });
    ctx.fill();
    return;
  }
  // square
  ctx.fillRect(outer.x, outer.y, outer.w, outer.h);
  ctx.fillStyle = bg;
  ctx.fillRect(innerHole.x, innerHole.y, innerHole.w, innerHole.h);
  ctx.fillStyle = fg;
  ctx.fillRect(dot.x, dot.y, dot.w, dot.h);
}

function circle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawCornerRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  c: { tl: boolean; tr: boolean; br: boolean; bl: boolean },
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + (c.tl ? rr : 0), y);
  ctx.lineTo(x + w - (c.tr ? rr : 0), y);
  if (c.tr) ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - (c.br ? rr : 0));
  if (c.br) ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + (c.bl ? rr : 0), y + h);
  if (c.bl) ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + (c.tl ? rr : 0));
  if (c.tl) ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
