import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Centerlist from "@/lib/model/centerlist";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const centers = await Centerlist.find({ userId: id })
            .select("-photos -additionalPhotos")
            .sort({ created_at: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            message: "Centers fetched successfully",
            data: centers,
        });
    } catch (error) {
        console.error("GET /api/centerlist/[id] failed:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to get centers" },
            { status: 500 }
        );
    }
}
