import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDB();
    
    const coupons = await db.collection("coupons")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      { 
        message: "Coupons retrieved successfully", 
        coupons: coupons 
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in get coupons controller", error);
    return NextResponse.json(
      { message: "Something went wrong in get coupons controller", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
