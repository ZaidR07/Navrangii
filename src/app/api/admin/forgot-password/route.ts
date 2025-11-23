import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { generateOTP } from "@/lib/otp";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    // Check if admin exists with this email
    const admin = await db.collection("admin").findOne({ email });

    if (!admin) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: "If an account with this email exists, an OTP has been sent" },
        { status: 200 }
      );
    }

    if (!admin.isAdmin) {
      return NextResponse.json(
        { message: "If an account with this email exists, an OTP has been sent" },
        { status: 200 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await db.collection("admin").updateOne(
      { email },
      { 
        $set: { 
          resetPasswordOTP: otp,
          resetPasswordOTPExpiry: otpExpiry
        }
      }
    );

    // Send OTP email
    await sendEmail({
      to: email,
      subject: "Admin Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Admin Password Reset</h2>
          <p>You have requested to reset your admin password. Use the OTP below to proceed:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #333; margin: 0;">${otp}</h1>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">This is an automated message, please do not reply.</p>
        </div>
      `
    });

    return NextResponse.json(
      { message: "If an account with this email exists, an OTP has been sent" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in admin forgot password", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
