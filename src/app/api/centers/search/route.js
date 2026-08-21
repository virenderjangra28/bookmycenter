import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/model/user";
import Location from "@/lib/model/location";
import Centerlist from "@/lib/model/centerlist";

function isClientRole(role) {
  return role === 2 || role === "2";
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toNumber(value) {
  if (value == null || value === "") return null;
  const parsed = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function exactInsensitive(value) {
  return new RegExp(`^\\s*${escapeRegex(value.trim())}\\s*$`, "i");
}

function containsInsensitive(value) {
  return new RegExp(escapeRegex(value.trim()), "i");
}

function sameText(left, right) {
  return String(left || "").trim().toLowerCase() === String(right || "").trim().toLowerCase();
}

function includesText(haystack, needle) {
  return String(haystack || "")
    .toLowerCase()
    .includes(String(needle || "").trim().toLowerCase());
}

function stateMatches(stored, requested) {
  if (!requested) return true;
  if (sameText(stored, requested)) return true;
  if (includesText(stored, requested) || includesText(requested, stored)) return true;
  const abbrev = requested
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toLowerCase();
  const storedCompact = String(stored || "").replace(/[.\s]/g, "").toLowerCase();
  return storedCompact === abbrev;
}

function cityMatches(location, requested) {
  if (!requested) return true;
  return includesText(location.city, requested) || includesText(location.fullAddress, requested);
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const regionType = body.regionType?.trim();
    const centerType = body.centerType?.trim();
    const country = body.country?.trim();
    const state = body.state?.trim();
    const city = body.city?.trim();
    const category = toNumber(body.category);
    const capacity = toNumber(body.capacity);

    const locationQuery = {};

    if (country) {
      locationQuery.country = exactInsensitive(country);
    } else if (regionType === "Domestic") {
      locationQuery.country = exactInsensitive("India");
    }

    if (city) {
      locationQuery.$or = [
        { city: containsInsensitive(city) },
        { fullAddress: containsInsensitive(city) },
      ];
    } else if (state) {
      locationQuery.state = containsInsensitive(state);
    }

    const locations = await Location.find(locationQuery)
      .select("userId country state city pinCode fullAddress")
      .lean()
      .maxTimeMS(4000);

    const locationByUserId = new Map();
    const locationUserIds = [];

    for (const location of locations) {
      if (!location.userId) continue;
      if (country && !sameText(location.country, country)) continue;
      if (!country && regionType === "Domestic" && !sameText(location.country, "India")) {
        continue;
      }
      if (city && !cityMatches(location, city)) continue;
      if (!city && state && !stateMatches(location.state, state)) continue;

      locationByUserId.set(String(location.userId), location);
      locationUserIds.push(location.userId);
    }

    if (locationUserIds.length === 0) {
      return NextResponse.json({ success: true, count: 0, data: [] });
    }

    const userQuery = {
      _id: { $in: locationUserIds },
      role: { $in: [2, "2"] },
    };

    if (centerType) {
      userQuery.centerType = exactInsensitive(centerType);
    }

    if (category != null) {
      userQuery.centerRating = { $in: [category, String(category)] };
    }

    const [users, centerDocs] = await Promise.all([
      User.find(userQuery)
        .select("name company email mobile centerType centerRating centerCapacity role")
        .lean()
        .maxTimeMS(4000),
      Centerlist.find({ userId: { $in: locationUserIds } })
        .select("userId label totalSeatingCapacity")
        .lean()
        .maxTimeMS(4000),
    ]);

    const seatingByUserId = new Map();
    for (const doc of centerDocs) {
      const seats = toNumber(doc.totalSeatingCapacity) || 0;
      const key = String(doc.userId);
      seatingByUserId.set(key, Math.max(seatingByUserId.get(key) || 0, seats));
    }

    const centers = [];

    for (const user of users) {
      if (!isClientRole(user.role)) continue;
      if (centerType && !sameText(user.centerType, centerType)) continue;
      if (category != null && toNumber(user.centerRating) !== category) continue;

      const location = locationByUserId.get(String(user._id));
      if (!location) continue;

      const seatingCapacity =
        seatingByUserId.get(String(user._id)) || toNumber(user.centerCapacity) || 0;

      if (
        capacity != null &&
        capacity > 0 &&
        seatingCapacity > 0 &&
        seatingCapacity < capacity
      ) {
        continue;
      }

      centers.push({
        id: String(user._id),
        name: user.company || user.name || "Unnamed Center",
        address: location.fullAddress || "",
        city: location.city || "",
        state: location.state || "",
        country: location.country || country || "",
        pinCode: location.pinCode || "",
        seatingCapacity,
        contactEmail: user.email || "",
        contactPhone: user.mobile || "",
        centerType: user.centerType || centerType || "",
        category: toNumber(user.centerRating) ?? category,
        availableFrom: null,
        availableTo: null,
        timeFrom: null,
        timeTo: null,
      });
    }

    centers.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      count: centers.length,
      data: centers,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to search centers",
        data: [],
      },
      { status: 500 }
    );
  }
}
