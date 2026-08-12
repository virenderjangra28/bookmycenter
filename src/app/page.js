import {
  CapabilitiesGridSection,
  HeroSection,
  ServiceCardsSection,
  TestimonialCarouselSection,
  TrustedPartnerSection,
} from "./sharedComponent/homeSection/index.js";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <ServiceCardsSection />
      <TrustedPartnerSection />
      <CapabilitiesGridSection />
      <TestimonialCarouselSection />
    </main>
  );
}
