import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDB();
    const body = await request.json();

    // Upsert: update if exists, insert if not
    const result = await db.collection("variables").findOneAndReplace(
      {},
      body,
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Variables updated successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in updateVariables:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating variables",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
