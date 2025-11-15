import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDB();

    const variables = await db.collection("variables").findOne({});

    if (!variables) {
      return NextResponse.json(
        {
          success: false,
          message: "Variables not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Variables fetched successfully",
        data: variables,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in getVariables:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching variables",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
