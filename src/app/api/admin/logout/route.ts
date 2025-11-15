import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ message: "User logout successful" }, { status: 200 });

    const isProd = process.env.NODE_ENV === "production";

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 0,
      path: "/",
    });

    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        message: "Something went wrong during logout",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
