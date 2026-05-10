import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import api from '../lib/axios';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    api.get(`/orders/${orderId}`)
      .then(r => setOrder(r.data.data ?? r.data))
      .catch(() => {/* order may not be accessible - show generic success */})
      .finally(() => setLoading(false));
  }, [orderId]);

  const itemCount = order?.items?.length ?? order?.orderItems?.length ?? 0;
  const total = order?.totalAmount ?? 0;

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-6">
      <div className="max-w-[480px] w-full text-center">
        {/* Animated checkmark */}
        <div
          className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}
        >
          <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={1.75} />
        </div>

        <h1 className="text-[28px] sm:text-[34px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-3">
          Order Confirmed!
        </h1>
        <p className="text-[15px] text-[#86868B] mb-2">
          Thank you for your purchase. We'll send updates to your email.
        </p>

        {orderId && (
          <p className="inline-flex items-center gap-1.5 text-[13px] bg-[#F5F5F7] text-[#86868B] rounded-full px-4 py-1.5 mb-6 font-mono">
            <Package className="w-3.5 h-3.5" strokeWidth={1.75} />
            Order #{orderId?.slice(-8)?.toUpperCase()}
          </p>
        )}

        {/* Order summary card (if loaded) */}
        {order && !loading && (
          <div className="bg-[#F5F5F7] rounded-2xl p-5 text-left mb-6 space-y-2">
            <div className="flex justify-between text-[14px]">
              <span className="text-[#86868B]">Items</span>
              <span className="text-[#1D1D1F] font-medium">{itemCount}</span>
            </div>
            {total > 0 && (
              <div className="flex justify-between text-[14px]">
                <span className="text-[#86868B]">Total Paid</span>
                <span className="text-[#1D1D1F] font-bold">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[14px]">
              <span className="text-[#86868B]">Status</span>
              <span className="text-orange-500 font-semibold capitalize">{order.status ?? 'Pending'}</span>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {orderId && (
            <Link to={`/account/orders`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1D1D1F] text-white rounded-full text-[15px] font-medium hover:bg-[#3A3A3C] transition-all">
              <Package className="w-4 h-4" strokeWidth={1.75} /> View My Orders
            </Link>
          )}
          <Link to="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F5F5F7] text-[#1D1D1F] rounded-full text-[15px] font-medium hover:bg-[#E8E8ED] transition-all">
            <ShoppingBag className="w-4 h-4" strokeWidth={1.75} /> Continue Shopping
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
