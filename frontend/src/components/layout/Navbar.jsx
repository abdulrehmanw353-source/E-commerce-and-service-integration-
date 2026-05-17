import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, User, LogOut, ChevronDown, Search, Package, Wrench } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

export default function Navbar({ onOpenSidebar }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const openCart  = useCartStore(s => s.open);
  const cartItems = useCartStore(s => s.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: searchResults, isFetching: isSearchLoading } = useQuery({
    queryKey: ['navbar-search', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const { data } = await api.get('/products', { params: { keyword: debouncedSearch, limit: 5 } });
      return data.data?.products || [];
    },
    enabled: !!debouncedSearch,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
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

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Catalog', to: '/products' },
    { label: 'Services', to: '/services' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0d1020]/92 backdrop-blur-[20px] border-b border-white/10" id="main-nav">
      <div className="apple-section-wide">
        <div className="flex items-center justify-between h-[64px]">
          {/* Logo */}
          <Link to="/" className="flex items-center" id="nav-logo">
            <span className="text-[26px] font-bold tracking-[-0.02em] text-[#f3f0ff]">
              DoorSet<span className="text-[#8f74ff]">Fix</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                id={`nav-${item.label.toLowerCase()}`}
                className="text-[14px] font-medium text-white/70 hover:text-white transition-colors duration-200 tracking-[0.01em]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setShowSearch(!showSearch)}
                id="nav-search"
                className="text-white/60 hover:text-white transition-colors p-0.5"
              >
                <Search className="w-[17px] h-[17px]" strokeWidth={1.5} />
              </button>

              {/* Search Dropdown */}
              {showSearch && (
                <div className="absolute right-0 top-full mt-3 w-[320px] sm:w-[400px] bg-[#141a2c] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] border border-white/10 overflow-hidden animate-scale-in origin-top-right">
                  <div className="p-3">
                    <div className="flex items-center gap-2.5 bg-white/5 rounded-xl px-3.5 py-2.5 border border-white/10">
                      <Search className="w-4 h-4 text-white/40 flex-shrink-0" strokeWidth={1.5} />
                      <input
                        type="text"
                        placeholder="Search products..."
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent w-full text-[15px] text-white placeholder:text-white/40 outline-none rounded-xl py-1 pl-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            navigate(`/products?keyword=${encodeURIComponent(e.target.value.trim())}`);
                            setShowSearch(false);
                            setSearchTerm('');
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                    {debouncedSearch ? (
                      isSearchLoading ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="w-5 h-5 border-2 border-white/20 border-t-[#8f74ff] rounded-full animate-spin"></div>
                        </div>
                      ) : searchResults?.length > 0 ? (
                        <div className="px-2 pb-2">
                          <p className="px-3 py-2 text-[11px] text-white/40 uppercase tracking-wider font-medium">Matching Products</p>
                          {searchResults.map((product) => (
                            <Link 
                              key={product._id} 
                              to={`/products/${product._id}`}
                              onClick={() => { setShowSearch(false); setSearchTerm(''); }}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {product.images?.[0] ? (
                                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-4 h-4 text-white/40" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[14px] text-white/90 font-medium truncate group-hover:text-[#9d84ff] transition-colors">{product.title}</p>
                                <p className="text-[13px] text-white/80">${product.price}</p>
                              </div>
                            </Link>
                          ))}
                          <Link
                            to={`/products?keyword=${encodeURIComponent(debouncedSearch)}`}
                            onClick={() => { setShowSearch(false); setSearchTerm(''); }}
                            className="block text-center mt-2 py-2 text-[13px] text-[#8f74ff] hover:bg-[#8f74ff]/10 rounded-lg transition-colors font-medium"
                          >
                            View all results
                          </Link>
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-[13px] text-white/80">No products found for "{debouncedSearch}"</p>
                        </div>
                      )
                    ) : (
                      <div className="border-t border-white/10 px-4 py-3">
                        <p className="text-[11px] text-white/40 uppercase tracking-wider font-medium mb-2">Quick Links</p>
                        <Link to="/products" onClick={() => setShowSearch(false)} className="flex items-center gap-2 py-1.5 text-[14px] text-white/90 hover:text-[#9d84ff] transition-colors">
                          <Package className="w-4 h-4 text-white/80" strokeWidth={1.5} />All Products
                        </Link>
                        <Link to="/services" onClick={() => setShowSearch(false)} className="flex items-center gap-2 py-1.5 text-[14px] text-white/90 hover:text-[#9d84ff] transition-colors">
                          <Wrench className="w-4 h-4 text-white/80" strokeWidth={1.5} />Repair Services
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  id="nav-user-menu"
                  className="hidden sm:flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                >
                  <div className="w-[30px] h-[30px] rounded-full bg-[#7a5cff] flex items-center justify-center">
                    <span className="text-[11px] font-semibold text-white leading-none">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} strokeWidth={2} />
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-3 w-[220px] bg-[#141a2c] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] border border-white/10 overflow-hidden animate-scale-in origin-top-right">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-[15px] font-semibold text-white truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-[12px] text-white/45 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <div className="py-1.5">
                      <Link
                        to="/account"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-white/90 hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4 text-white/55" strokeWidth={1.5} />
                        My Account
                      </Link>
                      <Link
                        to="/account/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-white/90 hover:bg-white/5 transition-colors"
                      >
                        <Package className="w-4 h-4 text-white/55" strokeWidth={1.5} />
                        My Orders
                      </Link>
                      <Link
                        to="/account/bookings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-white/90 hover:bg-white/5 transition-colors"
                      >
                        <Wrench className="w-4 h-4 text-white/55" strokeWidth={1.5} />
                        My Bookings
                      </Link>
                    </div>
                    <div className="border-t border-white/10 py-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#ff9aad] hover:text-white hover:bg-[#ff5e7d]/15 transition-colors"
                      >
                        <LogOut className="w-4 h-4" strokeWidth={1.5} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                id="nav-signin"
                className="hidden sm:block text-[14px] font-medium text-white/80 hover:text-white transition-colors border border-white/20 px-4 py-1.5 rounded-full"
              >
                Login
              </Link>
            )}

            {/* Cart */}
            <button
              id="nav-bag"
              onClick={openCart}
              className="relative text-white/70 hover:text-white transition-colors p-0.5"
            >
              <ShoppingBag className="w-[17px] h-[17px]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#7a5cff] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none tabular-nums">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={onOpenSidebar}
              className="md:hidden text-white/70 hover:text-white transition-colors p-0.5"
            >
              <Menu className="w-[17px] h-[17px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
