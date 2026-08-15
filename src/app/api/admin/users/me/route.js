import { connectDB } from "@/app/lib/db";
import { User } from "@/app/lib/model/user";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";

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

    return NextResponse.json({
      success: true,
      data: user,
      result: user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, result: "Unauthorized", error: error.message },
      { status: 401 }
    );
  }
}

export async function POST(request) {
  return GET(request);
}
