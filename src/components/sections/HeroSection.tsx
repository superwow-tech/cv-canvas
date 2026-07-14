import { personalInfo } from "@/data/portfolio-data";
import { motion } from "framer-motion";
import { Download, Linkedin, Github, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

/**
 * HeroSection Component
 * Resume-style header: large name, title, contact + socials, Download CV action.
 */
export default function HeroSection() {
  const [firstName, lastName] = personalInfo.name.split(" ");
  const phone = personalInfo.phone;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    const toastId = toast.loading("Generating your CV…");
    try {
      const { downloadCV } = await import("@/lib/generate-cv");
      await downloadCV();
      toast.success("CV downloaded", {
        id: toastId,
        description: "Check your downloads folder.",
      });
    } catch (error) {
      console.error("CV generation failed:", error);
      toast.error("Could not generate CV", {
        id: toastId,
        description: "Please try again in a moment.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const socials = [
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/sjaraminas" },
    { icon: Github, label: "GitHub", href: `https://${personalInfo.website}` },
    { icon: Mail, label: "Email", href: `mailto:${personalInfo.email}` },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 md:px-12 py-12 md:py-16">
      {/* Name */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-[clamp(3rem,11vw,7.5rem)] font-bold leading-[0.95] tracking-tighter uppercase text-foreground font-['Rubik']">
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
        className="mt-8 text-lg md:text-2xl tracking-wide text-orange font-['Rubik'] font-medium"
      >
        {personalInfo.title}
      </motion.h2>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="h-px bg-foreground/20 origin-left mt-8 mb-8"
      />

      {/* Contact + Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
      >
        {/* Contact info */}
        <div className="flex flex-col gap-2 text-sm md:text-base text-foreground/80 font-['Rubik']">
          <a
            href={`mailto:${personalInfo.email}`}
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Mail size={16} /> {personalInfo.email}
          </a>
          <a href={`tel:${phone}`} className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
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
            onClick={handleDownload}
            disabled={isDownloading}
            aria-busy={isDownloading}
            aria-label={isDownloading ? "Generating CV" : "Download CV"}
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors font-['Rubik'] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Download size={16} /> Download CV
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
