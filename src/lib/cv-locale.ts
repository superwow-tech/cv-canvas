/**
 * Resume language support. Controls the section headings, month names and
 * footer wording used inside the generated PDF.
 */

export type CvLocale = "en" | "lt";

export interface CvLabels {
  profile: string;
  experience: string;
  skills: string;
  education: string;
  languages: string;
  present: string;
  page: (current: number, total: number) => string;
  months: string[];
  /** Optional document title printed above the name (LT CVs often use it). */
  documentTitle?: string;
}

export const cvLocales: Array<{ id: CvLocale; label: string; hint: string }> = [
  { id: "en", label: "English", hint: "EN" },
  { id: "lt", label: "Lietuvių", hint: "LT" },
];

export const cvLabels: Record<CvLocale, CvLabels> = {
  en: {
    profile: "Profile",
    experience: "Experience",
    skills: "Skills",
    education: "Education",
    languages: "Languages",
    present: "Present",
    page: (c, t) => `Page ${c} of ${t}`,
    months: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
  },
  lt: {
    profile: "Apie mane",
    experience: "Darbo patirtis",
    skills: "Įgūdžiai",
    education: "Išsilavinimas",
    languages: "Kalbos",
    present: "iki dabar",
    page: (c, t) => `${c} psl. iš ${t}`,
    months: [
      "saus.", "vas.", "kov.", "bal.", "geg.", "birž.",
      "liep.", "rugp.", "rugs.", "spal.", "lapkr.", "gruod.",
    ],
    documentTitle: "Gyvenimo aprašymas",
  },
};

export function getCvLabels(locale: CvLocale = "en"): CvLabels {
  return cvLabels[locale] ?? cvLabels.en;
}
