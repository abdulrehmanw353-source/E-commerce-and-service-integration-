import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const fetchBookings = () => api.get('/bookings/').then(r => r.data.data ?? r.data);
const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`).then(r => r.data);

const STATUS_STYLE = {
  pending:     'bg-yellow-100 text-yellow-700',
  approved:    'bg-green-100 text-green-700',
  'in-progress':'bg-blue-100 text-blue-700',
  completed:   'bg-green-100 text-green-800',
  rejected:    'bg-red-100 text-red-700',
  cancelled:   'bg-[#F5F5F7] text-[#86868B]',
};

const DEVICE_ICONS = { laptop: '💻', desktop: '🖥️', mobile: '📱', tablet: '📲', other: '🔧' };

export default function MyBookingsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: fetchBookings,
    staleTime: 30_000,
  });

  const cancelMut = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => { qc.invalidateQueries(['my-bookings']); toast.success('Booking cancelled.'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Cannot cancel this booking.'),
  });

  const bookings = Array.isArray(data) ? data : (data?.bookings || []);

  return (
    <div className="bg-white min-h-screen">
      <div className="apple-section-wide pt-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[32px] font-bold tracking-[-0.03em] text-[#1D1D1F]">My Bookings</h1>
          <Link to="/services"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0071E3] text-white rounded-full text-[14px] font-medium hover:bg-[#0077ED] transition-all">
            <Calendar className="w-4 h-4" strokeWidth={2} /> Book a Repair
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-[#F5F5F7] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24">
            <Calendar className="w-12 h-12 text-[#D2D2D7] mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-[21px] font-semibold text-[#1D1D1F] mb-2">No bookings yet</h2>
            <p className="text-[15px] text-[#86868B] mb-6">Book a repair and we'll take care of your device.</p>
            <Link to="/services"
              className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#0071E3] text-white rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-all">
              Book a Repair <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div
                key={b._id}
                className="bg-white border border-[#E8E8ED] rounded-2xl p-5 hover:border-[#D2D2D7] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#F5F5F7] rounded-xl flex items-center justify-center flex-shrink-0 text-[22px]">
                      {DEVICE_ICONS[b.deviceType] || '🔧'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[15px] font-semibold text-[#1D1D1F] truncate">{b.problemTitle}</p>
                        <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_STYLE[b.status] || 'bg-[#F5F5F7] text-[#86868B]'}`}>
                          {b.status?.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#86868B] capitalize">
                        {b.deviceType}{b.deviceBrand ? ` · ${b.deviceBrand}` : ''}{b.deviceModel ? ` ${b.deviceModel}` : ''}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5 text-[13px] text-[#86868B]">
                        <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                        {new Date(b.preferredDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {b.estimatedCost && (
                      <span className="text-[14px] font-semibold text-[#1D1D1F]">${b.estimatedCost}</span>
                    )}
                    {b.status === 'pending' && (
                      <button
                        onClick={() => cancelMut.mutate(b._id)}
                        disabled={cancelMut.isPending}
                        className="p-2 rounded-xl text-[#86868B] hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition-all"
                        title="Cancel booking"
                      >
                        <X className="w-4 h-4" strokeWidth={2} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Admin notes */}
                {b.adminNotes && (
                  <div className="mt-3 pt-3 border-t border-[#F5F5F7]">
                    <p className="text-[12px] text-[#86868B]">
                      <span className="font-semibold text-[#1D1D1F]">Admin: </span>{b.adminNotes}
                    </p>
                  </div>
                )}
                {b.rejectionReason && (
                  <div className="mt-3 pt-3 border-t border-[#F5F5F7]">
                    <p className="text-[12px] text-red-500">
                      <span className="font-semibold">Rejected: </span>{b.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
