import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Store or update OTP in database
    await db.collection("otps").updateOne(
      { email },
      {
        $set: {
          email,
          otp,
          expiry: otpExpiry,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Send OTP via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: [email],
        subject: "Your OTP Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Your OTP Verification Code</h2>
            <p style="font-size: 18px; color: #666;">
              Your One-Time Password (OTP) is:
            </p>
            <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 4px;">
                ${otp}
              </span>
            </div>
            <p style="color: #666; font-size: 14px;">
              This OTP will expire in <strong>10 minutes</strong>. Please do not share this code with anyone.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Error sending email via Resend:", emailError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send OTP email",
          error: "Email service error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
        // In development, you might want to return the OTP for testing
        // otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send OTP",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
