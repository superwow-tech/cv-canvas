import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Loader2,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import SiteLayout from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { canUseTemplate } from "@/lib/plans";
import { cvTemplates, defaultTemplateId, type CvTemplateId } from "@/lib/cv-templates";
import {
  blankEducation,
  blankExperience,
  blankLanguage,
  blankSkillGroup,
  normalizeResume,
  type ResumeDocument,
} from "@/lib/resume-schema";
import { downloadCV, generateCVBlob, marginLimits, pageFormats, type PageFormat } from "@/lib/generate-cv";

const steps = ["Details", "Profile", "Experience", "Education", "Skills", "Languages", "Review"] as const;

const inputClass =
  "mt-1.5 w-full rounded-lg border border-foreground/20 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-foreground/60";
const labelClass = "block text-xs uppercase tracking-widest text-foreground/55";

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

export default function ResumeEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isPro } = useAuth();

  const [title, setTitle] = useState("Untitled resume");
  const [resume, setResume] = useState<ResumeDocument | null>(null);
  const [template, setTemplate] = useState<CvTemplateId>(defaultTemplateId);
  const [format, setFormat] = useState<PageFormat>("a4");
  const [marginX, setMarginX] = useState(18);
  const [marginY, setMarginY] = useState(18);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dirty = useRef(false);

  // Load
  useEffect(() => {
    if (!id) return;
    supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error("Resume not found");
          navigate("/app", { replace: true });
          return;
        }
        setTitle(data.title);
        setResume(normalizeResume(data.document));
        setTemplate((data.template as CvTemplateId) ?? defaultTemplateId);
        setFormat((data.page_format as PageFormat) ?? "a4");
        setMarginX(data.margin_x ?? 18);
        setMarginY(data.margin_y ?? 18);
        setLoading(false);
      });
  }, [id, navigate]);

  const patch = useCallback((updater: (draft: ResumeDocument) => ResumeDocument) => {
    dirty.current = true;
    setResume((prev) => (prev ? updater(structuredClone(prev)) : prev));
  }, []);

  const save = useCallback(
    async (silent = false) => {
      if (!id || !resume) return;
      setSaving(true);
      const { error } = await supabase
        .from("resumes")
        .update({
          title,
          document: resume as unknown as never,
          template,
          page_format: format,
          margin_x: marginX,
          margin_y: marginY,
        })
        .eq("id", id);
      setSaving(false);
      if (error) toast.error("Could not save", { description: error.message });
      else {
        dirty.current = false;
        if (!silent) toast.success("Saved");
      }
    },
    [id, resume, title, template, format, marginX, marginY]
  );

  // Autosave two seconds after the last change.
  useEffect(() => {
    if (!resume || loading) return;
    const t = setTimeout(() => {
      if (dirty.current) void save(true);
    }, 2000);
    return () => clearTimeout(t);
  }, [resume, title, template, format, marginX, marginY, loading, save]);

  const exportOptions = useMemo(() => ({ format, marginX, marginY }), [format, marginX, marginY]);

  // Live PDF preview, debounced.
  useEffect(() => {
    if (!resume) return;
    let cancelled = false;
    let url: string | null = null;
    const t = setTimeout(async () => {
      try {
        const blob = await generateCVBlob(resume, template, exportOptions);
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch (error) {
        console.error("Preview failed", error);
      }
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [resume, template, exportOptions]);

  const handleDownload = async () => {
    if (!resume) return;
    if (!canUseTemplate(isPro, template)) {
      navigate("/pricing");
      return;
    }
    try {
      await downloadCV(resume, template, exportOptions);
      toast.success("PDF downloaded");
    } catch (error) {
      toast.error("Export failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  if (loading || !resume) {
    return (
      <SiteLayout>
        <div className="py-32 grid place-items-center">
          <Loader2 className="animate-spin text-foreground/40" />
        </div>
      </SiteLayout>
    );
  }

  const p = resume.personal;

  return (
    <SiteLayout>
      <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-10 font-['Rubik']">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/app" aria-label="Back to resumes" className="text-foreground/50 hover:text-foreground">
              <ArrowLeft size={18} />
            </Link>
            <input
              value={title}
              onChange={(e) => {
                dirty.current = true;
                setTitle(e.target.value);
              }}
              aria-label="Resume title"
              className="min-w-0 flex-1 bg-transparent text-xl font-semibold tracking-tight outline-none border-b border-transparent focus:border-foreground/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground/45">{saving ? "Saving…" : dirty.current ? "Unsaved" : "Saved"}</span>
            <button
              onClick={() => save()}
              className="rounded-full border border-foreground/20 px-4 py-2 text-sm hover:border-foreground/50 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              <Download size={15} /> PDF
            </button>
          </div>
        </div>

        {/* Stepper */}
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Resume sections">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${
                i === step
                  ? "bg-foreground text-background"
                  : "border border-foreground/15 text-foreground/60 hover:border-foreground/40"
              }`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </nav>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-10">
          {/* FORM */}
          <div>
            {step === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name" value={p.name} onChange={(v) => patch((d) => ({ ...d, personal: { ...d.personal, name: v } }))} />
                <Field label="Headline" value={p.title} onChange={(v) => patch((d) => ({ ...d, personal: { ...d.personal, title: v } }))} />
                <Field label="Email" type="email" value={p.email} onChange={(v) => patch((d) => ({ ...d, personal: { ...d.personal, email: v } }))} />
                <Field label="Phone" value={p.phone} onChange={(v) => patch((d) => ({ ...d, personal: { ...d.personal, phone: v } }))} />
                <Field label="City" value={p.city} onChange={(v) => patch((d) => ({ ...d, personal: { ...d.personal, city: v } }))} />
                <Field label="Country" value={p.country} onChange={(v) => patch((d) => ({ ...d, personal: { ...d.personal, country: v } }))} />
                <Field label="Website" value={p.website} onChange={(v) => patch((d) => ({ ...d, personal: { ...d.personal, website: v } }))} placeholder="yoursite.com" />
                <Field label="LinkedIn" value={p.linkedin} onChange={(v) => patch((d) => ({ ...d, personal: { ...d.personal, linkedin: v } }))} placeholder="linkedin.com/in/you" />
              </div>
            )}

            {step === 1 && (
              <label className="block">
                <span className={labelClass}>Profile summary</span>
                <textarea
                  rows={8}
                  value={p.bio}
                  onChange={(e) => patch((d) => ({ ...d, personal: { ...d.personal, bio: e.target.value } }))}
                  className={inputClass}
                />
                <span className="mt-2 block text-xs text-foreground/50">
                  Three or four sentences: what you do, your strongest skills, and the impact you bring.
                </span>
              </label>
            )}

            {step === 2 && (
              <div className="space-y-8">
                {resume.experience.map((job, index) => (
                  <div key={job.id} className="rounded-xl border border-foreground/15 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-widest text-foreground/50">Role {index + 1}</p>
                      <button
                        aria-label="Remove role"
                        onClick={() =>
                          patch((d) => ({ ...d, experience: d.experience.filter((x) => x.id !== job.id) }))
                        }
                        className="text-foreground/45 hover:text-foreground"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Job title" value={job.role} onChange={(v) => patch((d) => ({ ...d, experience: d.experience.map((x) => (x.id === job.id ? { ...x, role: v } : x)) }))} />
                      <Field label="Company" value={job.company} onChange={(v) => patch((d) => ({ ...d, experience: d.experience.map((x) => (x.id === job.id ? { ...x, company: v } : x)) }))} />
                      <Field label="Location" value={job.location} onChange={(v) => patch((d) => ({ ...d, experience: d.experience.map((x) => (x.id === job.id ? { ...x, location: v } : x)) }))} />
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Start (YYYY-MM)" value={job.startDate} placeholder="2022-03" onChange={(v) => patch((d) => ({ ...d, experience: d.experience.map((x) => (x.id === job.id ? { ...x, startDate: v } : x)) }))} />
                        <Field label="End (blank = now)" value={job.endDate} placeholder="2024-09" onChange={(v) => patch((d) => ({ ...d, experience: d.experience.map((x) => (x.id === job.id ? { ...x, endDate: v } : x)) }))} />
                      </div>
                    </div>
                    <label className="mt-4 block">
                      <span className={labelClass}>Achievements (one per line)</span>
                      <textarea
                        rows={5}
                        value={job.bullets.join("\n")}
                        onChange={(e) =>
                          patch((d) => ({
                            ...d,
                            experience: d.experience.map((x) =>
                              x.id === job.id ? { ...x, bullets: e.target.value.split("\n") } : x
                            ),
                          }))
                        }
                        className={inputClass}
                      />
                    </label>
                    <label className="mt-4 block">
                      <span className={labelClass}>Tech (comma separated)</span>
                      <input
                        value={job.tech.join(", ")}
                        onChange={(e) =>
                          patch((d) => ({
                            ...d,
                            experience: d.experience.map((x) =>
                              x.id === job.id
                                ? { ...x, tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }
                                : x
                            ),
                          }))
                        }
                        className={inputClass}
                      />
                    </label>
                  </div>
                ))}
                <button
                  onClick={() => patch((d) => ({ ...d, experience: [...d.experience, blankExperience()] }))}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-sm hover:border-foreground/50 transition-colors"
                >
                  <Plus size={15} /> Add role
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                {resume.education.map((edu, index) => (
                  <div key={edu.id} className="rounded-xl border border-foreground/15 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-widest text-foreground/50">Entry {index + 1}</p>
                      <button
                        aria-label="Remove education entry"
                        onClick={() => patch((d) => ({ ...d, education: d.education.filter((x) => x.id !== edu.id) }))}
                        className="text-foreground/45 hover:text-foreground"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Degree" value={edu.degree} onChange={(v) => patch((d) => ({ ...d, education: d.education.map((x) => (x.id === edu.id ? { ...x, degree: v } : x)) }))} />
                      <Field label="Field" value={edu.field} onChange={(v) => patch((d) => ({ ...d, education: d.education.map((x) => (x.id === edu.id ? { ...x, field: v } : x)) }))} />
                      <Field label="Institution" value={edu.institution} onChange={(v) => patch((d) => ({ ...d, education: d.education.map((x) => (x.id === edu.id ? { ...x, institution: v } : x)) }))} />
                      <Field label="Location" value={edu.location} onChange={(v) => patch((d) => ({ ...d, education: d.education.map((x) => (x.id === edu.id ? { ...x, location: v } : x)) }))} />
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="From" value={edu.startYear} placeholder="2016" onChange={(v) => patch((d) => ({ ...d, education: d.education.map((x) => (x.id === edu.id ? { ...x, startYear: v } : x)) }))} />
                        <Field label="To" value={edu.endYear} placeholder="2020" onChange={(v) => patch((d) => ({ ...d, education: d.education.map((x) => (x.id === edu.id ? { ...x, endYear: v } : x)) }))} />
                      </div>
                      <Field label="Details" value={edu.details} onChange={(v) => patch((d) => ({ ...d, education: d.education.map((x) => (x.id === edu.id ? { ...x, details: v } : x)) }))} />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => patch((d) => ({ ...d, education: [...d.education, blankEducation()] }))}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-sm hover:border-foreground/50 transition-colors"
                >
                  <Plus size={15} /> Add education
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                {resume.skills.map((group) => (
                  <div key={group.id} className="rounded-xl border border-foreground/15 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-widest text-foreground/50">Skill group</p>
                      <button
                        aria-label="Remove skill group"
                        onClick={() => patch((d) => ({ ...d, skills: d.skills.filter((x) => x.id !== group.id) }))}
                        className="text-foreground/45 hover:text-foreground"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-3 space-y-4">
                      <Field label="Category" value={group.category} placeholder="Frontend" onChange={(v) => patch((d) => ({ ...d, skills: d.skills.map((x) => (x.id === group.id ? { ...x, category: v } : x)) }))} />
                      <Field label="Skills" value={group.skills} placeholder="Communication, Negotiation, Teamwork" onChange={(v) => patch((d) => ({ ...d, skills: d.skills.map((x) => (x.id === group.id ? { ...x, skills: v } : x)) }))} />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => patch((d) => ({ ...d, skills: [...d.skills, blankSkillGroup()] }))}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-sm hover:border-foreground/50 transition-colors"
                >
                  <Plus size={15} /> Add skill group
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                {resume.languages.map((lang) => (
                  <div key={lang.id} className="rounded-xl border border-foreground/15 p-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                    <Field label="Language" value={lang.language} onChange={(v) => patch((d) => ({ ...d, languages: d.languages.map((x) => (x.id === lang.id ? { ...x, language: v } : x)) }))} />
                    <Field label="Proficiency" value={lang.proficiency} placeholder="Fluent" onChange={(v) => patch((d) => ({ ...d, languages: d.languages.map((x) => (x.id === lang.id ? { ...x, proficiency: v } : x)) }))} />
                    <button
                      aria-label="Remove language"
                      onClick={() => patch((d) => ({ ...d, languages: d.languages.filter((x) => x.id !== lang.id) }))}
                      className="mb-2 text-foreground/45 hover:text-foreground"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => patch((d) => ({ ...d, languages: [...d.languages, blankLanguage()] }))}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-sm hover:border-foreground/50 transition-colors"
                >
                  <Plus size={15} /> Add language
                </button>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-sm uppercase tracking-widest text-foreground/55">Template</h2>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {cvTemplates.map((t) => {
                      const allowed = canUseTemplate(isPro, t.id);
                      const active = template === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => (allowed ? setTemplate(t.id) : navigate("/pricing"))}
                          className={`text-left rounded-xl border p-4 transition-colors ${
                            active ? "border-mint bg-mint-light/25" : "border-foreground/15 hover:border-foreground/40"
                          }`}
                        >
                          <span className="flex items-center justify-between text-sm font-medium">
                            {t.name}
                            {active ? <Check size={15} /> : !allowed ? <Lock size={14} className="text-foreground/45" /> : null}
                          </span>
                          <span className="mt-1 block text-xs text-foreground/55">{t.tagline}</span>
                        </button>
                      );
                    })}
                  </div>
                  {!isPro && <p className="mt-3 text-xs text-foreground/50">Classic and Minimal are part of Pro.</p>}
                </div>

                <div>
                  <h2 className="text-sm uppercase tracking-widest text-foreground/55">Page setup</h2>
                  <div className="mt-4 flex gap-2">
                    {pageFormats.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => (isPro || f.id === "a4" ? setFormat(f.id) : navigate("/pricing"))}
                        className={`rounded-full px-4 py-2 text-sm transition-colors ${
                          format === f.id
                            ? "bg-foreground text-background"
                            : "border border-foreground/20 hover:border-foreground/50"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-5 space-y-4 max-w-sm">
                    <label className="block">
                      <span className={labelClass}>Side margins — {marginX} mm</span>
                      <input
                        type="range"
                        min={marginLimits.min}
                        max={marginLimits.max}
                        step={marginLimits.step}
                        value={marginX}
                        disabled={!isPro}
                        onChange={(e) => setMarginX(Number(e.target.value))}
                        className="mt-2 w-full accent-foreground disabled:opacity-50"
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Top / bottom margins — {marginY} mm</span>
                      <input
                        type="range"
                        min={marginLimits.min}
                        max={marginLimits.max}
                        step={marginLimits.step}
                        value={marginY}
                        disabled={!isPro}
                        onChange={(e) => setMarginY(Number(e.target.value))}
                        className="mt-2 w-full accent-foreground disabled:opacity-50"
                      />
                    </label>
                    {!isPro && (
                      <p className="text-xs text-foreground/50">
                        Letter size and margin control are Pro features.{" "}
                        <Link to="/pricing" className="underline">
                          See Pro
                        </Link>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                  <Download size={16} /> Download PDF
                </button>
              </div>
            )}

            {/* Step nav */}
            <div className="mt-10 flex items-center justify-between border-t border-foreground/10 pt-6">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground disabled:opacity-40"
              >
                <ArrowLeft size={15} /> Back
              </button>
              <button
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                disabled={step === steps.length - 1}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-sm hover:border-foreground/50 transition-colors disabled:opacity-40"
              >
                Next <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* LIVE PREVIEW */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <p className="text-xs uppercase tracking-widest text-foreground/55">Live preview</p>
            <div className="mt-3 rounded-xl border border-foreground/15 overflow-hidden bg-foreground/[0.03]">
              {previewUrl ? (
                <iframe
                  title="Resume PDF preview"
                  src={previewUrl}
                  className="w-full h-[520px] lg:h-[720px] bg-white"
                />
              ) : (
                <div className="h-[520px] grid place-items-center">
                  <Loader2 className="animate-spin text-foreground/35" />
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
