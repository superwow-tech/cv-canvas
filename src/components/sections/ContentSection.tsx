import { experience, education, languages, skillCategories } from "@/data/portfolio-data";
import { motion } from "framer-motion";

function formatDateRange(start: string, end: string | null): string {
  const startYear = start.split('-')[0];
  const endDisplay = end ? end.split('-')[0] : 'Present';
  return `${startYear} - ${endDisplay}`;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center uppercase tracking-[0.15em] text-2xl md:text-3xl font-light text-foreground font-['Rubik'] mb-14">
      {children}
    </h2>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-foreground/5 text-foreground/70 text-xs px-3 py-1 font-['Rubik']">
      {children}
    </span>
  );
}

function TimelineItem({
  title,
  subtitle,
  meta,
  tech,
  bullets,
  isLast,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  tech?: string[];
  bullets?: string[];
  isLast?: boolean;
}) {
  return (
    <div className="relative pl-10 pb-12 last:pb-0">
      {/* Vertical line */}
      {!isLast && (
        <span className="absolute left-[5px] top-3 bottom-0 w-px bg-foreground/15" aria-hidden />
      )}
      {/* Dot */}
      <span className="absolute left-0 top-2 w-[11px] h-[11px] rounded-full border border-foreground/40 bg-background" aria-hidden />

      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-xl md:text-2xl font-semibold text-foreground font-['Rubik']">
            {title}
          </h3>
          {subtitle && (
            <div className="mt-1 text-sm md:text-base text-foreground/70 font-['Rubik']">
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
          <div className="shrink-0 text-sm text-foreground/60 font-['Rubik'] pt-1 whitespace-nowrap">
            {meta}
          </div>
        )}
      </div>

      {bullets && bullets.length > 0 && (
        <ul className="mt-5 space-y-2 text-foreground/80 font-['Rubik'] text-base leading-relaxed">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-foreground/40 mt-2 w-1 h-1 rounded-full bg-foreground/40 shrink-0" aria-hidden />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ContentSection() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-10">
      {/* Professional Experience */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20"
      >
        <SectionHeading>Professional Experience</SectionHeading>
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

      {/* Education */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20 border-t border-foreground/10"
      >
        <SectionHeading>Education</SectionHeading>
        <div>
          {education.map((edu, idx) => (
            <TimelineItem
              key={edu.id}
              title={`${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`}
              subtitle={`${edu.institution}${edu.location ? ` — ${edu.location}` : ""}`}
              meta={`${edu.startYear} - ${edu.endYear}`}
              bullets={edu.details ? [edu.details] : undefined}
              isLast={idx === education.length - 1}
            />
          ))}
        </div>
      </motion.section>

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20 border-t border-foreground/10"
      >
        <SectionHeading>Skills</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category) => (
            <div key={category.category}>
              <h3 className="text-lg font-semibold text-foreground mb-3 font-['Rubik']">
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

      {/* Languages */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20 border-t border-foreground/10"
      >
        <SectionHeading>Languages</SectionHeading>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          {languages.map((lang) => (
            <div key={lang.language} className="text-center font-['Rubik']">
              <div className="text-lg font-semibold text-foreground">{lang.language}</div>
              <div className="text-sm text-foreground/60 mt-1">{lang.proficiency}</div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
