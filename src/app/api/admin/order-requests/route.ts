import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function GET(_req: NextRequest) {
  try {
    const { db } = await connectToDB();

    const requests = await db
      .collection("order_requests")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Enrich with order
    const orderIds = requests
      .map((r: any) => r.orderId)
      .filter(Boolean);

    const orders = await db
      .collection("orders")
      .find({ _id: { $in: orderIds } })
      .toArray();

    const orderMap = new Map<string, any>();
    for (const o of orders) orderMap.set(o._id.toString(), o);

    const enriched = requests.map((r: any) => {
      const order = orderMap.get(r.orderId?.toString());
      const orderStatus =
        order?.orderStatusUpdate?.status || order?.status || "pending";

      let refundAmount: number | undefined;
      if (order) {
        const total = Number(order.total || 0);
        // If it's a cancellation AND the order was already shipped/delivered, deduct 200
        if (r.type === 'cancellation' && ["shipped", "delivered"].includes(orderStatus)) {
          refundAmount = Math.max(total - 200, 0);
        } else {
          // Returns and pre-shipment cancellations get full refund
          refundAmount = total;
        }
      }

      return {
        ...r,
        _id: r._id.toString(),
        orderId: r.orderId?.toString(),
        createdAt: r.createdAt?.toISOString?.() || r.createdAt,
        updatedAt: r.updatedAt?.toISOString?.() || r.updatedAt,
        order: order
          ? {
              _id: order._id.toString(),
              status: orderStatus,
              total: order.total,
              razorpayPaymentId: order.razorpayPaymentId || order.paymentDetails?.razorpayPaymentId,
              userEmail: order.userEmail,
            }
          : null,
        refundAmount,
      };
    });

    return NextResponse.json({ success: true, requests: enriched });
  } catch (error) {
    console.error("Error fetching order requests:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
