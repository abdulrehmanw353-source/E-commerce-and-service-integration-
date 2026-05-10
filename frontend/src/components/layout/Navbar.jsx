import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function Navbar({ onOpenSidebar }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/customer/logout');
    } catch {
      // Even if API fails, clear local state
    }
    logout();
    setShowUserMenu(false);
    toast.success('Signed out successfully.');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 apple-glass border-b border-separator" id="main-nav">
      <div className="apple-section-wide">
        <div className="flex items-center justify-between h-[48px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5" id="nav-logo">
            <span className="text-[21px] font-semibold tracking-tight text-label-primary">
              TechStore
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {[
              { label: 'Products', to: '/products' },
              { label: 'Services', to: '/services' },
              { label: 'Support', to: '/support' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                id={`nav-${item.label.toLowerCase()}`}
                className="text-[13px] font-normal text-label-secondary hover:text-label-primary transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5">
            {isAuthenticated ? (
              /* ─── Authenticated: User Menu ─── */
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  id="nav-user-menu"
                  className="hidden sm:flex items-center gap-1.5 text-[13px] font-normal text-label-secondary hover:text-label-primary transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-apple-blue flex items-center justify-center">
                    <span className="text-[12px] font-medium text-white">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:inline">{user?.firstName}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} strokeWidth={2} />
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-[200px] bg-bg-primary rounded-xl shadow-lg border border-separator overflow-hidden animate-scale-in origin-top-right">
                    <div className="p-3 border-b border-separator">
                      <p className="text-[15px] font-medium text-label-primary truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-[12px] text-label-quaternary truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/account"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-[15px] text-label-primary hover:bg-bg-secondary transition-colors"
                      >
                        <User className="w-4 h-4 text-label-quaternary" strokeWidth={1.5} />
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[15px] text-apple-red hover:bg-bg-secondary transition-colors"
                      >
                        <LogOut className="w-4 h-4" strokeWidth={1.5} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ─── Guest: Sign In Link ─── */
              <Link
                to="/login"
                id="nav-signin"
                className="hidden sm:block text-[13px] font-normal text-apple-blue hover:text-[#0071E3] transition-colors"
              >
                Sign In
              </Link>
            )}

            <button
              id="nav-bag"
              className="text-label-secondary hover:text-label-primary transition-colors"
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={onOpenSidebar}
              className="md:hidden text-label-secondary hover:text-label-primary transition-colors"
            >
              <Menu className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
