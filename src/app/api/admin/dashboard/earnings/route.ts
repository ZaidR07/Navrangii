import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDB();
    const now = new Date();
    const currentYear = now.getFullYear();

    // Aggregate paid orders by month for current year
    const earningsAgg = await db.collection("orders").aggregate([
      {
        $match: {
          "orderStatusUpdate.paymentStatus": "paid",
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          earnings: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]).toArray();

    const earningsMap = new Map<number, number>();
    for (const item of earningsAgg) {
      earningsMap.set(item._id, item.earnings);
    }

    const data = MONTHS.map((month, index) => ({
      month,
      earnings: earningsMap.get(index + 1) || 0,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
