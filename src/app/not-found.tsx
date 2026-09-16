import Link from "next/link";
import { Home, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Big 404 */}
        <p className="text-[120px] sm:text-[160px] font-extrabold leading-none bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent select-none">
          404
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mt-3 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to shopping.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium hover:from-purple-700 hover:to-fuchsia-700 shadow-md hover:shadow-lg transition-all"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-purple-300 text-purple-700 font-medium hover:bg-purple-50 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Browse Products
          </Link>
        </div>

        <div className="mt-10 text-sm text-gray-500">
          <Link href="/products" className="inline-flex items-center gap-1 hover:text-purple-600 transition-colors">
            <Search className="h-3.5 w-3.5" />
            Search our collection
          </Link>
        </div>
      </div>
    </div>
  );
}
