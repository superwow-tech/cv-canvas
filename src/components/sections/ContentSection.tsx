import { experience, education, languages, skillCategories } from "@/data/portfolio-data";
import { motion } from "framer-motion";

function formatDateRange(start: string, end: string | null): string {
  const startYear = start.split("-")[0];
  const endDisplay = end ? end.split("-")[0] : "Present";
  return `${startYear} — ${endDisplay}`;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="flex items-center gap-4 md:gap-6 mb-3">
        <span className="h-px flex-1 bg-foreground/10" aria-hidden />
        <span className="text-eyebrow text-foreground/50 font-sans whitespace-nowrap">
          {children}
        </span>
        <span className="h-px flex-1 bg-foreground/10" aria-hidden />
      </div>
      <h2 className="text-headline font-serif text-foreground text-center">
        {children}
      </h2>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-foreground/[0.04] text-foreground/60 text-[11px] md:text-xs px-3 py-1 font-sans tracking-wide">
      {children}
    </span>
  );
}

interface TimelineItemProps {
  title: string;
  subtitle?: string;
  meta?: string;
  tech?: string[];
  bullets?: string[];
  isLast?: boolean;
}

function TimelineItem({ title, subtitle, meta, tech, bullets, isLast }: TimelineItemProps) {
  return (
    <div className="relative pl-6 sm:pl-10 pb-10 md:pb-12 last:pb-0">
      {!isLast && (
        <span className="absolute left-[5px] top-[13px] bottom-0 w-px bg-foreground/10" aria-hidden />
      )}
      <span className="absolute left-0 top-2 w-[11px] h-[11px] rounded-full border border-foreground/30 bg-background" aria-hidden />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-6">
        <div className="min-w-0">
          {meta && (
            <div className="sm:hidden mb-1 text-[11px] text-foreground/50 font-sans tracking-[0.18em] uppercase tabular-nums">
              {meta}
            </div>
          )}
          <h3 className="text-[clamp(1.05rem,1.6vw,1.35rem)] font-semibold text-foreground font-sans leading-snug tracking-[-0.01em]">
            {title}
          </h3>
          {subtitle && (
            <div className="mt-1 text-sm md:text-[15px] text-foreground/60 font-sans">
              {subtitle}
            </div>
          )}
          {tech && tech.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tech.map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>
          )}
        </div>
        {meta && (
          <div className="hidden sm:block shrink-0 text-xs sm:text-[13px] text-foreground/50 font-sans tracking-[0.18em] uppercase sm:pt-2 whitespace-nowrap tabular-nums">
            {meta}
          </div>
        )}
      </div>

      {bullets && bullets.length > 0 && (
        <ul className="mt-4 md:mt-5 space-y-2 text-foreground/75 font-sans text-[15px] md:text-base leading-[1.65]">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-foreground/40 shrink-0" aria-hidden />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const sectionMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

export default function ContentSection() {
  return (
    <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 md:px-12">
      <motion.section {...sectionMotion} className="py-16 md:py-24">
        <SectionHeading>Experience</SectionHeading>
        <div>
          {experience.map((job, idx) => (
            <TimelineItem
              key={job.id}
              title={job.role}
              subtitle={job.company}
              meta={formatDateRange(job.startDate, job.endDate)}
              tech={job.tech}
              bullets={job.bullets ?? [job.description]}
              isLast={idx === experience.length - 1}
            />
          ))}
        </div>
      </motion.section>

      <motion.section {...sectionMotion} className="py-16 md:py-24 border-t border-foreground/10">
        <SectionHeading>Education</SectionHeading>
        <div>
          {education.map((edu, idx) => (
            <TimelineItem
              key={edu.id}
              title={`${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`}
              subtitle={`${edu.institution}${edu.location ? ` — ${edu.location}` : ""}`}
              meta={`${edu.startYear} — ${edu.endYear}`}
              bullets={edu.details ? [edu.details] : undefined}
              isLast={idx === education.length - 1}
            />
          ))}
        </div>
      </motion.section>

      <motion.section {...sectionMotion} className="py-16 md:py-24 border-t border-foreground/10">
        <SectionHeading>Skills</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {skillCategories.map((category) => (
            <div key={category.category}>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 font-sans tracking-[-0.01em]">
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.split(",").map((s) => (
                  <Pill key={s}>{s.trim()}</Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section {...sectionMotion} className="py-16 md:py-24 border-t border-foreground/10">
        <SectionHeading>Languages</SectionHeading>
        <div className="flex flex-wrap justify-center gap-x-10 md:gap-x-16 gap-y-6">
          {languages.map((lang) => (
            <div key={lang.language} className="text-center">
              <div className="text-xl md:text-[26px] text-foreground font-serif leading-tight">{lang.language}</div>
              <div className="text-[11px] md:text-xs text-foreground/60 mt-2 uppercase tracking-[0.22em] font-sans">
                {lang.proficiency}
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
