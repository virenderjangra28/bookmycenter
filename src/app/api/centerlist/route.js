import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Centerlist from "@/lib/model/centerlist";
import { User } from "@/lib/model/user";
import bcryptjs from "bcryptjs";
import Location from "@/lib/model/location";

function parseCenterRating(value) {
    if (value === null || value === undefined || value === "") {
        return undefined;
    }

    if (typeof value === "number") {
        return value;
    }

    const match = String(value).match(/\d+/);
    return match ? Number(match[0]) : undefined;
}

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const primaryCenter = body.centers?.[0] || {};

        // if (!body.organizationName) {
        //     return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
        // }

        // if (!body.emailVerified || !body.mobileVerified) {
        //     return NextResponse.json(
        //         { error: "Email and mobile OTP verification is required" },
        //         { status: 400 }
        //     );
        // }

        // if (!body.declaration?.termsAccepted) {
        //     return NextResponse.json(
        //         { error: "Terms & Conditions acceptance is required" },
        //         { status: 400 }
        //     );
        // }
        const user = await User.findOne({email: body.email});
        if (user) {
            return NextResponse.json({ error: "User already registered as a partner" }, { status: 400 });
        }

         //Hash Password (optional at signup)
         const password = "bookmycenter";
         const hashedPassword = password
         ? await bcryptjs.hash(password, 10)
         : "";

         //Create new User
         const newUser = await User.create({
            email: body.email,
            name: body.contactPersonName,
            password: hashedPassword ?? "",
            isVerified: body.isVerified ?? false,
            forgotPasswordToken: body.forgotPasswordToken ?? null,
            forgotPasswordTokenExpiry: body.forgotPasswordTokenExpiry ?? null,
            verificationToken: body.verificationToken ?? null,
            verificationTokenExpiry: body.verificationTokenExpiry ?? null,
            company: body.organizationName,
            mobile: body.contactNumber,
            isActive: body.isActive ?? 0,
            role: body.role ?? 2,
            centerType: body.centerType || "",
            centerRating: parseCenterRating(body.centerRating),
            centerCapacity: String(body.centreCapacity || body.centerCapacity || ""),
            created_at: body.created_at ?? new Date(),
        });

        const userId = await newUser._id;
        const location = await Location.create({
            userId: userId,
            country: body.country || "",
            state: body.state || "",
            city: body.city || "",
            pinCode: body.pinCode || "",
            fullAddress: body.fullAddress || "",
            latitude: body.latitude || "",
            longitude: body.longitude || "",
            locationPhotos: body.locationPhotos || {},
        });
       
        return NextResponse.json(
            { result: "Thank you for registering and location added! Your account is currently under review and will be activated within 2 hours.", success: true, status: 201 },
            { status: 201 }
        );
       
        // return NextResponse.json(
        //     { result: "Thank you for registering! Your account is currently under review and will be activated within 2 hours.", success: true, status: 201 },
        //     { status: 201 }
        // );










        // const center = await Centerlist.create({
        //     centerName: body.organizationName,
        //     centerType: body.centerType || "",
        //     capacity: String(body.centreCapacity || primaryCenter.totalSeatingCapacity || ""),
        //     country: body.country || "",
        //     State: body.state || "",
        //     city: body.city || "",
        //     phone: body.contactNumber || "",
        //     latitude: String(body.latitude || ""),
        //     longitude: String(body.longitude || ""),
        //     address: body.fullAddress || "",
        //     availability: body.availability?.operatingDays?.join(", ") || "",
        //     mainEntryPhoto: body.locationPhotos?.entrance?.[0] || primaryCenter.photos?.buildingFront?.[0] || "",
        //     washroomPhoto: body.locationPhotos?.washroom?.[0] || primaryCenter.photos?.washrooms?.[0] || "",
        //     others: body.declaration?.authorisedPersonName || body.contactPersonName || "",
        //     owner: "pending",
        //     isVerified: false,
        //     applicationData: body,
        // });

        // return NextResponse.json(
        //     {
        //         success: true,
        //         message: "Partner application submitted successfully",
        //         data: { id: center._id },
        //     },
        //     { status: 201 }
        // );
    } catch (error) {
        console.error("POST /api/centerlist failed:", error);

        return NextResponse.json(
            { error: error.message || "Failed to submit partner application" },
            { status: 500 }
        );
    }
}
