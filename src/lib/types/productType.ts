

export interface ProductVariantType {
  _id?:       string;
  color:     string;
  thumbnail?: string;
  gallery?:   string[];
   sizes: {
    size: string;
    marketPrice: number;
    sellingPrice: number;
    stock: number;
  }[];
}

/* ---- product ---- */
export interface Product {
  _id?:               string;
  name:              string;
  description:       string;
  category:          string;
  subcategory:       string;
  fabric:            string;
  occasion:          string;
  patternAndPrint:   string;
  style:             string; 
  options?:          string; 
  variants?:         ProductVariantType[];
   createdAt?: string;
}