import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Props = {
  value: string;
  fgColor?: string;
  bgColor?: string;
  logoText?: string;
  size?: number;
  showDownload?: boolean;
};

export function QRPreview({ value, fgColor = "#1a1a2e", bgColor = "#ffffff", logoText, size = 240, showDownload = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const download = () => {
    const canvas = ref.current?.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrlinkspot-qr.png";
    a.click();
  };

  const imageSettings = logoText
    ? undefined
    : undefined;

  return (
    <div className="flex flex-col items-center gap-4">
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
        {logoText && (
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg px-2 py-1 text-xs font-bold shadow-soft"
            style={{ background: bgColor, color: fgColor, border: `2px solid ${fgColor}` }}
          >
            {logoText.slice(0, 4).toUpperCase()}
          </div>
        )}
      </div>
      {showDownload && (
        <Button onClick={download} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Download PNG
        </Button>
      )}
    </div>
  );
}
