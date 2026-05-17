import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Admin Auth Store — Manages admin authentication state.
 * 
 * Separate from customer auth to keep admin and storefront
 * sessions fully independent with different token refresh endpoints.
 */
export const useAdminAuthStore = create(
  persist(
    (set) => ({
      // ─── State ────────────────────────
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      // ─── Actions ─────────────────────

      /**
       * Called on successful admin login
       */
      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        }),

      /**
       * Update only the access token (after refresh)
       */
      setAccessToken: (accessToken) =>
        set({ accessToken }),

      /**
       * Logout — clear everything
       */
      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      /**
       * Mark initial loading as complete
       */
      setLoaded: () =>
        set({ isLoading: false }),
    }),
    {
      name: 'admin-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
