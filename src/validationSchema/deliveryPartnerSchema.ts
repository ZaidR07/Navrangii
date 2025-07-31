import { z } from "zod"

export const deliveryPartnerSchema = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[+]?[\d\s\-()]{10,15}$/, { message: "Please enter a valid phone number" }),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .min(10, { message: "Address must be at least 10 characters" })
    .max(500, { message: "Address cannot exceed 500 characters" }),
  city: z
    .string()
    .min(1, { message: "City is required" })
    .max(50, { message: "City name cannot exceed 50 characters" }),
  state: z.string().min(1, { message: "State is required" }),
  capacity: z
    .number()
    .min(1, { message: "Capacity must be at least 1" })
    .max(1000, { message: "Capacity cannot exceed 1000" })
    .int({ message: "Capacity must be a whole number" }),
  status: z.enum(["active", "inactive"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be either active or inactive",
  }),
})

export type DeliveryPartnerFormData = z.infer<typeof deliveryPartnerSchema>
