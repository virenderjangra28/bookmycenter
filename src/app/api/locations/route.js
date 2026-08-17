import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Location from "@/lib/model/location";

export async function GET(request) {
  try {
    await connectDB();
    const locations = await Location.find();
    return NextResponse.json({ result: locations, success: true, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: "Failed to fetch locations", error: error.message }, { status: 500 });
  }
}