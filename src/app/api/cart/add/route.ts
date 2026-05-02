import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { productId, variantId, size, quantity = 1, email } = await req.json();

    const userId = email;
    if (!productId || !userId) {
      return NextResponse.json(
        { success: false, message: "Product ID and Email are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    // Check if item already exists in cart (same product, variant, size)
    const existingCart = await db.collection("carts").findOne({ userId });

    if (existingCart) {
      const existingItem = (existingCart.items || []).find(
        (item: any) => item.productId === productId && item.variantId === variantId && item.size === size
      );

      if (existingItem) {
        // Increment quantity for existing item
        await db.collection("carts").updateOne(
          { userId, "items.productId": productId, "items.variantId": variantId, "items.size": size },
          { $inc: { "items.$.quantity": quantity }, $set: { updatedAt: new Date() } }
        );
      } else {
        // Add new item to existing cart
        await db.collection("carts").updateOne(
          { userId },
          {
            $push: { items: { productId, variantId: variantId || "", size: size || "", quantity, addedAt: new Date() } } as any,
            $set: { updatedAt: new Date() }
          }
        );
      }
    } else {
      // Create new cart with the item
      await db.collection("carts").updateOne(
        { userId },
        {
          $setOnInsert: { createdAt: new Date() },
          $set: { updatedAt: new Date() },
          $push: { items: { productId, variantId: variantId || "", size: size || "", quantity, addedAt: new Date() } } as any
        },
        { upsert: true }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product added to cart successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add to cart",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
