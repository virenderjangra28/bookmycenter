import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Centerlist from "@/lib/model/centerlist";
import { User } from "@/lib/model/user";
import Location from "@/lib/model/location";
import { FEATURED_CENTERS } from "@/sharedComponent/homeSection/homeData";
import { SAMPLE_CENTER } from "@/lib/centerDetailsData";

export { SAMPLE_CENTER };

function toNumber(value) {
  const parsed = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function isMongoObjectId(id) {
  return typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);
}

function premiumScoreFromRating(rating) {
  const score = Math.round(80 + (toNumber(rating) || 4.5) * 2.5);
  return Math.min(99, Math.max(80, score));
}

function formatLocation(location) {
  if (!location) return "Location pending";
  const city = location.city?.trim();
  const address = location.fullAddress?.trim();
  if (address && city) {
    const firstPart = address.split(",")[0]?.trim();
    if (firstPart && !firstPart.toLowerCase().includes(city.toLowerCase())) {
      return `${firstPart}, ${city}`;
    }
    return city;
  }
  return [city, location.state].filter(Boolean).join(", ") || "Location pending";
}

function joinPhrase(parts) {
  const items = parts.filter(Boolean);
  if (items.length === 0) return "";
  if (items.length === 1) return `${items[0]}.`;
  if (items.length === 2) return `${items[0]} and ${items[1]}.`;
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}.`;
}

function technologyText(center, seats) {
  const cbt = center.cbtInfrastructure || {};
  const systems = cbt.totalComputers || center.totalComputerCapacity || seats;
  const parts = [];
  if (systems) parts.push(`${systems} systems`);
  if (cbt.backupComputers && toNumber(cbt.backupComputers) > 0) parts.push("backups");
  if (cbt.lanConnectivity === "Yes") parts.push("LAN");
  if (cbt.secureBrowserCompatible === "Yes") parts.push("secure-browser compatibility");
  return joinPhrase(parts) || `${seats} systems, backups, LAN and secure-browser compatibility.`;
}

function connectivityText(center) {
  const net = center.internetInfrastructure || {};
  if (net.backupInternetAvailable === "Yes") {
    const type = (net.connectionType || "fibre").toLowerCase();
    return `Primary ${type} plus backup ISP.`;
  }
  if (net.primarySpeed || net.primaryIsp) {
    return [net.connectionType, net.primarySpeed, net.primaryIsp].filter(Boolean).join(" · ") + ".";
  }
  return "Primary fibre plus backup ISP.";
}

function powerText(center) {
  const power = center.powerInfrastructure || {};
  const parts = [];
  if (power.upsAvailable === "Yes") parts.push("UPS");
  if (power.generatorAvailable === "Yes") parts.push("DG backup");
  return joinPhrase(parts) || "UPS and DG backup.";
}

function fromFeatured(center) {
  const seats = toNumber(center.seats) || 250;
  const rating = center.rating ?? "4.8";
  return {
    id: String(center.id),
    name: center.name,
    location: center.location || "Gurugram",
    rating: String(rating),
    seats,
    labs: toNumber(center.labs) || 1,
    price: toNumber(center.price) || 650,
    premiumScore: premiumScoreFromRating(rating),
    image: center.image || "",
    isVerified: center.isVerified !== false,
    infrastructure: {
      technology: `${seats} systems, backups, LAN and secure-browser compatibility.`,
      connectivity:
        center.internet === "Dual"
          ? "Primary fibre plus backup ISP."
          : `${center.internet || "Fibre"} connection.`,
      power:
        center.generatorAvailable === "Yes" || center.generatorAvailable === true
          ? "UPS and DG backup."
          : "UPS and DG backup.",
    },
  };
}

function fromDatabase(center, user, location) {
  const seats =
    toNumber(center.totalSeatingCapacity) || toNumber(user?.centerCapacity) || 100;
  const rating = toNumber(user?.centerRating) || 4.5;
  const photo = center.photos?.buildingFront?.[0];

  return {
    id: String(center._id),
    name: user?.company || user?.name || center.label || "Verified Center",
    location: formatLocation(location),
    rating: rating % 1 === 0 ? `${rating}.0` : String(rating),
    seats,
    labs: toNumber(center.examRooms) || 1,
    price: toNumber(center.price) || 0,
    premiumScore: premiumScoreFromRating(rating),
    image: typeof photo === "string" && photo.trim() ? photo : "",
    isVerified: center.isVerified !== false,
    infrastructure: {
      technology: technologyText(center, seats),
      connectivity: connectivityText(center),
      power: powerText(center),
    },
  };
}

export async function getCenterDetails(id) {
  if (!id) return SAMPLE_CENTER;

  const featured = FEATURED_CENTERS.find((center) => String(center.id) === String(id));
  if (featured) return fromFeatured(featured);

  if (!isMongoObjectId(id) || !mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  try {
    await connectDB();

    const doc = await Centerlist.findById(id)
      .select(
        "userId label totalSeatingCapacity totalComputerCapacity examRooms isVerified price cbtInfrastructure internetInfrastructure powerInfrastructure photos.buildingFront"
      )
      .slice("photos.buildingFront", 1)
      .lean()
      .maxTimeMS(4000);

    if (!doc) return null;

    const [user, location] = await Promise.all([
      doc.userId
        ? User.findById(doc.userId).select("company name centerRating centerCapacity").lean().maxTimeMS(4000)
        : null,
      doc.userId
        ? Location.findOne({ userId: doc.userId }).select("userId city state fullAddress").lean().maxTimeMS(4000)
        : null,
    ]);

    return fromDatabase(doc, user, location);
  } catch (error) {
    console.error("getCenterDetails failed:", error);
    return null;
  }
}
