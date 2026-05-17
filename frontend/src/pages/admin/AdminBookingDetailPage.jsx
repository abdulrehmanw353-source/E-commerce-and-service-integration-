import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Check, X, Wrench, Save, ChevronDown, Mail, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';
import StatusBadge from '../../components/admin/StatusBadge';

const fetchBooking = (id) => adminApi.get(`/admin/bookings/${id}`).then(r => r.data.data ?? r.data);
const fetchTechnicians = () => adminApi.get('/technicians', { params: { limit: 100 } }).then(r => r.data.data ?? r.data);
const approveBooking   = (id) => adminApi.patch(`/admin/bookings/${id}/approve`).then(r => r.data);
const rejectBooking    = (id) => adminApi.patch(`/admin/bookings/${id}/reject`).then(r => r.data);
const updateBookingStatus = ({ id, status }) => adminApi.patch(`/admin/bookings/${id}/status`, { status }).then(r => r.data);
const updateBookingPayment = ({ id, payload }) => adminApi.patch(`/admin/bookings/${id}/payment`, payload).then(r => r.data);
const assignTechnician = ({ id, technicianId, reassignmentReason, sendEmail }) =>
  adminApi.patch(`/admin/bookings/${id}/assign`, { technicianId, reassignmentReason, sendEmail }).then(r => r.data);

const BOOKING_STATUSES = ['pending', 'approved', 'in-progress', 'completed', 'rejected', 'cancelled'];

export default function AdminBookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-booking', id],
    queryFn: () => fetchBooking(id),
    enabled: !!id,
  });
  const { data: techData } = useQuery({
    queryKey: ['admin-technicians-lite'],
    queryFn: fetchTechnicians,
    staleTime: 60_000,
  });

  const inv = () => { qc.invalidateQueries({ queryKey: ['admin-booking', id] }); qc.invalidateQueries({ queryKey: ['admin-bookings'] }); };

  const approveMut = useMutation({ mutationFn: () => approveBooking(id), onSuccess: () => { inv(); toast.success('Approved!'); }, onError: (e) => toast.error(e.response?.data?.message || 'Failed.') });
  const rejectMut  = useMutation({ mutationFn: () => rejectBooking(id),  onSuccess: () => { inv(); toast.success('Rejected.'); }, onError: (e) => toast.error(e.response?.data?.message || 'Failed.') });
  const statusMut  = useMutation({ mutationFn: (status) => updateBookingStatus({ id, status }), onSuccess: () => { inv(); toast.success('Status updated!'); }, onError: (e) => toast.error(e.response?.data?.message || 'Failed.') });
  const assignMut  = useMutation({
    mutationFn: ({ technicianId: tid, reassignmentReason: reason, sendEmail: email }) =>
      assignTechnician({ id, technicianId: tid, reassignmentReason: reason, sendEmail: email }),
    onSuccess: (res) => {
      inv();
      const emailSent = res?.data?.emailSent;
      toast.success(emailSent ? 'Technician assigned & email sent!' : 'Technician assigned!');
      setReassignReason('');
      setSendEmailNotif(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Assignment failed.'),
  });

  const [technicianId, setTechnicianId] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [sendEmailNotif, setSendEmailNotif] = useState(false);
  
  const [paymentUpdate, setPaymentUpdate] = useState({});

  const paymentMut = useMutation({
    mutationFn: (payload) => updateBookingPayment({ id, payload }),
    onSuccess: () => { inv(); toast.success('Payment updated!'); setPaymentUpdate({}); },
    onError: (e) => toast.error(e.response?.data?.message || 'Payment update failed.')
  });

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
  const currentTechnician = b.assignedTechnician || '';
  const technicians = Array.isArray(techData) ? techData : (techData?.technicians || []);
  const addr = customer?.address || {};
  const timeSlotLabel = b.preferredTime || 'N/A';
  const isReassignment = !!currentTechnician;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5">
      <button onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-[13px] text-white hover:bg-white/[0.06] px-2.5 py-1.5 rounded-xl transition-colors w-fit">
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
            <div className="relative w-full sm:w-[210px]">
              <select
                value={b.status}
                onChange={e => statusMut.mutate(e.target.value)}
                disabled={statusMut.isPending}
                className="w-full bg-[#2C2C2E] border border-[#8f74ff]/35 rounded-xl px-3 py-2 pr-10 text-[13px] appearance-none text-white outline-none focus:border-[#a994ff] cursor-pointer transition-all"
              >
                {BOOKING_STATUSES.map(s => (
                  <option key={s} value={s}>{s.replace('-', ' ').charAt(0).toUpperCase() + s.replace('-', ' ').slice(1)}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-white/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
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
              {customer?.phoneNo && <p className="text-[12px] text-white/40">{customer.phoneNo}</p>}
            </div>
          </div>
          {(addr?.street || addr?.city || addr?.country) && (
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <p className="text-[11px] font-semibold text-white/35 uppercase tracking-wider mb-2">Address</p>
              <p className="text-[13px] text-white/70 leading-relaxed">
                {[addr.street, addr.city, addr.state, addr.country].filter(Boolean).join(', ')}
              </p>
            </div>
          )}
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
              { label: 'Time', value: timeSlotLabel },
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

      {/* Payment Details */}
      <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
        <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider mb-4">Payment Management</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Payment Method', value: b.paymentMethod },
            { label: 'Payment Status', value: b.paymentStatus?.replace('_', ' ') },
            { label: 'Payment Rule', value: b.paymentModeRule?.replace(/_/g, ' ') },
            { label: 'Advance Paid', value: `$${b.advancePaidAmount || 0}` },
            { label: 'Remaining', value: `$${b.remainingBalance || 0}` },
            { label: 'Final Cost', value: `$${b.finalCost || 0}` },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[11px] text-white/40 uppercase mb-1">{label}</p>
              <p className="text-[14px] font-semibold text-white capitalize">{value}</p>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-white/[0.06] grid gap-4 sm:grid-cols-2">
           <div>
             <label className="block text-[11px] font-semibold text-white/45 uppercase tracking-wider mb-1.5">Payment Status</label>
             <select
               value={paymentUpdate.paymentStatus || b.paymentStatus || ''}
               onChange={(e) => setPaymentUpdate({ ...paymentUpdate, paymentStatus: e.target.value })}
               className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white outline-none"
             >
               {['pending_payment', 'pending_verification', 'partially_paid', 'paid', 'pay_on_completion', 'cancelled', 'refunded'].map(s => (
                 <option key={s} value={s}>{s.replace(/_/g, ' ').charAt(0).toUpperCase() + s.replace(/_/g, ' ').slice(1)}</option>
               ))}
             </select>
           </div>
           <div>
             <label className="block text-[11px] font-semibold text-white/45 uppercase tracking-wider mb-1.5">Payment Method</label>
             <select
               value={paymentUpdate.paymentMethod || b.paymentMethod || ''}
               onChange={(e) => setPaymentUpdate({ ...paymentUpdate, paymentMethod: e.target.value })}
               className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white outline-none"
             >
               {['cod', 'jazzcash', 'easypaisa', 'bank_transfer'].map(m => (
                 <option key={m} value={m}>{m.toUpperCase()}</option>
               ))}
             </select>
           </div>
           <div>
             <label className="block text-[11px] font-semibold text-white/45 uppercase tracking-wider mb-1.5">Advance Paid ($)</label>
             <input type="number"
               value={paymentUpdate.advancePaidAmount ?? (b.advancePaidAmount || 0)}
               onChange={(e) => setPaymentUpdate({ ...paymentUpdate, advancePaidAmount: Number(e.target.value) })}
               className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white outline-none" />
           </div>
           <div>
             <label className="block text-[11px] font-semibold text-white/45 uppercase tracking-wider mb-1.5">Remaining Bal ($)</label>
             <input type="number"
               value={paymentUpdate.remainingBalance ?? (b.remainingBalance || 0)}
               onChange={(e) => setPaymentUpdate({ ...paymentUpdate, remainingBalance: Number(e.target.value) })}
               className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white outline-none" />
           </div>
           <div>
             <label className="block text-[11px] font-semibold text-white/45 uppercase tracking-wider mb-1.5">Final Cost ($)</label>
             <input type="number"
               value={paymentUpdate.finalCost ?? (b.finalCost || 0)}
               onChange={(e) => setPaymentUpdate({ ...paymentUpdate, finalCost: Number(e.target.value) })}
               className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white outline-none" />
           </div>
           <div className="flex items-end">
             <button onClick={() => paymentMut.mutate(paymentUpdate)} disabled={paymentMut.isPending || Object.keys(paymentUpdate).length === 0}
               className="w-full py-2 bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 text-[#00f5d4] rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50">
               {paymentMut.isPending ? 'Updating...' : 'Update Payment Details'}
             </button>
           </div>
        </div>
      </div>

      {/* Problem */}
      <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
        <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider mb-3">Problem</h3>
        <p className="text-[15px] font-semibold text-white mb-2">{b.problemTitle}</p>
        <p className="text-[13px] text-white/60 leading-relaxed">{b.problemDescription}</p>
      </div>

      {/* ─── Technician Assignment ─── */}
      <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
        <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider mb-3">
          {isReassignment ? 'Reassign Technician' : 'Assign Technician'}
        </h3>

        {currentTechnician && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl bg-[#7a5cff]/10 border border-[#7a5cff]/20">
            <Wrench className="w-4 h-4 text-[#b09fff]" strokeWidth={1.75} />
            <p className="text-[13px] text-white/80">
              Currently assigned: <span className="text-white font-semibold">{currentTechnician}</span>
            </p>
          </div>
        )}

        {/* Technician Selector */}
        <div className="space-y-3">
          <div className="relative">
            <select
              value={technicianId}
              onChange={(e) => setTechnicianId(e.target.value)}
              className="w-full bg-[#2C2C2E] border border-[#8f74ff]/35 rounded-xl px-3 py-2.5 pr-10 text-[13px] appearance-none text-white outline-none focus:border-[#b09fff] transition-all"
            >
              <option value="">Select technician</option>
              {technicians.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.firstName} {t.lastName || ''} — {t.status} {t.activeTasks > 0 ? `(${t.activeTasks} tasks)` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-white/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reassignment Reason (shown when there's already a technician) */}
          {isReassignment && technicianId && (
            <div>
              <label className="block text-[11px] font-semibold text-white/45 uppercase tracking-wider mb-1.5">
                Reason for Change
              </label>
              <textarea
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                rows={2}
                placeholder="e.g. Previous technician on leave, emergency reassignment..."
                className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-[#8f74ff]/50 transition-all resize-none"
              />
            </div>
          )}

          {/* Email Notification Toggle */}
          {technicianId && (
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`
                w-[38px] h-[22px] rounded-full flex items-center transition-all duration-200
                ${sendEmailNotif ? 'bg-[#7a5cff] justify-end' : 'bg-white/10 justify-start'}
              `}>
                <div className={`
                  w-[18px] h-[18px] rounded-full bg-white shadow-sm mx-[2px] transition-all duration-200
                  ${sendEmailNotif ? 'shadow-[0_0_8px_rgba(122,92,255,0.4)]' : ''}
                `} />
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-white/45" strokeWidth={1.75} />
                <span className="text-[12px] text-white/60 group-hover:text-white/80 transition-colors">
                  Send email notification to customer
                </span>
              </div>
            </label>
          )}

          {/* Assign Button */}
          <button
            onClick={() => assignMut.mutate({
              technicianId,
              reassignmentReason: reassignReason,
              sendEmail: sendEmailNotif,
            })}
            disabled={assignMut.isPending || !technicianId}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold ds-btn-primary disabled:opacity-50 transition-all"
          >
            {assignMut.isPending
              ? <Save className="w-4 h-4 animate-spin" />
              : <Wrench className="w-4 h-4" />}
            {isReassignment ? 'Reassign Technician' : 'Assign Technician'}
            {sendEmailNotif && <Mail className="w-3.5 h-3.5 ml-1 opacity-70" />}
          </button>
        </div>
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

      {/* Admin Notes, Rejection Reason, Reassignment Reason */}
      {(b.adminNotes || b.rejectionReason || b.reassignmentReason) && (
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          {b.adminNotes && (
            <div>
              <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider mb-2">Admin Notes</h3>
              <p className="text-[13px] text-white/60 leading-relaxed">{b.adminNotes}</p>
            </div>
          )}
          {b.reassignmentReason && (
            <div>
              <h3 className="text-[12px] font-semibold text-amber-400/60 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} />
                Reassignment Reason
              </h3>
              <p className="text-[13px] text-amber-300/70 leading-relaxed">{b.reassignmentReason}</p>
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

      {/* Location */}
      {b.location?.address && (
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider mb-3">Service Location</h3>
          <p className="text-[13px] text-white/70 leading-relaxed">
            {[b.location.address, b.location.city, b.location.state, b.location.country].filter(Boolean).join(', ')}
          </p>
          {b.location.lat && b.location.lng && (
            <p className="text-[11px] text-white/30 mt-1">
              Coordinates: {b.location.lat.toFixed(5)}, {b.location.lng.toFixed(5)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
