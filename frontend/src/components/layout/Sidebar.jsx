import { X, User, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  // Prevent scrolling on body when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/customer/logout');
    } catch {
      // Even if API fails, clear local state
    }
    logout();
    onClose();
    toast.success('Signed out successfully.');
    navigate('/');
  };

  const handleNavClick = (to) => {
    onClose();
    navigate(to);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="relative flex w-full max-w-[300px] flex-col bg-bg-primary h-full shadow-2xl animate-fade-in" style={{ animation: 'slide-right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' }}>
        {/* Header */}
        <div className="flex items-center justify-between h-[48px] px-6 border-b border-separator">
          <span className="text-[21px] font-semibold tracking-tight text-label-primary">
            Menu
          </span>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-secondary text-label-secondary hover:bg-bg-tertiary transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-1">
          {[
            { label: 'Products', to: '/products' },
            { label: 'Services', to: '/services' },
            { label: 'Support', to: '/support' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.to)}
              className="text-left text-[17px] font-medium text-label-primary py-3 border-b border-separator last:border-0 hover:text-apple-blue transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-separator bg-bg-secondary">
          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              {/* User info */}
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-full bg-apple-blue flex items-center justify-center">
                  <span className="text-[14px] font-medium text-white">
                    {user?.firstName?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-label-primary">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[12px] text-label-quaternary">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleNavClick('/account')}
                className="apple-btn apple-btn-secondary w-full text-[15px]"
              >
                <User className="w-4 h-4" strokeWidth={1.5} />
                My Account
              </button>
              <button
                onClick={handleLogout}
                className="apple-btn w-full text-[15px] text-apple-red bg-red-50 hover:bg-red-100 active:scale-[0.96] transition-all"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('/login')}
                className="apple-btn apple-btn-primary w-full text-[17px]"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('/register')}
                className="apple-btn apple-btn-secondary w-full text-[15px]"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes slide-right {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
