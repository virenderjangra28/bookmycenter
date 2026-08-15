import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/model/user";
import { getDataFromToken } from "@/helper/getDataFromToken";

function isClientRole(role) {
  return role === 2 || role === "2";
}

function normalizeCenterPayload(body) {
  const seatingCapacity = Number(body.seatingCapacity);

  return {
    name: String(body.centerName || body.name || "").trim(),
    address: String(body.address || "").trim(),
    city: String(body.city || "").trim(),
    state: String(body.state || "").trim(),
    seatingCapacity: Number.isFinite(seatingCapacity) ? seatingCapacity : null,
    contactEmail: String(body.contactEmail || "").trim().toLowerCase(),
    contactPhone: String(body.contactPhone || "").trim(),
    contactPerson: String(body.contactPerson || "").trim(),
    latitude:
      body.latitude === "" || body.latitude == null
        ? null
        : Number(body.latitude),
    longitude:
      body.longitude === "" || body.longitude == null
        ? null
        : Number(body.longitude),
  };
}

function validateCenter(center) {
  const errors = [];

  if (!center.name) errors.push("Center name is required");
  if (!center.city) errors.push("City is required");
  if (!center.state) errors.push("State is required");
  if (!center.contactEmail) errors.push("Contact email is required");
  if (!center.contactPhone) errors.push("Contact phone is required");
  if (!center.seatingCapacity || center.seatingCapacity < 1) {
    errors.push("Number of seating must be at least 1");
  }
  if (
    center.contactEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(center.contactEmail)
  ) {
    errors.push("Contact email is invalid");
  }
  if (
    (center.latitude != null && Number.isNaN(center.latitude)) ||
    (center.longitude != null && Number.isNaN(center.longitude))
  ) {
    errors.push("Location coordinates are invalid");
  }
  if (
    (center.latitude != null && center.longitude == null) ||
    (center.latitude == null && center.longitude != null)
  ) {
    errors.push("Both latitude and longitude are required for map location");
  }

  return errors;
}

export async function GET(request) {
  try {
    await connectDB();

    const userId = await getDataFromToken(request);
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, result: "User not found" },
        { status: 404 }
      );
    }

    if (!isClientRole(user.role)) {
      return NextResponse.json(
        { success: false, result: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        centerName: user.center?.name || user.company || "",
        address: user.center?.address || "",
        city: user.center?.city || "",
        state: user.center?.state || "",
        seatingCapacity: user.center?.seatingCapacity ?? "",
        contactEmail: user.center?.contactEmail || user.email || "",
        contactPhone: user.center?.contactPhone || user.mobile || "",
        contactPerson: user.center?.contactPerson || user.name || "",
        latitude: user.center?.latitude ?? "",
        longitude: user.center?.longitude ?? "",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, result: "Unauthorized", error: error.message },
      { status: 401 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const userId = await getDataFromToken(request);
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, result: "User not found" },
        { status: 404 }
      );
    }

    if (!isClientRole(user.role)) {
      return NextResponse.json(
        { success: false, result: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const center = normalizeCenterPayload(body);
    const errors = validateCenter(center);

    if (errors.length) {
      return NextResponse.json(
        { success: false, result: errors[0], errors },
        { status: 400 }
      );
    }

    user.center = center;
    user.company = center.name;
    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    return NextResponse.json({
      success: true,
      result: "Center details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, result: "Failed to update center", error: error.message },
      { status: 500 }
    );
  }
}
