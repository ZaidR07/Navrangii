import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "../../../../lib/mongodb";
import { getAuthenticatedAdmin } from "../../../../lib/adminAuth";

export async function GET() {
  try {
    const authUser = await getAuthenticatedAdmin();

    if (!authUser || !authUser.isAdmin) {
      return NextResponse.json({ message: "Access denied - Admins only." }, { status: 403 });
    }

    const { db } = await connectToDB();

    // Find users who are not admins and have no orders using aggregation
    const visitors = await db
      .collection("users")
      .aggregate([
        { $match: { isAdmin: { $ne: true } } },
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "customerId",
            as: "orders",
          },
        },
        {
          $match: {
            orders: { $size: 0 },
          },
        },
        {
          $project: {
            password: 0,
            otp: 0,
            otpExpires: 0,
            orders: 0,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    return NextResponse.json(
      {
        message: "Visitors fetched successfully",
        data: visitors,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching visitors:", error);
    return NextResponse.json(
      {
        message: "Error fetching visitors",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
