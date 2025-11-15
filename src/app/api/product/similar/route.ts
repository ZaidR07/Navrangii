import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "../../../../lib/mongodb";

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
        { $limit: 10 },
      ])
      .toArray();

    return NextResponse.json(
      {
        success: true,
        message: "Similar products fetched successfully",
        products,
      },
      { status: 200 }
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
