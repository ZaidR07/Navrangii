import { Skeleton } from "@/components/ui/skeleton";

const CONTAINER =
  "max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="aspect-[4/5] w-full border-4 border-white bg-white shadow">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/3 mx-auto" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SectionHeadingSkeleton() {
  return (
    <div className="text-center mb-8 space-y-3">
      <Skeleton className="h-8 w-56 mx-auto" />
      <Skeleton className="h-4 w-72 max-w-full mx-auto" />
    </div>
  );
}

export function SectionGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div>
      <SectionHeadingSkeleton />
      <ProductGridSkeleton count={count} />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-screen bg-slate-200 animate-pulse">
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-2 w-2 rounded-full bg-slate-300" />
        ))}
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className={`${CONTAINER} mt-20 sm:mt-24 lg:mt-36 py-4 sm:py-6`}>
      <Skeleton className="h-4 w-64 mb-4 sm:mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="lg:max-w-[56vh] lg:mx-auto w-full">
          <div className="aspect-[4/5] w-full border-4 border-white bg-white shadow">
            <Skeleton className="h-full w-full rounded-none" />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-12 rounded-full" />
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 w-36" />
          </div>
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductsPageSkeleton() {
  return (
    <div className={`${CONTAINER} py-8 mt-28 sm:mt-32 lg:mt-36`}>
      <Skeleton className="h-10 w-28 rounded-full mb-8 hidden sm:block" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}

export function CartPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${CONTAINER} py-8`}>
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 bg-white p-4 shadow">
                <Skeleton className="h-28 w-24 shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-8 w-28" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
          <div className="bg-white p-6 shadow h-fit space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-11 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${CONTAINER} py-8`}>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 shadow space-y-5">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-full" />
              ))}
            </div>
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
          <div className="bg-white p-6 shadow h-fit space-y-4">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-16 w-14 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-11 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WishlistPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${CONTAINER} py-8`}>
        <Skeleton className="h-8 w-44 mb-6" />
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${CONTAINER} py-8`}>
        <div className="bg-white shadow p-6 mb-6 flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileTabSkeleton() {
  return (
    <div className="space-y-4 py-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 bg-white p-4 shadow">
          <Skeleton className="h-20 w-16 shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TestimonialGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white shadow-md p-6 border border-gray-100 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSkeleton />
      <div className={`${CONTAINER} py-20`}>
        <SectionGridSkeleton />
      </div>
    </div>
  );
}
