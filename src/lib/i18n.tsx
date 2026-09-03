/**
 * Site-wide language support (English / Lithuanian).
 * The chosen UI language also drives the default resume language used by the
 * PDF generator, so switching in the header keeps everything consistent.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CvLocale } from "@/lib/cv-locale";

export type Lang = CvLocale; // "en" | "lt"

const STORAGE_KEY = "applyo-lang";

type Dict = Record<string, string>;

const en: Dict = {
  // Header / footer
  "nav.templates": "Templates",
  "nav.pricing": "Pricing",
  "nav.sample": "Sample resume",
  "nav.myResumes": "My resumes",
  "nav.account": "Account",
  "nav.signIn": "Sign in",
  "nav.signOut": "Sign out",
  "nav.startFree": "Start free",
  "nav.language": "Language",
  "footer.example": "Example",
  "footer.terms": "Terms",
  "footer.privacy": "Privacy",

  // Landing
  "landing.badge": "Resume builder",
  "landing.h1": "Portfolio-quality resumes in minutes",
  "landing.lede":
    "Applyo turns your career story into a shareable online resume page. A guided wizard, a live preview, and editorial-grade designs - with a print-ready PDF whenever you need it.",
  "landing.ctaSample": "See a sample resume",
  "landing.ctaBuild": "Build my resume free",
  "landing.noCard": "No card required",
  "landing.how": "How it works",
  "landing.step1.title": "Fill in the wizard",
  "landing.step1.body": "Answer plain questions. The live preview updates as you type.",
  "landing.step2.title": "Pick a design",
  "landing.step2.body": "Editorial layouts that look great on every screen.",
  "landing.step3.title": "Share your page",
  "landing.step3.body":
    "Get a link you can send to recruiters, then download a print-ready PDF whenever you need it.",
  "landing.templates": "Resume templates",
  "landing.templatesBody": "Proven layouts optimised for readability.",
  "landing.ctaSample2": "See the sample resume",
  "landing.pricing": "Simple pricing",
  "landing.pricingBody": "Everything you need, nothing you don't.",
  "landing.faq": "Questions",
  "landing.faq1.q": "Is the free plan really free?",
  "landing.faq1.a":
    "Yes. One saved resume, the Timeline template and unlimited A4 exports, with no card required.",
  "landing.faq2.q": "Are the PDFs ATS-friendly?",
  "landing.faq2.a":
    "They use real text (not images), standard fonts and a single-column structure, so parsers read them cleanly.",
  "landing.faq3.q": "Can I keep several versions?",
  "landing.faq3.a":
    "On Pro you can save unlimited resumes and duplicate any of them to tailor per application.",
  "landing.faq4.q": "Who owns my data?",
  "landing.faq4.a": "You do. Your resumes are private to your account and you can delete them at any time.",
  "landing.getStarted": "Get started",

  // Pricing page
  "pricing.h1": "Simple pricing",
  "pricing.lede":
    "Start free with one resume. Upgrade when you are applying to several roles and want every template, paper size and margin control.",
  "pricing.current": "Current plan",
  "pricing.onPro": "You're on Pro",
  "pricing.goToResumes": "Go to my resumes",
  "pricing.until": "Your Pro access runs until",

  // Plans
  "plan.free.name": "Free",
  "plan.free.cadence": "forever",
  "plan.free.summary": "Your own shareable resume page and a ready-to-print PDF.",
  "plan.free.f1": "1 saved resume",
  "plan.free.f2": "Shareable online resume page",
  "plan.free.f3": "Timeline layout",
  "plan.free.f4": "PDF download",
  "plan.free.f5": "Unlimited edits",
  "plan.free.cta": "Start free",
  "plan.pro.name": "Pro",
  "plan.pro.cadence": "per month",
  "plan.pro.summary": "For anyone applying to more than one role.",
  "plan.pro.f1": "Unlimited saved resumes",
  "plan.pro.f2": "All layouts",
  "plan.pro.f3": "Duplicate and tailor per application",
  "plan.pro.f4": "Full export controls in the editor",
  "plan.pro.f5": "Priority email support",
  "plan.pro.cta": "Upgrade to Pro",

  // Templates section
  "tpl.heading": "Resume Templates",
  "tpl.subFull": "Pick a design, preview the exact PDF, then export it.",
  "tpl.subMinimal": "Every layout exports to a clean, print-ready PDF.",
  "tpl.preview": "Preview",
  "tpl.exportOptions": "Export options",
  "tpl.paperSize": "Paper size",
  "tpl.marginsSide": "Side margins",
  "tpl.marginsTop": "Top / bottom margins",
  "tpl.reset": "Reset to 18 mm",
  "tpl.export": "Export",
  "tpl.exportPdf": "Export PDF",
  "tpl.generating": "Generating…",
  "tpl.build": "Build your own resume",
  "tpl.buildNote": "Fill in your details once - switch language or template any time.",
  "tpl.previewFail": "Could not build the preview",
  "tpl.tryAgain": "Please try again.",
  "tpl.downloading": "Generating your CV…",
  "tpl.downloaded": "CV downloaded",
  "tpl.downloadFail": "Could not generate CV",

  // Example page
  "example.notice": "This is a sample resume built with Applyo.",
  "example.buildOwn": "Build your own",
};

const lt: Dict = {
  "nav.templates": "Šablonai",
  "nav.pricing": "Kainos",
  "nav.sample": "CV pavyzdys",
  "nav.myResumes": "Mano CV",
  "nav.account": "Paskyra",
  "nav.signIn": "Prisijungti",
  "nav.signOut": "Atsijungti",
  "nav.startFree": "Pradėti nemokamai",
  "nav.language": "Kalba",
  "footer.example": "Pavyzdys",
  "footer.terms": "Taisyklės",
  "footer.privacy": "Privatumas",

  "landing.badge": "CV kūrimo įrankis",
  "landing.h1": "Profesionalus CV per kelias minutes",
  "landing.lede":
    "Applyo jūsų karjeros istoriją paverčia gražiu internetiniu CV puslapiu. Paprasti klausimai, gyva peržiūra ir kelios redakcinio lygio formos - o spausdinimui paruoštą PDF atsisiųsite kada tik reikės.",
  "landing.ctaSample": "Žiūrėti CV pavyzdį",
  "landing.ctaBuild": "Kurti CV nemokamai",
  "landing.noCard": "Kortelės nereikia",
  "landing.how": "Kaip tai veikia",
  "landing.step1.title": "Užpildykite formą",
  "landing.step1.body": "Atsakykite į paprastus klausimus. Peržiūra atsinaujina rašant.",
  "landing.step2.title": "Pasirinkite dizainą",
  "landing.step2.body": "Tvarkingi maketai, kurie gerai atrodo bet kuriame ekrane.",
  "landing.step3.title": "Dalinkitės nuoroda",
  "landing.step3.body":
    "Gaukite nuorodą, kurią galite siųsti darbdaviams, ir atsisiųskite spausdinimui paruoštą PDF.",
  "landing.templates": "CV šablonai",
  "landing.templatesBody": "Patikrinti maketai, optimizuoti skaitomumui.",
  "landing.ctaSample2": "Žiūrėti CV pavyzdį",
  "landing.pricing": "Paprastos kainos",
  "landing.pricingBody": "Viskas, ko reikia - ir nieko daugiau.",
  "landing.faq": "Klausimai",
  "landing.faq1.q": "Ar nemokamas planas tikrai nemokamas?",
  "landing.faq1.a":
    "Taip. Vienas išsaugotas CV, „Timeline“ šablonas ir neribotas A4 atsisiuntimas - kortelės nereikia.",
  "landing.faq2.q": "Ar PDF tinka ATS sistemoms?",
  "landing.faq2.a":
    "Naudojamas tikras tekstas (ne vaizdai), standartiniai šriftai ir viena skiltis, todėl sistemos jį perskaito be klaidų.",
  "landing.faq3.q": "Ar galiu turėti kelias versijas?",
  "landing.faq3.a":
    "Su Pro planu galite išsaugoti neribotai CV ir kopijuoti bet kurį, kad pritaikytumėte konkrečiai pozicijai.",
  "landing.faq4.q": "Kam priklauso mano duomenys?",
  "landing.faq4.a": "Jums. Jūsų CV yra privatūs jūsų paskyroje ir galite juos ištrinti bet kada.",
  "landing.getStarted": "Pradėti",

  "pricing.h1": "Paprastos kainos",
  "pricing.lede":
    "Pradėkite nemokamai su vienu CV. Pereikite į Pro, kai teikiate kelias paraiškas ir norite visų šablonų, lapo formatų bei paraščių valdymo.",
  "pricing.current": "Dabartinis planas",
  "pricing.onPro": "Turite Pro",
  "pricing.goToResumes": "Į mano CV",
  "pricing.until": "Pro galioja iki",

  "plan.free.name": "Nemokamas",
  "plan.free.cadence": "visada",
  "plan.free.summary": "Jūsų internetinis CV puslapis ir spausdinimui paruoštas PDF.",
  "plan.free.f1": "1 išsaugotas CV",
  "plan.free.f2": "Internetinis CV puslapis su nuoroda",
  "plan.free.f3": "„Timeline“ maketas",
  "plan.free.f4": "PDF atsisiuntimas",
  "plan.free.f5": "Neriboti redagavimai",
  "plan.free.cta": "Pradėti nemokamai",
  "plan.pro.name": "Pro",
  "plan.pro.cadence": "per mėnesį",
  "plan.pro.summary": "Tiems, kurie teikia daugiau nei vieną paraišką.",
  "plan.pro.f1": "Neribotai išsaugotų CV",
  "plan.pro.f2": "Visi maketai",
  "plan.pro.f3": "Kopijavimas ir pritaikymas kiekvienai paraiškai",
  "plan.pro.f4": "Pilnas eksporto valdymas redaktoriuje",
  "plan.pro.f5": "Prioritetinė pagalba el. paštu",
  "plan.pro.cta": "Rinktis Pro",

  "tpl.heading": "CV šablonai",
  "tpl.subFull": "Pasirinkite dizainą, peržiūrėkite tikrą PDF ir atsisiųskite.",
  "tpl.subMinimal": "Kiekvienas maketas eksportuojamas į tvarkingą, spausdinimui paruoštą PDF.",
  "tpl.preview": "Peržiūra",
  "tpl.exportOptions": "Eksporto nustatymai",
  "tpl.paperSize": "Lapo formatas",
  "tpl.marginsSide": "Šoninės paraštės",
  "tpl.marginsTop": "Viršaus / apačios paraštės",
  "tpl.reset": "Atstatyti į 18 mm",
  "tpl.export": "Atsisiųsti",
  "tpl.exportPdf": "Atsisiųsti PDF",
  "tpl.generating": "Kuriama…",
  "tpl.build": "Kurkite savo CV",
  "tpl.buildNote": "Užpildykite duomenis vieną kartą - kalbą ar šabloną galite pakeisti bet kada.",
  "tpl.previewFail": "Nepavyko sukurti peržiūros",
  "tpl.tryAgain": "Bandykite dar kartą.",
  "tpl.downloading": "Kuriamas jūsų CV…",
  "tpl.downloaded": "CV atsisiųstas",
  "tpl.downloadFail": "Nepavyko sukurti CV",

  "example.notice": "Tai CV pavyzdys, sukurtas su Applyo.",
  "example.buildOwn": "Kurkite savo",
};

const dictionaries: Record<Lang, Dict> = { en, lt };

export const languages: Array<{ id: Lang; label: string; short: string }> = [
  { id: "en", label: "English", short: "EN" },
  { id: "lt", label: "Lietuvių", short: "LT" },
];

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nValue | undefined>(undefined);

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "lt") return stored;
  return navigator.language?.toLowerCase().startsWith("lt") ? "lt" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const t = useCallback((key: string) => dictionaries[lang][key] ?? dictionaries.en[key] ?? key, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
