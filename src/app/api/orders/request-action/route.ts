import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/email";
import { uploadBase64Image } from "@/lib/awsUploadImages";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, reason, type, photosBase64, videoBase64 } = body;

    if (type !== "cancellation" && type !== "return") {
      return NextResponse.json({ success: false, message: "Invalid request type" }, { status: 400 });
    }

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
    }

    if (!reason || typeof reason !== "string" || !reason.trim()) {
      return NextResponse.json({ success: false, message: "Reason is required" }, { status: 400 });
    }

    if (type === "return") {
      if (!Array.isArray(photosBase64) || photosBase64.length < 2 || photosBase64.length > 4) {
        return NextResponse.json(
          { success: false, message: "Return request requires 2 to 4 photos" },
          { status: 400 }
        );
      }
    }

    const { db } = await connectToDB();
    const order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const requestId = new ObjectId();
    const createdAt = new Date();

    const photoUrls: string[] = [];
    if (Array.isArray(photosBase64)) {
      for (let i = 0; i < photosBase64.length; i++) {
        const base64 = photosBase64[i];
        if (typeof base64 !== "string" || !base64.startsWith("data:")) continue;
        const url = await uploadBase64Image(
          base64,
          `order-requests/${requestId.toString()}/photo-${i + 1}-${Date.now()}`
        );
        photoUrls.push(url);
      }
    }

    let videoUrl: string | null = null;
    if (typeof videoBase64 === "string" && videoBase64.startsWith("data:")) {
      videoUrl = await uploadBase64Image(
        videoBase64,
        `order-requests/${requestId.toString()}/video-${Date.now()}`
      );
    }

    await db.collection("order_requests").insertOne({
      _id: requestId,
      orderId: new ObjectId(orderId),
      orderNumber: order.orderId || null,
      userEmail: order.userEmail || order.customerEmail || null,
      customerName: order.customerName || null,
      type,
      reason: reason.trim(),
      photoUrls,
      videoUrl,
      status: "requested",
      originalOrderStatus: order.orderStatusUpdate?.status || order.status || "pending",
      createdAt,
      updatedAt: createdAt,
    });

    // If it's a cancellation, we should also update the order status to cancelled
    // so the customer sees it immediately
    if (type === "cancellation") {
      await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId) },
        { 
          $set: { 
            status: "cancelled",
            "orderStatusUpdate.status": "cancelled",
            updatedAt: new Date() 
          } 
        }
      );
    }

    // Send email notification to admin
    await sendEmail({
      to: process.env.FROM_EMAIL || 'admin@darshu.store',
      subject: `New ${type === 'cancellation' ? 'Cancellation' : 'Return'} Request - ${order.orderId || orderId}`,
      html: `
        <h2>New ${type === 'cancellation' ? 'Cancellation' : 'Return'} Request</h2>
        <p><strong>Order ID:</strong> ${order.orderId || orderId}</p>
        <p><strong>Customer:</strong> ${order.customerName || 'N/A'} (${order.customerEmail || order.userEmail})</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Photos:</strong> ${photoUrls.length ? photoUrls.map((u) => `<a href="${u}">${u}</a>`).join("<br/>") : "N/A"}</p>
        <p><strong>Video:</strong> ${videoUrl ? `<a href="${videoUrl}">${videoUrl}</a>` : "N/A"}</p>
        <p>Please check the admin panel for details.</p>
      `
    });

    return NextResponse.json({ 
      success: true, 
      requestId: requestId.toString(),
      message: `${type === 'cancellation' ? 'Cancellation' : 'Return'} request submitted successfully.` 
    });
  } catch (error) {
    console.error(`Error processing request:`, error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
