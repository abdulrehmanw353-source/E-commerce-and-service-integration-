import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const fetchBookings = () => api.get('/bookings/').then(r => r.data.data ?? r.data);
const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`).then(r => r.data);

const STATUS_STYLE = {
  pending:     'bg-yellow-500/15 text-yellow-300 border border-yellow-500/25',
  approved:    'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  'in-progress':'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  completed:   'bg-green-500/15 text-green-300 border border-green-500/25',
  rejected:    'bg-red-500/15 text-red-300 border border-red-500/25',
  cancelled:   'bg-white/[0.06] text-white/45 border border-white/10',
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
    <div className="min-h-screen">
      <div className="apple-section-wide pt-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[26px] sm:text-[32px] font-extrabold tracking-[-0.03em] text-white">My Bookings</h1>
          <Link to="/services"
            className="flex items-center gap-1.5 px-5 py-2.5 ds-btn-primary text-white rounded-xl text-[13px] font-semibold transition-all">
            <Calendar className="w-4 h-4" strokeWidth={2} /> Book a Repair
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-white/[0.06] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 ds-card">
            <Calendar className="w-12 h-12 text-white/25 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-[18px] font-semibold text-white mb-2">No bookings yet</h2>
            <p className="text-[13px] text-white/45 mb-6">Book a repair and we'll take care of your device.</p>
            <Link to="/services"
              className="inline-flex items-center gap-1.5 px-6 py-3 ds-btn-primary rounded-xl text-[14px] font-semibold transition-all">
              Book a Repair <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div
                key={b._id}
                className="ds-card rounded-2xl overflow-hidden hover:border-[#8f74ff]/40 transition-all"
              >
                <Link to={`/account/bookings/${b._id}`} className="block p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/[0.04] border border-white/[0.06] rounded-xl flex items-center justify-center flex-shrink-0 text-[22px]">
                        {DEVICE_ICONS[b.deviceType] || '🔧'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[14px] font-semibold text-white truncate">{b.problemTitle}</p>
                          <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_STYLE[b.status] || 'bg-white/[0.06] text-white/45 border border-white/10'}`}>
                            {b.status?.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-[12px] text-white/45 capitalize">
                          {b.deviceType}{b.deviceBrand ? ` · ${b.deviceBrand}` : ''}{b.deviceModel ? ` ${b.deviceModel}` : ''}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5 text-[12px] text-white/45">
                          <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                          {new Date(b.preferredDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {b.estimatedCost && (
                        <span className="text-[13px] font-bold text-white">${b.estimatedCost}</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-white/25" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Admin notes */}
                  {b.adminNotes && (
                    <div className="mt-3 pt-3 border-t border-white/[0.06]">
                      <p className="text-[12px] text-white/45">
                        <span className="font-semibold text-white">Admin: </span>{b.adminNotes}
                      </p>
                    </div>
                  )}
                </Link>
                {/* Cancel button — outside the link */}
                {b.status === 'pending' && (
                  <div className="px-5 pb-4">
                    <button
                      onClick={() => cancelMut.mutate(b._id)}
                      disabled={cancelMut.isPending}
                      className="flex items-center gap-1.5 text-[12px] font-semibold text-[#ff9aad] hover:text-white hover:bg-[#ff5e7d]/15 px-3 py-2 rounded-xl disabled:opacity-40 transition-all"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={2} /> Cancel Booking
                    </button>
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
