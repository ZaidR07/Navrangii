import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDB } from "../../../../lib/mongodb";
import { AdminTokenUser, generateAccessToken, generateRefreshToken } from "../../../../lib/adminTokens";

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDB();
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.collection("users").insertOne({
      name,
      email,
      phone,
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date(),
    });

    if (!newUser?.insertedId) {
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
    }

    const rawUser = await db.collection("users").findOne({ _id: newUser.insertedId });
    if (!rawUser) {
      return NextResponse.json({ message: "User not found after insert" }, { status: 404 });
    }

    const userForToken: AdminTokenUser = {
      _id: rawUser._id.toString(),
      name: rawUser.name,
      email: rawUser.email,
      phone: rawUser.phone,
      isAdmin: rawUser.isAdmin,
    };

    const accessToken = generateAccessToken(userForToken);
    const refreshToken = generateRefreshToken(userForToken);

    const response = NextResponse.json({ message: "User created successfully" }, { status: 201 });

    const isProd = process.env.NODE_ENV === "production";

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong in Add User controller", error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
