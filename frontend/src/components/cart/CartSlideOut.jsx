import { useEffect, useRef } from 'react';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useGetCart, useClearCart } from '../../hooks/useCart';
import { useAuthStore } from '../../store/authStore';
import CartItem from './CartItem';
import toast from 'react-hot-toast';

export default function CartSlideOut() {
  const { isOpen, close } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading } = useGetCart();
  const clearMut = useClearCart();
  const overlayRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const items    = data?.items ?? [];
  const subtotal = items.reduce((s, i) => s + (i.price ?? 0) * (i.quantity ?? 1), 0);

  const handleClear = () => {
    clearMut.mutate(undefined, {
      onSuccess: () => toast.success('Cart cleared.'),
      onError:   () => toast.error('Failed to clear cart.'),
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ─── Backdrop ─── */}
      <div
        ref={overlayRef}
        onClick={close}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300"
      />

      {/* ─── Drawer ─── */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-white shadow-[−20px_0_60px_rgba(0,0,0,0.15)] flex flex-col"
        style={{ animation: 'slideInRight 0.28s cubic-bezier(0.32,0.72,0,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F5F5F7]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1D1D1F]" strokeWidth={1.75} />
            <h2 className="text-[17px] font-semibold text-[#1D1D1F]">
              My Cart
              {items.length > 0 && (
                <span className="ml-2 text-[13px] font-normal text-[#86868B]">({items.length})</span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={handleClear}
                disabled={clearMut.isPending}
                className="flex items-center gap-1 text-[12px] text-[#86868B] hover:text-[#FF3B30] transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                Clear
              </button>
            )}
            <button
              onClick={close}
              className="w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-[#1D1D1F]" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="w-12 h-12 text-[#D2D2D7] mb-4" strokeWidth={1.5} />
              <p className="text-[17px] font-semibold text-[#1D1D1F] mb-2">Sign in to view cart</p>
              <p className="text-[14px] text-[#86868B] mb-6">Your cart items are saved to your account.</p>
              <Link to="/login" onClick={close}
                className="px-6 py-2.5 bg-[#1D1D1F] text-white rounded-full text-[15px] font-medium hover:bg-[#3A3A3C] transition-all">
                Sign In
              </Link>
            </div>
          ) : isLoading ? (
            <div className="space-y-4 py-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 py-4 border-b border-[#F5F5F7]">
                  <div className="w-16 h-16 bg-[#F5F5F7] rounded-xl animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-[#F5F5F7] rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-[#F5F5F7] rounded animate-pulse w-1/3" />
                    <div className="h-7 bg-[#F5F5F7] rounded-full animate-pulse w-24 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="w-12 h-12 text-[#D2D2D7] mb-4" strokeWidth={1.5} />
              <p className="text-[17px] font-semibold text-[#1D1D1F] mb-2">Your cart is empty</p>
              <p className="text-[14px] text-[#86868B] mb-6">Add products to get started.</p>
              <Link to="/products" onClick={close}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#0071E3] text-white rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-all">
                Shop Now <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={item._id ?? item.productId} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer — only shown when cart has items */}
        {isAuthenticated && items.length > 0 && (
          <div className="border-t border-[#F5F5F7] px-5 py-5 space-y-4 bg-white">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#86868B]">Subtotal</span>
              <span className="text-[17px] font-bold text-[#1D1D1F]">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal)}
              </span>
            </div>
            <p className="text-[12px] text-[#86868B]">Taxes and shipping calculated at checkout.</p>

            {/* Checkout CTA */}
            <Link
              to="/checkout"
              onClick={close}
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-[16px] font-semibold transition-all active:scale-[0.98]"
            >
              Checkout <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <button onClick={close}
              className="w-full py-3 text-[14px] font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Slide-in animation */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
