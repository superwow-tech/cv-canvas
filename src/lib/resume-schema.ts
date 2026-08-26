/**
 * Shared resume document model used by the builder, the live preview and the
 * PDF generator. One resume = one ResumeDocument.
 */

export interface ResumePersonal {
  name: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  website: string;
  linkedin: string;
  bio: string;
}

export interface ResumeExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  /** YYYY-MM */
  startDate: string;
  /** YYYY-MM or empty string for "Present" */
  endDate: string;
  bullets: string[];
  tech: string[];
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  location: string;
  details: string;
}

export interface ResumeSkillGroup {
  id: string;
  category: string;
  skills: string;
}

export interface ResumeLanguage {
  id: string;
  language: string;
  proficiency: string;
}

export interface ResumeDocument {
  personal: ResumePersonal;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillGroup[];
  languages: ResumeLanguage[];
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export const emptyResume = (): ResumeDocument => ({
  personal: {
    name: "",
    title: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    website: "",
    linkedin: "",
    bio: "",
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
});

export const blankExperience = (): ResumeExperience => ({
  id: uid(),
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  bullets: [""],
  tech: [],
});

export const blankEducation = (): ResumeEducation => ({
  id: uid(),
  institution: "",
  degree: "",
  field: "",
  startYear: "",
  endYear: "",
  location: "",
  details: "",
});

export const blankSkillGroup = (): ResumeSkillGroup => ({
  id: uid(),
  category: "",
  skills: "",
});

export const blankLanguage = (): ResumeLanguage => ({
  id: uid(),
  language: "",
  proficiency: "",
});

/** Narrow unknown JSON coming from the database into a ResumeDocument. */
export function normalizeResume(input: unknown): ResumeDocument {
  const base = emptyResume();
  if (!input || typeof input !== "object") return base;
  const raw = input as Partial<ResumeDocument>;
  return {
    personal: { ...base.personal, ...(raw.personal ?? {}) },
    experience: Array.isArray(raw.experience) ? raw.experience : [],
    education: Array.isArray(raw.education) ? raw.education : [],
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    languages: Array.isArray(raw.languages) ? raw.languages : [],
  };
}
