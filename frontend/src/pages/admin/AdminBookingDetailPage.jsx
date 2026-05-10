import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Check, X, UserCog } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';
import StatusBadge from '../../components/admin/StatusBadge';

const fetchBooking = (id) => adminApi.get(`/admin/bookings/${id}`).then(r => r.data.data ?? r.data);
const approveBooking   = (id) => adminApi.patch(`/admin/bookings/${id}/approve`).then(r => r.data);
const rejectBooking    = (id) => adminApi.patch(`/admin/bookings/${id}/reject`).then(r => r.data);
const updateBookingStatus = ({ id, status }) => adminApi.patch(`/admin/bookings/${id}/status`, { status }).then(r => r.data);

const BOOKING_STATUSES = ['pending','confirmed','rejected','assigned','in_progress','completed','cancelled'];

export default function AdminBookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-booking', id],
    queryFn: () => fetchBooking(id),
    enabled: !!id,
  });

  const inv = () => { qc.invalidateQueries(['admin-booking', id]); qc.invalidateQueries(['admin-bookings']); };

  const approveMut = useMutation({ mutationFn: () => approveBooking(id), onSuccess: () => { inv(); toast.success('Approved!'); }, onError: (e) => toast.error(e.response?.data?.message || 'Failed.') });
  const rejectMut  = useMutation({ mutationFn: () => rejectBooking(id),  onSuccess: () => { inv(); toast.success('Rejected.'); }, onError: (e) => toast.error(e.response?.data?.message || 'Failed.') });
  const statusMut  = useMutation({ mutationFn: (status) => updateBookingStatus({ id, status }), onSuccess: () => { inv(); toast.success('Status updated!'); }, onError: (e) => toast.error(e.response?.data?.message || 'Failed.') });

  if (isLoading) return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-6 w-48 bg-white/[0.06] rounded-full" />
      <div className="h-64 bg-white/[0.06] rounded-2xl" />
    </div>
  );

  if (isError || !data) return (
    <div className="p-6 flex flex-col items-center justify-center py-24">
      <Calendar className="w-12 h-12 text-white/20 mb-4" strokeWidth={1.5} />
      <p className="text-[15px] text-white/40">Booking not found</p>
      <button onClick={() => navigate('/admin/bookings')} className="mt-4 text-[13px] text-[#0071E3] hover:opacity-80">← Back</button>
    </div>
  );

  const b = data.booking ?? data;
  const customer = b.customer ?? b.user;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" strokeWidth={1.75} /> Bookings
      </button>

      {/* Header */}
      <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold text-white/35 uppercase tracking-wider mb-1">Booking</p>
            <h2 className="text-[20px] font-bold text-white tracking-[-0.02em] font-mono">
              #{b._id?.slice(-10)?.toUpperCase()}
            </h2>
            <p className="text-[12px] text-white/35 mt-1">
              {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-3">
            <StatusBadge status={b.status} />
            {/* Quick actions for pending */}
            {b.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => approveMut.mutate()} disabled={approveMut.isPending}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-green-400 bg-green-500/10 hover:bg-green-500/20 disabled:opacity-40 transition-all">
                  <Check className="w-3.5 h-3.5" strokeWidth={2} /> Approve
                </button>
                <button onClick={() => rejectMut.mutate()} disabled={rejectMut.isPending}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-40 transition-all">
                  <X className="w-3.5 h-3.5" strokeWidth={2} /> Reject
                </button>
              </div>
            )}
            {/* Status Dropdown */}
            <select
              value={b.status}
              onChange={e => statusMut.mutate(e.target.value)}
              disabled={statusMut.isPending}
              className="bg-[#2C2C2E] border border-white/[0.08] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#0071E3] cursor-pointer transition-all"
            >
              {BOOKING_STATUSES.map(s => (
                <option key={s} value={s}>{s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Customer */}
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider mb-4">Customer</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0071E3]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[14px] font-bold text-[#0071E3]">{customer?.firstName?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white">{customer?.firstName} {customer?.lastName}</p>
              <p className="text-[12px] text-white/40">{customer?.email}</p>
              {customer?.phone && <p className="text-[12px] text-white/40">{customer.phone}</p>}
            </div>
          </div>
        </div>

        {/* Device Details */}
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider mb-4">Device Details</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Device Type', value: b.deviceType },
              { label: 'Brand', value: b.deviceBrand },
              { label: 'Model', value: b.deviceModel },
              { label: 'Preferred Date', value: b.preferredDate ? new Date(b.preferredDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : null },
              { label: 'Technician', value: b.assignedTechnician },
              { label: 'Est. Cost', value: b.estimatedCost ? `$${b.estimatedCost}` : null },
              { label: 'Final Cost', value: b.finalCost ? `$${b.finalCost}` : null },
            ].filter(f => f.value).map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4 text-[13px]">
                <span className="text-white/40 flex-shrink-0">{label}</span>
                <span className="text-white text-right capitalize">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem */}
      <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
        <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider mb-3">Problem</h3>
        <p className="text-[15px] font-semibold text-white mb-2">{b.problemTitle}</p>
        <p className="text-[13px] text-white/60 leading-relaxed">{b.problemDescription}</p>
      </div>

      {/* Images */}
      {b.images?.length > 0 && (
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider mb-4">Images</h3>
          <div className="flex gap-3 flex-wrap">
            {b.images.map((img, i) => (
              <img key={i} src={img} alt={`Booking image ${i+1}`}
                className="w-24 h-24 object-cover rounded-xl border border-white/[0.06]" />
            ))}
          </div>
        </div>
      )}

      {/* Admin Notes & Rejection Reason */}
      {(b.adminNotes || b.rejectionReason) && (
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
          {b.adminNotes && (
            <div className="mb-3">
              <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider mb-2">Admin Notes</h3>
              <p className="text-[13px] text-white/60 leading-relaxed">{b.adminNotes}</p>
            </div>
          )}
          {b.rejectionReason && (
            <div>
              <h3 className="text-[12px] font-semibold text-red-400/60 uppercase tracking-wider mb-2">Rejection Reason</h3>
              <p className="text-[13px] text-red-400/70 leading-relaxed">{b.rejectionReason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
