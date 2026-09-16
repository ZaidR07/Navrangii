import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "../../../../lib/mongodb";
import { uploadBase64Image, deleteS3Object } from "../../../../lib/awsUploadImages";
import { getAuthenticatedAdmin } from "../../../../lib/adminAuth";

const isBase64 = (str: string) => /^data:image\/[a-z]+;base64,/.test(str);

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedAdmin();

    if (!authUser || !authUser.isAdmin) {
      return NextResponse.json({ message: "Access denied - Admins only." }, { status: 403 });
    }

    const { db } = await connectToDB();
    const product = await req.json();

    if (!product._id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const existingProduct = await db
      .collection("products")
      .findOne({ _id: new ObjectId(product._id) });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
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

        if (
          !variant.gallery ||
          !Array.isArray(variant.gallery) ||
          variant.gallery.length === 0
        ) {
          return NextResponse.json(
            { message: "At least 1 gallery image is required per variant" },
            { status: 400 }
          );
        }

        if (
          !variant.gallery ||
          !Array.isArray(variant.gallery) ||
          variant.gallery.some((img: any) => typeof img !== "string")
        ) {
          return NextResponse.json(
            { message: "Variant gallery must be an array of strings" },
            { status: 400 }
          );
        }

        if (!variant.thumbnail || typeof variant.thumbnail !== "string") {
          return NextResponse.json(
            { message: "Variant thumbnail is required and must be a string" },
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
              { message: "Invalid size fields in variant" },
              { status: 400 }
            );
          }
        }

        let uploadedThumbnailUrl = variant.thumbnail;
        let uploadedGalleryUrls = variant.gallery || [];

        const oldVariant = variant.id
          ? await db.collection("productVariants").findOne({ _id: new ObjectId(variant.id) })
          : null;

        if (oldVariant) {
          if (
            variant.thumbnail &&
            variant.thumbnail !== oldVariant.thumbnail &&
            isBase64(variant.thumbnail)
          ) {
            const key = new URL(oldVariant.thumbnail).pathname.slice(1);
            await deleteS3Object(key);
            uploadedThumbnailUrl = await uploadBase64Image(
              variant.thumbnail,
              `products/${product.name}/variant-${i}/thumbnail.jpg`
            );
          }

          const newGallery = variant.gallery;
          const changed = JSON.stringify(newGallery) !== JSON.stringify(oldVariant.gallery);

          if (changed && Array.isArray(newGallery)) {
            for (const img of oldVariant.gallery || []) {
              const key = new URL(img).pathname.slice(1);
              await deleteS3Object(key);
            }

            uploadedGalleryUrls = await Promise.all(
              newGallery.map((img: string, j: number) =>
                isBase64(img)
                  ? uploadBase64Image(
                      img,
                      `products/${product.name}/variant-${i}/gallery-${j}.jpg`
                    )
                  : img
              )
            );
          }

          await db.collection("productVariants").updateOne(
            { _id: oldVariant._id },
            {
              $set: {
                color: variant.color,
                thumbnail: uploadedThumbnailUrl,
                gallery: uploadedGalleryUrls,
                sizes: variant.sizes,
              },
            }
          );

          variantIds.push(oldVariant._id);
        } else {
          if (isBase64(variant.thumbnail)) {
            uploadedThumbnailUrl = await uploadBase64Image(
              variant.thumbnail,
              `products/${product.name}/variant-${i}/thumbnail.jpg`
            );
          }

          uploadedGalleryUrls = await Promise.all(
            (variant.gallery || []).map((img: string, j: number) =>
              isBase64(img)
                ? uploadBase64Image(
                    img,
                    `products/${product.name}/variant-${i}/gallery-${j}.jpg`
                  )
                : img
            )
          );

          const result = await db.collection("productVariants").insertOne({
            color: variant.color,
            thumbnail: uploadedThumbnailUrl,
            gallery: uploadedGalleryUrls,
            sizes: variant.sizes,
          });

          variantIds.push(result.insertedId);
        }
      }
    }

    const updateResult = await db.collection("products").updateOne(
      { _id: new ObjectId(product._id) },
      {
        $set: {
          name: product.name,
          section: product.section,
          category: product.category,
          subcategory: product.subcategory,
          description: product.description,
          fabric: product.fabric,
          occasion: product.occasion,
          patternAndPrint: product.patternAndPrint,
          style: product.style,
          productType: product.productType,
          options: product.options,
          updatedAt: new Date(),
          variants: variantIds,
        },
      }
    );

    if (!updateResult.acknowledged) {
      return NextResponse.json(
        { message: "Failed to update product" },
        { status: 500 }
      );
    }

    const updatedProductArr = await db
      .collection("products")
      .aggregate([
        { $match: { _id: new ObjectId(product._id) } },
        {
          $lookup: {
            from: "productVariants",
            localField: "variants",
            foreignField: "_id",
            as: "variants",
          },
        },
      ])
      .toArray();

    if (!updatedProductArr || updatedProductArr.length === 0) {
      return NextResponse.json(
        { message: "Product not found after update" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Product updated successfully",
        updatedProduct: updatedProductArr[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in updateProduct:", error);
    return NextResponse.json(
      {
        message: "Failed to update product",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
