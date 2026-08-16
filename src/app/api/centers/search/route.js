import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/model/user";

function isClientRole(role) {
  return role === 2 || role === "2";
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const centerType = searchParams.get("centerType")?.trim();
    const country = searchParams.get("country")?.trim();
    const state = searchParams.get("state")?.trim();
    const city = searchParams.get("city")?.trim();
    const dateFrom = searchParams.get("dateFrom")?.trim();
    const dateTo = searchParams.get("dateTo")?.trim();
    const timeFrom = searchParams.get("timeFrom")?.trim();
    const timeTo = searchParams.get("timeTo")?.trim();
    const capacity = Number(searchParams.get("capacity"));

    const query = {
      role: { $in: [2, "2"] },
      "center.name": { $exists: true, $ne: "" },
    };

    if (state) {
      query["center.state"] = new RegExp(`^${escapeRegex(state)}$`, "i");
    }

    if (city) {
      query["center.city"] = new RegExp(escapeRegex(city), "i");
    }

    if (Number.isFinite(capacity) && capacity > 0) {
      query["center.seatingCapacity"] = { $gte: capacity };
    }

    const users = await User.find(query)
      .select("center company email mobile")
      .sort({ "center.name": 1 })
      .lean();

    const centers = users
      .filter((user) => isClientRole(user.role) && user.center?.name)
      .map((user) => ({
        id: String(user._id),
        name: user.center.name || user.company || "Unnamed Center",
        address: user.center.address || "",
        city: user.center.city || "",
        state: user.center.state || "",
        country: country || "India",
        seatingCapacity: user.center.seatingCapacity ?? null,
        contactEmail: user.center.contactEmail || user.email || "",
        contactPhone: user.center.contactPhone || user.mobile || "",
        centerType: centerType || "CBT Centers",
        availableFrom: dateFrom || null,
        availableTo: dateTo || null,
        timeFrom: timeFrom || null,
        timeTo: timeTo || null,
      }));

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
