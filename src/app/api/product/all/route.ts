import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";

export async function GET(req: NextRequest) {
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
      ])
      .toArray();

    return NextResponse.json(
      {
        success: true,
        message: "Products fetched successfully",
        products,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in getAllProducts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching products",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
