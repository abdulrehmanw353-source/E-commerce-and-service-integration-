import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';

// ─── API calls ────────────────────────────────────────────────
const getCart     = ()              => api.get('/cart/').then(r => r.data.data ?? r.data);
const addItem     = (body)          => api.post('/cart/', body).then(r => r.data);
const updateItem  = (id, quantity)  => api.patch(`/cart/${id}`, { quantity }).then(r => r.data);
const removeItem  = (id)            => api.delete(`/cart/${id}`).then(r => r.data);
const clearCart   = ()              => api.delete('/cart/').then(r => r.data);

// ─── Hooks ────────────────────────────────────────────────────

/** Fetch the full cart. Only runs when authenticated. */
export function useGetCart() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}

/** Derived: total item count for the navbar badge. */
export function useCartItemCount() {
  const { data } = useGetCart();
  const items = data?.items ?? [];
  return items.reduce((sum, i) => sum + (i.quantity || 0), 0);
}

/** Add product to cart. */
export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity = 1 }) => addItem({ productId, quantity }),
    onSuccess: () => qc.invalidateQueries(['cart']),
  });
}

/** Update quantity of a cart item. */
export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }) => updateItem(itemId, quantity),
    onSuccess: () => qc.invalidateQueries(['cart']),
  });
}

/** Remove a single item from cart. */
export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId) => removeItem(itemId),
    onSuccess: () => qc.invalidateQueries(['cart']),
  });
}

/** Clear entire cart. */
export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => qc.invalidateQueries(['cart']),
  });
}
