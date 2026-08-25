import { jsPDF } from "jspdf";
import {
  CvTemplateId,
  defaultTemplateId,
  getTemplate,
} from "@/lib/cv-templates";
import {
  personalInfo,
  experience,
  education,
  languages,
  skillCategories,
} from "@/data/portfolio-data";

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
 * Generate a professional PDF CV from portfolio data.
 * Returns a Blob that can be downloaded or opened.
 */
export async function generateCVBlob(
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

  const formatDate = (date: string | null) => {
    if (!date) return "Present";
    const [year, month] = date.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
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
  // Larger name with more breathing room
  addText(personalInfo.name, marginX, cursorY, {
    size: style.nameSize,
    bold: true,
    color: colors.text,
    align: style.headerAlign,
  });
  cursorY += style.nameSize * 0.37 + 1;

  addText(personalInfo.title, marginX, cursorY, {
    size: 12,
    color: colors.muted,
    align: style.headerAlign,
  });
  cursorY += 8;

  // Helper: draw a clickable segment on the current contact line.
  const drawContactSegments = (
    segments: Array<{ label: string; url?: string }>,
    y: number
  ) => {
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
  };

  // Line 1: email · phone · location
  drawContactSegments(
    [
      { label: personalInfo.email, url: `mailto:${personalInfo.email}` },
      { label: personalInfo.phone, url: `tel:${personalInfo.phone.replace(/\s+/g, "")}` },
      { label: `${personalInfo.location.city}, ${personalInfo.location.country}` },
    ],
    cursorY
  );
  cursorY += 5;

  // Line 2: linkedin · github
  drawContactSegments(
    [
      { label: "linkedin.com/in/sjaraminas", url: "https://linkedin.com/in/sjaraminas" },
      { label: personalInfo.website, url: `https://${personalInfo.website}` },
    ],
    cursorY
  );
  cursorY += 12 * style.spacing;

  // === SUMMARY ===
  checkPageBreak(20);
  cursorY += addSectionHeader("Profile", cursorY);
  const summaryHeight = addText(personalInfo.bio, marginX, cursorY, {
    size: style.bodySize,
    color: colors.text,
    maxWidth: contentWidth,
  });
  cursorY += summaryHeight + 8;

  // === EXPERIENCE ===
  checkPageBreak(30);
  cursorY += addSectionHeader("Experience", cursorY);

  experience.forEach((job) => {
    const start = formatDate(job.startDate);
    const end = formatDate(job.endDate);
    const dateRange = `${start} – ${end}`;

    // Estimate entry height to avoid splitting an entry across pages.
    const bulletCount = job.bullets?.length ?? 0;
    const estimatedEntryHeight = 5 + 5.5 + bulletCount * 12 + 6;
    checkPageBreak(estimatedEntryHeight);

    addText(job.role, marginX, cursorY, { size: 11, bold: true, color: colors.text });
    addText(dateRange, pageWidth - marginX, cursorY, {
      size: 9,
      color: colors.muted,
      align: "right",
    });
    cursorY += 5;

    addText(`${job.company} — ${job.location}`, marginX, cursorY, {
      size: 10,
      color: colors.muted,
    });
    cursorY += 5.5;

    if (job.bullets && job.bullets.length > 0) {
      job.bullets.forEach((bullet) => {
        const bulletText = `• ${bullet}`;
        const bulletHeight = addText(bulletText, marginX + 3, cursorY, {
          size: style.bodySize,
          color: colors.text,
          maxWidth: contentWidth - 6,
        });
        cursorY += bulletHeight + 1.5;
      });
    }

    cursorY += 6 * style.spacing;
  });

  // === SKILLS ===
  checkPageBreak(30);
  cursorY += addSectionHeader("Skills", cursorY);

  skillCategories.forEach((category) => {
    checkPageBreak(12);
    addText(`${category.category}:`, marginX, cursorY, {
      size: 10,
      bold: true,
      color: colors.text,
    });
    cursorY += 4.5;

    const skillsHeight = addText(category.skills, marginX, cursorY, {
      size: style.bodySize,
      color: colors.text,
      maxWidth: contentWidth,
    });
    cursorY += skillsHeight + 5;
  });
  cursorY += 3;

  // === EDUCATION ===
  checkPageBreak(25);
  cursorY += addSectionHeader("Education", cursorY);

  education.forEach((edu) => {
    checkPageBreak(18);

    const degreeText = edu.field
      ? `${edu.degree}, ${edu.field}`
      : edu.degree;

    addText(degreeText, marginX, cursorY, {
      size: 11,
      bold: true,
      color: colors.text,
    });
    addText(`${edu.startYear} – ${edu.endYear}`, pageWidth - marginX, cursorY, {
      size: 9,
      color: colors.muted,
      align: "right",
    });
    cursorY += 5;

    addText(`${edu.institution} — ${edu.location}`, marginX, cursorY, {
      size: 10,
      color: colors.muted,
    });
    cursorY += 5;

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

  // === LANGUAGES ===
  checkPageBreak(20);
  cursorY += addSectionHeader("Languages", cursorY);

  const languageText = languages
    .map((lang) => `${lang.language} — ${lang.proficiency}`)
    .join("    ");
  const langHeight = addText(languageText, marginX, cursorY, {
    size: style.bodySize,
    color: colors.text,
    maxWidth: contentWidth,
  });
  cursorY += langHeight + 6;

  // === PAGE FOOTERS ===
  // Add "Name — Page X of N" on every page (skip if single-page CV).
  const totalPages = doc.getNumberOfPages();
  if (totalPages > 1) {
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont(fontName, "normal");
      doc.setFontSize(8);
      doc.setTextColor(colors.muted);
      doc.text(
        toAscii(`${personalInfo.name} — Page ${p} of ${totalPages}`),
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );
    }
  }

  return doc.output("blob");
}

/**
 * Trigger a browser download of the generated CV PDF.
 */
export async function downloadCV(
  templateId: CvTemplateId = defaultTemplateId
): Promise<void> {
  const blob = await generateCVBlob(templateId);
  const url = URL.createObjectURL(blob);
  const filename = `Sarunas-Jaraminas-CV-${templateId}.pdf`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the object URL after the download starts
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
