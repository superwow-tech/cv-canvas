import type { CvTemplateId } from "@/lib/cv-templates";

/** Product identity, reused across marketing and app UI. */
export const product = {
  name: "Applyo",
  tagline: "Portfolio-quality resumes, ready in minutes.",
  description:
    "Applyo turns your career story into a print-ready PDF resume. Fill in a guided wizard, pick a design, export A4 or Letter.",
};

export interface Plan {
  id: "free" | "pro";
  name: string;
  price: string;
  cadence: string;
  summary: string;
  features: string[];
  cta: string;
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "€0",
    cadence: "forever",
    summary: "Your own shareable resume page and a ready-to-print PDF.",
    features: [
      "1 saved resume",
      "Shareable online resume page",
      "Timeline layout",
      "PDF download",
      "Unlimited edits",
    ],
    cta: "Start free",
  },
  {
    id: "pro",
    name: "Pro",
    price: "€6",
    cadence: "per month",
    summary: "For anyone applying to more than one role.",
    features: [
      "Unlimited saved resumes",
      "All three layouts",
      "Duplicate and tailor per application",
      "Full export controls in the editor",
      "Priority email support",
    ],
    cta: "Upgrade to Pro",
  },
];

export const FREE_RESUME_LIMIT = 1;
export const FREE_TEMPLATES: CvTemplateId[] = ["timeline", "lithuanian"];

export const canUseTemplate = (isPro: boolean, id: CvTemplateId) =>
  isPro || FREE_TEMPLATES.includes(id);

export const canCreateResume = (isPro: boolean, count: number) =>
  isPro || count < FREE_RESUME_LIMIT;
