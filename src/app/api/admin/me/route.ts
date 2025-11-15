import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";
import { getAuthenticatedAdmin } from "../../../../lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedAdmin();

    if (!authUser || !authUser._id) {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
    }

    const { db } = await connectToDB();

    const user = await db.collection("admin").findOne({ email: authUser.email });

    if (!user) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    if (!user.isAdmin) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const { password: _password, ...safeUser } = user;

    return NextResponse.json(
      { message: "Admin retrieved successfully", safeUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in get admin controller", error);
    return NextResponse.json(
      { message: "Something went wrong in get admin controller", error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
