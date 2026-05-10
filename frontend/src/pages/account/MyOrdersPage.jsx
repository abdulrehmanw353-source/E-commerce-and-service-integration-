import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import api from '../../lib/axios';

const fetchOrders = () => api.get('/orders/').then(r => r.data.data ?? r.data);

const STATUS_STYLE = {
  pending:    'bg-yellow-100 text-yellow-700',
  paid:       'bg-blue-100 text-blue-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

export default function MyOrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: fetchOrders,
    staleTime: 30_000,
  });

  const orders = Array.isArray(data) ? data : (data?.orders || []);

  return (
    <div className="bg-white min-h-screen">
      <div className="apple-section-wide pt-8 pb-16">
        <h1 className="text-[32px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-8">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-[#F5F5F7] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-12 h-12 text-[#D2D2D7] mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-[21px] font-semibold text-[#1D1D1F] mb-2">No orders yet</h2>
            <p className="text-[15px] text-[#86868B] mb-6">When you place an order, it will appear here.</p>
            <Link to="/products"
              className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#0071E3] text-white rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-all">
              Shop Now <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <Link
                key={o._id}
                to={`/account/orders/${o._id}`}
                className="flex items-center justify-between bg-white border border-[#E8E8ED] hover:border-[#D2D2D7] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl p-5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* First product image thumbnail */}
                  {o.items?.[0]?.image
                    ? <img src={o.items[0].image} alt="" className="w-14 h-14 object-contain bg-[#F5F5F7] rounded-xl flex-shrink-0" />
                    : <div className="w-14 h-14 bg-[#F5F5F7] rounded-xl flex-shrink-0 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-[#D2D2D7]" strokeWidth={1.5} />
                      </div>
                  }
                  <div>
                    <p className="text-[13px] font-mono text-[#86868B] mb-0.5">#{o._id?.slice(-10)?.toUpperCase()}</p>
                    <p className="text-[15px] font-semibold text-[#1D1D1F]">
                      {o.items?.length} {o.items?.length === 1 ? 'item' : 'items'}
                    </p>
                    <p className="text-[13px] text-[#86868B]">
                      {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[17px] font-bold text-[#1D1D1F]">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(o.totalAmount)}
                    </p>
                    <span className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${STATUS_STYLE[o.status] || 'bg-[#F5F5F7] text-[#86868B]'}`}>
                      {o.status}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#D2D2D7] group-hover:text-[#86868B] transition-colors" strokeWidth={2} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
