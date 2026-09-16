import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";

// Cache the product list for 60s on CDN, serve stale for up to 5min while revalidating
const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
};

export async function GET() {
  try {
    const { db } = await connectToDB();

    const products = await db
      .collection("products")
      .aggregate([
        {
          $lookup: {
            from: "productVariants",
            localField: "variants",
            foreignField: "_id",
            as: "variants",
          },
        },
        {
          $addFields: {
            variants: { $ifNull: ["$variants", []] },
          },
        },
        {
          // Project only fields needed by the storefront/admin to reduce payload size
          $project: {
            name: 1,
            description: 1,
            category: 1,
            subcategory: 1,
            section: 1,
            productType: 1,
            fabric: 1,
            occasion: 1,
            patternAndPrint: 1,
            style: 1,
            options: 1,
            color: 1,
            image: 1,
            createdAt: 1,
            updatedAt: 1,
            "variants._id": 1,
            "variants.color": 1,
            "variants.thumbnail": 1,
            "variants.gallery": 1,
            "variants.sizes.size": 1,
            "variants.sizes.sellingPrice": 1,
            "variants.sizes.marketPrice": 1,
            "variants.sizes.stock": 1,
          },
        },
      ])
      .toArray();

    return NextResponse.json(
      {
        success: true,
        message: "Products fetched successfully",
        products,
      },
      { status: 200, headers: CACHE_HEADERS }
    );
  } catch (error: unknown) {
    console.error("Error in getAllProducts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching products",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
