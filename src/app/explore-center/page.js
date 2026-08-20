import { getVerifiedCenters } from "@/lib/exploreVerified";
import ExploreCenter from "./ExploreCenter";

export const metadata = {
  title: "Explore Centers | BookMyCenter",
  description:
    "Explore verified exam centers across cities and categories using capacity, facilities and verification filters.",
};

export default async function ExploreCenterPage() {
  const centers = await getVerifiedCenters();
  return <ExploreCenter centers={centers} />;
}
