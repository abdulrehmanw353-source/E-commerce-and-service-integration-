import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ShoppingBag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminApi from '../../lib/adminAxios';
import StatusBadge from '../../components/admin/StatusBadge';

const fetchOrders = (params) =>
  adminApi.get('/admin/orders/', { params }).then(r => r.data.data ?? r.data);

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, search, statusFilter],
    queryFn: () => fetchOrders({ page, limit: 15, keyword: search || undefined, status: statusFilter || undefined }),
    keepPreviousData: true,
  });

  const orders = Array.isArray(data) ? data : (data?.orders || []);
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-4 sm:p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search by order ID or customer…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-[#1C1C1E] border border-[#8f74ff]/25 rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white placeholder:text-white/35 outline-none focus:border-[#a994ff] transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', ...ORDER_STATUSES].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition-all ${statusFilter === s
                ? 'ds-btn-primary text-white'
                : 'bg-[#1C1C1E] border border-[#8f74ff]/30 text-white/60 hover:text-white'}`}>
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold text-white/35 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-4 bg-white/[0.06] rounded-full animate-pulse" /></td>
                  ))}</tr>
                ))
                : orders.length === 0
                  ? (
                    <tr><td colSpan={7} className="px-5 py-16 text-center">
                      <ShoppingBag className="w-8 h-8 text-white/20 mx-auto mb-3" strokeWidth={1.5} />
                      <p className="text-[13px] text-white/25">No orders found</p>
                    </td></tr>
                  )
                  : orders.map(o => (
                    <tr key={o._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[12px] text-white/70">
                        #{o._id?.slice(-8)?.toUpperCase()}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-white">{o.user?.firstName} {o.user?.lastName}</p>
                        <p className="text-[11px] text-white/35">{o.user?.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-white/50">{o.items?.length ?? '—'}</td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(o.totalAmount)}
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-3.5 text-white/40 whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link to={`/admin/orders/${o._id}`}
                          className="p-1.5 rounded-lg inline-flex text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
                          <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
                        </Link>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
            <p className="text-[12px] text-white/35">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/50 bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-30 transition-all">Prev</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/50 bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-30 transition-all">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
