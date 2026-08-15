import { connectDB } from "@/app/lib/db";
import { User } from "@/app/lib/model/user";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

await connectDB();

export async function POST(request) {
    try {
        
        const payload = await request.json();
        const { email, password } = payload;

        const user = await User.findOne({email});

        if (!user) {
            return NextResponse.json({ result: "User not found", success: false, status: 400 });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ result: "Invalid password", success: false, status: 400 });
        }

        const tokenData = { 
                                id: user._id, 
                                email: user.email, 
                                name: user.name,
                                role: user.role
                            }

        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1h" });
        const response =NextResponse.json({ result: "Login successful", data: tokenData, success: true, status: 200, token });
        response.cookies.set("token", token, { httpOnly: true });
        return response;
    } catch (error) {
        return NextResponse.json({ result: "Failed to login", error: error.message }, { status: 500 });
    }
}