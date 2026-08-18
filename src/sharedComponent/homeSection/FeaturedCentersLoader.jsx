import { getFeaturedCenters } from "@/lib/featuredCenters";
import FeaturedCentersSection from "./FeaturedCentersSection";

export default async function FeaturedCentersLoader() {
  const centers = await getFeaturedCenters();
  return <FeaturedCentersSection centers={centers} />;
}
