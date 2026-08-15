import { connectDB } from "@/app/lib/db";
import { User } from "@/app/lib/model/user";
import { NextResponse, NextRequest } from "next/server";

await connectDB();

export async function GET(request) {
    try {
        
        const response = NextResponse.json({ result: "Logout successful", success: true, status: 200 });
        response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
        return response;
    } catch (error) {
        return NextResponse.json({ result: "Failed to logout", error: error.message }, { status: 500 });
    }
}