import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const { db } = await connectToDB();

    // Get orders, filter by email if provided
    const query = email ? { userEmail: email } : {};
    const orders = await db
      .collection("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Get all users for enrichment
    const users = await db
      .collection("users")
      .find({})
      .toArray();

    // Create a map of email -> user for quick lookup
    const userMap = new Map();
    for (const user of users) {
      if (user.email) {
        userMap.set(user.email, user);
      }
    }

    // Enrich orders with user data if missing
    const enrichedOrders = orders.map((order: any) => {
      const orderEmail = order.userEmail || order.customerEmail;
      const user = orderEmail ? userMap.get(orderEmail) : null;

      return {
        ...order,
        _id: order._id.toString(),
        customerName: order.customerName || user?.name || 'Unknown',
        customerEmail: order.customerEmail || order.userEmail || user?.email || 'N/A',
        shippingAddress: order.shippingAddress || order.address || (user ? {
          fullName: user.name || '',
          phone: user.phone || 'N/A',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          zipCode: user.zipCode || '',
          country: user.country || '',
        } : {}),
      };
    });

    return NextResponse.json({
      success: true,
      orders: enrichedOrders || [],
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
