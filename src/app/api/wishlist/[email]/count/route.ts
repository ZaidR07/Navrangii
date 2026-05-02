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

    const wishlist = await db.collection("wishlists").findOne({ userId: email });

    const count = wishlist?.products?.length || 0;

    return NextResponse.json(
      {
        success: true,
        count,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching wishlist count:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch wishlist count",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
