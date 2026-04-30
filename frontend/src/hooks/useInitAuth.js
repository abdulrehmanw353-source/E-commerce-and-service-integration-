import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';

/**
 * useInitAuth — Attempts to restore the user session on app load.
 * 
 * If the user was previously authenticated (persisted flag in localStorage),
 * it tries to refresh the access token using the HttpOnly cookie.
 * If refresh fails, it clears auth state gracefully.
 */
export function useInitAuth() {
  const { isAuthenticated, isLoading, setAuth, setLoaded, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      // If user was previously authenticated, try to refresh
      if (isAuthenticated) {
        try {
          const { data } = await api.post('/auth/customer/refresh-token');
          const storedUser = useAuthStore.getState().user;
          setAuth(storedUser, data.data.accessToken);
        } catch {
          // Refresh failed — session expired
          logout();
        }
      } else {
        // Not authenticated — just mark loading as done
        setLoaded();
      }
    };

    initAuth();
  }, []); // Run once on mount

  return { isLoading };
}
