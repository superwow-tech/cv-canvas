/**
 * Portfolio Data
 * Single source of truth for all portfolio content
 */

import type { PersonalInfo, Experience, Education, Language, SkillCategory } from "@/types/portfolio";

// ===== Portfolio Data =====

export const personalInfo: PersonalInfo = {
  name: "Šarūnas Jaraminas",
  title: "a Senior Software Engineer | AI-Curious",
  location: { city: "Vilnius", country: "Lithuania" },
  website: "github.com/superwow-tech",
  email: "sarunas.jaraminas@gmail.com",
  phone: "+370 640 06633",
  avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800",
  bio: "Front-End Engineer experienced in building scalable, production-ready web applications, reusable UI components, micro-frontends, and design-system driven interfaces. Strong background in modern JavaScript and TypeScript development, with experience across frontend architecture, backend integration, CI/CD pipelines, and AI-powered application development.",
  skills:
    "JavaScript, TypeScript, Angular, React, Next.js, NestJS, Node.js, RxJS, NgRx, Micro-frontends, Design Systems, CI/CD, Azure, Docker, Figma, Storybook, LLMs, RAG, Prompt Engineering, AI SDK, LangChain, OpenAI API",
};

export const experience: Experience[] = [
  {
    id: "exp-1",
    company: "Softeta",
    role: "Senior Software Engineer",
    location: "Vilnius, Lithuania",
    startDate: "2024-01",
    endDate: null,
    description:
      "Develop and maintain payment-related web applications in the banking domain. Build new features, improve application flows, and support production releases. Contribute to micro-frontend architecture, maintainability, and frontend quality. Stack: Angular, Next.js, Git, Figma.",
    bullets: [
      "Develop and maintain payment-related web applications in the banking domain.",
      "Build new features, improve application flows, and support production releases.",
      "Contribute to micro-frontend architecture, maintainability, and frontend quality.",
    ],
    tech: ["Angular", "NextJs", "Git", "Figma"],
    current: true,
  },
  {
    id: "exp-2",
    company: "Companial",
    role: "Front-End Developer / Team Lead",
    location: "Vilnius, Lithuania",
    startDate: "2021-01",
    endDate: "2024-01",
    description:
      "Developed a business platform used by Microsoft Dynamics partners. Built reusable UI components and contributed to frontend architecture. Supported CI/CD pipelines, environment configuration, and delivery planning. Stack: Angular, Next.js, Azure, Git.",
    bullets: [
      "Developed a business platform used by Microsoft Dynamics partners.",
      "Built reusable UI components and contributed to frontend architecture.",
      "Supported CI/CD pipelines, environment configuration, and delivery planning.",
    ],
    tech: ["Angular", "NestJS", "Azure", "Git"],
    current: false,
  },
  {
    id: "exp-3",
    company: "Visma Lietuva",
    role: "Front-End Developer",
    location: "Vilnius, Lithuania",
    startDate: "2019-01",
    endDate: "2021-01",
    description:
      "Delivered features for healthcare and logistics applications. Worked on forms, UI implementation, and data-driven workflows. Participated in migration from AngularJS to Angular. Stack: Angular, React, Git, Firebase.",
    bullets: [
      "Delivered features for healthcare and logistics applications.",
      "Worked on forms, UI implementation, and data-driven workflows.",
      "Participated in migration from AngularJS to Angular.",
    ],
    tech: ["Angular", "React", "Git", "Firebase"],
    current: false,
  },
  {
    id: "exp-4",
    company: "EIS Group Lietuva",
    role: "QA Automation Engineer / DevOps Engineer",
    location: "Vilnius, Lithuania",
    startDate: "2015-01",
    endDate: "2018-12",
    description:
      "Worked across QA automation, CI/CD, and release delivery on an insurance platform. Improved test automation, pipeline stability, and software delivery processes. Stack: Java, Selenium, Jenkins, Git.",
    bullets: [
      "Worked across QA automation, CI/CD, and release delivery on an insurance platform.",
      "Improved test automation and pipeline stability.",
      "Contributed to software delivery process improvements.",
    ],
    tech: ["Java", "Selenium", "Jenkins", "Git"],
    current: false,
  },
];

export const education: Education[] = [
  {
    id: "edu-1",
    institution: "Turing College",
    degree: "AI Engineering",
    field: "",
    startYear: "2025",
    endYear: "2025",
    location: "Online",
    details: "AI software development program focused on modern AI engineering practices.",
  },
  {
    id: "edu-2",
    institution: "Mykolas Romeris University",
    degree: "Bachelor's Degree",
    field: "Informatics",
    startYear: "2012",
    endYear: "2016",
    location: "Vilnius, Lithuania",
  },
];

export const languages: Language[] = [
  { language: "Lithuanian", proficiency: "Native" },
  { language: "English", proficiency: "Professional" },
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Core Expertise",
    skills:
      "Frontend Architecture, Micro-frontends, Full-Stack Web Development, UI/UX & Design Systems, DevOps & CI/CD, Testing & QA, Agile Delivery",
  },
  {
    category: "Languages & Frameworks",
    skills: "JavaScript, TypeScript, Angular, React, React Native, Next.js, NestJS, Node.js, Expo",
  },
  {
    category: "AI & LLMs",
    skills: "RAG, AI SDK, LLMs, Prompt Engineering, LangChain, OpenAI API",
  },
  {
    category: "Design & Dev Tools",
    skills: "HTML, CSS/SCSS, Tailwind CSS, Bootstrap, Storybook, Figma, Adobe XD",
  },
  {
    category: "Deployment & Cloud",
    skills: "Azure, Docker, Kubernetes, Git, Jenkins, Vercel",
  },
];
