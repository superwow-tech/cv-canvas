import type { CvLocale } from "@/lib/cv-locale";

/**
 * Resume template definitions.
 * Each template shares the same data model but renders its own PDF styling.
 */

export type CvTemplateId = "timeline" | "classic" | "minimal" | "lithuanian";

export interface CvTemplateStyle {
  /** Header block alignment */
  headerAlign: "left" | "center";
  /** Name font size in pt */
  nameSize: number;
  /** Body copy size in pt */
  bodySize: number;
  /** Section header treatment */
  sectionHeader: "rule" | "underline-accent" | "plain";
  /** Letter spacing feel for section titles (uppercase vs title case) */
  sectionUppercase: boolean;
  /** Divider / accent hex color */
  accent: string;
  /** Page margin in mm */
  margin: number;
  /** Extra spacing multiplier for airy layouts */
  spacing: number;
}

export interface CvTemplate {
  id: CvTemplateId;
  name: string;
  tagline: string;
  description: string;
  style: CvTemplateStyle;
  /** Language the template is designed for. Defaults to English. */
  locale?: CvLocale;
}

export const cvTemplates: CvTemplate[] = [
  {
    id: "lithuanian",
    name: "Lietuviškas",
    tagline: "Gyvenimo aprašymas",
    description:
      "Lithuanian-language CV with local section headings, month names and formal header - ready for the Baltic job market.",
    locale: "lt",
    style: {
      headerAlign: "left",
      nameSize: 26,
      bodySize: 10,
      sectionHeader: "rule",
      sectionUppercase: true,
      accent: "#c7cdd4",
      margin: 20,
      spacing: 1.05,
    },
  },
  {
    id: "timeline",
    name: "Timeline",
    tagline: "Structured & scannable",
    description:
      "Full-width entries with ruled section headers - the layout used on this site.",
    style: {
      headerAlign: "left",
      nameSize: 30,
      bodySize: 10,
      sectionHeader: "rule",
      sectionUppercase: true,
      accent: "#d1d5db",
      margin: 20,
      spacing: 1,
    },
  },
  {
    id: "classic",
    name: "Classic",
    tagline: "Traditional & formal",
    description:
      "Centered header with compact, dense sections. Familiar to recruiters and ATS-friendly.",
    style: {
      headerAlign: "center",
      nameSize: 24,
      bodySize: 9.5,
      sectionHeader: "underline-accent",
      sectionUppercase: true,
      accent: "#9ca3af",
      margin: 18,
      spacing: 0.85,
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Airy & editorial",
    description:
      "Generous whitespace, no heavy rules, title-case headings. Built for creatives and consultants.",
    style: {
      headerAlign: "left",
      nameSize: 26,
      bodySize: 10,
      sectionHeader: "plain",
      sectionUppercase: false,
      accent: "#e5e7eb",
      margin: 24,
      spacing: 1.25,
    },
  },
];

export const defaultTemplateId: CvTemplateId = "timeline";

export function getTemplate(id: CvTemplateId): CvTemplate {
  return cvTemplates.find((t) => t.id === id) ?? cvTemplates[0];
}
