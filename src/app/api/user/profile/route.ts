import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    const user = await db.collection("users").findOne(
      { email },
      {
        projection: {
          password: 0,
          otp: 0,
          otpExpires: 0,
          isAdmin: 0,
        },
      }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id.toString(),
          name: user.name || "",
          email: user.email,
          phone: user.phone || "",
          addresses: user.addresses || [],
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching profile",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, addresses } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (addresses !== undefined) updateData.addresses = addresses;

    const result = await db.collection("users").updateOne(
      { email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const updatedUser = await db.collection("users").findOne(
      { email },
      {
        projection: {
          password: 0,
          otp: 0,
          otpExpires: 0,
          isAdmin: 0,
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: {
          id: updatedUser!._id.toString(),
          name: updatedUser!.name || "",
          email: updatedUser!.email,
          phone: updatedUser!.phone || "",
          addresses: updatedUser!.addresses || [],
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating profile",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
