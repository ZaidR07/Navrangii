import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productIdsParam = searchParams.get("productIds");

    if (!productIdsParam) {
      return NextResponse.json({ success: false, message: "productIds are required" }, { status: 400 });
    }

    const productIds = productIdsParam.split(",");
    const { db } = await connectToDB();

    // Aggregate average rating and review count per product
    const reviewAgg = await db.collection("product_reviews").aggregate([
      { $match: { productId: { $in: productIds }, status: "approved" } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]).toArray();

    const result: Record<string, { avgRating: number; reviewCount: number }> = {};
    for (const r of reviewAgg) {
      result[r._id] = {
        avgRating: Math.round((r.avgRating || 0) * 10) / 10,
        reviewCount: r.reviewCount || 0,
      };
    }

    return NextResponse.json({ success: true, reviews: result });
  } catch (error) {
    console.error("Error fetching aggregated reviews:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
