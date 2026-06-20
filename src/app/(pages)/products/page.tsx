"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Filter, X, ChevronLeft, Eye } from 'lucide-react';
import NavigationHeader from '@/components/NavigationHeader';
import Footer from '@/components/Footer';
import { useGetAllProducts } from '@/hooks/product/useGetProduct';
import { useGetVariable } from '@/hooks/variable/useGetVariable';
import { Product } from '@/lib/types/productType';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: products = [], isLoading: productsLoading, error: productsError } = useGetAllProducts();
  const { data: variables, isLoading: variablesLoading, error: variablesError } = useGetVariable();
  
  // Get section, category and subcategory from URL parameters
  const sectionParam = searchParams.get('section');
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');
  const productTypeParam = searchParams.get('productType');
  const sortParam = searchParams.get('sort');
  
  // State for filters
  const [selectedFabric, setSelectedFabric] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter products based on search and parameters
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      // Search filter
      const searchParam = searchParams.get('search');
      if (searchParam) {
        const query = searchParam.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(query);
        const matchesCategory = product.category?.toLowerCase().includes(query);
        const matchesSubcategory = product.subcategory?.toLowerCase().includes(query);
        const matchesFabric = product.fabric?.toLowerCase().includes(query);
        const matchesDescription = product.description?.toLowerCase().includes(query);

        if (!matchesName && !matchesCategory && !matchesSubcategory && !matchesFabric && !matchesDescription) {
          return false;
        }
      }

      // Section filter
      if (sectionParam && product.section !== sectionParam) {
        return false;
      }

      // Category filter
      if (categoryParam && product.category !== categoryParam) {
        return false;
      }

      // Subcategory filter
      if (subcategoryParam && product.subcategory !== subcategoryParam) {
        return false;
      }

      // Product type filter (onSale/bestSeller/regular/newArrival)
      if (productTypeParam && product.productType !== productTypeParam) {
        return false;
      }

      return true;
    });

    // Sort by newest first when sort=new
    if (sortParam === 'new') {
      result = [...result].sort((a, b) => {
        const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bt - at;
      });
    }

    return result;
  }, [
    products,
    sectionParam,
    categoryParam,
    subcategoryParam,
    productTypeParam,
    sortParam,
    searchParams
  ]);

  // Map categories/sections that HAVE products
  const availableSections = useMemo(() => {
    const hasProducts = new Set<string>();
    products.forEach(product => {
      if (product.section) {
        hasProducts.add(product.section);
      }
    });
    return Array.from(hasProducts);
  }, [products]);

  // Map sections to their first available product image
  const categoryImages = useMemo(() => {
    const mapping: Record<string, string> = {};
    
    // Special sections images
    const onSaleProduct = products.find((p: any) => p.productType === 'onSale');
    if (onSaleProduct) mapping['onSale'] = onSaleProduct.variants?.[0]?.thumbnail || onSaleProduct.image || '';
    
    const bestSellerProduct = products.find((p: any) => p.productType === 'bestSeller');
    if (bestSellerProduct) mapping['bestSeller'] = bestSellerProduct.variants?.[0]?.thumbnail || bestSellerProduct.image || '';
    
    const newArrivalProduct = [...products].sort((a: any, b: any) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )[0];
    if (newArrivalProduct) mapping['newArrival'] = newArrivalProduct.variants?.[0]?.thumbnail || newArrivalProduct.image || '';
    
    // Regular category images
    products.forEach((product: any) => {
      if (product.section && !mapping[product.section]) {
        const imageUrl = product.variants?.[0]?.thumbnail || product.image;
        if (imageUrl) {
          mapping[product.section] = imageUrl;
        }
      }
    });
    return mapping;
  }, [products]);

  // Group products by category when section is selected (no category/subcategory filter)
  const productsByCategory = useMemo(() => {
    if (!sectionParam || categoryParam || subcategoryParam) return null;
    
    const grouped: Record<string, Record<string, Product[]>> = {};
    filteredProducts.forEach((product) => {
      const cat = product.category || 'Other';
      const sub = product.subcategory || 'Other';
      if (!grouped[cat]) grouped[cat] = {};
      if (!grouped[cat][sub]) grouped[cat][sub] = [];
      grouped[cat][sub].push(product);
    });
    return grouped;
  }, [filteredProducts, sectionParam, categoryParam, subcategoryParam]);
  
  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFabric([]);
    setSelectedOccasion([]);
    setSelectedColor([]);
    setSelectedSize([]);
    setSelectedPriceRange('');
  };
  
  // Generate page title based on filters
  const getPageTitle = () => {
    const parts = [];
    if (sectionParam) parts.push(decodeURIComponent(sectionParam));
    if (categoryParam) parts.push(decodeURIComponent(categoryParam));
    if (subcategoryParam) parts.push(decodeURIComponent(subcategoryParam));
    if (parts.length === 0) parts.push('All Products');
    return parts.join(' - ');
  };
  
  if (productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">We couldn&apos;t load the products right now. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <NavigationHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-32 sm:mt-36 lg:mt-40">
        {/* Header */}
        <div className="mb-8 hidden sm:block">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-700 hover:to-fuchsia-700 shadow-md"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Removed per user request */}
          
          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more products</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Clear All Filters
                </button>
              </div>
            ) : productsByCategory ? (
              /* Grouped view: section selected, show products by category with subcategory groups */
              <div className="space-y-10">
                {Object.entries(productsByCategory).map(([category, subcategories]) => (
                  <div key={category}>
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                      <Link
                        href={`/products?section=${encodeURIComponent(sectionParam || '')}&category=${encodeURIComponent(category)}`}
                        className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                        View All <ChevronLeft className="h-4 w-4 rotate-180" />
                      </Link>
                      {/* <h2 className="text-2xl font-bold text-gray-900">{category}</h2> */}
                    </div>

                    {/* Subcategory groups */}
                    {Object.entries(subcategories).map(([subcategory, subProducts]) => (
                      <div key={subcategory} className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          {/* <h3 className="text-lg font-semibold text-purple-700">{subcategory}</h3> */}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {subProducts.slice(0, 8).map((product) => (
                            <div
                              key={product._id}
                              onClick={() => router.push(`/product/${product._id}`)}
                              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                            >
                              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                                <img
                                  src={product.variants?.[0]?.thumbnail || product.image || '/placeholder.svg'}
                                  alt={product.name}
                                  className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="p-3">
                                <h4 className="font-medium text-gray-900 text-sm line-clamp-1 mb-1" onClick={(e) => { e.stopPropagation(); router.push(`/product/${product._id}`); }}>{product.name}</h4>
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-purple-600 font-bold text-sm">
                                    {product.variants && product.variants.length > 0 ? (
                                      (() => {
                                        const allPrices = product.variants.flatMap(v => v.sizes.map(s => s.sellingPrice));
                                        const minPrice = Math.min(...allPrices);
                                        const maxPrice = Math.max(...allPrices);
                                        return (
                                          <>
                                            ₹{minPrice}
                                            {minPrice !== maxPrice && (
                                              <span className="text-gray-400 font-normal"> - ₹{maxPrice}</span>
                                            )}
                                          </>
                                        );
                                      })()
                                    ) : (
                                      <span className="text-gray-400">Price not available</span>
                                    )}
                                  </p>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); router.push(`/product/${product._id}`); }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                  >
                                    <Eye className="h-3 w-3" /> View
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              /* Flat grid view: category/subcategory filter or all products */
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                      <img
                        src={product.variants?.[0]?.thumbnail || product.image || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2" onClick={(e) => { e.stopPropagation(); router.push(`/product/${product._id}`); }}>{product.name}</h3>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-purple-600 font-bold text-sm">
                          {product.variants && product.variants.length > 0 ? (
                            (() => {
                              const allPrices = product.variants.flatMap(v => v.sizes.map(s => s.sellingPrice));
                              const minPrice = Math.min(...allPrices);
                              const maxPrice = Math.max(...allPrices);
                              return (
                                <>
                                  ₹{minPrice}
                                  {minPrice !== maxPrice && (
                                    <span className="text-gray-400 font-normal"> - ₹{maxPrice}</span>
                                  )}
                                </>
                              );
                            })()
                          ) : (
                            <span className="text-gray-400">Price not available</span>
                          )}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/product/${product._id}`); }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Eye className="h-3 w-3" /> View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
