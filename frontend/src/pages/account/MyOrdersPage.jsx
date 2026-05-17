import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import api from '../../lib/axios';

const fetchOrders = () => api.get('/orders/').then(r => r.data.data ?? r.data);

const STATUS_STYLE = {
  pending:    'bg-yellow-500/15 text-yellow-300 border border-yellow-500/25',
  processing: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  paid:       'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  shipped:    'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25',
  delivered:  'bg-green-500/15 text-green-300 border border-green-500/25',
  cancelled:  'bg-red-500/15 text-red-300 border border-red-500/25',
};

export default function MyOrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: fetchOrders,
  });

  const orders = Array.isArray(data) ? data : (data?.orders || []);

  return (
    <div className="min-h-screen">
      <div className="apple-section-wide pt-8 pb-16">
        <h1 className="text-[26px] sm:text-[32px] font-extrabold tracking-[-0.03em] text-white mb-8">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-white/[0.06] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 ds-card">
            <ShoppingBag className="w-12 h-12 text-white/25 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-[18px] font-semibold text-white mb-2">No orders yet</h2>
            <p className="text-[13px] text-white/45 mb-6">When you place an order, it will appear here.</p>
            <Link to="/products"
              className="inline-flex items-center gap-1.5 px-6 py-3 ds-btn-primary rounded-xl text-[14px] font-semibold transition-all">
              Shop Now <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <Link
                key={o._id}
                to={`/account/orders/${o._id}`}
                className="flex items-center justify-between ds-card rounded-2xl p-5 transition-all group hover:border-[#8f74ff]/40"
              >
                <div className="flex items-center gap-4">
                  {/* First product image thumbnail */}
                  {o.items?.[0]?.image
                    ? <img src={o.items[0].image} alt="" className="w-14 h-14 object-contain bg-white/[0.04] border border-white/[0.06] rounded-xl flex-shrink-0" />
                    : <div className="w-14 h-14 bg-white/[0.04] border border-white/[0.06] rounded-xl flex-shrink-0 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-white/25" strokeWidth={1.5} />
                      </div>
                  }
                  <div>
                    <p className="text-[12px] font-mono text-white/45 mb-0.5">#{o._id?.slice(-10)?.toUpperCase()}</p>
                    <p className="text-[14px] font-semibold text-white">
                      {o.items?.length} {o.items?.length === 1 ? 'item' : 'items'}
                    </p>
                    <p className="text-[12px] text-white/45">
                      {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[15px] font-bold text-white">
                      {((val) => `RS ${new Intl.NumberFormat("en-US").format(val)}`)(o.totalAmount)}
                    </p>
                    <span className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${STATUS_STYLE[o.status] || 'bg-white/[0.06] text-white/45 border border-white/10'}`}>
                      {o.status}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/25 group-hover:text-white/55 transition-colors" strokeWidth={2} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
