import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

/**
 * useProducts — Fetch public products with filters
 * 
 * @param {Object} params - { keyword, category, minPrice, maxPrice, page, limit, sort }
 */
export function useProducts(params = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/products', { params });
      return data.data; // { products, totalProducts, page, totalPages }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * useFeaturedProducts — Fetch top-rated products for homepage
 */
export function useFeaturedProducts(limit = 4) {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: async () => {
      const { data } = await api.get('/products', {
        params: { sort: '-ratings', limit },
      });
      return data.data.products;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * useProduct — Fetch single product by ID
 */
export function useProduct(productId) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}`);
      return data.data;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 2,
  });
}
