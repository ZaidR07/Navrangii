import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const userId = email;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    // Clear all items from cart
    const result = await db.collection("carts").updateOne(
      { userId },
      {
        $set: { items: [], updatedAt: new Date() }
      }
    );

    // If no cart exists, create empty cart
    if (result.matchedCount === 0) {
      await db.collection("carts").insertOne({
        userId,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Cart cleared successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to clear cart",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
