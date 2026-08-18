import { Suspense } from "react";
import {
  HeroSection,
  QuickActionSection,
  CenterTypesSection,
  EnterpriseSection,
  HowItWorksSection,
} from "../sharedComponent/homeSection/index.js";
import FeaturedCentersLoader from "../sharedComponent/homeSection/FeaturedCentersLoader";
import { FeaturedCentersSectionSkeleton } from "../sharedComponent/homeSection/FeaturedCentersSection";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <QuickActionSection />
      <CenterTypesSection />
      <Suspense fallback={<FeaturedCentersSectionSkeleton />}>
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
