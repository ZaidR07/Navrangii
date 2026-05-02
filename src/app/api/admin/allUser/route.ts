import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";
import { getAuthenticatedAdmin } from "../../../../lib/adminAuth";

export async function GET() {
  try {
    const authUser = await getAuthenticatedAdmin();

    if (!authUser || !authUser.isAdmin) {
      return NextResponse.json({ message: "Access denied - Admins only." }, { status: 403 });
    }

    const { db } = await connectToDB();

    const users = await db
      .collection("users")
      .aggregate([
        {
          $match: {
            isAdmin: { $ne: true },
          },
        },
        {
          $lookup: {
            from: "orders",
            localField: "email",
            foreignField: "userEmail",
            as: "orders",
          },
        },
        {
          $match: {
            orders: { $ne: [] },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            phone: 1,
            isAdmin: 1,
            createdAt: 1,
            orders: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    return NextResponse.json(
      {
        message: "Users fetched successfully",
        users,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in getAllUsers:", error);
    return NextResponse.json(
      {
        message: "Error fetching users",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
