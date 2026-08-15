import { connectDB } from "@/lib/db";
import { User } from "@/lib/model/user";
import { NextResponse } from "next/server";

await connectDB();

export async function GET() {
    try {
        const data = await User.find();
        return NextResponse.json({ result: data, success: true, status: 201 });
    } catch (error) {
        return NextResponse.json(
            { result: "Failed to fetch users", error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const payload = await request.json();

        const user = await User.create({
            email: payload.email,
            name: payload.name,
            password: payload.password,
            isVerified: payload.isVerified ?? false,
            forgotPasswordToken: payload.forgotPasswordToken ?? null,
            forgotPasswordTokenExpiry: payload.forgotPasswordTokenExpiry ?? null,
            verificationToken: payload.verificationToken ?? null,
            verificationTokenExpiry: payload.verificationTokenExpiry ?? null,
            company: payload.company,
            mobile: payload.mobile,
            isActive: payload.isActive ?? 0,
            role: payload.role ?? 2,
            created_at: payload.created_at ?? new Date(),
        });

        return NextResponse.json(
            { result: "Thank you for registering! Your account is currently under review and will be activated within 2 hours.", success: true, status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { result: "Failed to add user", success: false, error: error.message },
            { status: 500 }
        );
    }
}
