import { z } from "zod"

export const couponSchema = z
  .object({
    code: z
      .string()
      .min(1, { message: "Coupon code is required" })
      .min(3, { message: "Coupon code must be at least 3 characters" })
      .max(20, { message: "Coupon code cannot exceed 20 characters" })
      .regex(/^[A-Z0-9_-]+$/, {
        message: "Coupon code can only contain uppercase letters, numbers, hyphens, and underscores",
      }),
    description: z
      .string()
      .min(1, { message: "Description is required" })
      .min(10, { message: "Description must be at least 10 characters" })
      .max(200, { message: "Description cannot exceed 200 characters" }),
    discountType: z.enum(["percentage", "fixed"], {
      required_error: "Discount type is required",
      invalid_type_error: "Discount type must be either percentage or fixed",
    }),
    discountValue: z
      .number()
      .min(0.01, { message: "Discount value must be greater than 0" })
      .max(100, { message: "Percentage discount cannot exceed 100%" }),
    minimumOrderAmount: z
      .number()
      .min(0, { message: "Minimum order amount cannot be negative" })
      .max(100000, { message: "Minimum order amount cannot exceed ₹1,00,000" }),
    maximumDiscountAmount: z
      .number()
      .min(0, { message: "Maximum discount amount cannot be negative" })
      .max(50000, { message: "Maximum discount amount cannot exceed ₹50,000" })
      .optional(),
    usageLimit: z
      .number()
      .min(1, { message: "Usage limit must be at least 1" })
      .max(10000, { message: "Usage limit cannot exceed 10,000" })
      .int({ message: "Usage limit must be a whole number" }),
    startDate: z.string().min(1, { message: "Start date is required" }),
    endDate: z.string().min(1, { message: "End date is required" }),
    status: z.enum(["active", "inactive"], {
      required_error: "Status is required",
      invalid_type_error: "Status must be either active or inactive",
    }),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      if (data.discountType === "percentage") {
        return data.discountValue <= 100
      }
      return true
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    },
  )

export type CouponFormData = z.infer<typeof couponSchema>
