import { DeliveryPartners, Order } from "./orderType";
import { Product, ProductVariantType } from "./productType";

export  interface User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  isAdmin: boolean;
  createdAt?: string
  orders?: Order[];
}

export interface ExtendedUser extends Omit<User, "orders"> {
  orders: {
    _id: string;
    items: {
      product: Pick<
        Product,
        | "_id"
        | "name"
        | "description"
        | "category"
        | "subcategory"
        | "fabric"
        | "occasion"
        | "patternAndPrint"
        | "style"
        | "options"
      >;
      variant: Pick<ProductVariantType, "_id" | "color" | "thumbnail" | "gallery">;
      size: string;
      quantity: number;
      price: number;
    }[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    orderStatusUpdate: {
      status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
      paymentStatus?: "pending" | "paid" | "failed" | "refunded";
      trackingNumber?: string;
      estimatedDelivery?: string;
    };
    paymentMethod: string;
    shippingAddress: {
      fullName: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone: string;
    };
    assignedDeliveryPartner?: DeliveryPartners;
    assignedDate?: string;
    paymentDetails?: {
      razorpayOrderId: string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
      verified: boolean;
      paymentTime?: string;
    };
    createdAt: string;
  }[];
}