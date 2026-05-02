import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json({ success: false, message: "Review ID is required" }, { status: 400 });
    }

    const { db } = await connectToDB();
    await db.collection("product_reviews").deleteOne({ _id: new ObjectId(reviewId) });

    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
