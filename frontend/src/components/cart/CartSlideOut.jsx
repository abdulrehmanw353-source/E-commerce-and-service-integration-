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
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[4px]"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[440px] bg-[#0f1425] border-l border-white/10 shadow-2xl flex flex-col"
        style={{ animation: 'slideInRight 0.28s cubic-bezier(0.32,0.72,0,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0f1425]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white" strokeWidth={1.75} />
            <h2 className="text-[16px] font-semibold text-white">
              My Cart
              {items.length > 0 && (
                <span className="ml-2 text-[12px] font-medium text-white/45">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={clearCart}
                className="flex items-center gap-1 text-[12px] text-white/45 hover:text-[#ff9aad] px-2 py-1 rounded-lg hover:bg-[#ff5e7d]/10 transition-all">
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} /> Clear all
              </button>
            )}
            <button onClick={close}
              className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 bg-white/[0.06] border border-white/10 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-white/25" strokeWidth={1.5} />
              </div>
              <p className="text-[16px] font-semibold text-white mb-2">Your cart is empty</p>
              <p className="text-[13px] text-white/45 mb-6">Browse products and add something you love.</p>
              <Link to="/products" onClick={close}
                className="inline-flex items-center gap-1.5 px-6 py-3 ds-btn-primary rounded-xl text-[14px] font-semibold transition-all">
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
          <div className="border-t border-white/10 px-5 py-5 space-y-3 bg-[#0f1425]">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-white/45">Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items)</span>
              <span className="text-[18px] font-bold text-white">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal)}
              </span>
            </div>
            <p className="text-[12px] text-white/35">
              Taxes and shipping calculated at checkout. <strong>No account required.</strong>
            </p>
            <Link to="/checkout" onClick={close}
              className="flex items-center justify-center gap-2 w-full py-3.5 ds-btn-primary rounded-xl text-[14px] font-semibold transition-all active:scale-[0.98]">
              Checkout <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <button onClick={close}
              className="w-full py-2.5 text-[13px] font-semibold text-white/55 hover:text-white transition-colors rounded-xl hover:bg-white/[0.06]">
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
