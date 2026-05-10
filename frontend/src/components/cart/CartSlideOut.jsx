import { useEffect } from 'react';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import CartItem from './CartItem';

export default function CartSlideOut() {
  const { isOpen, close, items, clearCart } = useCartStore();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-white shadow-2xl flex flex-col"
        style={{ animation: 'slideInRight 0.28s cubic-bezier(0.32,0.72,0,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F5F5F7]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1D1D1F]" strokeWidth={1.75} />
            <h2 className="text-[17px] font-semibold text-[#1D1D1F]">
              My Cart
              {items.length > 0 && (
                <span className="ml-2 text-[13px] font-normal text-[#86868B]">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={clearCart}
                className="flex items-center gap-1 text-[12px] text-[#86868B] hover:text-[#FF3B30] px-2 py-1 rounded-lg hover:bg-red-50 transition-all">
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} /> Clear all
              </button>
            )}
            <button onClick={close}
              className="w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-[#1D1D1F]" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-[#D2D2D7]" strokeWidth={1.5} />
              </div>
              <p className="text-[17px] font-semibold text-[#1D1D1F] mb-2">Your cart is empty</p>
              <p className="text-[14px] text-[#86868B] mb-6">Browse our products and add something you love.</p>
              <Link to="/products" onClick={close}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#0071E3] text-white rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-all">
                Shop Now <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#F5F5F7] px-5 py-5 space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#86868B]">Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items)</span>
              <span className="text-[20px] font-bold text-[#1D1D1F]">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal)}
              </span>
            </div>
            <p className="text-[12px] text-[#86868B]">
              Taxes and shipping calculated at checkout. <strong>No account required.</strong>
            </p>
            <Link to="/checkout" onClick={close}
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-[16px] font-semibold transition-all active:scale-[0.98]">
              Checkout <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <button onClick={close}
              className="w-full py-2.5 text-[14px] font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
