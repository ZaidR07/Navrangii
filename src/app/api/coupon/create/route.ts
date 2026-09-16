import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { getAuthenticatedAdmin } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedAdmin();

    if (!authUser || !authUser.isAdmin) {
      return NextResponse.json(
        { message: "Access denied - Admins only." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const requiredFields = [
      "code",
      "description",
      "discountType",
      "discountValue",
      "minimumOrderAmount",
      "usageLimit",
      "startDate",
      "endDate",
      "status",
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json(
          { message: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    const { db } = await connectToDB();

    // Prevent duplicate coupon codes (case-insensitive)
    const existing = await db
      .collection("coupons")
      .findOne({ code: { $regex: new RegExp(`^${body.code}$`, "i") } });

    if (existing) {
      return NextResponse.json(
        { message: "Coupon code already exists" },
        { status: 409 }
      );
    }

    const newCoupon = {
      code: body.code,
      description: body.description,
      discountType: body.discountType,
      discountValue: Number(body.discountValue),
      minimumOrderAmount: Number(body.minimumOrderAmount),
      maximumDiscountAmount:
        body.maximumDiscountAmount !== undefined && body.maximumDiscountAmount !== ""
          ? Number(body.maximumDiscountAmount)
          : 0,
      usageLimit: Number(body.usageLimit),
      usedCount: 0,
      startDate: body.startDate,
      endDate: body.endDate,
      status: body.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection("coupons").insertOne(newCoupon);

    if (!result.acknowledged) {
      return NextResponse.json(
        { message: "Failed to create coupon" },
        { status: 500 }
      );
    }

    const createdCoupon = await db
      .collection("coupons")
      .findOne({ _id: result.insertedId });

    return NextResponse.json(
      {
        success: true,
        message: "Coupon created successfully",
        data: {
          ...createdCoupon,
          _id: createdCoupon?._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      {
        message: "Failed to create coupon",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
