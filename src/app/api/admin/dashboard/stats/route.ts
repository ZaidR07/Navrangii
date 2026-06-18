import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDB();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const startOfWeek = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Orders aggregation
    const ordersToday = await db.collection("orders").countDocuments({ createdAt: { $gte: startOfToday } });
    const ordersYesterday = await db.collection("orders").countDocuments({
      createdAt: { $gte: startOfYesterday, $lt: startOfToday },
    });
    const ordersWeek = await db.collection("orders").countDocuments({ createdAt: { $gte: startOfWeek } });
    const ordersMonth = await db.collection("orders").countDocuments({ createdAt: { $gte: startOfMonth } });

    // Sales aggregation (sum of total for paid/confirmed orders)
    const salesAggToday = await db.collection("orders").aggregate([
      { $match: { createdAt: { $gte: startOfToday }, "orderStatusUpdate.paymentStatus": "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]).toArray();
    const salesAggYesterday = await db.collection("orders").aggregate([
      { $match: { createdAt: { $gte: startOfYesterday, $lt: startOfToday }, "orderStatusUpdate.paymentStatus": "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]).toArray();
    const salesAggWeek = await db.collection("orders").aggregate([
      { $match: { createdAt: { $gte: startOfWeek }, "orderStatusUpdate.paymentStatus": "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]).toArray();
    const salesAggMonth = await db.collection("orders").aggregate([
      { $match: { createdAt: { $gte: startOfMonth }, "orderStatusUpdate.paymentStatus": "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]).toArray();

    // Products in stock - sum all stock across all variants/sizes
    const productsAgg = await db.collection("products").aggregate([
      { $unwind: "$variants" },
      { $unwind: "$variants.sizes" },
      { $group: { _id: null, totalStock: { $sum: "$variants.sizes.stock" } } },
    ]).toArray();
    const totalStock = productsAgg[0]?.totalStock || 0;

    // Active customers (users with at least one order in the month)
    const activeCustomersToday = await db.collection("users").countDocuments({ createdAt: { $gte: startOfToday } });
    const activeCustomersYesterday = await db.collection("users").countDocuments({
      createdAt: { $gte: startOfYesterday, $lt: startOfToday },
    });
    const activeCustomersWeek = await db.collection("users").countDocuments({ createdAt: { $gte: startOfWeek } });
    const activeCustomersMonth = await db.collection("users").countDocuments({ createdAt: { $gte: startOfMonth } });

    return NextResponse.json({
      success: true,
      stats: {
        orders: { today: ordersToday, yesterday: ordersYesterday, week: ordersWeek, month: ordersMonth },
        sales: {
          today: salesAggToday[0]?.total || 0,
          yesterday: salesAggYesterday[0]?.total || 0,
          week: salesAggWeek[0]?.total || 0,
          month: salesAggMonth[0]?.total || 0,
        },
        products: { today: totalStock, yesterday: totalStock, week: totalStock, month: totalStock },
        customers: { today: activeCustomersToday, yesterday: activeCustomersYesterday, week: activeCustomersWeek, month: activeCustomersMonth },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
