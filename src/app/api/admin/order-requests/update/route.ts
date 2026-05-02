import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requestId, status } = body;

    if (!requestId) {
      return NextResponse.json({ success: false, message: "requestId is required" }, { status: 400 });
    }

    const allowed = [
      "requested",
      "approved",
      "pickup_scheduled",
      "picked_up",
      "refunded",
      "rejected",
    ];
    if (!allowed.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    const { db } = await connectToDB();

    const request = await db.collection("order_requests").findOne({ _id: new ObjectId(requestId) });
    if (!request) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    }

    const order = request.orderId
      ? await db.collection("orders").findOne({ _id: new ObjectId(request.orderId) })
      : null;

    // If moving to refunded, process Razorpay refund (for online paid orders)
    if (status === "refunded" && order) {
      const orderStatus = order?.orderStatusUpdate?.status || order?.status || "pending";
      const total = Number(order.total || 0);
      
      // Calculate refund amount based on updated rules:
      // Deduct 200 ONLY for cancellations of shipped/delivered orders
      const refundAmount = (request.type === "cancellation" && ["shipped", "delivered"].includes(orderStatus)) 
        ? Math.max(total - 200, 0) 
        : total;

      const paymentId = order.razorpayPaymentId || order.paymentDetails?.razorpayPaymentId;

      if (paymentId && (order.paymentStatus === "paid" || order.orderStatusUpdate?.paymentStatus === "paid" || order.paymentMethod === "online" || order.paymentMethod === "Razorpay")) {
        // Razorpay expects paise
        await razorpay.payments.refund(paymentId, {
          amount: Math.round(refundAmount * 100),
          notes: {
            reason: request.reason || "refund",
            requestId: request._id.toString(),
          },
        });

        await db.collection("orders").updateOne(
          { _id: new ObjectId(order._id) },
          {
            $set: {
              "orderStatusUpdate.paymentStatus": "refunded",
              updatedAt: new Date(),
            },
          }
        );
      }
    }

    await db.collection("order_requests").updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status, updatedAt: new Date() } }
    );

    // Mirror some status back to order for customer visibility
    if (order) {
      if (status === "approved") {
        await db.collection("orders").updateOne(
          { _id: new ObjectId(order._id) },
          { $set: { status: request.type === "cancellation" ? "cancelled" : "return_request", updatedAt: new Date() } }
        );
      }
      if (status === "picked_up") {
        await db.collection("orders").updateOne(
          { _id: new ObjectId(order._id) },
          { $set: { status: "returned", updatedAt: new Date() } }
        );
      }
    }

    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json({ success: false, message: "Failed to update" }, { status: 500 });
  }
}
