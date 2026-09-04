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
    name: "plan.free.name",
    price: "€0",
    cadence: "plan.free.cadence",
    summary: "plan.free.summary",
    features: ["plan.free.f1", "plan.free.f2", "plan.free.f3", "plan.free.f4", "plan.free.f5"],
    cta: "plan.free.cta",
  },
  {
    id: "pro",
    name: "plan.pro.name",
    price: "€6",
    cadence: "plan.pro.cadence",
    summary: "plan.pro.summary",
    features: ["plan.pro.f1", "plan.pro.f2", "plan.pro.f3", "plan.pro.f4", "plan.pro.f5"],
    cta: "plan.pro.cta",
  },
];

/** Resolves the translation keys stored on each plan into display strings. */
export const localizePlans = (t: (key: string) => string): Plan[] =>
  plans.map((p) => ({
    ...p,
    name: t(p.name),
    cadence: t(p.cadence),
    summary: t(p.summary),
    features: p.features.map(t),
    cta: t(p.cta),
  }));

export const FREE_RESUME_LIMIT = 1;
export const FREE_TEMPLATES: CvTemplateId[] = ["timeline"];

export const canUseTemplate = (isPro: boolean, id: CvTemplateId) =>
  isPro || FREE_TEMPLATES.includes(id);

export const canCreateResume = (isPro: boolean, count: number) =>
  isPro || count < FREE_RESUME_LIMIT;
