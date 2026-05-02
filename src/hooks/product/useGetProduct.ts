import { useQuery } from '@tanstack/react-query';
import { Product } from '@/lib/types/productType';
import apiClient from '@/lib/axios';
import { AxiosError } from 'axios';

// API service function for fetching all products
export async function fetchAllProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get('product/all', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.products ?? [];
  } catch (error) {
    console.error('Error fetching products:', error);
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        window.location.href = '/admin';
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
    throw error;
  }
}

// API service function for fetching similar products
export async function fetchSimilarProducts(category?: string, subcategory?: string, excludeId?: string): Promise<Product[]> {
  if (!category && !subcategory) {
    throw new Error('Category or subcategory is required');
  }

  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (subcategory) params.append('subcategory', subcategory);
    if (excludeId) params.append('excludeId', excludeId);
    
    const response = await apiClient.get(`product/similar?${params.toString()}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.products ?? [];
  } catch (error) {
    console.error('Error fetching similar products:', error);
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        window.location.href = '/admin';
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch similar products');
    }
    throw error;
  }
}

// API service function for fetching a single product by ID
export async function fetchProductById(id: string): Promise<Product> {
  if (!id) {
    throw new Error('Product ID is required');
  }

  try {
    const response = await apiClient.get(`product/${id}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch product');
    }

    return response.data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        window.location.href = '/admin';
      }
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch product. Please try again later.'
      );
    }
    throw error;
  }
}

// React Query hook
export function useGetAllProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 (Unauthorized)
      if (error.message.includes('401')) {
        return false;
      }
      return failureCount < 3; // Retry up to 3 times for other errors
    },
  });
}

interface UseGetProductByIdOptions {
  enabled?: boolean;
  staleTime?: number;
  initialData?: Product | (() => Product | undefined) | undefined;
}

// React Query hook for single product
export function useGetProductById(
  id: string | null, 
  options: UseGetProductByIdOptions = {}
) {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => id ? fetchProductById(id) : Promise.reject(new Error('No product ID provided')),
    enabled: !!id && (options.enabled !== undefined ? options.enabled : true),
    staleTime: options.staleTime ?? 1000 * 60 * 5, // 5 minutes
    initialData: options.initialData,
  });
}

interface UseGetSimilarProductsOptions {
  enabled?: boolean;
  staleTime?: number;
}

export function useGetSimilarProducts(
  category?: string, 
  subcategory?: string,
  excludeId?: string,
  options: UseGetSimilarProductsOptions = {}
) {
  return useQuery<Product[], Error>({
    queryKey: ['similar-products', category, subcategory, excludeId],
    queryFn: () => fetchSimilarProducts(category, subcategory, excludeId),
    enabled: (!!category || !!subcategory) && (options.enabled !== undefined ? options.enabled : true),
    staleTime: options.staleTime ?? 1000 * 60 * 5, // 5 minutes
  });
}
