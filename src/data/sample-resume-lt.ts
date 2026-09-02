import type { ResumeDocument } from "@/lib/resume-schema";

/**
 * Lithuanian sample resume ("Gyvenimo aprašymas") used by the Lithuanian
 * template and by the language switch in the templates section.
 */
export const sampleResumeLt: ResumeDocument = {
  personal: {
    name: "Mantas Petrauskas",
    title: "Pardavimų vadovas",
    email: "mantas.petrauskas@pastas.lt",
    phone: "+370 600 12345",
    city: "Vilnius",
    country: "Lietuva",
    website: "mantaspetrauskas.lt",
    linkedin: "linkedin.com/in/mantaspetrauskas",
    bio:
      "Pardavimų vadovas, turintis daugiau nei 8 metų patirtį B2B pardavimuose Baltijos šalyse. " +
      "Kuriu ir įgyvendinu pardavimų strategijas, formuoju bei ugdau komandas, valdau ilgalaikius " +
      "santykius su klientais nuo pirmo kontakto iki sutarties atnaujinimo. Dirbu su CRM sistemomis, " +
      "pardavimų prognozėmis ir duomenimis grįstais sprendimais.",
  },
  experience: [
    {
      id: "lt-exp-1",
      role: "Pardavimų vadovas",
      company: "Baltic Trade House",
      location: "Vilnius, Lietuva",
      startDate: "2021-03",
      endDate: "",
      bullets: [
        "Vadovauju 6 žmonių pardavimų komandai, atsakingai už Lietuvos ir Latvijos rinkas.",
        "Metinė pardavimų apyvarta išaugo 34 % per dvejus metus optimizavus pardavimų procesą.",
        "Įdiegiau CRM procesą ir savaitines prognozes - pardavimų ciklas sutrumpėjo nuo 74 iki 51 dienos.",
        "Sudariau ir atnaujinau sutartis su 20+ didmeninės prekybos klientų.",
      ],
      tech: ["B2B pardavimai", "CRM", "Komandos vadyba", "Prognozavimas"],
    },
    {
      id: "lt-exp-2",
      role: "Pardavimų projektų vadovas",
      company: "Nordika Retail",
      location: "Kaunas, Lietuva",
      startDate: "2018-01",
      endDate: "2021-02",
      bullets: [
        "Vysčiau naujų klientų portfelį - per metus pritraukiau 45 naujus verslo klientus.",
        "Vedžiau derybas dėl kainodaros ir tiekimo sąlygų su tarptautiniais partneriais.",
        "Parengiau pardavimų komandos mokymų programą naujiems darbuotojams.",
      ],
      tech: ["Derybos", "Klientų paieška", "Kainodara"],
    },
    {
      id: "lt-exp-3",
      role: "Pardavimų specialistas",
      company: "Vilnius Logistics Group",
      location: "Vilnius, Lietuva",
      startDate: "2015-06",
      endDate: "2017-12",
      bullets: [
        "Aptarnavau 60+ nuolatinių klientų, pasiekiau 112 % metinio pardavimų plano.",
        "Rengiau komercinius pasiūlymus ir dalyvavau viešuosiuose pirkimuose.",
      ],
      tech: ["Komerciniai pasiūlymai", "Klientų aptarnavimas"],
    },
  ],
  education: [
    {
      id: "lt-edu-1",
      institution: "Vilniaus universitetas",
      degree: "Magistras",
      field: "Rinkodara ir integruota komunikacija",
      startYear: "2013",
      endYear: "2015",
      location: "Vilnius, Lietuva",
      details: "Baigimo darbas apie B2B klientų lojalumą Baltijos rinkose.",
    },
    {
      id: "lt-edu-2",
      institution: "Kauno technologijos universitetas",
      degree: "Bakalauras",
      field: "Verslo administravimas",
      startYear: "2009",
      endYear: "2013",
      location: "Kaunas, Lietuva",
      details: "",
    },
  ],
  skills: [
    {
      id: "lt-sk-1",
      category: "Pardavimai",
      skills:
        "B2B pardavimai, naujų klientų paieška, derybos, sutarčių valdymas, pardavimų planavimas",
    },
    {
      id: "lt-sk-2",
      category: "Vadyba",
      skills:
        "Komandos formavimas, mentorystė, tikslų nustatymas, veiklos rodiklių (KPI) valdymas",
    },
    {
      id: "lt-sk-3",
      category: "Įrankiai",
      skills: "Salesforce, HubSpot, Pipedrive, Power BI, MS Excel",
    },
  ],
  languages: [
    { id: "lt-ln-1", language: "Lietuvių", proficiency: "gimtoji" },
    { id: "lt-ln-2", language: "Anglų", proficiency: "C1" },
    { id: "lt-ln-3", language: "Vokiečių", proficiency: "B1" },
  ],
};
