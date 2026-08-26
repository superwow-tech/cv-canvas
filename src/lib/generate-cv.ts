import { jsPDF } from "jspdf";
import {
  CvTemplateId,
  defaultTemplateId,
  getTemplate,
} from "@/lib/cv-templates";
import type { ResumeDocument } from "@/lib/resume-schema";

/**
 * Transliterate Lithuanian (and general Latin-extended) diacritics to
 * plain ASCII so the built-in Helvetica encoding can render them.
 * ATS systems typically strip diacritics too, so this is a common CV pattern.
 */
const DIACRITIC_MAP: Record<string, string> = {
  Š: "S", š: "s", Ž: "Z", ž: "z", Č: "C", č: "c",
  Ą: "A", ą: "a", Ę: "E", ę: "e", Ė: "E", ė: "e",
  Į: "I", į: "i", Ų: "U", ų: "u", Ū: "U", ū: "u",
  Ó: "O", ó: "o", Ö: "O", ö: "o", Ä: "A", ä: "a",
  Ü: "U", ü: "u", ß: "ss", Ñ: "N", ñ: "n",
  "–": "-", "—": "-", "‑": "-",
};
function toAscii(text: string): string {
  return text.replace(/[^\x00-\x7F]/g, (ch) => DIACRITIC_MAP[ch] ?? ch);
}

export type PageFormat = "a4" | "letter";

export interface ExportOptions {
  /** Paper size for the exported PDF. */
  format?: PageFormat;
  /** Horizontal page margin in mm. Falls back to the template's margin. */
  marginX?: number;
  /** Vertical (top/bottom) page margin in mm. */
  marginY?: number;
}

export const pageFormats: Array<{ id: PageFormat; label: string; hint: string }> = [
  { id: "a4", label: "A4", hint: "210 × 297 mm" },
  { id: "letter", label: "Letter", hint: "8.5 × 11 in" },
];

export const marginLimits = { min: 10, max: 30, step: 1 };

/**
 * Generate a professional PDF CV from a resume document.
 * Returns a Blob that can be downloaded or opened.
 */
export async function generateCVBlob(
  resume: ResumeDocument,
  templateId: CvTemplateId = defaultTemplateId,
  options: ExportOptions = {}
): Promise<Blob> {
  const template = getTemplate(templateId);
  const style = template.style;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: options.format ?? "a4",
    compress: true,
  });

  const clamp = (v: number) =>
    Math.min(marginLimits.max, Math.max(marginLimits.min, v));

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = clamp(options.marginX ?? style.margin);
  const marginY = clamp(options.marginY ?? 18);
  const contentWidth = pageWidth - marginX * 2;
  let cursorY = marginY;

  const personal = resume.personal;

  const colors = {
    text: "#1f2937",
    muted: "#6b7280",
    accent: style.accent,
    light: "#f3f4f6",
  };

  // Use jsPDF's built-in Helvetica (reliable, universal). Non-ASCII characters
  // are transliterated at the call site via toAscii().
  const fontName = "helvetica";
  doc.setFont(fontName);

  // Helpers
  const addText = (
    text: string,
    x: number,
    y: number,
    options?: {
      size?: number;
      bold?: boolean;
      color?: string;
      align?: "left" | "center" | "right";
      maxWidth?: number;
    }
  ) => {
    const size = options?.size ?? 10;
    const bold = options?.bold ?? false;
    const color = options?.color ?? colors.text;
    const align = options?.align ?? "left";
    const maxWidth = options?.maxWidth ?? contentWidth;

    doc.setFont(fontName, bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);

    const lines = doc.splitTextToSize(toAscii(text), maxWidth);
    const lineHeight = size * 0.352778; // pt to mm

    if (align === "center") {
      doc.text(lines, pageWidth / 2, y, { align: "center" });
    } else if (align === "right") {
      doc.text(lines, pageWidth - marginX, y, { align: "right" });
    } else {
      doc.text(lines, x, y);
    }

    return lines.length * lineHeight;
  };

  const addSectionHeader = (title: string, y: number) => {
    const label = style.sectionUppercase ? title.toUpperCase() : title;
    addText(label, marginX, y, {
      size: 11,
      bold: true,
      color: colors.text,
      align: "left",
    });
    if (style.sectionHeader === "rule") {
      doc.setDrawColor(colors.accent);
      doc.setLineWidth(0.6);
      doc.line(marginX, y + 2.5, pageWidth - marginX, y + 2.5);
    } else if (style.sectionHeader === "underline-accent") {
      doc.setDrawColor(colors.accent);
      doc.setLineWidth(0.4);
      const w = doc.getTextWidth(toAscii(label));
      doc.line(marginX, y + 2, marginX + w, y + 2);
    }
    return 7 * style.spacing;
  };

  const formatDate = (date: string) => {
    if (!date) return "Present";
    const [year, month] = date.split("-");
    if (!month) return year;
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthName = monthNames[parseInt(month, 10) - 1] ?? month;
    return `${monthName} ${year}`;
  };

  const checkPageBreak = (neededHeight: number, reserveSpace = true) => {
    if (cursorY + neededHeight > pageHeight - marginY) {
      if (reserveSpace && cursorY > marginY) {
        doc.addPage();
        cursorY = marginY;
      }
      return true;
    }
    return false;
  };

  // === HEADER ===
  addText(personal.name || "Your Name", marginX, cursorY, {
    size: style.nameSize,
    bold: true,
    color: colors.text,
    align: style.headerAlign,
  });
  cursorY += style.nameSize * 0.37 + 1;

  if (personal.title) {
    addText(personal.title, marginX, cursorY, {
      size: 12,
      color: colors.muted,
      align: style.headerAlign,
    });
    cursorY += 8;
  } else {
    cursorY += 4;
  }

  // Helper: draw a clickable segment on the current contact line.
  const drawContactSegments = (
    segments: Array<{ label: string; url?: string }>,
    y: number
  ) => {
    if (segments.length === 0) return false;
    doc.setFont(fontName, "normal");
    doc.setFontSize(9);
    doc.setTextColor(colors.muted);
    const separator = "  |  ";
    const sepWidth = doc.getTextWidth(separator);
    const totalWidth =
      segments.reduce((acc, s2) => acc + doc.getTextWidth(toAscii(s2.label)), 0) +
      sepWidth * (segments.length - 1);
    let x =
      style.headerAlign === "center" ? (pageWidth - totalWidth) / 2 : marginX;
    segments.forEach((seg, i) => {
      const label = toAscii(seg.label);
      const w = doc.getTextWidth(label);
      if (seg.url) {
        doc.textWithLink(label, x, y, { url: seg.url });
      } else {
        doc.text(label, x, y);
      }
      x += w;
      if (i < segments.length - 1) {
        doc.text(separator, x, y);
        x += sepWidth;
      }
    });
    return true;
  };

  // Line 1: email · phone · location
  const location = [personal.city, personal.country].filter(Boolean).join(", ");
  const line1: Array<{ label: string; url?: string }> = [];
  if (personal.email) line1.push({ label: personal.email, url: `mailto:${personal.email}` });
  if (personal.phone)
    line1.push({ label: personal.phone, url: `tel:${personal.phone.replace(/\s+/g, "")}` });
  if (location) line1.push({ label: location });
  if (drawContactSegments(line1, cursorY)) cursorY += 5;

  // Line 2: linkedin · website
  const line2: Array<{ label: string; url?: string }> = [];
  if (personal.linkedin)
    line2.push({ label: personal.linkedin, url: `https://${personal.linkedin.replace(/^https?:\/\//, "")}` });
  if (personal.website)
    line2.push({ label: personal.website, url: `https://${personal.website.replace(/^https?:\/\//, "")}` });
  if (drawContactSegments(line2, cursorY)) cursorY += 5;

  cursorY += 7 * style.spacing;

  // === SUMMARY ===
  if (personal.bio) {
    checkPageBreak(20);
    cursorY += addSectionHeader("Profile", cursorY);
    const summaryHeight = addText(personal.bio, marginX, cursorY, {
      size: style.bodySize,
      color: colors.text,
      maxWidth: contentWidth,
    });
    cursorY += summaryHeight + 8;
  }

  // === EXPERIENCE ===
  if (resume.experience.length > 0) {
    checkPageBreak(30);
    cursorY += addSectionHeader("Experience", cursorY);

    resume.experience.forEach((job) => {
      const dateRange = `${formatDate(job.startDate)} - ${formatDate(job.endDate)}`;
      const bullets = (job.bullets ?? []).filter((b) => b.trim().length > 0);
      const estimatedEntryHeight = 5 + 5.5 + bullets.length * 12 + 6;
      checkPageBreak(estimatedEntryHeight);

      addText(job.role, marginX, cursorY, { size: 11, bold: true, color: colors.text });
      addText(dateRange, pageWidth - marginX, cursorY, {
        size: 9,
        color: colors.muted,
        align: "right",
      });
      cursorY += 5;

      const sub = [job.company, job.location].filter(Boolean).join(" - ");
      if (sub) {
        addText(sub, marginX, cursorY, { size: 10, color: colors.muted });
        cursorY += 5.5;
      }

      bullets.forEach((bullet) => {
        const bulletHeight = addText(`• ${bullet}`, marginX + 3, cursorY, {
          size: style.bodySize,
          color: colors.text,
          maxWidth: contentWidth - 6,
        });
        cursorY += bulletHeight + 1.5;
      });

      cursorY += 6 * style.spacing;
    });
  }

  // === SKILLS ===
  const skills = resume.skills.filter((s) => s.category || s.skills);
  if (skills.length > 0) {
    checkPageBreak(30);
    cursorY += addSectionHeader("Skills", cursorY);

    skills.forEach((category) => {
      checkPageBreak(12);
      if (category.category) {
        addText(`${category.category}:`, marginX, cursorY, {
          size: 10,
          bold: true,
          color: colors.text,
        });
        cursorY += 4.5;
      }

      const skillsHeight = addText(category.skills, marginX, cursorY, {
        size: style.bodySize,
        color: colors.text,
        maxWidth: contentWidth,
      });
      cursorY += skillsHeight + 5;
    });
    cursorY += 3;
  }

  // === EDUCATION ===
  if (resume.education.length > 0) {
    checkPageBreak(25);
    cursorY += addSectionHeader("Education", cursorY);

    resume.education.forEach((edu) => {
      checkPageBreak(18);

      const degreeText = edu.field ? `${edu.degree}, ${edu.field}` : edu.degree;

      addText(degreeText, marginX, cursorY, {
        size: 11,
        bold: true,
        color: colors.text,
      });
      const years = [edu.startYear, edu.endYear].filter(Boolean).join(" - ");
      if (years) {
        addText(years, pageWidth - marginX, cursorY, {
          size: 9,
          color: colors.muted,
          align: "right",
        });
      }
      cursorY += 5;

      const sub = [edu.institution, edu.location].filter(Boolean).join(" - ");
      if (sub) {
        addText(sub, marginX, cursorY, { size: 10, color: colors.muted });
        cursorY += 5;
      }

      if (edu.details) {
        const detailsHeight = addText(edu.details, marginX, cursorY, {
          size: 10,
          color: colors.text,
          maxWidth: contentWidth,
        });
        cursorY += detailsHeight + 2;
      }

      cursorY += 4;
    });
  }

  // === LANGUAGES ===
  const langs = resume.languages.filter((l) => l.language);
  if (langs.length > 0) {
    checkPageBreak(20);
    cursorY += addSectionHeader("Languages", cursorY);

    const languageText = langs
      .map((lang) => [lang.language, lang.proficiency].filter(Boolean).join(" - "))
      .join("    ");
    const langHeight = addText(languageText, marginX, cursorY, {
      size: style.bodySize,
      color: colors.text,
      maxWidth: contentWidth,
    });
    cursorY += langHeight + 6;
  }

  // === PAGE FOOTERS ===
  const totalPages = doc.getNumberOfPages();
  if (totalPages > 1) {
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(colors.muted);
      doc.text(
        toAscii(`${personal.name} - Page ${p} of ${totalPages}`),
        pageWidth / 2,
        pageHeight - Math.max(6, marginY - 8),
        { align: "center" }
      );
    }
  }

  return doc.output("blob");
}

function slugify(name: string) {
  return (
    name
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "resume"
  );
}

/**
 * Trigger a browser download of the generated CV PDF.
 */
export async function downloadCV(
  resume: ResumeDocument,
  templateId: CvTemplateId = defaultTemplateId,
  options: ExportOptions = {}
): Promise<void> {
  const blob = await generateCVBlob(resume, templateId, options);
  const url = URL.createObjectURL(blob);
  const filename = `${slugify(resume.personal.name)}-CV-${templateId}-${
    options.format ?? "a4"
  }.pdf`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
