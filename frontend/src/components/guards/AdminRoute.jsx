import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../../store/adminAuthStore';

/**
 * AdminRoute — Protects routes that require admin authentication.
 * Checks both authentication status and admin role.
 * If not authenticated as admin, redirects to /admin/login.
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAdminAuthStore();
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
