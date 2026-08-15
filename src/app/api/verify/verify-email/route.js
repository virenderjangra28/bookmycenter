import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/model/user";

function normalizeToken(rawToken) {
  if (!rawToken || typeof rawToken !== "string") {
    return null;
  }

  let token = rawToken.trim();

  while (token.includes("%")) {
    try {
      const decoded = decodeURIComponent(token);
      if (decoded === token) break;
      token = decoded;
    } catch {
      break;
    }
  }

  return token;
}

export async function POST(request) {
  try {
    const { token: rawToken } = await request.json();
    const token = normalizeToken(rawToken);

    if (!token) {
      return NextResponse.json(
        { success: false, result: "Verification link is invalid or missing." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          result: "This verification link is invalid or has expired.",
        },
        { status: 400 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        result: "Email already verified.",
      });
    }

    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    });

    return NextResponse.json({
      success: true,
      result: "Email verified successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        result: "Failed to verify email.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
