import { Control, FieldArrayWithId, UseFieldArrayAppend, } from "react-hook-form";
import { TopSellProduct } from "./dashboardSliderType";
import { Product } from "./productType";
import { ProductFormValues } from "@/validationSchema/productSchema";
import { Order } from "./orderType";

export interface SidebarProps {
  defaultCollapsed?: boolean;
}

export interface ProductCarouselProps {
  products: TopSellProduct[]
}


export interface ProductDialogProps {
  initialProduct?:Product;              
  onSave: (product: Product) => void; 
  trigger: React.ReactNode;
}

export interface SizeSectionProps {
  idx: number;
  sizeFields: FieldArrayWithId<
    ProductFormValues,
    `variants.${number}.sizes`,
    "id"
  >[];
  appendSize: UseFieldArrayAppend<
    ProductFormValues,
    `variants.${number}.sizes`
  >;             // ✅ expects SizeRowForm
  removeSize: (index: number) => void;
  control: Control<ProductFormValues>;
}



export interface SizeSectionProps {
  idx: number;
  control: Control<ProductFormValues>;
  sizeFields: FieldArrayWithId<ProductFormValues, `variants.${number}.sizes`, "id">[];
  appendSize: UseFieldArrayAppend<ProductFormValues, `variants.${number}.sizes`>;
  removeSize: (idx: number) => void;
}

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

export interface OrdersListTabProps {
  orders: Order[]
  getStatusColor: (status: Order["orderStatusUpdate"]) => string;
}

export interface DeliveryPartnerAssignmentProps {
  orders: Order[]
  getStatusColor: (status: Order["orderStatusUpdate"]) => string
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
}
