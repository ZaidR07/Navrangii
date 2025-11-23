import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { productId, userId, quantity = 1 } = await req.json();

    if (!productId || !userId) {
      return NextResponse.json(
        { success: false, message: "Product ID and User ID are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    // Add to cart
    await db.collection("carts").updateOne(
      { userId },
      {
        $push: { items: { productId, quantity, addedAt: new Date() } } as any,
        $setOnInsert: { items: [], createdAt: new Date() },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );

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
