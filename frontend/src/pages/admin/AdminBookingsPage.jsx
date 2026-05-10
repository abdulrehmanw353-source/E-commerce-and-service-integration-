import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Calendar, ChevronRight, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';
import StatusBadge from '../../components/admin/StatusBadge';

const fetchBookings = (params) =>
  adminApi.get('/admin/bookings/', { params }).then(r => r.data.data ?? r.data);
const approveBooking = (id) => adminApi.patch(`/admin/bookings/${id}/approve`).then(r => r.data);
const rejectBooking  = (id) => adminApi.patch(`/admin/bookings/${id}/reject`).then(r => r.data);

const BOOKING_STATUSES = ['pending', 'approved', 'in-progress', 'completed', 'rejected', 'cancelled'];

export default function AdminBookingsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', page, search, statusFilter],
    queryFn: () => fetchBookings({ page, limit: 15, keyword: search || undefined, status: statusFilter || undefined }),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  const bookings = Array.isArray(data) ? data : (data?.bookings || []);
  const totalPages = data?.totalPages || 1;

  const approveMut = useMutation({
    mutationFn: approveBooking,
    onSuccess: () => { qc.invalidateQueries(['admin-bookings']); toast.success('Booking approved!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed.'),
  });
  const rejectMut = useMutation({
    mutationFn: rejectBooking,
    onSuccess: () => { qc.invalidateQueries(['admin-bookings']); toast.success('Booking rejected.'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed.'),
  });

  return (
    <div className="p-4 sm:p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search bookings…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-[#1C1C1E] border border-[#8f74ff]/25 rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white placeholder:text-white/35 outline-none focus:border-[#a994ff] transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', 'pending', 'approved', 'in-progress', 'completed', 'rejected'].map(s => (
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
                {['Booking', 'Customer', 'Service', 'Scheduled', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold text-white/35 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-4 bg-white/[0.06] rounded-full animate-pulse" /></td>
                  ))}</tr>
                ))
                : bookings.length === 0
                  ? (
                    <tr><td colSpan={6} className="px-5 py-16 text-center">
                      <Calendar className="w-8 h-8 text-white/20 mx-auto mb-3" strokeWidth={1.5} />
                      <p className="text-[13px] text-white/25">No bookings found</p>
                    </td></tr>
                  )
                  : bookings.map(b => (
                    <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[12px] text-white/70">
                        #{b._id?.slice(-8)?.toUpperCase()}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-white">{b.customer?.firstName ?? b.user?.firstName} {b.customer?.lastName ?? b.user?.lastName}</p>
                        <p className="text-[11px] text-white/35">{b.customer?.email ?? b.user?.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-white/60">{b.problemTitle ?? '—'}</td>
                      <td className="px-5 py-3.5 text-white/40 whitespace-nowrap">
                        {b.preferredDate
                          ? new Date(b.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '—'}
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={b.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {b.status === 'pending' && (
                            <>
                              <button
                                onClick={() => approveMut.mutate(b._id)}
                                disabled={approveMut.isPending}
                                className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 disabled:opacity-40 transition-all"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" strokeWidth={2} />
                              </button>
                              <button
                                onClick={() => rejectMut.mutate(b._id)}
                                disabled={rejectMut.isPending}
                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 disabled:opacity-40 transition-all"
                                title="Reject"
                              >
                                <X className="w-4 h-4" strokeWidth={2} />
                              </button>
                            </>
                          )}
                          <Link to={`/admin/bookings/${b._id}`}
                            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
                            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
                          </Link>
                        </div>
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
