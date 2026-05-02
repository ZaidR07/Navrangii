import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reviewId, status } = body;

    if (!reviewId || !status) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const { db } = await connectToDB();
    await db.collection("product_reviews").updateOne(
      { _id: new ObjectId(reviewId) },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, message: `Review ${status}` });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
