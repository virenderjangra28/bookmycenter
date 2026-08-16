import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

connectDB();

export async function GET(request) {
    try {
        const countries = await fetch("https://countriesnow.space/api/v0.1/countries");
        const data = await countries.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
    }
}

