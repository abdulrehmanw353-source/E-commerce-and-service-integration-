import { create } from 'zustand';

/**
 * Cart UI Store — Controls slide-out open/close state.
 * Item count badge comes from React Query (server is source of truth).
 */
export const useCartStore = create((set) => ({
  isOpen: false,
  open:  () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));
