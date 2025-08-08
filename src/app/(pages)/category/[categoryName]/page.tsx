"use client";

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Filter, X, ChevronLeft } from 'lucide-react';
import { useGetAllProducts } from '@/hooks/product/useGetProduct';
import { Product } from '@/lib/types/productType';

export default function CategoryPage({ params }: { params: { categoryName: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: products = [], isLoading, error } = useGetAllProducts();
  
  // State for filters
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get category name from params
  const categoryName = params.categoryName;
  
  // Filter products by category (exact match including case and punctuation)
  const categoryProducts = useMemo(() => {
    return products.filter(product => 
      product.category === decodeURIComponent(categoryName)
    );
  }, [products, categoryName]);
  
  // Get unique filter options from products
  const filterOptions = useMemo(() => {
    const subcategories = Array.from(new Set(categoryProducts.map(p => p.subcategory).filter(Boolean))) as string[];
    const fabrics = Array.from(new Set(categoryProducts.map(p => p.fabric).filter(Boolean))) as string[];
    const occasions = Array.from(new Set(categoryProducts.map(p => p.occasion).filter(Boolean))) as string[];
    const patterns = Array.from(new Set(categoryProducts.map(p => p.patternAndPrint).filter(Boolean))) as string[];
    const styles = Array.from(new Set(categoryProducts.map(p => p.style).filter(Boolean))) as string[];
    
    // Get all colors and sizes from variants
    const colors = Array.from(new Set(categoryProducts.flatMap(p => 
      p.variants?.flatMap(v => v.color) || []
    ).filter(Boolean))) as string[];
    
    const sizes = Array.from(new Set(categoryProducts.flatMap(p => 
      p.variants?.flatMap(v => v.sizes.map(s => s.size)) || []
    ).filter(Boolean))) as string[];
    
    return {
      subcategories,
      fabrics,
      occasions,
      patterns,
      styles,
      colors,
      sizes
    };
  }, [categoryProducts]);
  
  // Apply filters to products
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter(product => {
      // Subcategory filter
      if (selectedSubcategory && product.subcategory !== selectedSubcategory) return false;
      
      // Fabric filter
      if (selectedFabric && product.fabric !== selectedFabric) return false;
      
      // Occasion filter
      if (selectedOccasion && product.occasion !== selectedOccasion) return false;
      
      // Pattern filter
      if (selectedPattern && product.patternAndPrint !== selectedPattern) return false;
      
      // Style filter
      if (selectedStyle && product.style !== selectedStyle) return false;
      
      // Color filter (check if any variant has the selected color)
      if (selectedColor && !product.variants?.some(v => v.color === selectedColor)) return false;
      
      // Size filter (check if any variant has the selected size)
      if (selectedSize && !product.variants?.some(v => 
        v.sizes.some(s => s.size === selectedSize)
      )) return false;
      
      // Price filter (check if any variant is within price range)
      if (priceRange[0] > 0 || priceRange[1] < 5000) {
        const hasPriceInRange = product.variants?.some(v => 
          v.sizes.some(s => 
            s.sellingPrice >= priceRange[0] && s.sellingPrice <= priceRange[1]
          )
        );
        if (!hasPriceInRange) return false;
      }
      
      return true;
    });
  }, [
    categoryProducts, 
    selectedSubcategory, 
    selectedFabric, 
    selectedOccasion, 
    selectedPattern, 
    selectedStyle, 
    selectedColor, 
    selectedSize, 
    priceRange
  ]);
  
  // Clear all filters
  const clearAllFilters = () => {
    setSelectedSubcategory('');
    setSelectedFabric('');
    setSelectedOccasion('');
    setSelectedPattern('');
    setSelectedStyle('');
    setSelectedColor('');
    setSelectedSize('');
    setPriceRange([0, 5000]);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600">{error.message || 'Failed to load products. Please try again later.'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-purple-50">
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
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-purple-800">Filters</h2>
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Clear All
                </button>
              </div>
              
              {/* Subcategory Filter */}
              {filterOptions.subcategories.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Subcategory</h3>
                  <div className="space-y-2">
                    {filterOptions.subcategories.map((subcategory) => (
                      <div key={subcategory} className="flex items-center">
                        <input
                          id={`subcategory-${subcategory}`}
                          name="subcategory"
                          type="radio"
                          checked={selectedSubcategory === subcategory}
                          onChange={() => setSelectedSubcategory(subcategory)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`subcategory-${subcategory}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {subcategory}
                        </label>
                      </div>
                    ))}
                    {selectedSubcategory && (
                      <button
                        onClick={() => setSelectedSubcategory('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Fabric Filter */}
              {filterOptions.fabrics.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Fabric</h3>
                  <div className="space-y-2">
                    {filterOptions.fabrics.map((fabric) => (
                      <div key={fabric} className="flex items-center">
                        <input
                          id={`fabric-${fabric}`}
                          name="fabric"
                          type="radio"
                          checked={selectedFabric === fabric}
                          onChange={() => setSelectedFabric(fabric)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`fabric-${fabric}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {fabric}
                        </label>
                      </div>
                    ))}
                    {selectedFabric && (
                      <button
                        onClick={() => setSelectedFabric('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Occasion Filter */}
              {filterOptions.occasions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Occasion</h3>
                  <div className="space-y-2">
                    {filterOptions.occasions.map((occasion) => (
                      <div key={occasion} className="flex items-center">
                        <input
                          id={`occasion-${occasion}`}
                          name="occasion"
                          type="radio"
                          checked={selectedOccasion === occasion}
                          onChange={() => setSelectedOccasion(occasion)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`occasion-${occasion}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {occasion}
                        </label>
                      </div>
                    ))}
                    {selectedOccasion && (
                      <button
                        onClick={() => setSelectedOccasion('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Pattern Filter */}
              {filterOptions.patterns.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Pattern</h3>
                  <div className="space-y-2">
                    {filterOptions.patterns.map((pattern) => (
                      <div key={pattern} className="flex items-center">
                        <input
                          id={`pattern-${pattern}`}
                          name="pattern"
                          type="radio"
                          checked={selectedPattern === pattern}
                          onChange={() => setSelectedPattern(pattern)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`pattern-${pattern}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {pattern}
                        </label>
                      </div>
                    ))}
                    {selectedPattern && (
                      <button
                        onClick={() => setSelectedPattern('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Style Filter */}
              {filterOptions.styles.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Style</h3>
                  <div className="space-y-2">
                    {filterOptions.styles.map((style) => (
                      <div key={style} className="flex items-center">
                        <input
                          id={`style-${style}`}
                          name="style"
                          type="radio"
                          checked={selectedStyle === style}
                          onChange={() => setSelectedStyle(style)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`style-${style}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {style}
                        </label>
                      </div>
                    ))}
                    {selectedStyle && (
                      <button
                        onClick={() => setSelectedStyle('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Color Filter */}
              {filterOptions.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Color</h3>
                  <div className="space-y-2">
                    {filterOptions.colors.map((color) => (
                      <div key={color} className="flex items-center">
                        <input
                          id={`color-${color}`}
                          name="color"
                          type="radio"
                          checked={selectedColor === color}
                          onChange={() => setSelectedColor(color)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`color-${color}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {color}
                        </label>
                      </div>
                    ))}
                    {selectedColor && (
                      <button
                        onClick={() => setSelectedColor('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Size Filter */}
              {filterOptions.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Size</h3>
                  <div className="space-y-2">
                    {filterOptions.sizes.map((size) => (
                      <div key={size} className="flex items-center">
                        <input
                          id={`size-${size}`}
                          name="size"
                          type="radio"
                          checked={selectedSize === size}
                          onChange={() => setSelectedSize(size)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`size-${size}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {size}
                        </label>
                      </div>
                    ))}
                    {selectedSize && (
                      <button
                        onClick={() => setSelectedSize('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Min Price</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Max Price</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>
                  <button
                    onClick={() => setPriceRange([0, 5000])}
                    className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                  >
                    <X className="h-3 w-3 mr-1" /> Reset Price Range
                  </button>
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
            <div className="lg:hidden bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Subcategory Filter */}
              {filterOptions.subcategories.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Subcategory</h3>
                  <div className="space-y-2">
                    {filterOptions.subcategories.map((subcategory) => (
                      <div key={subcategory} className="flex items-center">
                        <input
                          id={`mobile-subcategory-${subcategory}`}
                          name="subcategory"
                          type="radio"
                          checked={selectedSubcategory === subcategory}
                          onChange={() => setSelectedSubcategory(subcategory)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`mobile-subcategory-${subcategory}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {subcategory}
                        </label>
                      </div>
                    ))}
                    {selectedSubcategory && (
                      <button
                        onClick={() => setSelectedSubcategory('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Fabric Filter */}
              {filterOptions.fabrics.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Fabric</h3>
                  <div className="space-y-2">
                    {filterOptions.fabrics.map((fabric) => (
                      <div key={fabric} className="flex items-center">
                        <input
                          id={`mobile-fabric-${fabric}`}
                          name="fabric"
                          type="radio"
                          checked={selectedFabric === fabric}
                          onChange={() => setSelectedFabric(fabric)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`mobile-fabric-${fabric}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {fabric}
                        </label>
                      </div>
                    ))}
                    {selectedFabric && (
                      <button
                        onClick={() => setSelectedFabric('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Occasion Filter */}
              {filterOptions.occasions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Occasion</h3>
                  <div className="space-y-2">
                    {filterOptions.occasions.map((occasion) => (
                      <div key={occasion} className="flex items-center">
                        <input
                          id={`mobile-occasion-${occasion}`}
                          name="occasion"
                          type="radio"
                          checked={selectedOccasion === occasion}
                          onChange={() => setSelectedOccasion(occasion)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`mobile-occasion-${occasion}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {occasion}
                        </label>
                      </div>
                    ))}
                    {selectedOccasion && (
                      <button
                        onClick={() => setSelectedOccasion('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Pattern Filter */}
              {filterOptions.patterns.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Pattern</h3>
                  <div className="space-y-2">
                    {filterOptions.patterns.map((pattern) => (
                      <div key={pattern} className="flex items-center">
                        <input
                          id={`mobile-pattern-${pattern}`}
                          name="pattern"
                          type="radio"
                          checked={selectedPattern === pattern}
                          onChange={() => setSelectedPattern(pattern)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`mobile-pattern-${pattern}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {pattern}
                        </label>
                      </div>
                    ))}
                    {selectedPattern && (
                      <button
                        onClick={() => setSelectedPattern('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Style Filter */}
              {filterOptions.styles.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Style</h3>
                  <div className="space-y-2">
                    {filterOptions.styles.map((style) => (
                      <div key={style} className="flex items-center">
                        <input
                          id={`mobile-style-${style}`}
                          name="style"
                          type="radio"
                          checked={selectedStyle === style}
                          onChange={() => setSelectedStyle(style)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`mobile-style-${style}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {style}
                        </label>
                      </div>
                    ))}
                    {selectedStyle && (
                      <button
                        onClick={() => setSelectedStyle('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Color Filter */}
              {filterOptions.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Color</h3>
                  <div className="space-y-2">
                    {filterOptions.colors.map((color) => (
                      <div key={color} className="flex items-center">
                        <input
                          id={`mobile-color-${color}`}
                          name="color"
                          type="radio"
                          checked={selectedColor === color}
                          onChange={() => setSelectedColor(color)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`mobile-color-${color}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {color}
                        </label>
                      </div>
                    ))}
                    {selectedColor && (
                      <button
                        onClick={() => setSelectedColor('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Size Filter */}
              {filterOptions.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Size</h3>
                  <div className="space-y-2">
                    {filterOptions.sizes.map((size) => (
                      <div key={size} className="flex items-center">
                        <input
                          id={`mobile-size-${size}`}
                          name="size"
                          type="radio"
                          checked={selectedSize === size}
                          onChange={() => setSelectedSize(size)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`mobile-size-${size}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {size}
                        </label>
                      </div>
                    ))}
                    {selectedSize && (
                      <button
                        onClick={() => setSelectedSize('')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-2 flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" /> Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Min Price</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Max Price</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>
                  <button
                    onClick={() => setPriceRange([0, 5000])}
                    className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                  >
                    <X className="h-3 w-3 mr-1" /> Reset Price Range
                  </button>
                </div>
              </div>
              
              {/* Clear All Filters */}
              <button
                onClick={() => {
                  clearAllFilters();
                  setShowFilters(false);
                }}
                className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mt-4"
              >
                Clear All Filters
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
