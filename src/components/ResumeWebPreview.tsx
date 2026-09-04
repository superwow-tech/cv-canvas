import type { ResumeDocument } from "@/lib/resume-schema";
import type { CvTemplateId } from "@/lib/cv-templates";
import { getCvLabels, type CvLocale } from "@/lib/cv-locale";

/**
 * Online (HTML) rendering of a resume, styled per template.
 * This is what visitors preview - the PDF is only produced on download.
 */

function formatMonth(value: string, locale: CvLocale) {
  if (!value) return "";
  const [year, month] = value.split("-");
  const months = getCvLabels(locale).months;
  const idx = Number(month) - 1;
  return months[idx] ? `${months[idx]} ${year}` : year;
}

export default function ResumeWebPreview({
  resume,
  template,
  locale = "en",
}: {
  resume: ResumeDocument;
  template: CvTemplateId;
  locale?: CvLocale;
}) {
  const labels = getCvLabels(locale);
  const centered = template === "classic";
  const airy = template === "minimal";
  const ruled = template === "timeline";

  const headingClass = [
    "font-['Rubik'] text-foreground/60",
    airy
      ? "text-sm md:text-base font-medium normal-case tracking-normal"
      : "text-[11px] md:text-xs uppercase tracking-[0.22em] font-semibold",
  ].join(" ");

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className={airy ? "mt-10 md:mt-12" : "mt-8 md:mt-10"}>
      <div className="flex items-center gap-3">
        <h3 className={headingClass}>{title}</h3>
        {ruled && <span className="h-px flex-1 bg-foreground/15" aria-hidden />}
        {centered && <span className="h-px flex-1 bg-foreground/10" aria-hidden />}
      </div>
      <div className={airy ? "mt-4 space-y-7" : "mt-3 space-y-5"}>{children}</div>
    </section>
  );

  const { personal } = resume;
  const contact = [
    personal.email,
    personal.phone,
    [personal.city, personal.country].filter(Boolean).join(", "),
    personal.website,
    personal.linkedin,
  ].filter(Boolean);

  return (
    <article
      className={`bg-background text-foreground px-6 py-8 md:px-10 md:py-12 ${
        airy ? "leading-loose" : "leading-relaxed"
      }`}
    >
      <header className={centered ? "text-center" : ""}>
        {locale === "lt" && labels.documentTitle && (
          <p className="text-[11px] uppercase tracking-[0.25em] text-foreground/45 font-['Rubik']">
            {labels.documentTitle}
          </p>
        )}
        <h2
          className={`font-['Rubik'] font-bold text-foreground ${
            centered ? "text-2xl md:text-3xl mt-1" : "text-3xl md:text-4xl"
          }`}
        >
          {personal.name}
        </h2>
        <p className="mt-1 text-sm md:text-base text-foreground/70 font-['Rubik']">
          {personal.title}
        </p>
        <p
          className={`mt-3 text-xs md:text-sm text-foreground/55 font-['Rubik'] ${
            centered ? "mx-auto" : ""
          }`}
        >
          {contact.join(" · ")}
        </p>
        {!centered && <span className="mt-6 block h-px w-full bg-foreground/15" aria-hidden />}
      </header>

      {personal.bio && (
        <Section title={labels.profile}>
          <p className="text-sm md:text-base text-foreground/75 font-['Rubik'] text-pretty">
            {personal.bio}
          </p>
        </Section>
      )}

      {resume.experience.length > 0 && (
        <Section title={labels.experience}>
          {resume.experience.map((job) => (
            <div key={job.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h4 className="text-base md:text-lg font-semibold font-['Rubik']">
                  {job.role}
                </h4>
                <span className="text-xs md:text-sm text-foreground/50 font-['Rubik'] tabular-nums">
                  {formatMonth(job.startDate, locale)} - {job.endDate ? formatMonth(job.endDate, locale) : labels.present}
                </span>
              </div>
              <p className="text-sm text-foreground/60 font-['Rubik']">
                {[job.company, job.location].filter(Boolean).join(" · ")}
              </p>
              {job.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {job.bullets.filter(Boolean).map((b, i) => (
                    <li
                      key={i}
                      className="relative pl-4 text-sm md:text-base text-foreground/75 font-['Rubik'] before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-foreground/35"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {job.tech.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {job.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-foreground/15 px-2.5 py-0.5 text-[11px] text-foreground/60 font-['Rubik']"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title={labels.skills}>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {resume.skills.map((group) => (
              <div key={group.id}>
                <dt className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-['Rubik']">
                  {group.category}
                </dt>
                <dd className="mt-1 text-sm md:text-base text-foreground/75 font-['Rubik']">
                  {group.skills}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {resume.education.length > 0 && (
        <Section title={labels.education}>
          {resume.education.map((edu) => (
            <div key={edu.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h4 className="text-base md:text-lg font-semibold font-['Rubik']">
                  {[edu.degree, edu.field].filter(Boolean).join(", ")}
                </h4>
                <span className="text-xs md:text-sm text-foreground/50 font-['Rubik'] tabular-nums">
                  {[edu.startYear, edu.endYear].filter(Boolean).join(" - ")}
                </span>
              </div>
              <p className="text-sm text-foreground/60 font-['Rubik']">
                {[edu.institution, edu.location].filter(Boolean).join(" · ")}
              </p>
              {edu.details && (
                <p className="mt-1 text-sm text-foreground/70 font-['Rubik']">{edu.details}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {resume.languages.length > 0 && (
        <Section title={labels.languages}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {resume.languages.map((l) => (
              <li key={l.id} className="text-sm md:text-base text-foreground/75 font-['Rubik']">
                <span className="font-medium text-foreground">{l.language}</span>{" "}
                <span className="text-foreground/55">({l.proficiency})</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}
