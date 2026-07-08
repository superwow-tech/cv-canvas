import { personalInfo } from "@/data/portfolio-data";
import { motion } from "framer-motion";
import { Download, Linkedin, Github, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

/**
 * HeroSection Component
 * Resume-style header: large name, title, contact + socials, Download CV action.
 */
export default function HeroSection() {
  const [firstName, lastName] = personalInfo.name.split(" ");
  const phone = personalInfo.phone;

  const socials = [
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/sjaraminas" },
    { icon: Github, label: "GitHub", href: `https://${personalInfo.website}` },
    { icon: Mail, label: "Email", href: `mailto:${personalInfo.email}` },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 md:px-12 py-20 md:py-28">
      {/* Name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-display-name font-sans font-bold uppercase text-foreground">
          {firstName}
          <br />
          {lastName}
        </h1>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-6 text-eyebrow text-orange font-sans"
      >
        {personalInfo.title}
      </motion.h2>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="h-px bg-foreground/20 origin-left my-10"
      />

      {/* Contact + Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
      >
        {/* Contact info */}
        <div className="flex flex-col gap-2 text-sm md:text-[15px] text-foreground/80 font-sans">
          <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
            <Mail size={16} /> {personalInfo.email}
          </a>
          <a href={`tel:${phone}`} className="inline-flex items-center gap-2 hover:text-foreground transition-colors tabular-nums">
            <Phone size={16} /> {phone}
          </a>
          <div className="inline-flex items-center gap-2">
            <MapPin size={16} /> {personalInfo.location.city}, {personalInfo.location.country}
          </div>
        </div>

        {/* Actions: socials + Download CV */}
        <div className="flex items-center gap-3">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-foreground/20 text-foreground/70 hover:text-foreground hover:border-foreground/60 transition-colors"
            >
              <Icon size={18} />
            </a>
          ))}
          <button
            onClick={() => {
              toast.promise(
                import("@/lib/generate-cv").then((mod) => mod.downloadCV()),
                {
                  loading: "Generating CV…",
                  success: "CV downloaded",
                  error: "Could not generate CV",
                }
              );
            }}
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors font-sans"
          >
            <Download size={16} /> Download CV
          </button>
        </div>
      </motion.div>
    </div>
  );
}
