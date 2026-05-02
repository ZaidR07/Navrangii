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

    // Get user's cart
    const cart = await db.collection("carts").findOne({ userId: email });

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json(
        {
          success: true,
          cart: [],
        },
        { status: 200 }
      );
    }

    // Populate product data for each cart item using $lookup (same as product API)
    const populatedItems = await Promise.all(
      cart.items.map(async (item: any) => {
        let productObjectId;
        try {
          productObjectId = new ObjectId(item.productId);
        } catch {
          productObjectId = item.productId;
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
          return { ...item, product: null, variant: null };
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

        // Find the matching variant
        const variant = productData.variants?.find((v: any) => v._id === item.variantId) || null;

        return {
          ...item,
          product: productData,
          variant,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        cart: populatedItems,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cart",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
