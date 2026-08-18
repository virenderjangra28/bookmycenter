import { Suspense } from "react";
import {
  HeroSection,
  QuickActionSection,
  CenterTypesSection,
  FeaturedCentersSection,
  EnterpriseSection,
  HowItWorksSection,
} from "../sharedComponent/homeSection/index.js";
import FeaturedCentersLoader from "../sharedComponent/homeSection/FeaturedCentersLoader";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <QuickActionSection />
      <CenterTypesSection />
      <Suspense fallback={<FeaturedCentersSection centers={[]} />}>
        <FeaturedCentersLoader />
      </Suspense>
      <section id="enterprise">
        <EnterpriseSection />
      </section>
      <section id="how-it-works">
        <HowItWorksSection />
      </section>
    </main>
  );
}
