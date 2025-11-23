import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { productId, email } = await req.json();

    if (!productId || !email) {
      return NextResponse.json(
        { success: false, message: "Product ID and Email are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    // Add to wishlist
    await db.collection("wishlists").updateOne(
      { userId: email },
      {
        $addToSet: { products: productId },
        $setOnInsert: { createdAt: new Date() },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product added to wishlist successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add to wishlist",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
