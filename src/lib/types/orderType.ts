
import { Product, ProductVariantType } from "./productType";


export interface DeliveryPartners {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  status: "active" | "inactive";
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  product: Product;
  variant: ProductVariantType;
  size: string;
  quantity: number;
  price: number;
}

export interface PaymentDetails {
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  verified: boolean;
  paymentTime?: string;
}

export interface OrderStatusUpdate {
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "return_request" | "returned";
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface Order {
  _id: string;
  customerId: string;
  customerEmail?: string;
  customerName?: string;
  userEmail?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  orderStatusUpdate?: OrderStatusUpdate;
  status?: string;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  address?: any;
  assignedDeliveryPartner?: DeliveryPartners;
  assignedDate?: string;
  paymentDetails?: PaymentDetails;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderDate: string;
  createdAt: string;
}
