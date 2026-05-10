import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * GuestRoute — Prevents authenticated users from accessing
 * login/register pages. Redirects to home instead.
 * 
 * @param {string} redirectTo - Where to redirect authenticated users (default: '/')
 */
export default function GuestRoute({ children, redirectTo = '/' }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
