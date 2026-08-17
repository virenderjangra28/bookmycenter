import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import LegalRegistration from "@/lib/model/legalRegistration";

export async function GET(request) {
  try {
    await connectDB();
    const legalRegistrations = await LegalRegistration.find();
    return NextResponse.json({ result: legalRegistrations, success: true, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: "Failed to fetch legal registrations", error: error.message }, { status: 500 });
  }
}