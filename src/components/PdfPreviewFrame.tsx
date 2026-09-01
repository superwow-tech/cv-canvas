import { useEffect, useState } from "react";
import { ExternalLink, FileText } from "lucide-react";

/**
 * Mobile browsers (iOS Safari, most Android WebViews) refuse to render PDFs
 * inside an <iframe>, so the frame renders blank. Detect that and show an
 * "open the PDF" fallback instead of an empty box.
 */
export function supportsInlinePdf() {
  if (typeof navigator === "undefined") return true;
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const android = /Android/.test(ua);
  const coarse = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;
  return !(iOS || android || coarse);
}

export default function PdfPreviewFrame({
  url,
  title = "Resume PDF preview",
  className = "",
}: {
  url: string;
  title?: string;
  className?: string;
}) {
  const [inline, setInline] = useState(true);

  useEffect(() => {
    setInline(supportsInlinePdf());
  }, []);

  if (inline) {
    return <iframe title={title} src={url} className={className} />;
  }

  return (
    <div className={`grid place-items-center p-6 text-center ${className}`}>
      <div className="max-w-xs">
        <FileText className="mx-auto text-foreground/35" size={28} />
        <p className="mt-3 text-sm text-foreground/70 font-body">
          Your phone's browser can't display PDFs inline. Open it in a new tab to view the resume.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium"
        >
          <ExternalLink size={15} /> Open PDF
        </a>
      </div>
    </div>
  );
}
