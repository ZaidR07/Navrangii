import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

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

    if (!cart || !cart.items) {
      return NextResponse.json(
        {
          success: true,
          count: 0,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        count: cart.items.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching cart count:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cart count",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
