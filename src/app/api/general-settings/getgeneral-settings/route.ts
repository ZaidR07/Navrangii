import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDB();

    const doc = await db.collection("general_information").findOne({ _id: "general_settings" });

    const data = doc?.data;

    return NextResponse.json(
      {
        success: true,
        message: "General settings fetched successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in getGeneralSettings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching general settings",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
