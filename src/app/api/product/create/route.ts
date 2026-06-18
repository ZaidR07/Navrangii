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
    const product = await req.json();

    const requiredFields = [
      "section",
      "category",
      "name",
      "description",
      "fabric",
      "occasion",
      "patternAndPrint",
      "style",
      "options",
    ];

    for (const field of requiredFields) {
      if (!product[field]) {
        return NextResponse.json(
          { message: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    const existingProduct = await db
      .collection("products")
      .findOne({ name: product.name });

    if (existingProduct) {
      return NextResponse.json(
        { message: "Product already exists" },
        { status: 409 }
      );
    }

    const variantIds: any[] = [];

    if (product.variants && Array.isArray(product.variants)) {
      for (let i = 0; i < product.variants.length; i++) {
        const variant = product.variants[i];

        if (!variant.color || !variant.sizes || variant.sizes.length === 0) {
          return NextResponse.json(
            { message: "Variant color and sizes are required" },
            { status: 400 }
          );
        }

        for (const size of variant.sizes) {
          if (
            !size.size ||
            size.marketPrice === undefined ||
            size.sellingPrice === undefined ||
            size.stock === undefined
          ) {
            return NextResponse.json(
              { message: "Size name and price are required for each size" },
              { status: 400 }
            );
          }
        }

        if (variant.thumbnail && typeof variant.thumbnail !== "string") {
          return NextResponse.json(
            { message: "Variant thumbnail must be a string" },
            { status: 400 }
          );
        }

        if (
          variant.gallery &&
          variant.gallery.some((g: any) => typeof g !== "string")
        ) {
          return NextResponse.json(
            { message: "All gallery items must be strings" },
            { status: 400 }
          );
        }

        const uploadedThumbnailUrl = await uploadBase64Image(
          variant.thumbnail,
          `products/${product.name}/variant-${i}/thumbnail.jpg`
        );

        const uploadedGalleryUrls = await Promise.all(
          (variant.gallery || []).map((img: string, j: number) =>
            uploadBase64Image(
              img,
              `products/${product.name}/variant-${i}/gallery-${j}.jpg`
            )
          )
        );

        if (variant.images && Array.isArray(variant.images)) {
          const uploadedImages = await Promise.all(
            variant.images.map(async (image: string) => {
              if (image && image.startsWith("data:image")) {
                const result = await uploadBase64Image(
                  image,
                  `products/${product.name.replace(/\s+/g, "-").toLowerCase()}/${variant.color}`
                );
                return result;
              }
              return image;
            })
          );

          variant.images = uploadedImages.filter((img: string | null) => img);
        }

        const variantResult = await db.collection("productVariants").insertOne({
          color: variant.color,
          thumbnail: uploadedThumbnailUrl,
          gallery: uploadedGalleryUrls,
          sizes: variant.sizes,
          images: variant.images,
        });

        variantIds.push(variantResult.insertedId);
      }
    }

    const result = await db.collection("products").insertOne({
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      variants: variantIds,
    });

    if (!result.acknowledged) {
      return NextResponse.json(
        { message: "Failed to create product" },
        { status: 500 }
      );
    }

    const createdProduct = await db
      .collection("products")
      .aggregate([
        { $match: { _id: result.insertedId } },
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
      ])
      .next();

    if (!createdProduct) {
      return NextResponse.json(
        { message: "Product not found after creation" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully",
        product: createdProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      {
        message: "Failed to add product",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
