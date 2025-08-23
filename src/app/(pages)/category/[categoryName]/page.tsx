"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Filter, X, ChevronLeft } from 'lucide-react';
import { useGetAllProducts } from '@/hooks/product/useGetProduct';
import { useGetVariable } from '@/hooks/variable/useGetVariable';
import { Product } from '@/lib/types/productType';

export default function CategoryPage({ params }: { params: { categoryName: string } }) {
  // Custom scrollbar styles
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f3e8ff; /* purple-50 equivalent */
      border-radius: 3px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #c084fc; /* purple-400 equivalent */
      border-radius: 3px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #a855f7; /* purple-500 equivalent */
    }
  `;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: products = [], isLoading: productsLoading, error: productsError } = useGetAllProducts();
  const { data: variables, isLoading: variablesLoading, error: variablesError } = useGetVariable();
  
  // State for filters
  const [selectedFabric, setSelectedFabric] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get category name from params
  const categoryName = params.categoryName;
  
  // Filter products by category (exact match including case and punctuation)
  const categoryProducts = useMemo(() => {
    return products.filter(product => 
      product.category === decodeURIComponent(categoryName)
    );
  }, [products, categoryName]);
  
  
  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (params.categoryName && product.category !== params.categoryName) {
        return false;
      }
      
      // Fabric filter - check if product fabric is in selected fabrics array
      if (selectedFabric.length > 0 && !selectedFabric.includes(product.fabric)) {
        return false;
      }
      
      // Occasion filter - check if product occasion is in selected occasions array
      if (selectedOccasion.length > 0 && !selectedOccasion.includes(product.occasion)) {
        return false;
      }
      
      // Color filter - check if any variant has a color in selected colors array
      if (selectedColor.length > 0 && (!product.variants || !product.variants.some(variant => selectedColor.includes(variant.color)))) {
        return false;
      }
      
      // Size filter - check if any variant has a size in selected sizes array
      if (selectedSize.length > 0 && (!product.variants || !product.variants.some(variant => variant.sizes.some(size => selectedSize.includes(size.size))))) {
        return false;
      }
      
      // Price range filter - check if any variant has a price within selected range
      if (selectedPriceRange && product.variants && product.variants.length > 0) {
        const hasPriceInRange = product.variants.some(variant => 
          variant.sizes.some(size => {
            const price = size.sellingPrice;
            switch (selectedPriceRange) {
              case 'under-500':
                return price < 500;
              case '500-2000':
                return price >= 500 && price <= 2000;
              case '2000-5000':
                return price > 2000 && price <= 5000;
              case '5000-20000':
                return price > 5000 && price <= 20000;
              default:
                return true;
            }
          })
        );
        if (!hasPriceInRange) return false;
      }
      
      return true;
    });
  }, [
    products, 
    params.categoryName, 
    selectedFabric, 
    selectedOccasion, 
    selectedColor, 
    selectedSize, 
    selectedPriceRange
  ]);
  
  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFabric([]);
    setSelectedOccasion([]);
    setSelectedColor([]);
    setSelectedSize([]);
    setSelectedPriceRange('');
  };
  
  if (productsLoading || variablesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }
  
  if (productsError || variablesError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{productsError?.message || variablesError?.message || 'Failed to load data. Please try again later.'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-purple-50">
      <style jsx>{scrollbarStyles}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-700 hover:to-fuchsia-700 shadow-md"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>
          </div>
          <h1 className="text-3xl font-extrabold text-purple-800 capitalize">
            {decodeURIComponent(categoryName)} Collection
          </h1>
          <p className="mt-2 text-purple-600">
            {filteredProducts.length} products found
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-full lg:w-64 flex-shrink-0">
            <div className="bg-gradient-to-b from-purple-50 to-fuchsia-50 rounded-xl shadow-lg p-6 sticky top-8 border border-purple-100">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-purple-200">
                <h2 className="text-xl font-bold text-purple-800 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-purple-600" /> Filters
                </h2>
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center transition-colors duration-200"
                >
                  <X className="h-4 w-4 mr-1" /> Clear All
                </button>
              </div>
              
              {/* Fabric Filter */}
              {variables?.fabric && variables.fabric.length > 0 && (
                <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                  <h3 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div> Fabric
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {variables.fabric.map((fabric) => (
                      <div key={fabric} className="flex items-center group">
                        <input
                          id={`fabric-${fabric}`}
                          name="fabric"
                          type="checkbox"
                          checked={selectedFabric.includes(fabric)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFabric(prev => [...prev, fabric]);
                            } else {
                              setSelectedFabric(prev => prev.filter(item => item !== fabric));
                            }
                          }}
                          className="h-4 w-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-purple-50 transition-all duration-200 bg-white checked:bg-purple-600"
                        />
                        <label
                          htmlFor={`fabric-${fabric}`}
                          className="ml-3 text-sm text-gray-700 group-hover:text-purple-700 transition-colors duration-200 cursor-pointer"
                        >
                          {fabric}
                        </label>
                      </div>
                    ))}
                    {selectedFabric.length > 0 && (
                      <button
                        onClick={() => setSelectedFabric([])}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center transition-colors duration-200"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Occasion Filter */}
              {variables?.occassion && variables.occassion.length > 0 && (
                <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                  <h3 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-fuchsia-500 mr-2"></div> Occasion
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {variables.occassion.map((occasion) => (
                      <div key={occasion} className="flex items-center group">
                        <input
                          id={`occasion-${occasion}`}
                          name="occasion"
                          type="checkbox"
                          checked={selectedOccasion.includes(occasion)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOccasion(prev => [...prev, occasion]);
                            } else {
                              setSelectedOccasion(prev => prev.filter(item => item !== occasion));
                            }
                          }}
                          className="h-4 w-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-purple-50 transition-all duration-200 bg-white checked:bg-purple-600"
                        />
                        <label
                          htmlFor={`occasion-${occasion}`}
                          className="ml-3 text-sm text-gray-700 group-hover:text-purple-700 transition-colors duration-200 cursor-pointer"
                        >
                          {occasion}
                        </label>
                      </div>
                    ))}
                    {selectedOccasion.length > 0 && (
                      <button
                        onClick={() => setSelectedOccasion([])}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center transition-colors duration-200"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Color Filter */}
              {variables?.color && variables.color.length > 0 && (
                <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                  <h3 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-pink-500 mr-2"></div> Color
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {variables.color.map((color) => (
                      <div key={color} className="flex items-center group">
                        <input
                          id={`color-${color}`}
                          name="color"
                          type="checkbox"
                          checked={selectedColor.includes(color)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedColor(prev => [...prev, color]);
                            } else {
                              setSelectedColor(prev => prev.filter(item => item !== color));
                            }
                          }}
                          className="h-4 w-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-purple-50 transition-all duration-200 bg-white checked:bg-purple-600"
                        />
                        <label
                          htmlFor={`color-${color}`}
                          className="ml-3 text-sm text-gray-700 group-hover:text-purple-700 transition-colors duration-200 cursor-pointer"
                        >
                          {color}
                        </label>
                      </div>
                    ))}
                    {selectedColor.length > 0 && (
                      <button
                        onClick={() => setSelectedColor([])}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center transition-colors duration-200"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Size Filter */}
              {variables?.sizes && variables.sizes.length > 0 && (
                <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                  <h3 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></div> Size
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {variables.sizes.map((size) => (
                      <div key={size} className="flex items-center group">
                        <input
                          id={`size-${size}`}
                          name="size"
                          type="checkbox"
                          checked={selectedSize.includes(size)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSize(prev => [...prev, size]);
                            } else {
                              setSelectedSize(prev => prev.filter(item => item !== size));
                            }
                          }}
                          className="h-4 w-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-purple-50 transition-all duration-200 bg-white checked:bg-purple-600"
                        />
                        <label
                          htmlFor={`size-${size}`}
                          className="ml-3 text-sm text-gray-700 group-hover:text-purple-700 transition-colors duration-200 cursor-pointer"
                        >
                          {size}
                        </label>
                      </div>
                    ))}
                    {selectedSize.length > 0 && (
                      <button
                        onClick={() => setSelectedSize([])}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center transition-colors duration-200"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Price Range Filter */}
              <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                <h3 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
                  <div className="h-2 w-2 rounded-full bg-rose-500 mr-2"></div> Price Range
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'under-500', label: 'Under ₹500', value: 'under-500' },
                    { id: '500-2000', label: '₹500 - ₹2000', value: '500-2000' },
                    { id: '2000-5000', label: '₹2000 - ₹5000', value: '2000-5000' },
                    { id: '5000-20000', label: '₹5000 - ₹20000', value: '5000-20000' }
                  ].map((range) => (
                    <div key={range.id} className="flex items-center group">
                      <input
                        id={`price-${range.id}`}
                        name="price-range"
                        type="radio"
                        checked={selectedPriceRange === range.value}
                        onChange={() => setSelectedPriceRange(range.value)}
                        className="h-4 w-4 text-purple-600 border-purple-300 focus:ring-purple-500 bg-white checked:bg-purple-600"
                      />
                      <label
                        htmlFor={`price-${range.id}`}
                        className="ml-3 text-sm text-gray-700 group-hover:text-purple-700 transition-colors duration-200 cursor-pointer"
                      >
                        {range.label}
                      </label>
                    </div>
                  ))}
                  {selectedPriceRange && (
                    <button
                      onClick={() => setSelectedPriceRange('')}
                      className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center transition-colors duration-200"
                    >
                      <X className="h-3 w-3 mr-1" /> Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
          
          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden bg-gradient-to-b from-purple-50 to-fuchsia-50 rounded-xl shadow-lg p-6 mb-6 border border-purple-100">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-purple-200">
                <h2 className="text-xl font-bold text-purple-800 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-purple-600" /> Filters
                </h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Fabric Filter */}
              {variables?.fabric && variables.fabric.length > 0 && (
                <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                  <h3 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div> Fabric
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {variables.fabric.map((fabric) => (
                      <div key={fabric} className="flex items-center group">
                        <input
                          id={`mobile-fabric-${fabric}`}
                          name="fabric"
                          type="checkbox"
                          checked={selectedFabric.includes(fabric)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFabric(prev => [...prev, fabric]);
                            } else {
                              setSelectedFabric(prev => prev.filter(item => item !== fabric));
                            }
                          }}
                          className="h-4 w-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-purple-50 transition-all duration-200 bg-white checked:bg-purple-600"
                        />
                        <label
                          htmlFor={`mobile-fabric-${fabric}`}
                          className="ml-3 text-sm text-gray-700 group-hover:text-purple-700 transition-colors duration-200 cursor-pointer"
                        >
                          {fabric}
                        </label>
                      </div>
                    ))}
                    {selectedFabric.length > 0 && (
                      <button
                        onClick={() => setSelectedFabric([])}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center transition-colors duration-200"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Occasion Filter */}
              {variables?.occassion && variables.occassion.length > 0 && (
                <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                  <h3 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-fuchsia-500 mr-2"></div> Occasion
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {variables.occassion.map((occasion) => (
                      <div key={occasion} className="flex items-center group">
                        <input
                          id={`mobile-occasion-${occasion}`}
                          name="occasion"
                          type="checkbox"
                          checked={selectedOccasion.includes(occasion)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOccasion(prev => [...prev, occasion]);
                            } else {
                              setSelectedOccasion(prev => prev.filter(item => item !== occasion));
                            }
                          }}
                          className="h-4 w-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-purple-50 transition-all duration-200 bg-white checked:bg-purple-600"
                        />
                        <label
                          htmlFor={`mobile-occasion-${occasion}`}
                          className="ml-3 text-sm text-gray-700 group-hover:text-purple-700 transition-colors duration-200 cursor-pointer"
                        >
                          {occasion}
                        </label>
                      </div>
                    ))}
                    {selectedOccasion.length > 0 && (
                      <button
                        onClick={() => setSelectedOccasion([])}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center transition-colors duration-200"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Color Filter */}
              {variables?.color && variables.color.length > 0 && (
                <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                  <h3 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-pink-500 mr-2"></div> Color
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {variables.color.map((color) => (
                      <div key={color} className="flex items-center group">
                        <input
                          id={`mobile-color-${color}`}
                          name="color"
                          type="checkbox"
                          checked={selectedColor.includes(color)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedColor(prev => [...prev, color]);
                            } else {
                              setSelectedColor(prev => prev.filter(item => item !== color));
                            }
                          }}
                          className="h-4 w-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-purple-50 transition-all duration-200 bg-white checked:bg-purple-600"
                        />
                        <label
                          htmlFor={`mobile-color-${color}`}
                          className="ml-3 text-sm text-gray-700 group-hover:text-purple-700 transition-colors duration-200 cursor-pointer"
                        >
                          {color}
                        </label>
                      </div>
                    ))}
                    {selectedColor.length > 0 && (
                      <button
                        onClick={() => setSelectedColor([])}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center transition-colors duration-200"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Size Filter */}
              {variables?.sizes && variables.sizes.length > 0 && (
                <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                  <h3 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></div> Size
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {variables.sizes.map((size) => (
                      <div key={size} className="flex items-center group">
                        <input
                          id={`mobile-size-${size}`}
                          name="size"
                          type="checkbox"
                          checked={selectedSize.includes(size)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSize(prev => [...prev, size]);
                            } else {
                              setSelectedSize(prev => prev.filter(item => item !== size));
                            }
                          }}
                          className="h-4 w-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-purple-50 transition-all duration-200 bg-white checked:bg-purple-600"
                        />
                        <label
                          htmlFor={`mobile-size-${size}`}
                          className="ml-3 text-sm text-gray-700 group-hover:text-purple-700 transition-colors duration-200 cursor-pointer"
                        >
                          {size}
                        </label>
                      </div>
                    ))}
                    {selectedSize.length > 0 && (
                      <button
                        onClick={() => setSelectedSize([])}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center transition-colors duration-200"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Price Range Filter */}
              <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                <h3 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
                  <div className="h-2 w-2 rounded-full bg-rose-500 mr-2"></div> Price Range
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'mobile-under-500', label: 'Under ₹500', value: 'under-500' },
                    { id: 'mobile-500-2000', label: '₹500 - ₹2000', value: '500-2000' },
                    { id: 'mobile-2000-5000', label: '₹2000 - ₹5000', value: '2000-5000' },
                    { id: 'mobile-5000-20000', label: '₹5000 - ₹20000', value: '5000-20000' }
                  ].map((range) => (
                    <div key={range.id} className="flex items-center group">
                      <input
                        id={range.id}
                        name="price-range"
                        type="radio"
                        checked={selectedPriceRange === range.value}
                        onChange={() => setSelectedPriceRange(range.value)}
                        className="h-4 w-4 text-purple-600 border-purple-300 focus:ring-purple-500 bg-white checked:bg-purple-600"
                      />
                      <label
                        htmlFor={range.id}
                        className="ml-3 text-sm text-gray-700 group-hover:text-purple-700 transition-colors duration-200 cursor-pointer"
                      >
                        {range.label}
                      </label>
                    </div>
                  ))}
                  {selectedPriceRange && (
                    <button
                      onClick={() => setSelectedPriceRange('')}
                      className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center transition-colors duration-200"
                    >
                      <X className="h-3 w-3 mr-1" /> Clear
                    </button>
                  )}
                </div>
              </div>
              
              {/* Clear All Filters */}
              <button
                onClick={() => {
                  clearAllFilters();
                  setShowFilters(false);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-fuchsia-700 shadow-md transition-all duration-200 mt-4 flex items-center justify-center"
              >
                <X className="h-4 w-4 mr-2" /> Clear All Filters
              </button>
            </div>
          )}
          
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
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product._id}`}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                    aria-label={`View ${product.name}`}
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                      <img
                        src={product.variants?.[0]?.thumbnail || product.image || 'https://placehold.co/300'}
                        alt={product.name}
                        className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500 truncate">{product.subcategory}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          ₹{product.variants?.[0]?.sizes?.[0]?.sellingPrice || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          ₹{product.variants?.[0]?.sizes?.[0]?.marketPrice || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
