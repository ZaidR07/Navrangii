import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";
import { sign } from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    // Find the OTP record
    const otpRecord = await db.collection("otps").findOne({ email });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "OTP not found or expired" },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date() > new Date(otpRecord.expiry)) {
      return NextResponse.json(
        { success: false, message: "OTP has expired" },
        { status: 400 }
      );
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Check if user exists, if not create one
    let user = await db.collection("users").findOne({ email });
    
    if (!user) {
      // Create new user
      const newUser = {
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };
      
      const result = await db.collection("users").insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }

    // Delete the OTP record after successful verification
    await db.collection("otps").deleteOne({ email });

    // Generate JWT token
    const token = sign(
      { 
        userId: user._id.toString(), 
        email: user.email 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    // Update user's last login
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully",
        user: {
          _id: user._id,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify OTP",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
