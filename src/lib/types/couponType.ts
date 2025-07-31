export interface Coupon {
  _id?: string
  code: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minimumOrderAmount: number
  maximumDiscountAmount?: number
  usageLimit: number
  usedCount: number
  startDate: string
  endDate: string
  status: "active" | "inactive" | "expired"
  createdAt: string
  updatedAt?: string
}

export interface CouponFormData {
  code: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minimumOrderAmount: number
  maximumDiscountAmount?: number
  usageLimit: number
  startDate: string
  endDate: string
  status: "active" | "inactive"
}
