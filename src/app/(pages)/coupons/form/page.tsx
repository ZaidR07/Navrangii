"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Tag,
  Percent,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Save,
  Edit,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"


import { toast } from "react-toastify"
import { CouponFormData, couponSchema } from "@/validationSchema/couponSchema"
import { useAddCoupon } from "@/hooks/coupon/useAddCoupon"
import { useUpdateCoupon } from "@/hooks/coupon/useUpdateCoupon"
import { useGetCoupons } from "@/hooks/coupon/useGetCoupons"

export default function CouponForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get coupon ID from URL search params for edit mode
  const couponId = searchParams.get("id")
  const isEditMode = !!couponId

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      minimumOrderAmount: 0,
      maximumDiscountAmount: 0,
      usageLimit: 1,
      startDate: "",
      endDate: "",
      status: "active",
    },
  })

  const watchedValues = form.watch()
  const discountType = form.watch("discountType")

  // Hooks for API operations
  const { mutateAsync: addCoupon } = useAddCoupon()
  const { mutateAsync: updateCoupon } = useUpdateCoupon()
  const { data: allCoupons, isLoading: isLoadingCoupon } = useGetCoupons()

  // Find the specific coupon by ID when in edit mode
  const existingCoupon = isEditMode && allCoupons ? allCoupons.find((coupon) => coupon._id === couponId) : null

  // Populate form with existing data when editing
  useEffect(() => {
    if (isEditMode && existingCoupon) {
      form.reset({
        code: existingCoupon.code,
        description: existingCoupon.description,
        discountType: existingCoupon.discountType,
        discountValue: existingCoupon.discountValue,
        minimumOrderAmount: existingCoupon.minimumOrderAmount,
        maximumDiscountAmount: existingCoupon.maximumDiscountAmount,
        usageLimit: existingCoupon.usageLimit,
        startDate: existingCoupon.startDate.split("T")[0], // Convert to date input format
        endDate: existingCoupon.endDate.split("T")[0], // Convert to date input format
        status: existingCoupon.status === "expired" ? "inactive" : existingCoupon.status, // Don't allow setting expired status
      })
    }
  }, [existingCoupon, form, isEditMode])

  const onSubmit = async (data: CouponFormData) => {
    setIsSubmitting(true)
    try {
      // Convert dates to ISO string format
      const formattedData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      }

      if (isEditMode && couponId) {
        // Update existing coupon
        await updateCoupon({ id: couponId, data: formattedData })
        toast.success("Coupon updated successfully!")
        router.push("/coupons") // Redirect to list page
      } else {
        // Create new coupon
        await addCoupon(formattedData)
        toast.success("Coupon created successfully!")
        router.push("/coupons") // Redirect to list page
        form.reset() // Reset form for new entry
      }
    } catch (error) {
      console.error(error)
      toast.error(
        isEditMode ? "Failed to update coupon. Please try again." : "Failed to create coupon. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    if (isEditMode && existingCoupon) {
      // Reset to original values when editing
      form.reset({
        code: existingCoupon.code,
        description: existingCoupon.description,
        discountType: existingCoupon.discountType,
        discountValue: existingCoupon.discountValue,
        minimumOrderAmount: existingCoupon.minimumOrderAmount,
        maximumDiscountAmount: existingCoupon.maximumDiscountAmount,
        usageLimit: existingCoupon.usageLimit,
        startDate: existingCoupon.startDate.split("T")[0],
        endDate: existingCoupon.endDate.split("T")[0],
        status: existingCoupon.status === "expired" ? "inactive" : existingCoupon.status,
      })
    } else {
      // Reset to empty values when creating
      form.reset()
    }
  }

  const handleCancel = () => {
    router.push("/coupons")
  }

  // Show loading state when fetching coupon data for edit
  if (isEditMode && isLoadingCoupon) {
    return (
      <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading coupon data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error if coupon not found in edit mode
  if (isEditMode && !isLoadingCoupon && !existingCoupon) {
    return (
      <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Coupon Not Found</h3>
            <p className="text-slate-600 mb-4">The coupon you&apos;re trying to edit doesn&apos;t exist.</p>
            <Button onClick={() => router.push("/coupons")}>Back to Coupons</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 hover:from-purple-600 hover:to-purple-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          {isEditMode ? "Edit Coupon" : "Create New Coupon"}
        </h1>
        <p className="text-sm bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          {isEditMode ? "Update coupon details and settings" : "Create a new discount coupon for your customers"}
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                  <Tag className="h-5 w-5 text-purple-700" />
                  Basic Information
                  {isEditMode && <Badge className="bg-blue-100 text-blue-700 ml-auto">Editing Mode</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Code */}
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-700 font-medium">Coupon Code *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., WELCOME10"
                            className="bg-white border-purple-200 focus-visible:ring-purple-500 font-mono"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 flex items-center gap-1">
                          {form.formState.errors.code && <XCircle className="h-3 w-3" />}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-700 font-medium">Status *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-purple-200 focus:ring-purple-500">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Active
                              </div>
                            </SelectItem>
                            <SelectItem value="inactive">
                              <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-red-500" />
                                Inactive
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-600 flex items-center gap-1">
                          {form.formState.errors.status && <XCircle className="h-3 w-3" />}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-700 font-medium">Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what this coupon offers to customers..."
                          className="bg-white border-purple-200 focus-visible:ring-purple-500 min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 flex items-center gap-1">
                        {form.formState.errors.description && <XCircle className="h-3 w-3" />}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Discount Configuration */}
            <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  {discountType === "percentage" ? <Percent className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />}
                  Discount Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Discount Type */}
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-medium">Discount Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-green-200 focus:ring-green-500">
                              <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">
                              <div className="flex items-center gap-2">
                                <Percent className="h-4 w-4 text-green-500" />
                                Percentage (%)
                              </div>
                            </SelectItem>
                            <SelectItem value="fixed">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-blue-500" />
                                Fixed Amount (₹)
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-600 flex items-center gap-1">
                          {form.formState.errors.discountType && <XCircle className="h-3 w-3" />}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Discount Value */}
                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-medium">
                          Discount Value * {discountType === "percentage" ? "(%)" : "(₹)"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0.01"
                            max={discountType === "percentage" ? "100" : "50000"}
                            step={discountType === "percentage" ? "0.01" : "1"}
                            placeholder={discountType === "percentage" ? "e.g., 10" : "e.g., 100"}
                            className="bg-white border-green-200 focus-visible:ring-green-500"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 flex items-center gap-1">
                          {form.formState.errors.discountValue && <XCircle className="h-3 w-3" />}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Minimum Order Amount */}
                  <FormField
                    control={form.control}
                    name="minimumOrderAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-medium">Minimum Order Amount (₹) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="e.g., 500"
                            className="bg-white border-green-200 focus-visible:ring-green-500"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 flex items-center gap-1">
                          {form.formState.errors.minimumOrderAmount && <XCircle className="h-3 w-3" />}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Maximum Discount Amount (only for percentage) */}
                  {discountType === "percentage" && (
                    <FormField
                      control={form.control}
                      name="maximumDiscountAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-700 font-medium">Maximum Discount Amount (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="e.g., 500"
                              className="bg-white border-green-200 focus-visible:ring-green-500"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600 flex items-center gap-1">
                            {form.formState.errors.maximumDiscountAmount && <XCircle className="h-3 w-3" />}
                          </FormMessage>
                          <p className="text-sm text-green-600">
                            <Info className="h-3 w-3 inline mr-1" />
                            Leave empty for no maximum limit
                          </p>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Usage & Validity */}
            <Card className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Usage & Validity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Usage Limit */}
                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700 font-medium">Usage Limit *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            min="1"
                            max="10000"
                            placeholder="e.g., 100"
                            className="bg-white border-blue-200 focus-visible:ring-blue-500"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Users className="h-4 w-4 text-blue-500" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-600 flex items-center gap-1">
                        {form.formState.errors.usageLimit && <XCircle className="h-3 w-3" />}
                      </FormMessage>
                      <p className="text-sm text-blue-600">Maximum number of times this coupon can be used</p>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 font-medium">Start Date *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-white border-blue-200 focus-visible:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 flex items-center gap-1">
                          {form.formState.errors.startDate && <XCircle className="h-3 w-3" />}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* End Date */}
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 font-medium">End Date *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-white border-blue-200 focus-visible:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 flex items-center gap-1">
                          {form.formState.errors.endDate && <XCircle className="h-3 w-3" />}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Preview */}
            {watchedValues.code && (
              <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>Code:</strong>{" "}
                        <span className="font-mono bg-purple-100 px-2 py-1 rounded">{watchedValues.code}</span>
                      </p>
                      <p>
                        <strong>Discount:</strong>{" "}
                        {watchedValues.discountType === "percentage"
                          ? `${watchedValues.discountValue}%`
                          : `₹${watchedValues.discountValue}`}
                      </p>
                      <p>
                        <strong>Min. Order:</strong> ₹{watchedValues.minimumOrderAmount}
                      </p>
                      {watchedValues.maximumDiscountAmount && (
                        <p>
                          <strong>Max. Discount:</strong> ₹{watchedValues.maximumDiscountAmount}
                        </p>
                      )}
                    </div>
                    <div>
                      <p>
                        <strong>Usage Limit:</strong> {watchedValues.usageLimit}
                      </p>
                      <p>
                        <strong>Valid From:</strong> {watchedValues.startDate}
                      </p>
                      <p>
                        <strong>Valid Until:</strong> {watchedValues.endDate}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <strong>Status:</strong>
                        <Badge className={watchedValues.status === "active" ? "bg-green-500" : "bg-red-500"}>
                          {watchedValues.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator className="bg-purple-200" />

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
              >
                {isEditMode ? "Reset Changes" : "Reset Form"}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 hover:from-purple-600 hover:to-purple-700 min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isEditMode ? <Edit className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    {isEditMode ? "Update Coupon" : "Create Coupon"}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
