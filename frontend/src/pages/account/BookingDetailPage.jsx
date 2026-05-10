import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Calendar, Clock, Smartphone, Laptop, Monitor,
  Tablet, Wrench, ImageIcon, AlertCircle, CheckCircle, XCircle,
  RefreshCw, DollarSign, User, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const fetchBooking = (id) =>
  api.get(`/bookings/${id}`).then(r => r.data.data ?? r.data);
const cancelBooking = (id) =>
  api.patch(`/bookings/${id}/cancel`).then(r => r.data);

const STATUS_CONFIG = {
  pending:      { label: 'Pending Review',  color: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/25', icon: Clock },
  approved:     { label: 'Approved',        color: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',  icon: CheckCircle },
  'in-progress':{ label: 'In Progress',     color: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',   icon: RefreshCw },
  completed:    { label: 'Completed',       color: 'bg-green-500/15 text-green-300 border border-green-500/25',  icon: CheckCircle },
  rejected:     { label: 'Rejected',        color: 'bg-red-500/15 text-red-300 border border-red-500/25',    icon: XCircle },
  cancelled:    { label: 'Cancelled',       color: 'bg-white/[0.06] text-white/45 border border-white/10',   icon: XCircle },
};

const DEVICE_ICONS = {
  laptop:  Laptop,
  desktop: Monitor,
  mobile:  Smartphone,
  tablet:  Tablet,
  other:   Wrench,
};

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between py-3 border-b border-white/[0.06] last:border-0">
      <span className="text-[14px] text-white/45 flex-shrink-0 w-40">{label}</span>
      <span className="text-[14px] font-medium text-white text-right">{value}</span>
    </div>
  );
}

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => fetchBooking(id),
    enabled: !!id,
  });

  const cancelMut = useMutation({
    mutationFn: () => cancelBooking(id),
    onSuccess: () => {
      qc.invalidateQueries(['booking', id]);
      qc.invalidateQueries(['my-bookings']);
      toast.success('Booking cancelled successfully.');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Cannot cancel this booking.'),
  });

  if (isLoading) return (
    <div className="min-h-screen">
      <div className="apple-section-wide pt-8 pb-16 space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-white/[0.06] rounded-full" />
        <div className="h-48 bg-white/[0.06] rounded-2xl" />
        <div className="h-64 bg-white/[0.06] rounded-2xl" />
      </div>
    </div>
  );

  if (isError || !booking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 ds-card">
        <AlertCircle className="w-12 h-12 text-white/25 mx-auto mb-4" strokeWidth={1.5} />
        <h2 className="text-[21px] font-semibold text-white mb-2">Booking not found</h2>
        <Link to="/account/bookings"
          className="inline-flex items-center gap-1.5 px-6 py-3 ds-btn-primary rounded-xl text-[14px] font-semibold transition-all">
          Back to Bookings
        </Link>
      </div>
    </div>
  );

  const status   = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;
  const DeviceIcon = DEVICE_ICONS[booking.deviceType] ?? Wrench;

  return (
    <div className="min-h-screen">
      <div className="apple-section-wide pt-8 pb-16">
        {/* Back nav */}
        <Link to="/account/bookings"
          className="inline-flex items-center gap-1.5 text-[14px] text-white/45 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" strokeWidth={2} /> My Bookings
        </Link>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* ─── Left ─── */}
          <div className="space-y-5">

            {/* Status Banner */}
            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl ${status.color}`}>
              <StatusIcon className="w-5 h-5 flex-shrink-0" strokeWidth={1.75} />
              <div>
                <p className="text-[15px] font-bold">{status.label}</p>
                <p className="text-[13px] opacity-75 mt-0.5">
                  Booking #{booking._id?.slice(-8)?.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Problem */}
            <div className="ds-card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-[#7a5cff]" strokeWidth={2} />
                <h2 className="text-[15px] font-bold text-white">Problem Report</h2>
              </div>
              <h3 className="text-[17px] font-semibold text-white mb-2">{booking.problemTitle}</h3>
              {booking.problemDescription && (
                <p className="text-[14px] text-white/65 leading-relaxed whitespace-pre-line">
                  {booking.problemDescription}
                </p>
              )}
            </div>

            {/* Device Info */}
            <div className="ds-card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <DeviceIcon className="w-4 h-4 text-[#7a5cff]" strokeWidth={2} />
                <h2 className="text-[15px] font-bold text-white">Device Details</h2>
              </div>
              <InfoRow label="Device Type"  value={booking.deviceType?.replace('-', ' ')} />
              <InfoRow label="Brand"        value={booking.deviceBrand} />
              <InfoRow label="Model"        value={booking.deviceModel} />
              <InfoRow label="Preferred Date" value={
                booking.preferredDate
                  ? new Date(booking.preferredDate).toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                    })
                  : null
              } />
              <InfoRow label="Time Slot"    value={booking.preferredTimeSlot} />
            </div>

            {/* Images */}
            {booking.images?.length > 0 && (
              <div className="ds-card p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-4 h-4 text-[#7a5cff]" strokeWidth={2} />
                  <h2 className="text-[15px] font-bold text-white">Attached Photos</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {booking.images.map((img, i) => (
                    <a key={i} href={img} target="_blank" rel="noopener noreferrer"
                      className="aspect-square bg-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden hover:opacity-80 transition-opacity">
                      <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {booking.adminNotes && (
              <div className="ds-card p-5 border border-[#2d8cff]/30 bg-[#2d8cff]/[0.02]">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-[#93c5ff]" strokeWidth={2} />
                  <p className="text-[14px] font-semibold text-[#93c5ff]">Note from Technician</p>
                </div>
                <p className="text-[14px] text-white/80 leading-relaxed">{booking.adminNotes}</p>
              </div>
            )}

            {/* Rejection Reason */}
            {booking.rejectionReason && (
              <div className="ds-card p-5 border border-[#ff3b57]/30 bg-[#ff3b57]/[0.02]">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-[#ff9aad]" strokeWidth={2} />
                  <p className="text-[14px] font-semibold text-[#ff9aad]">Reason for Rejection</p>
                </div>
                <p className="text-[14px] text-white/80 leading-relaxed">{booking.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* ─── Right Sidebar ─── */}
          <div className="space-y-5">
            {/* Pricing */}
            <div className="ds-card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-4 h-4 text-[#7a5cff]" strokeWidth={2} />
                <h2 className="text-[15px] font-bold text-white">Pricing</h2>
              </div>
              <div className="space-y-3">
                {booking.estimatedCost ? (
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] text-white/45">Estimated Cost</span>
                    <span className="text-[17px] font-bold text-white">${booking.estimatedCost}</span>
                  </div>
                ) : (
                  <p className="text-[13px] text-white/45 text-center py-2">
                    Cost estimate will be provided after review
                  </p>
                )}
                {booking.finalCost && (
                  <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
                    <span className="text-[14px] font-semibold text-white">Final Cost</span>
                    <span className="text-[20px] font-bold text-[#00f5d4]">${booking.finalCost}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="ds-card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-[#7a5cff]" strokeWidth={2} />
                <h2 className="text-[15px] font-bold text-white">Timeline</h2>
              </div>
              <InfoRow label="Submitted"
                value={new Date(booking.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })} />
              {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
                <InfoRow label="Last Updated"
                  value={new Date(booking.updatedAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })} />
              )}
            </div>

            {/* Technician */}
            {booking.assignedTechnician && (
              <div className="ds-card p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-[#7a5cff]" strokeWidth={2} />
                  <h2 className="text-[15px] font-bold text-white">Assigned Technician</h2>
                </div>
                <p className="text-[14px] font-medium text-white">{booking.assignedTechnician}</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2.5">
              {booking.status === 'pending' && (
                <button
                  onClick={() => cancelMut.mutate()}
                  disabled={cancelMut.isPending}
                  className="w-full py-3 rounded-xl text-[14px] font-semibold text-[#ff9aad] border border-[#ff3b57]/30 hover:bg-[#ff3b57]/15 hover:border-[#ff3b57]/50 disabled:opacity-50 transition-all"
                >
                  {cancelMut.isPending ? 'Cancelling…' : 'Cancel Booking'}
                </button>
              )}
              <Link to="/services"
                className="flex items-center justify-center gap-2 w-full py-3 ds-btn-primary rounded-xl text-[14px] font-semibold transition-all">
                <Wrench className="w-4 h-4" strokeWidth={2} /> Book Another Repair
              </Link>
              <Link to="/account/bookings"
                className="flex items-center justify-center w-full py-3 rounded-xl text-[14px] font-medium text-white/45 hover:text-white transition-colors">
                ← All Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
