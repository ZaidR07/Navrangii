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

    // Remove from wishlist
    const result = await db.collection("wishlists").updateOne(
      { userId: email },
      {
        $pull: { products: productId },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Wishlist not found for this email" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product removed from wishlist successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove from wishlist",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
