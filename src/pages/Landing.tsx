import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, FileDown, LayoutTemplate, ListChecks, Save } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import TemplatesSection from "@/components/sections/TemplatesSection";
import { plans, product } from "@/lib/plans";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    icon: ListChecks,
    title: "Guided wizard",
    body: "Six short steps — details, profile, experience, education, skills, languages. No blank-page paralysis.",
  },
  {
    icon: LayoutTemplate,
    title: "Three designs",
    body: "Timeline, Classic and Minimal. Same content, three very different first impressions.",
  },
  {
    icon: FileDown,
    title: "Print-ready PDF",
    body: "A4 or Letter, adjustable margins, clickable contact links, automatic page numbering.",
  },
  {
    icon: Save,
    title: "Saved and reusable",
    body: "Your resumes live in your account. Duplicate one and tailor it per application.",
  },
];

const steps = [
  { n: "01", title: "Fill in the wizard", body: "Answer plain questions. The live preview updates as you type." },
  { n: "02", title: "Pick a design", body: "Preview the exact PDF for each template before you commit." },
  { n: "03", title: "Export and apply", body: "Download a print-ready PDF, then reuse it for the next role." },
];

const faqs = [
  {
    q: "Is the free plan really free?",
    a: "Yes. One saved resume, the Timeline template and unlimited A4 exports, with no card required.",
  },
  {
    q: "Are the PDFs ATS-friendly?",
    a: "They use real text (not images), standard fonts and a single-column structure, so parsers read them cleanly.",
  },
  {
    q: "Can I keep several versions?",
    a: "On Pro you can save unlimited resumes and duplicate any of them to tailor per application.",
  },
  {
    q: "Who owns my data?",
    a: "You do. Your resumes are private to your account and you can delete them at any time.",
  },
];

export default function Landing() {
  const { user } = useAuth();
  const primaryTo = user ? "/app" : "/auth?mode=signup";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: product.description,
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "EUR", name: "Free" },
      { "@type": "Offer", price: "6", priceCurrency: "EUR", name: "Pro" },
    ],
  };

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-16 pb-12 md:pt-24 md:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="uppercase tracking-[0.3em] text-xs text-foreground/50 font-['Rubik']"
        >
          Resume builder
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 text-[clamp(2.6rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tighter uppercase font-['Rubik'] max-w-4xl"
        >
          Portfolio-quality
          <br />
          resumes in
          <span className="relative whitespace-nowrap">
            {" "}minutes
            <span className="absolute left-0 -bottom-1 h-2 w-full bg-mint/70 -z-10" aria-hidden />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-foreground/70 font-['Rubik'] text-balance"
        >
          {product.name} turns your career story into a print-ready PDF. A guided wizard, a live preview, three
          editorial-grade designs, and exports sized for real printers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center"
        >
          <Link
            to={primaryTo}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors font-['Rubik']"
          >
            Build my resume free <ArrowRight size={16} />
          </Link>
          <a
            href="#templates"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium hover:border-foreground/50 transition-colors font-['Rubik']"
          >
            See the templates
          </a>
          <span className="text-xs text-foreground/50 font-['Rubik'] sm:ml-2">No card required</span>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-12 md:py-16 border-t border-foreground/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-mint-light text-foreground/80">
                <Icon size={18} />
              </span>
              <h3 className="mt-4 text-base font-medium font-['Rubik']">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/65 font-['Rubik']">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-12 md:py-16 border-t border-foreground/10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase font-['Rubik']">How it works</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((s) => (
            <div key={s.n} className="border-t border-foreground/15 pt-5">
              <span className="text-xs tracking-[0.3em] text-foreground/45 font-['Rubik']">{s.n}</span>
              <h3 className="mt-3 text-lg font-medium font-['Rubik']">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/65 font-['Rubik']">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATES (live PDF preview of the sample resume) */}
      <section id="templates" className="border-t border-foreground/10 scroll-mt-20">
        <TemplatesSection />
        <p className="text-center text-sm text-foreground/55 font-['Rubik'] pb-8">
          Previews use our{" "}
          <Link to="/example" className="underline hover:text-foreground">
            sample resume
          </Link>
          .
        </p>
      </section>

      {/* PRICING */}
      <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-12 md:py-16 border-t border-foreground/10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase font-['Rubik']">Pricing</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border p-6 md:p-8 ${
                plan.id === "pro" ? "border-mint bg-mint-light/25" : "border-foreground/15"
              }`}
            >
              <h3 className="text-lg font-medium font-['Rubik']">{plan.name}</h3>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-['Rubik']">{plan.price}</span>
                <span className="text-sm text-foreground/55 font-['Rubik']">{plan.cadence}</span>
              </p>
              <p className="mt-3 text-sm text-foreground/65 font-['Rubik']">{plan.summary}</p>
              <ul className="mt-5 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-foreground/75 font-['Rubik']">
                    <Check size={16} className="mt-0.5 shrink-0 text-foreground/50" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.id === "pro" ? "/pricing" : primaryTo}
                className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium font-['Rubik'] transition-colors ${
                  plan.id === "pro"
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "border border-foreground/20 hover:border-foreground/50"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-12 md:py-16 border-t border-foreground/10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase font-['Rubik']">FAQ</h2>
        <dl className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {faqs.map((f) => (
            <div key={f.q}>
              <dt className="text-base font-medium font-['Rubik']">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-foreground/65 font-['Rubik']">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-14 md:py-20 border-t border-foreground/10">
        <div className="rounded-2xl bg-foreground text-background px-6 py-12 md:px-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight uppercase font-['Rubik']">
            Your next role starts with one page
          </h2>
          <p className="mt-4 text-sm md:text-base text-background/75 font-['Rubik'] max-w-xl mx-auto">
            Build it once, tailor it forever. Start free and export your first PDF in minutes.
          </p>
          <Link
            to={primaryTo}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-medium hover:bg-background/90 transition-colors font-['Rubik']"
          >
            Get started <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
