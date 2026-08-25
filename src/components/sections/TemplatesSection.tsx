import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Download, Eye, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cvTemplates, defaultTemplateId, type CvTemplateId } from "@/lib/cv-templates";
import { personalInfo } from "@/data/portfolio-data";

type PageFormat = "a4" | "letter";

const PAGE_FORMATS: Array<{ id: PageFormat; label: string; hint: string }> = [
  { id: "a4", label: "A4", hint: "210 x 297 mm" },
  { id: "letter", label: "Letter", hint: "8.5 x 11 in" },
];

const MARGIN_MIN = 10;
const MARGIN_MAX = 30;


function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10 md:mb-14 flex items-center gap-4 md:gap-6">
      <span className="h-px flex-1 bg-foreground/10" aria-hidden />
      <h2 className="uppercase tracking-[0.25em] text-xs md:text-sm font-medium text-foreground/70 font-['Rubik'] whitespace-nowrap">
        {children}
      </h2>
      <span className="h-px flex-1 bg-foreground/10" aria-hidden />
    </div>
  );
}

/** Miniature paper preview approximating each PDF template. */
function Thumbnail({ id }: { id: CvTemplateId }) {
  const centered = id === "classic";
  const airy = id === "minimal";
  const bar = (w: string, tone = "bg-foreground/15") => (
    <span className={`block h-[3px] rounded-full ${tone}`} style={{ width: w }} />
  );

  return (
    <div
      className={`aspect-[1/1.414] w-full rounded-sm bg-background border border-foreground/10 shadow-sm overflow-hidden ${
        airy ? "p-4 md:p-5" : "p-3 md:p-4"
      }`}
    >
      <div className={`flex flex-col ${airy ? "gap-3" : "gap-2"} ${centered ? "items-center" : "items-start"}`}>
        <span
          className={`block rounded-sm bg-foreground/80 ${id === "timeline" ? "h-3" : "h-2.5"}`}
          style={{ width: centered ? "62%" : id === "timeline" ? "78%" : "58%" }}
        />
        {bar(centered ? "40%" : "46%", "bg-foreground/30")}
        {bar(centered ? "70%" : "60%", "bg-foreground/15")}
      </div>

      {[0, 1, 2].map((s) => (
        <div key={s} className={airy ? "mt-5" : "mt-4"}>
          <div className="flex items-center gap-2">
            {bar("26%", "bg-foreground/50")}
            {id === "timeline" && <span className="h-px flex-1 bg-foreground/15" />}
            {id === "classic" && <span className="h-px w-6 bg-foreground/25" />}
          </div>
          <div className={`mt-2 flex flex-col ${airy ? "gap-2" : "gap-1.5"}`}>
            {bar("92%", "bg-foreground/10")}
            {bar("86%", "bg-foreground/10")}
            {bar("70%", "bg-foreground/10")}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TemplatesSection() {
  const [selected, setSelected] = useState<CvTemplateId>(defaultTemplateId);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFor, setPreviewFor] = useState<CvTemplateId | null>(null);
  const [busy, setBusy] = useState<"preview" | "download" | null>(null);

  const openPreview = async (id: CvTemplateId) => {
    if (busy) return;
    setBusy("preview");
    try {
      const { generateCVBlob } = await import("@/lib/generate-cv");
      const blob = await generateCVBlob(id);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
      setPreviewFor(id);
      setSelected(id);
    } catch (error) {
      console.error("Preview failed:", error);
      toast.error("Could not build the preview", { description: "Please try again." });
    } finally {
      setBusy(null);
    }
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFor(null);
  };

  const download = async (id: CvTemplateId) => {
    if (busy) return;
    setBusy("download");
    const toastId = toast.loading("Generating your CV…");
    try {
      const { downloadCV } = await import("@/lib/generate-cv");
      await downloadCV(id);
      toast.success("CV downloaded", { id: toastId, description: "Check your downloads folder." });
    } catch (error) {
      console.error("CV generation failed:", error);
      toast.error("Could not generate CV", { id: toastId, description: "Please try again in a moment." });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 md:px-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="py-12 md:py-16"
      >
        <SectionHeading>Resume Templates</SectionHeading>

        <p className="mb-8 md:mb-10 text-center text-sm md:text-base text-foreground/65 font-['Rubik'] text-balance max-w-2xl mx-auto">
          Pick a design, preview the exact PDF, then export it.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {cvTemplates.map((t) => {
            const isSelected = selected === t.id;
            return (
              <div key={t.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setSelected(t.id)}
                  aria-pressed={isSelected}
                  className={`relative rounded-lg p-2 transition-all text-left ${
                    isSelected
                      ? "ring-2 ring-foreground/70 bg-foreground/[0.03]"
                      : "ring-1 ring-foreground/10 hover:ring-foreground/30"
                  }`}
                >
                  <Thumbnail id={t.id} />
                  {isSelected && (
                    <span className="absolute top-3 right-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-foreground text-background">
                      <Check size={14} />
                    </span>
                  )}
                </button>

                <h3 className="mt-4 text-base md:text-lg font-semibold text-foreground font-['Rubik']">
                  {t.name}
                </h3>
                <div className="text-[11px] md:text-xs uppercase tracking-[0.15em] text-foreground/50 font-['Rubik'] mt-0.5">
                  {t.tagline}
                </div>
                <p className="mt-2 text-sm text-foreground/65 font-['Rubik'] leading-relaxed">
                  {t.description}
                </p>

                <button
                  type="button"
                  onClick={() => openPreview(t.id)}
                  disabled={busy !== null}
                  className="mt-3 self-start inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors font-['Rubik'] disabled:opacity-60"
                >
                  {busy === "preview" && previewFor !== t.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Eye size={15} />
                  )}
                  Preview
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => download(selected)}
            disabled={busy !== null}
            aria-busy={busy === "download"}
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors font-['Rubik'] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {busy === "download" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Download size={16} /> Export {cvTemplates.find((t) => t.id === selected)?.name} PDF
              </>
            )}
          </button>
        </div>
      </motion.section>

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Resume preview"
          onClick={closePreview}
        >
          <div
            className="relative w-full max-w-3xl h-full max-h-[88vh] rounded-lg bg-background overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-foreground/10">
              <div className="font-['Rubik'] text-sm md:text-base font-medium text-foreground">
                {cvTemplates.find((t) => t.id === previewFor)?.name} - {personalInfo.name}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => previewFor && download(previewFor)}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-xs md:text-sm font-medium hover:bg-foreground/90 transition-colors font-['Rubik'] disabled:opacity-70"
                >
                  <Download size={14} /> Export
                </button>
                <button
                  onClick={closePreview}
                  aria-label="Close preview"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-foreground/20 text-foreground/70 hover:text-foreground hover:border-foreground/60 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <iframe src={previewUrl} title="Resume PDF preview" className="flex-1 w-full bg-foreground/5" />
          </div>
        </div>
      )}
    </div>
  );
}
