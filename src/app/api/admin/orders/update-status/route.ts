import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { 
        $set: { 
          "orderStatusUpdate.status": status,
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Send email notification if status is confirmed
    if (status === 'confirmed') {
      try {
        const order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) });
        if (order) {
          const customerEmail = order.customerEmail || order.userEmail;
          if (customerEmail) {
            await sendEmail({
              to: customerEmail,
              subject: `Order Confirmed - ${order.orderId || order._id.toString()}`,
              html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmed</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
    <div style="background: #7C3AED; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">Order Confirmed!</h1>
    </div>
    <div style="padding: 30px;">
      <p>Hi ${order.customerName || 'Valued Customer'},</p>
      <p>Great news! Your order has been confirmed.</p>
      <div style="background: #f8f8f8; border-radius: 6px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Order Details</h3>
        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.orderId || order._id.toString()}</p>
        <p style="margin: 5px 0;"><strong>Amount:</strong> ₹${order.total || 0}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> Confirmed</p>
      </div>
      <p>We'll process and ship your order soon. You can track your order status in your profile.</p>
    </div>
    <div style="background: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #888;">
      <p>Darshu Store &copy; ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>`,
            });
          }
        }
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
