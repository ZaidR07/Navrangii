import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  });
}

function isConfigured() {
  return !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;
}

export async function POST(req: NextRequest) {
  try {
    // Check if Razorpay is configured
    if (!isConfigured()) {
      console.error("Razorpay not configured: Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET");
      return NextResponse.json(
        { success: false, message: "Payment gateway not configured. Please contact support." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { amount, currency = "INR", receipt, notes } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 }
      );
    }

    // Create order options
    const options = {
      amount: Math.round(amount * 100), // Convert to paise (Razorpay expects amount in smallest currency unit)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    // Create order in Razorpay
    const order = await getRazorpay().orders.create(options);

    if (!order || !order.id) {
      return NextResponse.json(
        { success: false, message: "Failed to create order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key: process.env.RAZORPAY_KEY_ID, // Return key from server
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create payment order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
