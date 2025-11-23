import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email, productId, variantId, size, quantity } = await req.json();

    if (!email || !productId || !size || quantity === undefined) {
      return NextResponse.json(
        { success: false, message: "Email, Product ID, size, and quantity are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    // Update cart item quantity
    const result = await db.collection("carts").updateOne(
      { 
        userId: email,
        "items.productId": productId,
        "items.size": size,
        ...(variantId && { "items.variantId": variantId })
      },
      {
        $set: { 
          "items.$.quantity": quantity,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Cart quantity updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating cart quantity:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update cart quantity",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
