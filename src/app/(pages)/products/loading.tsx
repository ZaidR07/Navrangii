import { ProductsPageSkeleton } from "@/components/skeletons/site-skeletons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-purple-50">
      <ProductsPageSkeleton />
    </div>
  );
}
