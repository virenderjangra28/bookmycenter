import { connectionString } from "@/app/lib/db";
import { User } from "@/app/lib/model/user";
import mongoose from "mongoose";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helper/mailer";

async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    await mongoose.connect(connectionString);
}

export async function POST(request) {
    try {
         await connectDB();
        const payload = await request.json();
        const { email, password } = payload;
       
        //Check if user already exists
        const user = await User.findOne({ email });
        if(user){
            return NextResponse.json({ result: "User already exists", success: false, status: 400 });
        }

        //Hash Password (optional at signup)
        const hashedPassword = password
            ? await bcryptjs.hash(password, 10)
            : "";

        
        // Create new user
        const newUser = await User.create({
            email: payload.email,
            name: payload.name,
            password: hashedPassword ?? "",
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
        console.log("[signup] user created", newUser._id);

        //Send Email
        await sendEmail({ email, emailType: "VERIFY", userId: newUser._id });
        console.log("[signup] sendEmail completed");

        return NextResponse.json(
            { result: "Thank you for registering! Your account is currently under review and will be activated within 2 hours.", success: true, status: 201 },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { result: "Failed to add user", success: false, error: error.message },
            { status: 500 }
        );
    }
}
