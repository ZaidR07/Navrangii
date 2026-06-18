import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDB();

    // Get products with low stock (< 10) and total products
    const lowStockProducts = await db.collection("products").aggregate([
      { $unwind: "$variants" },
      { $unwind: "$variants.sizes" },
      { $match: { "variants.sizes.stock": { $lt: 10 } } },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          thumbnail: { $first: { $arrayElemAt: ["$variants.thumbnail", 0] } },
          totalStock: { $sum: "$variants.sizes.stock" },
        },
      },
      { $sort: { totalStock: 1 } },
      { $limit: 10 },
    ]).toArray();

    const totalProducts = await db.collection("products").countDocuments();
    const outOfStock = await db.collection("products").aggregate([
      { $unwind: "$variants" },
      { $unwind: "$variants.sizes" },
      { $match: { "variants.sizes.stock": { $lte: 0 } } },
      { $group: { _id: "$_id" } },
      { $count: "total" },
    ]).toArray();

    const lowStockCount = await db.collection("products").aggregate([
      { $unwind: "$variants" },
      { $unwind: "$variants.sizes" },
      { $match: { "variants.sizes.stock": { $gt: 0, $lt: 10 } } },
      { $group: { _id: "$_id" } },
      { $count: "total" },
    ]).toArray();

    return NextResponse.json({
      success: true,
      stock: {
        totalProducts,
        outOfStock: outOfStock[0]?.total || 0,
        lowStock: lowStockCount[0]?.total || 0,
        lowStockProducts: lowStockProducts.map((p) => ({
          _id: p._id.toString(),
          name: p.name,
          thumbnail: p.thumbnail || "/placeholder.svg",
          totalStock: p.totalStock,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching stock:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
