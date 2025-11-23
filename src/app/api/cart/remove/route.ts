import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { productId, userId } = await req.json();

    if (!productId || !userId) {
      return NextResponse.json(
        { success: false, message: "Product ID and User ID are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    // Remove from cart
    const result = await db.collection("carts").updateOne(
      { userId },
      {
        $pull: { items: { productId } } as any,
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Cart not found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product removed from cart successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove from cart",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
