import { useEffect } from 'react';
import { useAdminAuthStore } from '../store/adminAuthStore';
import adminApi from '../lib/adminAxios';

/**
 * useInitAdminAuth — Attempts to restore admin session on app load.
 * 
 * If admin was previously authenticated (persisted flag),
 * tries to refresh the access token via the admin refresh endpoint.
 */
export function useInitAdminAuth() {
  const { isAuthenticated, isLoading, setAuth, setLoaded, logout } = useAdminAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated) {
        try {
          const { data } = await adminApi.post('/auth/admin/refresh-token');
          const storedUser = useAdminAuthStore.getState().user;
          setAuth(storedUser, data.data.accessToken);
        } catch {
          // Refresh failed — admin session expired
          logout();
        }
      } else {
        setLoaded();
      }
    };

    initAuth();
  }, []); // Run once on mount

  return { isLoading };
}
