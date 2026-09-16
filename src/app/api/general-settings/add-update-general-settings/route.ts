import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";
import { uploadBase64Image } from "../../../../lib/awsUploadImages";
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
      heroCarousel: [],
      heroCarouselMobile: [],
      returnPeriod: null,
      freeShippingThreshold: null,
      phoneNumber: "",
      email: "",
      whatsapp: "",
      whatsappUsername: "",
      whatsappDeviceToken: "",
    };

    const normalized = {
      ...body,
      newsAndOffers: Array.isArray(body.newsAndOffers)
        ? body.newsAndOffers
        : Array.isArray(body.generalItems)
        ? body.generalItems
        : [],
    };

    const uploadCarousel = async (images: unknown, prefix: string) =>
      Promise.all(
        (Array.isArray(images) ? images : []).map(async (img: string, i: number) => {
          if (typeof img === "string" && img.startsWith("data:image")) {
            const ext = img.match(/^data:image\/(\w+)/)?.[1] || "jpg";
            return uploadBase64Image(img, `hero-carousel/${prefix}-slide-${Date.now()}-${i}.${ext}`);
          }
          return img;
        })
      );

    const heroCarousel = await uploadCarousel(normalized.heroCarousel, "desktop");
    const heroCarouselMobile = await uploadCarousel(normalized.heroCarouselMobile, "mobile");

    const toSave = { ...defaultGeneralSettings, ...normalized, heroCarousel, heroCarouselMobile };

    await db.collection("general_information").updateOne(
      { _id: "general_settings" as any },
      {
        $set: { data: toSave, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    const updated = await db
      .collection("general_information")
      .findOne({ _id: "general_settings" as any });

    return NextResponse.json(
      {
        success: true,
        message: "General settings updated successfully",
        data: updated?.data || toSave,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in addUpdateGeneralSettings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating general settings",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
