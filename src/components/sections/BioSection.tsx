import { personalInfo } from "@/data/portfolio-data";
import { motion } from "framer-motion";

/**
 * BioSection Component
 * Large text bio section
 */
export default function BioSection() {
  return (
    <section className="w-full max-w-4xl mx-auto px-5 sm:px-8 md:px-12 pb-16 md:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <p className="text-lg sm:text-xl md:text-2xl leading-relaxed font-['Rubik'] text-foreground/80">
          {personalInfo.bio}
        </p>
      </motion.div>
    </section>
  );
}
