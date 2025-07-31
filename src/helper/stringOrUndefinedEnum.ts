import { VariantFormValues } from "@/validationSchema/productSchema";
import { ProductVariantType } from "@/lib/types/productType";

/**
 * Converts RHF form variant (VariantFormValues) to payload (ProductVariantType)
 * for saving to backend / database.
 */
export function mapVariantToPayload(v: VariantFormValues): ProductVariantType {
  return {
    _id: v._id ?? undefined,
    color: v.color,
    thumbnail: v.thumbnail || "",
    gallery: v.gallery?.length ? v.gallery : [],
    sizes: v.sizes.map((sizeObj) => ({
      size: sizeObj.size,
      marketPrice: sizeObj.marketPrice,
      sellingPrice: sizeObj.sellingPrice,
      stock: sizeObj.stock,
    })),
  };
}
