import {
  HeroSection,
  QuickActionSection,
  CenterTypesSection,
  FeaturedCentersSection,
  EnterpriseSection,
  HowItWorksSection,
} from "../sharedComponent/homeSection/index.js";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <QuickActionSection />
      <CenterTypesSection />
      <FeaturedCentersSection />
      <section id="enterprise">
        <EnterpriseSection />
      </section>
      <section id="how-it-works">
        <HowItWorksSection />
      </section>
    </main>
  );
}
