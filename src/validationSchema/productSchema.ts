// validationSchema/productSchema.ts
import { z } from "zod";


/* ───── size row ───── */
export const variantSizeSchema = z.object({
  size: z.string().min(1, { message: "Select one size" }),
  marketPrice: z.number().min(1, { message: "MRP must be ≥ 1" }),
  sellingPrice: z.number().min(1, { message: "Price must be ≥ 1" }),
  stock: z.number().min(1, { message: "Stock must be ≥ 1" }),
});

/* ───── variant ───── */
  export const variantSchema = z.object({
    _id: z.string().optional(),
    color: z.string().min(1, { message: "Colour is required" }),
    sizes: z.array(variantSizeSchema).min(1, { message: "Add at least one size row" }),
    thumbnail: z.string().url({ message: "Thumbnail URL is required" }),
    gallery: z
      .array(z.string().url({ message: "Invalid image URL" }))
      .max(4, { message: "Up to 4 gallery images" })
      .optional(),
  });

/* ───── product ───── */
export const productSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, { message: "Product name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().min(1, { message: "Subcategory is required" }),
  fabric: z.string().min(1, { message: "Fabric is required" }),
  occasion: z.string().min(1, { message: "Occasion is required" }),
  patternAndPrint: z.string().min(1, { message: "Pattern is required" }),
  style: z.string().min(1, { message: "Style is required" }),
  option: z.string().min(1, { message: "Style is required" }),
  variants: z.array(variantSchema).min(1, { message: "Add at least one variant" }),
});

/* inferred types */
export type VariantFormValues = z.infer<typeof variantSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
