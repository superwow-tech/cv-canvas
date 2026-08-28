import type { ResumeDocument } from "@/lib/resume-schema";
import {
  personalInfo,
  experience,
  education,
  languages,
  skillCategories,
} from "@/data/portfolio-data";

/**
 * The demo resume shown on the landing page and at /example.
 * Derived from the original portfolio data.
 */
export const sampleResume: ResumeDocument = {
  personal: {
    name: personalInfo.name,
    title: personalInfo.title,
    email: personalInfo.email,
    phone: personalInfo.phone,
    city: personalInfo.location.city,
    country: personalInfo.location.country,
    website: personalInfo.website,
    linkedin: "linkedin.com/in/mantaspetrauskas",
    bio: personalInfo.bio,
  },
  experience: experience.map((job) => ({
    id: job.id,
    role: job.role,
    company: job.company,
    location: job.location,
    startDate: job.startDate,
    endDate: job.endDate ?? "",
    bullets: job.bullets ?? [],
    tech: job.tech ?? [],
  })),
  education: education.map((edu) => ({
    id: edu.id,
    institution: edu.institution,
    degree: edu.degree,
    field: edu.field,
    startYear: edu.startYear,
    endYear: edu.endYear,
    location: edu.location,
    details: edu.details ?? "",
  })),
  skills: skillCategories.map((c, i) => ({
    id: `skill-${i + 1}`,
    category: c.category,
    skills: c.skills,
  })),
  languages: languages.map((l, i) => ({
    id: `lang-${i + 1}`,
    language: l.language,
    proficiency: l.proficiency,
  })),
};

/** Starter content for a brand-new resume so the preview is never empty. */
export const starterResume = (): ResumeDocument => ({
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
  experience: [
    {
      id: "exp-1",
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      bullets: [""],
      tech: [],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
      location: "",
      details: "",
    },
  ],
  skills: [{ id: "sk-1", category: "Core Expertise", skills: "" }],
  languages: [{ id: "ln-1", language: "", proficiency: "" }],
});
