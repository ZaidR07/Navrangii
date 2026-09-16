import { ProductDetailSkeleton } from "@/components/skeletons/site-skeletons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <ProductDetailSkeleton />
    </div>
  );
}
