/**
 * Portfolio Data
 * Single source of truth for all sample/demo content.
 * NOTE: All data below is fictional placeholder content used for demos.
 */

import type { PersonalInfo, Experience, Education, Language, SkillCategory } from "@/types/portfolio";

// ===== Sample Data (fictional persona) =====

export const personalInfo: PersonalInfo = {
  name: "Mantas Petrauskas",
  title: "Sales Manager | B2B & Client Relations",
  location: { city: "Vilnius", country: "Lithuania" },
  website: "",
  email: "mantas.petrauskas@example.com",
  phone: "+370 612 34567",
  avatar: "",
  bio: "Sales Manager with 8+ years of experience in B2B sales, account management, and business development. Skilled at building long-term client relationships, negotiating contracts, and consistently exceeding revenue targets. Experienced in leading small sales teams, developing go-to-market strategies, and working with CRM-driven sales processes.",
  skills:
    "B2B Sales, Account Management, Business Development, Negotiation, CRM (Salesforce, HubSpot), Sales Forecasting, Lead Generation, Contract Management, Team Leadership, Customer Success, Market Analysis, Presentation Skills",
};

export const experience: Experience[] = [
  {
    id: "exp-1",
    company: "Baltic Trade House",
    role: "Sales Manager",
    location: "Vilnius, Lithuania",
    startDate: "2021-03",
    endDate: null,
    description:
      "Manage a portfolio of 40+ B2B clients across the Baltic region. Own the full sales cycle from prospecting to contract signing and renewals. Lead a team of 3 sales representatives.",
    bullets: [
      "Grew annual revenue in assigned territory by 32% year over year.",
      "Manage a portfolio of 40+ B2B clients across the Baltic region.",
      "Lead and coach a team of 3 sales representatives.",
    ],
    tech: ["Salesforce", "HubSpot", "MS Office"],
    current: true,
  },
  {
    id: "exp-2",
    company: "Nordika Retail",
    role: "Key Account Manager",
    location: "Vilnius, Lithuania",
    startDate: "2018-06",
    endDate: "2021-02",
    description:
      "Managed key retail accounts and negotiated annual supply agreements. Coordinated with logistics and marketing teams to ensure on-time delivery and promotional support.",
    bullets: [
      "Managed 15 key accounts generating over €2M in annual revenue.",
      "Negotiated annual supply agreements and promotional campaigns.",
      "Achieved 110% of sales target for three consecutive years.",
    ],
    tech: ["CRM", "Excel", "ERP"],
    current: false,
  },
  {
    id: "exp-3",
    company: "Amber Distribution",
    role: "Sales Representative",
    location: "Kaunas, Lithuania",
    startDate: "2016-01",
    endDate: "2018-05",
    description:
      "Responsible for outbound sales and new client acquisition in the FMCG sector. Built a client base from scratch in the Kaunas region.",
    bullets: [
      "Acquired 60+ new clients in the Kaunas region.",
      "Consistently exceeded monthly sales quotas by 15-20%.",
      "Prepared offers, contracts, and sales reports.",
    ],
    tech: ["CRM", "MS Office"],
    current: false,
  },
];

export const education: Education[] = [
  {
    id: "edu-1",
    institution: "Vilnius University",
    degree: "Bachelor's Degree",
    field: "Business Administration",
    startYear: "2012",
    endYear: "2016",
    location: "Vilnius, Lithuania",
  },
  {
    id: "edu-2",
    institution: "Kaunas University of Technology",
    degree: "Professional Certificate",
    field: "Sales & Negotiation",
    startYear: "2018",
    endYear: "2018",
    location: "Kaunas, Lithuania",
    details: "Intensive professional program on negotiation strategy and B2B sales processes.",
  },
];

export const languages: Language[] = [
  { language: "Lithuanian", proficiency: "Native" },
  { language: "English", proficiency: "Professional" },
  { language: "German", proficiency: "Intermediate" },
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Core Expertise",
    skills:
      "B2B Sales, Account Management, Business Development, Negotiation, Sales Strategy, Team Leadership",
  },
  {
    category: "Sales Tools",
    skills: "Salesforce, HubSpot, Pipedrive, LinkedIn Sales Navigator, MS Office, Excel",
  },
  {
    category: "Business Skills",
    skills:
      "Sales Forecasting, Lead Generation, Contract Management, Market Analysis, Customer Success, Presentation Skills",
  },
  {
    category: "Personal Strengths",
    skills: "Communication, Relationship Building, Goal Orientation, Problem Solving, Time Management",
  },
];
