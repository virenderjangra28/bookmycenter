import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Centerlist from "@/lib/model/centerlist";
import { User } from "@/lib/model/user";
import bcryptjs from "bcryptjs";
import Location from "@/lib/model/location";
import LegalRegistration from "@/lib/model/legalRegistration";
import BankingDetail from "@/lib/model/bankingDetail";
import CenterAvilability from "@/lib/model/centerAvailability";
import CompDeclaration from "@/lib/model/complianceDeclaration";

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

export async function GET() {
    try {
        await connectDB();
        const centerList = await Centerlist.find()
            .select("-photos -additionalPhotos")
            .sort({ created_at: -1 })
            .limit(50)
            .lean()
            .maxTimeMS(4000);
        return NextResponse.json({ message: "Center list fetched successfully", data: centerList }, { status: 200 });
    } catch (error) {
        console.error("GET /api/centerlist failed:", error);
        return NextResponse.json({ error: error.message || "Failed to get center list" }, { status: 500 });
    }
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

        //Add Location
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

        //Add Legal Registration
        const legalRegistration = await LegalRegistration.create({
            userId: userId,
            gstNumber: body.gstNumber || "",
            panNumber: body.panNumber || "",
            corporateNumber: body.corporateNumber || "",
            legalRegistrationPhotos: body.legalRegistrationPhotos || {},
        });

        //Bank Details 
        const bankingDetail = await BankingDetail.create({
            userId: userId,
            accountName: body.accountName || "",
            bankName: body.bankName || "",
            accountNumber: body.accountNumber || "",
            ifscCode: body.ifscCode || "",
            branchName: body.branchName || "",
            cancelCheckPhotos: body.cancelCheckPhotos?.checkPhoto || "",
        });

        //Centre Availability
        const centerAvailability = await CenterAvilability.create({
            userId: userId,
            operatingDays: Array.isArray(body.availability?.operatingDays)
                ? body.availability.operatingDays
                : [],
            operatingHoursFrom: body.availability?.hoursFrom || "",
            operatingHoursTo: body.availability?.hoursTo || "",
            weekdayExams: Boolean(body.availability?.weekdayExams),
            weekendExams: Boolean(body.availability?.weekendExams),
            multiDayExams: Boolean(body.availability?.multiDayExams),
            shortNoticeExams: Boolean(body.availability?.shortNoticeExams),
        });

        //Compliance Declaration
        const complianceDeclaration = await CompDeclaration.create({
            userId: userId,
            authorityName: body.complianceDeclaration?.authorityName || "",
            authorityDesignation: body.complianceDeclaration?.authorityDesignation || "",
            authDate: body.complianceDeclaration?.authDate || "",
        });

        //Centre Details
        const centers = Array.isArray(body.centers) ? body.centers : [];
        if (centers.length) {
            await Centerlist.insertMany(
                centers.map((center) => ({
                    userId,
                    centerId: center.id || "",
                    label: center.label || "",
                    separateRegistrationArea: center.separateRegistrationArea || "",
                    bagStorage: center.bagStorage || "",
                    totalAreaSqFt: center.totalAreaSqFt || "",
                    examRooms: center.examRooms || "",
                    totalSeatingCapacity: center.totalSeatingCapacity || "",
                    totalComputerCapacity: center.totalComputerCapacity || "",
                    maxCandidatesPerShift: center.maxCandidatesPerShift || "",
                    shiftsPerDay: center.shiftsPerDay || "",
                    waitingArea: center.waitingArea || "",
                    cbtInfrastructure: center.cbtInfrastructure || {},
                    internetInfrastructure: center.internetInfrastructure || {},
                    pbtInfrastructure: center.pbtInfrastructure || {},
                    powerInfrastructure: center.powerInfrastructure || {},
                    cctvSecurity: {
                        ...(center.cctvSecurity || {}),
                        cctvCoverage: Array.isArray(center.cctvSecurity?.cctvCoverage)
                            ? center.cctvSecurity.cctvCoverage
                            : [],
                    },
                    authenticationFacilities: Array.isArray(center.authenticationFacilities)
                        ? center.authenticationFacilities
                        : [],
                    accessibility: center.accessibility || {},
                    staff: center.staff || {},
                    photos: center.photos || {},
                    additionalPhotos: Array.isArray(center.additionalPhotos)
                        ? center.additionalPhotos
                        : [],
                    isVerified: false,
                    isAvailable: false,
                    price: center.price || 0,
                    pricePerCandidate: center.pricePerCandidate || 0,
                }))
            );
        }
       
        return NextResponse.json(
            { result: "Thank you for registering! Your account is currently under review and will be activated within 2 hours.", success: true, status: 201 },
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
