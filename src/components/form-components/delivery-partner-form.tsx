"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Mail, MapPin, Building, Users, CheckCircle, XCircle, Save, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DeliveryPartnerFormData, deliveryPartnerSchema, } from "@/validationSchema/deliveryPartnerSchema"
import { toast } from "react-toastify"
import { useAddDeliveryPartner } from "@/hooks/delivery-partner/useAddDeliveryPartner"
import { useUpdateDeliveryPartner } from "@/hooks/delivery-partner/useUpdateDeliveryPartner"
import { DeliveryPartners } from "@/lib/types/orderType"
import { useGetDeliveryPartners } from "@/hooks/delivery-partner/useGetDeliveryPartner"

// Indian states for the dropdown
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
]

interface DeliveryPartnerFormProps {
 deliverypartnerId?: string
  onDone?: () => void
}

export default function DeliveryPartnerForm({ deliverypartnerId}: DeliveryPartnerFormProps) {
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const searchParams = useSearchParams()

  // Get the delivery partner ID from props or search params
  const id = deliverypartnerId || searchParams.get("id")
  const isEditMode = !!id

  const form = useForm<DeliveryPartnerFormData>({
    resolver: zodResolver(deliveryPartnerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      capacity: 0,
      status: "active",
    },
  })

  const watchedValues = form.watch()

  // Hooks for API operations
  const { mutateAsync: addDeliveryPartner } = useAddDeliveryPartner()
  const { mutateAsync: updateDeliveryPartner } = useUpdateDeliveryPartner()

  const { data: deliveryPartners, isLoading: isLoadingDeliveryPartners } = useGetDeliveryPartners()
  
const existingDeliveryPartner = useMemo(() => {
  if (isEditMode && deliveryPartners && id) {
    return deliveryPartners.find((dist: DeliveryPartners) => dist._id.toString() === id.toString());
  }
  return null;
}, [isEditMode, deliveryPartners, id]);

useEffect(() => {
  if (existingDeliveryPartner) {
    form.reset({
      name: existingDeliveryPartner.name,
      email: existingDeliveryPartner.email,
      phone: existingDeliveryPartner.phone,
      address: existingDeliveryPartner.address,
      city: existingDeliveryPartner.city,
      state: existingDeliveryPartner.state,
      capacity: existingDeliveryPartner.capacity,
      status: existingDeliveryPartner.status,
    });
  }
}, [existingDeliveryPartner, form]);

  const onSubmit = async (data: DeliveryPartnerFormData) => {
    setIsSubmitting(true)
    try {
      if (isEditMode && id) {
        // Update existing Delivery Partner
        await updateDeliveryPartner({ id, ...data })
        toast.success("Delivery Partner updated successfully!")// Redirect to list page
      } else {
        // Create new Delivery Partner
        await addDeliveryPartner(data)
        toast.success("Delivery Partner created successfully!")
        form.reset() // Reset form for new entry
      }
    } catch (error) {
      console.error(error)
      toast.error(
        isEditMode
          ? "Failed to update Delivery Partner. Please try again."
          : "Failed to create Delivery Partner. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    if (isEditMode && existingDeliveryPartner) {
      // Reset to original values when editing
      form.reset({
        name: existingDeliveryPartner.name || "",
        email: existingDeliveryPartner.email || "",
        phone: existingDeliveryPartner.phone || "",
        address: existingDeliveryPartner.address || "",
        city: existingDeliveryPartner.city || "",
        state: existingDeliveryPartner.state || "",
        capacity: existingDeliveryPartner.capacity || 0,
        status: existingDeliveryPartner.status || "active",
      })
    } else {
      // Reset to empty values when creating
      form.reset({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        capacity: 0,
        status: "active",
      })
    }
  }



  // Show loading state when fetching DeliveryPartner data for edit
  if (isEditMode && isLoadingDeliveryPartners) {
    return (
      <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading Delivery Partners data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state if in edit mode but DeliveryPartner not found
  if (isEditMode && !isLoadingDeliveryPartners && !existingDeliveryPartner) {
    return (
      <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Delivery Partner Not Found</h3>
            <p className="text-slate-600 mb-4">The Delivery Partner you&apos;re trying to edit doesn&apos;t exist.</p>
            
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
       
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          {isEditMode ? "Edit Delivery Partner" : "Add New Delivery Partner"}
        </h1>
        <p className="text-sm bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          {isEditMode
            ? "Update Delivery Partner information and settings"
            : "Create a new Delivery Partner profile for order management"}
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-700" />
                  Basic Information
                  {isEditMode && <Badge className="bg-blue-100 text-blue-700 ml-auto">Editing Mode</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-700 font-medium">Delivery Partner Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Delivery Partner name"
                            className="bg-white border-purple-200 focus-visible:ring-purple-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 flex items-center gap-1">
                          {form.formState.errors.name && <XCircle className="h-3 w-3" />}
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
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 font-medium">Email Address *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="DeliveryPartner@example.com"
                            className="bg-white border-blue-200 focus-visible:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 flex items-center gap-1">
                          {form.formState.errors.email && <XCircle className="h-3 w-3" />}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 font-medium">Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+91 98765 43210"
                            className="bg-white border-blue-200 focus-visible:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 flex items-center gap-1">
                          {form.formState.errors.phone && <XCircle className="h-3 w-3" />}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-green-700 font-medium">Full Address *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter complete address including street, area, landmarks"
                          className="bg-white border-green-200 focus-visible:ring-green-500 min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 flex items-center gap-1">
                        {form.formState.errors.address && <XCircle className="h-3 w-3" />}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* City */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-medium">City *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter city name"
                            className="bg-white border-green-200 focus-visible:ring-green-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 flex items-center gap-1">
                          {form.formState.errors.city && <XCircle className="h-3 w-3" />}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* State */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-700 font-medium">State *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-green-200 focus:ring-green-500">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-600 flex items-center gap-1">
                          {form.formState.errors.state && <XCircle className="h-3 w-3" />}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Capacity Information */}
            <Card className="bg-gradient-to-r from-orange-50/50 to-amber-50/50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Capacity Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-700 font-medium">Maximum Order Capacity *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            min="1"
                            max="1000"
                            placeholder="Enter maximum number of orders"
                            className="bg-white border-orange-200 focus-visible:ring-orange-500"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Users className="h-4 w-4 text-orange-500" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-600 flex items-center gap-1">
                        {form.formState.errors.capacity && <XCircle className="h-3 w-3" />}
                      </FormMessage>
                      <p className="text-sm text-orange-600">
                        This represents the maximum number of orders this DeliveryPartner can handle simultaneously.
                      </p>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Form Preview */}
            {watchedValues.name && (
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
                        <strong>Name:</strong> {watchedValues.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {watchedValues.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {watchedValues.phone}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>City:</strong> {watchedValues.city}
                      </p>
                      <p>
                        <strong>State:</strong> {watchedValues.state}
                      </p>
                      <p>
                        <strong>Capacity:</strong> {watchedValues.capacity} orders
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
                    {isEditMode ? "Update Delivery Partner" : "Create Delivery Partner"}
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