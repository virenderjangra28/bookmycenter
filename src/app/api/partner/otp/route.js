import { NextResponse } from "next/server";

const otpStore = globalThis.__partnerOtpStore || new Map();
globalThis.__partnerOtpStore = otpStore;

function getKey(type, value) {
  return `${type}:${String(value).trim().toLowerCase()}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, type, value, otp } = body;

    if (!type || !value) {
      return NextResponse.json({ error: "Type and value are required" }, { status: 400 });
    }

    const key = getKey(type, value);

    if (action === "send") {
      const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
      otpStore.set(key, {
        otp: generatedOtp,
        expiresAt: Date.now() + 10 * 60 * 1000,
      });

      console.info(`Partner OTP for ${type} ${value}: ${generatedOtp}`);

      return NextResponse.json({
        success: true,
        message: "OTP sent successfully",
      });
    }

    if (action === "verify") {
      const record = otpStore.get(key);

      if (!record || record.expiresAt < Date.now()) {
        return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 400 });
      }

      if (String(otp).trim() !== record.otp) {
        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
      }

      otpStore.delete(key);

      return NextResponse.json({
        success: true,
        message: "OTP verified successfully",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "OTP request failed" },
      { status: 500 }
    );
  }
}
