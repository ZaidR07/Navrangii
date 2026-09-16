import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "../../../../lib/mongodb";

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const excludeId = searchParams.get("excludeId");

    if (!category && !subcategory) {
      return NextResponse.json(
        { success: false, message: "Category or subcategory is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    const query: any = {};
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (excludeId) {
      query._id = { $ne: new ObjectId(excludeId) };
    }

    const products = await db
      .collection("products")
      .aggregate([
        { $match: query },
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
          // Project only fields needed for similar products display
          $project: {
            name: 1,
            category: 1,
            subcategory: 1,
            section: 1,
            productType: 1,
            image: 1,
            createdAt: 1,
            "variants._id": 1,
            "variants.thumbnail": 1,
            "variants.gallery": 1,
            "variants.sizes.sellingPrice": 1,
            "variants.sizes.marketPrice": 1,
            "variants.sizes.size": 1,
          },
        },
        { $limit: 10 },
      ])
      .toArray();

    return NextResponse.json(
      {
        success: true,
        message: "Similar products fetched successfully",
        products,
      },
      { status: 200, headers: CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("Error in getSimilarProducts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching similar products",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
