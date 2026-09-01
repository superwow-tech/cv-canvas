import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import TemplatesSection from "@/components/sections/TemplatesSection";
import { plans, product } from "@/lib/plans";
import { useAuth } from "@/hooks/useAuth";

const steps = [
  { n: "1", title: "Fill in the wizard", body: "Answer plain questions. The live preview updates as you type." },
  { n: "2", title: "Pick a design", body: "Preview the exact PDF for each template before you commit." },
  { n: "3", title: "Export and apply", body: "Download a print-ready PDF, then reuse it for the next role." },
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

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

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

      {/* HERO — centred, precise, generous air */}
      <section className="border-b border-border px-5 sm:px-8 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block rounded-full bg-border/70 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            Resume builder
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 font-display text-[clamp(2.6rem,7vw,4.5rem)] font-bold leading-[0.95] tracking-tighter text-balance"
          >
            Portfolio-quality resumes in minutes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 mx-auto max-w-2xl text-lg md:text-xl leading-relaxed text-foreground/70 text-balance"
          >
            {product.name} turns your career story into a print-ready PDF. A guided wizard, a live preview, three
            editorial-grade designs, and exports sized for real printers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-center gap-3"
          >
            <Link
              to={primaryTo}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-8 py-4 text-sm font-bold transition-transform hover:scale-[1.02]"
            >
              Build my resume free <ArrowRight size={16} />
            </Link>
            <a
              href="#templates"
              className="inline-flex items-center justify-center rounded-full border border-border px-8 py-4 text-sm font-bold transition-colors hover:bg-border/30"
            >
              See the templates
            </a>
          </motion.div>

          <p className="mt-6 text-xs font-medium text-foreground/50">No card required</p>
        </div>
      </section>

      {/* HOW IT WORKS — ghost numerals */}
      <section className="border-b border-border px-5 sm:px-8 py-20 md:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.h2 {...fadeUp} className="font-display text-4xl font-bold tracking-tight">
            How it works
          </motion.h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative isolate"
              >
                <span
                  aria-hidden
                  className="absolute -top-16 -left-2 -z-10 font-display text-[6rem] leading-none font-bold text-border/80"
                >
                  {s.n}
                </span>
                <h3 className="font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-4 text-foreground/70 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES — tinted band */}
      <section id="templates" className="border-b border-border bg-border/20 scroll-mt-20">
        <div className="px-5 sm:px-8 pt-20 md:pt-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight">Resume templates</h2>
              <p className="mt-4 text-foreground/70">Proven layouts optimised for readability.</p>
            </div>
            <Link
              to="/example"
              className="text-sm font-bold underline decoration-mint decoration-2 underline-offset-4"
            >
              See the sample resume
            </Link>
          </div>
        </div>
        <TemplatesSection />
      </section>

      {/* PRICING */}
      <section className="border-b border-border px-5 sm:px-8 py-20 md:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight">Simple pricing</h2>
            <p className="mt-4 text-foreground/70">Everything you need, nothing you don't.</p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan) => {
              const isPro = plan.id === "pro";
              return (
                <motion.div
                  key={plan.id}
                  {...fadeUp}
                  className={`flex flex-col rounded-2xl p-8 md:p-10 ${
                    isPro ? "bg-foreground text-background" : "border border-border"
                  }`}
                >
                  <h3 className={`font-display text-lg font-bold ${isPro ? "text-mint" : ""}`}>{plan.name}</h3>
                  <p className="mt-2 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold">{plan.price}</span>
                    <span className={`text-sm ${isPro ? "text-background/50" : "text-foreground/50"}`}>
                      {plan.cadence}
                    </span>
                  </p>
                  <p className={`mt-4 text-sm ${isPro ? "text-background/70" : "text-foreground/70"}`}>
                    {plan.summary}
                  </p>
                  <ul className="mt-8 flex-1 space-y-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={isPro ? "/pricing" : primaryTo}
                    className={`mt-10 inline-flex w-full items-center justify-center rounded-full py-3.5 text-sm font-bold transition-all ${
                      isPro
                        ? "bg-mint text-foreground hover:scale-[1.02]"
                        : "border border-foreground hover:bg-foreground hover:text-background"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border px-5 sm:px-8 py-20 md:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.h2 {...fadeUp} className="font-display text-4xl font-bold tracking-tight">
            Questions
          </motion.h2>
          <dl className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
            {faqs.map((f) => (
              <motion.div key={f.q} {...fadeUp}>
                <dt className="font-display text-lg font-bold">{f.q}</dt>
                <dd className="mt-3 leading-relaxed text-foreground/70">{f.a}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-8 py-20 md:py-24">
        <motion.div
          {...fadeUp}
          className="max-w-7xl mx-auto rounded-2xl bg-foreground text-background px-6 py-16 md:px-12 md:py-20 text-center"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tighter text-balance">
            Your next role starts with one page
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-background/70">
            Build it once, tailor it forever. Start free and export your first PDF in minutes.
          </p>
          <Link
            to={primaryTo}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-mint text-foreground px-8 py-4 text-sm font-bold transition-transform hover:scale-[1.02]"
          >
            Get started <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </SiteLayout>
  );
}
