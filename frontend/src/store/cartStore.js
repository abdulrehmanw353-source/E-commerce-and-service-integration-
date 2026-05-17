import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Cart Store — Local-first cart, persisted to localStorage.
 * No auth required to add/view items.
 * Server cart API is NOT used — the full cart is stored client-side.
 * On checkout: items are sent directly in the order payload.
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      // ─── State ────────────────────────────
      items: [],        // [{ productId, title, price, image, quantity }]
      isOpen: false,

      // ─── UI ───────────────────────────────
      open:   () => set({ isOpen: true }),
      close:  () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      // ─── Cart Actions ─────────────────────

      /** Add a product or increment quantity if already in cart. */
      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existing = items.find((i) => i.productId === product._id);
        
        if (existing) {
          const newQty = existing.quantity + quantity;
          if (newQty > product.stock) {
            return { success: false, message: "Maximum available stock already added to cart." };
          }
          set({
            items: items.map((i) =>
              i.productId === product._id
                ? { ...i, quantity: newQty, stock: product.stock }
                : i
            ),
          });
          return { success: true };
        } else {
          if (quantity > product.stock) {
            return { success: false, message: "Maximum available stock already added to cart." };
          }
          set({
            items: [
              ...items,
              {
                productId: product._id,
                title:     product.title,
                price:     product.price,
                image:     product.images?.[0] ?? null,
                quantity,
                stock:     product.stock,
                category:  product.category,
              },
            ],
          });
          return { success: true };
        }
      },

      /** Set exact quantity for an item. */
      updateQty: (productId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) => {
            if (i.productId === productId) {
              const safeQty = i.stock ? Math.min(quantity, i.stock) : quantity;
              return { ...i, quantity: safeQty };
            }
            return i;
          }),
        });
      },

      /** Remove an item from cart. */
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      /** Clear entire cart. */
      clearCart: () => set({ items: [] }),

      // ─── Derived ──────────────────────────

      /** Total number of individual items (sum of quantities). */
      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      /** Subtotal price. */
      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist cart items, not the open/close state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
