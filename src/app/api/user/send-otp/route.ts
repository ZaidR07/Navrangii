import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";
import { sendWhatsAppMessage, formatWhatsAppNumber } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    // Validate Indian mobile number (10 digits, optionally prefixed with +91 or 91)
    const cleaned = phone.replace(/\s|-/g, "");
    const phoneRegex = /^(\+?91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleaned)) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number. Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    const formattedPhone = formatWhatsAppNumber(cleaned);

    // Store or update OTP in database (keyed by phone)
    await db.collection("otps").updateOne(
      { phone: formattedPhone },
      {
        $set: {
          phone: formattedPhone,
          otp,
          expiry: otpExpiry,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Send OTP via WhatsApp (same provider as marketing campaigns)
    const message = `Your Navrangi OTP is ${otp}. It is valid for 10 minutes. Please do not share this code with anyone.`;

    try {
      const result = await sendWhatsAppMessage(formattedPhone, message);
      if (!result.ok) {
        console.error("WhatsApp API returned an error:", result.response);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to send OTP via WhatsApp",
            error: "WhatsApp service error",
          },
          { status: 500 }
        );
      }
    } catch (whatsappError) {
      console.error("Error sending OTP via WhatsApp:", whatsappError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send OTP via WhatsApp",
          error: whatsappError instanceof Error ? whatsappError.message : "WhatsApp service error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully to your WhatsApp number",
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
