import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * CustomerRoute — Protects routes that require customer authentication.
 * If not authenticated, redirects to /login with the current location
 * so we can redirect back after login.
 */
export default function CustomerRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
