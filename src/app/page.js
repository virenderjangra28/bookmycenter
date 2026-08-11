import {
  CapabilitiesGridSection,
  HeroSection,
  ServiceCardsSection,
  TestimonialCarouselSection,
  TrustedPartnerSection,
} from "./herSection";

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
