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
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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
    const pinCode = body.pinCode?.trim();
    const startDate = (body.startDate || body.dateFrom)?.trim();
    const endDate = (body.endDate || body.dateTo)?.trim();
    const startTime = (body.startTime || body.timeFrom)?.trim();
    const endTime = (body.endTime || body.timeTo)?.trim();
    const category = toNumber(body.category);
    const capacity = toNumber(body.capacity);

    const locationQuery = {};

    if (country) {
      locationQuery.country = new RegExp(`^${escapeRegex(country)}$`, "i");
    } else if (regionType === "Domestic") {
      locationQuery.country = new RegExp("^India$", "i");
    }

    if (state) {
      locationQuery.state = new RegExp(`^${escapeRegex(state)}$`, "i");
    }

    if (city) {
      locationQuery.city = new RegExp(escapeRegex(city), "i");
    }

    if (pinCode) {
      const pinNumber = toNumber(pinCode);
      locationQuery.pinCode = pinNumber ?? pinCode;
    }

    const locations = await Location.find(locationQuery).lean();
    const locationByUserId = new Map(
      locations.map((location) => [String(location.userId), location])
    );
    const locationUserIds = locations.map((location) => location.userId).filter(Boolean);

    if (locationUserIds.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const userQuery = {
      _id: { $in: locationUserIds },
      role: { $in: [2, "2"] },
    };

    if (centerType) {
      userQuery.centerType = new RegExp(`^${escapeRegex(centerType)}$`, "i");
    }

    if (category) {
      userQuery.centerRating = category;
    }

    const users = await User.find(userQuery)
      .select("name company email mobile centerType centerRating centerCapacity role")
      .sort({ company: 1, name: 1 })
      .lean();

    const matchingUserIds = users.map((user) => user._id);
    const centerDocs = matchingUserIds.length
      ? await Centerlist.find({ userId: { $in: matchingUserIds } })
          .select("userId totalSeatingCapacity")
          .lean()
      : [];

    const seatingByUserId = new Map();
    for (const doc of centerDocs) {
      const seats = toNumber(doc.totalSeatingCapacity) || 0;
      const key = String(doc.userId);
      seatingByUserId.set(key, (seatingByUserId.get(key) || 0) + seats);
    }

    const centers = users
      .filter((user) => isClientRole(user.role))
      .map((user) => {
        const location = locationByUserId.get(String(user._id));
        const seatingCapacity =
          seatingByUserId.get(String(user._id)) || toNumber(user.centerCapacity);

        return {
          id: String(user._id),
          name: user.company || user.name || "Unnamed Center",
          address: location?.fullAddress || "",
          city: location?.city || "",
          state: location?.state || "",
          country: location?.country || country || "",
          pinCode: location?.pinCode || "",
          seatingCapacity,
          contactEmail: user.email || "",
          contactPhone: user.mobile || "",
          centerType: user.centerType || centerType || "",
          category: user.centerRating ?? category ?? null,
          availableFrom: startDate || null,
          availableTo: endDate || null,
          timeFrom: startTime || null,
          timeTo: endTime || null,
        };
      })
      .filter((center) => {
        if (capacity && capacity > 0) {
          return (center.seatingCapacity || 0) >= capacity;
        }
        return true;
      });

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
