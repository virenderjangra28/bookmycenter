import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Centerlist from "@/lib/model/centerlist";

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const primaryCenter = body.centers?.[0] || {};

        if (!body.organizationName) {
            return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
        }

        if (!body.emailVerified || !body.mobileVerified) {
            return NextResponse.json(
                { error: "Email and mobile OTP verification is required" },
                { status: 400 }
            );
        }

        if (!body.declaration?.termsAccepted) {
            return NextResponse.json(
                { error: "Terms & Conditions acceptance is required" },
                { status: 400 }
            );
        }

        const center = await Centerlist.create({
            centerName: body.organizationName,
            centerType: body.centerType || "",
            capacity: String(body.centreCapacity || primaryCenter.totalSeatingCapacity || ""),
            country: body.country || "",
            State: body.state || "",
            city: body.city || "",
            phone: body.contactNumber || "",
            latitude: String(body.latitude || ""),
            longitude: String(body.longitude || ""),
            address: body.fullAddress || "",
            availability: body.availability?.operatingDays?.join(", ") || "",
            mainEntryPhoto: body.locationPhotos?.entrance?.[0] || primaryCenter.photos?.buildingFront?.[0] || "",
            washroomPhoto: body.locationPhotos?.washroom?.[0] || primaryCenter.photos?.washrooms?.[0] || "",
            others: body.declaration?.authorisedPersonName || body.contactPersonName || "",
            owner: "pending",
            isVerified: false,
            applicationData: body,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Partner application submitted successfully",
                data: { id: center._id },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/centerlist failed:", error);

        return NextResponse.json(
            { error: error.message || "Failed to submit partner application" },
            { status: 500 }
        );
    }
}
