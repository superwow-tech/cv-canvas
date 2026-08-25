import Layout from "@/components/Layout";
import HeroSection from "@/components/sections/HeroSection";
import BioSection from "@/components/sections/BioSection";
import ContentSection from "@/components/sections/ContentSection";
import TemplatesSection from "@/components/sections/TemplatesSection";

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <BioSection />
      <ContentSection />
      <TemplatesSection />
    </Layout>
  );
}
