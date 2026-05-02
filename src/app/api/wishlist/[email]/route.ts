import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    // Get user's wishlist
    const wishlist = await db.collection("wishlists").findOne({ userId: email });

    if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
      return NextResponse.json(
        {
          success: true,
          wishlist: [],
        },
        { status: 200 }
      );
    }

    // Populate product data for each wishlist item
    const populatedItems = await Promise.all(
      wishlist.products.map(async (productId: string) => {
        let productObjectId;
        try {
          productObjectId = new ObjectId(productId);
        } catch {
          productObjectId = productId;
        }

        // Use aggregation with $lookup to populate variants from productVariants collection
        const products = await db.collection("products").aggregate([
          { $match: { _id: productObjectId } },
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
        ]).toArray();

        const product = products[0];

        if (!product) {
          return { productId, product: null };
        }

        // Convert ObjectId to string for frontend
        const productData = {
          ...product,
          _id: product._id.toString(),
          variants: (product.variants || []).map((v: any) => ({
            ...v,
            _id: v._id?.toString?.() || v._id,
          })),
        };

        return {
          productId,
          product: productData,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        wishlist: populatedItems,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch wishlist",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
