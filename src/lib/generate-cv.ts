import { jsPDF } from "jspdf";
import {
  personalInfo,
  experience,
  education,
  languages,
  skillCategories,
} from "@/data/portfolio-data";
import dejaVuSansUrl from "@/assets/fonts/DejaVuSans.ttf?url";

/**
 * Convert an ArrayBuffer to a base64 string.
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Generate a professional PDF CV from portfolio data.
 * Returns a Blob that can be downloaded or opened.
 */
export async function generateCVBlob(): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 20;
  const contentWidth = pageWidth - marginX * 2;
  let cursorY = 18;

  const colors = {
    text: "#1f2937",
    muted: "#6b7280",
    accent: "#6BCABA",
    light: "#f3f4f6",
  };

  const fontName = "DejaVuSans";
  const fontResponse = await fetch(dejaVuSansUrl);
  const fontBuffer = await fontResponse.arrayBuffer();
  const fontBase64 = arrayBufferToBase64(fontBuffer);
  doc.addFileToVFS(`${fontName}.ttf`, fontBase64);
  doc.addFont(`${fontName}.ttf`, fontName, "normal");
  doc.addFont(`${fontName}.ttf`, fontName, "bold");
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

    const lines = doc.splitTextToSize(text, maxWidth);
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
    addText(title.toUpperCase(), marginX, y, {
      size: 11,
      bold: true,
      color: colors.text,
    });
    doc.setDrawColor(colors.accent);
    doc.setLineWidth(0.6);
    doc.line(marginX, y + 2.5, pageWidth - marginX, y + 2.5);
    return 7;
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
    if (cursorY + neededHeight > pageHeight - 15) {
      if (reserveSpace && cursorY > 18) {
        doc.addPage();
        cursorY = 18;
      }
      return true;
    }
    return false;
  };

  // === HEADER ===
  addText(personalInfo.name, marginX, cursorY, {
    size: 26,
    bold: true,
    color: colors.text,
  });
  cursorY += 10;

  addText(personalInfo.title, marginX, cursorY, {
    size: 12,
    color: colors.muted,
  });
  cursorY += 6;

  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    `${personalInfo.location.city}, ${personalInfo.location.country}`,
    `linkedin.com/in/sjaraminas`,
    personalInfo.website,
  ];
  const contactLine = contactParts.join("  •  ");
  const contactHeight = addText(contactLine, marginX, cursorY, {
    size: 9,
    color: colors.muted,
    maxWidth: contentWidth,
  });
  cursorY += contactHeight + 10;

  // === SUMMARY ===
  checkPageBreak(20);
  cursorY += addSectionHeader("Profile", cursorY);
  const summaryHeight = addText(personalInfo.bio, marginX, cursorY, {
    size: 10,
    color: colors.text,
    maxWidth: contentWidth,
  });
  cursorY += summaryHeight + 8;

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
      size: 10,
      color: colors.text,
      maxWidth: contentWidth,
    });
    cursorY += skillsHeight + 5;
  });
  cursorY += 3;

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
          size: 10,
          color: colors.text,
          maxWidth: contentWidth - 6,
        });
        cursorY += bulletHeight + 1.5;
      });
    }

    cursorY += 6;
  });

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
    size: 10,
    color: colors.text,
    maxWidth: contentWidth,
  });
  cursorY += langHeight + 6;

  return doc.output("blob");
}

/**
 * Trigger a browser download of the generated CV PDF.
 */
export async function downloadCV(): Promise<void> {
  const blob = await generateCVBlob();
  const url = URL.createObjectURL(blob);
  const filename = "Sarunas-Jaraminas-CV.pdf";

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the object URL after the download starts
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
