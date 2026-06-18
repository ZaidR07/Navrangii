import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Orders by status
    const orderStatusAgg = await db.collection("orders").aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      {
        $group: {
          _id: { $ifNull: ["$orderStatusUpdate.status", "$status", "pending"] },
          count: { $sum: 1 },
        },
      },
    ]).toArray();

    const statusMap: Record<string, number> = {};
    for (const s of orderStatusAgg) {
      const status = s._id || "pending";
      statusMap[status] = (statusMap[status] || 0) + s.count;
    }

    const ordersData = [
      { name: "Pending", value: statusMap["pending"] || 0, color: "#8b5cf6" },
      { name: "Confirmed", value: statusMap["confirmed"] || 0, color: "#a855f7" },
      { name: "Shipped", value: statusMap["shipped"] || 0, color: "#c084fc" },
      { name: "Delivered", value: statusMap["delivered"] || 0, color: "#7c3aed" },
      { name: "Cancelled", value: statusMap["cancelled"] || 0, color: "#ef4444" },
    ].filter((d) => d.value > 0);

    // Customers: new vs returning (based on having >1 order)
    const customerOrders = await db.collection("orders").aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: "$userEmail", count: { $sum: 1 } } },
    ]).toArray();

    let newCount = 0;
    let returningCount = 0;
    for (const c of customerOrders) {
      if (c.count > 1) returningCount++;
      else newCount++;
    }

    // Inactive customers = total users - active this month
    const totalUsers = await db.collection("users").countDocuments();
    const activeThisMonth = customerOrders.length;
    const inactiveCount = Math.max(0, totalUsers - activeThisMonth);

    const customersData = [
      { name: "New", value: newCount, color: "#8b5cf6" },
      { name: "Returning", value: returningCount, color: "#a855f7" },
      { name: "Inactive", value: inactiveCount, color: "#c084fc" },
    ].filter((d) => d.value > 0);

    return NextResponse.json({
      success: true,
      stats: {
        orders: ordersData.length > 0 ? ordersData : [{ name: "No Data", value: 1, color: "#d1d5db" }],
        customers: customersData.length > 0 ? customersData : [{ name: "No Data", value: 1, color: "#d1d5db" }],
      },
    });
  } catch (error) {
    console.error("Error fetching pie stats:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
