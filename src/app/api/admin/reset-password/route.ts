import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { message: "Email, OTP, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    // Find admin with email and valid OTP
    const admin = await db.collection("admin").findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Check if OTP exists and is not expired
    if (!admin.resetPasswordOTP || !admin.resetPasswordOTPExpiry) {
      return NextResponse.json(
        { message: "No password reset request found" },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date() > new Date(admin.resetPasswordOTPExpiry)) {
      return NextResponse.json(
        { message: "OTP has expired" },
        { status: 400 }
      );
    }

    // Verify OTP
    if (admin.resetPasswordOTP !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    await db.collection("admin").updateOne(
      { email },
      { 
        $set: { 
          password: hashedPassword
        },
        $unset: { 
          resetPasswordOTP: 1,
          resetPasswordOTPExpiry: 1
        }
      }
    );

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in admin reset password", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
