import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "../../../../lib/mongodb";
import { deleteS3Object } from "../../../../lib/awsUploadImages";
import { getAuthenticatedAdmin } from "../../../../lib/adminAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID format" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    const product = await db
      .collection("products")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "productVariants",
            localField: "variants",
            foreignField: "_id",
            as: "variants",
          },
        },
        {
          $addFields: {
            variants: { $ifNull: ["$variants", []] },
          },
        },
        { $limit: 1 },
      ])
      .next();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product fetched successfully",
        product,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in getProductById:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching product",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthenticatedAdmin();

    if (!authUser || !authUser.isAdmin) {
      return NextResponse.json({ message: "Access denied - Admins only." }, { status: 403 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDB();

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const variants = await db
      .collection("productVariants")
      .find({ _id: { $in: product.variants || [] } })
      .toArray();

    for (const variant of variants) {
      if (variant.thumbnail) {
        const thumbnailKey = new URL(variant.thumbnail).pathname.slice(1);
        await deleteS3Object(thumbnailKey);
      }

      for (const img of variant.gallery || []) {
        const galleryKey = new URL(img).pathname.slice(1);
        await deleteS3Object(galleryKey);
      }
    }

    await db.collection("productVariants").deleteMany({
      _id: { $in: product.variants || [] },
    });

    await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        message: "Failed to delete product",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
