import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDB } from "@/lib/mongodb";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = body;

    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment verification parameters" },
        { status: 400 }
      );
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Connect to database and save order
    const { db } = await connectToDB();

    const orderData = {
      orderId: `ORD-${Date.now()}`,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      verified: true,
      paymentTime: new Date().toISOString(),
      paymentStatus: "paid",
      status: "confirmed",
      paymentMethod: orderDetails?.paymentMethod || "online",
      ...orderDetails,
      createdAt: new Date(),
    };

    await db.collection("orders").insertOne(orderData);

    // Send order confirmation email
    const customerEmail = orderDetails?.customerEmail || orderDetails?.userEmail;
    if (customerEmail) {
      await sendEmail({
        to: customerEmail,
        subject: `Order Confirmed - ${orderData.orderId}`,
        html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
    <div style="background: #7C3AED; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">Order Confirmed!</h1>
    </div>
    <div style="padding: 30px;">
      <p>Hi ${orderDetails?.customerName || 'Valued Customer'},</p>
      <p>Thank you for your order. We're pleased to confirm your order has been received.</p>
      <div style="background: #f8f8f8; border-radius: 6px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Order Details</h3>
        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p style="margin: 5px 0;"><strong>Amount:</strong> ₹${orderDetails?.total || 0}</p>
        <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${orderDetails?.paymentMethod || 'Online'}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> Confirmed</p>
      </div>
      <p>We'll notify you once your order is shipped. You can track your order status in your profile.</p>
    </div>
    <div style="background: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #888;">
      <p>Darshu Store &copy; ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      orderId: orderData.orderId,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
