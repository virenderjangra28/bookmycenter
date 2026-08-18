import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Centerlist from "@/lib/model/centerlist";
import { User } from "@/lib/model/user";
import Location from "@/lib/model/location";
import { FEATURED_CENTERS } from "@/sharedComponent/homeSection/homeData";

const FALLBACK_IMAGES = FEATURED_CENTERS.map((center) => center.image);

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatLocation(location) {
  if (!location) return "Location pending";
  return [location.city, location.state].filter(Boolean).join(", ") || "Location pending";
}

function formatInternet(center) {
  const backup = center.internetInfrastructure?.backupInternetAvailable;
  if (backup === "Yes") return "Dual";
  return center.internetInfrastructure?.primarySpeed || "Available";
}

function getCenterImage(center, index) {
  const photo = center.photos?.buildingFront?.[0];
  if (typeof photo === "string" && photo.trim()) {
    return photo;
  }
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function mapCenter(center, user, location, index) {
  const seats = toNumber(center.totalSeatingCapacity) || toNumber(user?.centerCapacity);
  const rating = toNumber(user?.centerRating) || 4.5;

  return {
    id: String(center._id),
    name: user?.company || user?.name || center.label || "Verified Center",
    location: formatLocation(location),
    rating: rating % 1 === 0 ? `${rating}.0` : String(rating),
    reviews: 0,
    image: getCenterImage(center, index),
    seats: seats || 100,
    labs: toNumber(center.examRooms) || 1,
    internet: formatInternet(center),
    price: "On request",
    available: center.isAvailable !== false,
  };
}

async function fetchFeaturedCentersFromDb() {
  await connectDB();

  const docs = await Centerlist.find()
    .select(
      "userId label totalSeatingCapacity examRooms isAvailable internetInfrastructure.backupInternetAvailable internetInfrastructure.primarySpeed photos.buildingFront created_at"
    )
    .slice("photos.buildingFront", 1)
    .sort({ created_at: -1 })
    .limit(8)
    .lean()
    .maxTimeMS(4000);

  if (!docs.length) return [];

  const userIds = docs.map((doc) => doc.userId).filter(Boolean);

  const [users, locations] = await Promise.all([
    User.find({ _id: { $in: userIds } })
      .select("company name centerRating centerCapacity")
      .lean()
      .maxTimeMS(4000),
    Location.find({ userId: { $in: userIds } })
      .select("userId city state country")
      .lean()
      .maxTimeMS(4000),
  ]);

  const userById = new Map(users.map((user) => [String(user._id), user]));
  const locationByUserId = new Map(
    locations.map((location) => [String(location.userId), location])
  );

  return docs.map((center, index) =>
    mapCenter(
      center,
      userById.get(String(center.userId)),
      locationByUserId.get(String(center.userId)),
      index
    )
  );
}

export const getFeaturedCenters = unstable_cache(
  async () => {
    try {
      return await fetchFeaturedCentersFromDb();
    } catch (error) {
      console.error("getFeaturedCenters failed:", error);
      return [];
    }
  },
  ["featured-centers-v2"],
  { revalidate: 60 }
);
