import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import HeroSection from "@/components/sections/HeroSection";
import BioSection from "@/components/sections/BioSection";
import ContentSection from "@/components/sections/ContentSection";

export default function Example() {
  return (
    <SiteLayout>
      <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 md:px-12 pt-8">
        <p className="rounded-lg border border-foreground/15 bg-mint-light/25 px-4 py-3 text-sm text-foreground/75 font-['Rubik']">
          This is a sample resume built with Applyo.{" "}
          <Link to="/auth?mode=signup" className="underline hover:text-foreground">
            Build your own
          </Link>
          .
        </p>
      </div>
      <HeroSection />
      <BioSection />
      <ContentSection />
    </SiteLayout>
  );
}
