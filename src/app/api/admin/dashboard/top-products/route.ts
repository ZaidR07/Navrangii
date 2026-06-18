import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDB();

    // Aggregate top selling products from orders.
    // Orders store paymentStatus at the top level (legacy) or nested in orderStatusUpdate.
    // Order items may be under "items" (new) or "cartItems" (legacy).
    const topProductsAgg = await db.collection("orders").aggregate([
      {
        $match: {
          $or: [
            { paymentStatus: "paid" },
            { "orderStatusUpdate.paymentStatus": "paid" },
          ],
        },
      },
      // Normalise field name: some orders store under "items", legacy orders under "cartItems"
      {
        $addFields: {
          _orderItems: {
            $cond: {
              if: { $isArray: "$items" },
              then: "$items",
              else: {
                $cond: {
                  if: { $isArray: "$cartItems" },
                  then: "$cartItems",
                  else: [],
                },
              },
            },
          },
        },
      },
      { $unwind: "$_orderItems" },
      // Compute unit price if missing (legacy orders don't store price on items)
      {
        $addFields: {
          "_orderItems.price": {
            $ifNull: [
              "$_orderItems.price",
              {
                $let: {
                  vars: {
                    matchedSize: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: { $ifNull: ["$_orderItems.variant.sizes", []] },
                            as: "s",
                            cond: {
                              $eq: [
                                "$$s.size",
                                { $ifNull: ["$_orderItems.size", ""] },
                              ],
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: { $ifNull: ["$$matchedSize.sellingPrice", 0] },
                },
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_orderItems.product._id",
          name: { $first: "$_orderItems.product.name" },
          image: { $first: "$_orderItems.variant.thumbnail" },
          totalSell: { $sum: "$_orderItems.quantity" },
          unitPrice: { $first: "$_orderItems.price" },
        },
      },
      { $sort: { totalSell: -1 } },
      { $limit: 5 },
    ]).toArray();

    // If no paid orders exist yet, return recent products as fallback
    if (topProductsAgg.length === 0) {
      const fallbackProducts = await db.collection("products").aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
        {
          $project: {
            name: 1,
            image: { $arrayElemAt: ["$variants.thumbnail", 0] },
            totalSell: { $literal: 0 },
            unitPrice: {
              $let: {
                vars: {
                  firstVariant: { $arrayElemAt: ["$variants", 0] },
                },
                in: {
                  $let: {
                    vars: {
                      firstSize: { $arrayElemAt: ["$$firstVariant.sizes", 0] },
                    },
                    in: "$$firstSize.sellingPrice",
                  },
                },
              },
            },
          },
        },
      ]).toArray();

      const formatted = fallbackProducts.map((p) => ({
        name: p.name || "Unknown Product",
        totalSell: 0,
        unitPrice: p.unitPrice || 0,
        totalAmount: 0,
        image: p.image || "/placeholder.svg",
      }));

      return NextResponse.json({ success: true, products: formatted });
    }

    const formatted = topProductsAgg.map((p) => ({
      name: p.name || "Unknown Product",
      totalSell: p.totalSell || 0,
      unitPrice: p.unitPrice || 0,
      totalAmount: (p.totalSell || 0) * (p.unitPrice || 0),
      image: p.image || "/placeholder.svg",
    }));

    return NextResponse.json({ success: true, products: formatted });
  } catch (error) {
    console.error("Error fetching top products:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
