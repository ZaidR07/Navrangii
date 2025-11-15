import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";
import { getAuthenticatedAdmin } from "../../../../lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedAdmin();

    if (!authUser || !authUser.isAdmin) {
      return NextResponse.json({ message: "Access denied - Admins only." }, { status: 403 });
    }

    const { db } = await connectToDB();
    const body = await req.json();

    const defaultGeneralSettings = {
      newsAndOffers: [],
      returnPeriod: null,
      freeShippingThreshold: null,
      phoneNumber: "",
      email: "",
      whatsapp: "",
    };

    const normalized = {
      ...body,
      newsAndOffers: Array.isArray(body.newsAndOffers)
        ? body.newsAndOffers
        : Array.isArray(body.generalItems)
        ? body.generalItems
        : [],
    };

    const toSave = { ...defaultGeneralSettings, ...normalized };

    await db.collection("general_information").updateOne(
      { _id: "general_settings" },
      {
        $set: { data: toSave, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    const updated = await db
      .collection("general_information")
      .findOne({ _id: "general_settings" });

    return NextResponse.json(
      {
        success: true,
        message: "General settings updated successfully",
        data: updated?.data || toSave,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in addUpdateGeneralSettings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating general settings",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
