import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Auth Store — Manages user authentication state.
 * 
 * Persists `user` to localStorage for session continuity.
 * The `accessToken` is kept only in memory (not persisted)
 * for security — it's refreshed via the HttpOnly cookie on load.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ─── State ────────────────────────
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true, // True until initial auth check completes

      // ─── Actions ─────────────────────
      
      /**
       * Called on successful login / register
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
       * Update user profile data
       */
      setUser: (user) =>
        set({ user }),

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
       * Mark initial loading as complete (even if not authenticated)
       */
      setLoaded: () =>
        set({ isLoading: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist user data, NOT the token
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
