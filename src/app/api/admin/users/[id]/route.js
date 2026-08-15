import { NextResponse } from "next/server";
import { User } from "@/lib/model/user";
import { connectDB } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { isActive } = await request.json();

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: Number(isActive) },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: user, success: true });
  } catch (error) {
    return NextResponse.json(
      { result: "Failed to update user", success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  return PUT(request, { params });
}
