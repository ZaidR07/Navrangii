"use client";

import ProductCard from '@/components/product/ProductCard';

interface WishlistItemProps {
  item: {
    productId: string;
    product: any; // Using any to match the data structure from wishlist
  };
  onRemove: (productId: string) => void;
}

export default function WishlistItem({ item, onRemove }: WishlistItemProps) {
  const { product } = item;
  
  return (
    <ProductCard 
      product={product} 
      showWishlist={false}
      onRemoveFromWishlist={onRemove}
    />
  );
}
