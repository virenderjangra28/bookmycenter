import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { State } from "@/lib/model/state";

export async function POST(request) {
    const countryCode = request.nextUrl.searchParams.get("countryCode");


   
}