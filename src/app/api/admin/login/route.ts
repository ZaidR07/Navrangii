import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDB } from "../../../../lib/mongodb";
import { AdminTokenUser, generateAccessToken, generateRefreshToken } from "../../../../lib/adminTokens";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    let db;
    try {
      const conn = await connectToDB();
      db = conn.db;
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json({ message: "Database connection error" }, { status: 500 });
    }

    let user;
    try {
      user = await db.collection("admin").findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
      }
    } catch (findError) {
      console.error("Error finding user:", findError);
      return NextResponse.json({ message: "Error authenticating user" }, { status: 500 });
    }

    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
      }
    } catch (bcryptError) {
      console.error("Error comparing passwords:", bcryptError);
      return NextResponse.json({ message: "Error authenticating user" }, { status: 500 });
    }

    try {
      const userForToken: AdminTokenUser = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      };

      const accessToken = generateAccessToken(userForToken);
      const refreshToken = generateRefreshToken(userForToken);

      const response = NextResponse.json(
        {
          message: "Login successful",
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        },
        { status: 200 }
      );

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
    } catch (tokenError) {
      console.error("Error generating tokens:", tokenError);
      return NextResponse.json({ message: "Error generating authentication tokens" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Unexpected error in login controller:", error);
    return NextResponse.json(
      {
        message: "An unexpected error occurred during login",
      },
      { status: 500 }
    );
  }
}
