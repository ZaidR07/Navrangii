import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { productId, variantId, size, email } = await req.json();

    const userId = email;
    if (!productId || !userId) {
      return NextResponse.json(
        { success: false, message: "Product ID and Email are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    // Build the pull filter to match the specific item
    const pullFilter: any = { productId };
    if (variantId) pullFilter.variantId = variantId;
    if (size) pullFilter.size = size;

    // Remove from cart
    const result = await db.collection("carts").updateOne(
      { userId },
      {
        $pull: { items: pullFilter } as any,
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
