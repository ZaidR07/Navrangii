import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const { db } = await connectToDB();
    const reviews = await db
      .collection("product_reviews")
      .find({ productId, status: "approved" })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, rating, comment, userName, userEmail } = body;

    if (!productId || !rating || !comment || !userName) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const { db } = await connectToDB();
    const reviewData = {
      productId,
      rating: Number(rating),
      comment,
      userName,
      userEmail,
      status: "pending", // Reviews need admin approval by default
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("product_reviews").insertOne(reviewData);

    return NextResponse.json({ 
      success: true, 
      message: "Review submitted for approval. Thank you!" 
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
