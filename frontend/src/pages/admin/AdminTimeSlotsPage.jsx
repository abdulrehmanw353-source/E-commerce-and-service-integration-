import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';

// ─── API ──────────────────────────────────────────────────────
const fetchSchedule = () => adminApi.get('/time-slots/').then(r => r.data.data ?? r.data);
const updateScheduleDay = ({ id, body }) => adminApi.patch(`/time-slots/${id}`, body).then(r => r.data);

export default function AdminTimeSlotsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-weekly-schedule'],
    queryFn: fetchSchedule,
    staleTime: 30_000,
  });

  const schedule = Array.isArray(data) ? data : (data?.slots ?? data?.timeSlots ?? []);

  const updateMut = useMutation({
    mutationFn: updateScheduleDay,
    onSuccess: () => {
      qc.invalidateQueries(['admin-weekly-schedule']);
      toast.success('Schedule updated!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update schedule.'),
  });

  const handleUpdate = (id, field, value) => {
    updateMut.mutate({ id, body: { [field]: value } });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-[18px] font-semibold text-white flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-[#0071E3]" /> Weekly Schedule
        </h2>
        <p className="text-[13px] text-white/40 mt-1">
          Configure operating hours for each day. Bookings are automatically generated within these hours.
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/[0.04] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-[20px] overflow-hidden">
          <div className="grid grid-cols-[140px_1fr_1fr_80px] gap-4 p-4 text-[12px] font-medium text-white/40 uppercase tracking-wider border-b border-white/[0.06] bg-white/[0.02]">
            <div>Day</div>
            <div>Opening Time</div>
            <div>Closing Time</div>
            <div className="text-center">Status</div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {schedule.map(day => (
              <div key={day._id} className={`grid grid-cols-[140px_1fr_1fr_80px] gap-4 p-4 items-center transition-all ${!day.isOpen ? 'opacity-50 grayscale' : ''}`}>
                <div className="text-[15px] font-semibold text-white">
                  {day.dayOfWeek}
                </div>

                {/* Start Time */}
                <div>
                  <input
                    type="time"
                    value={day.startTime}
                    disabled={!day.isOpen || updateMut.isPending}
                    onChange={(e) => handleUpdate(day._id, 'startTime', e.target.value)}
                    className="bg-[#2C2C2E] border border-white/[0.08] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#0071E3] transition-all disabled:opacity-50"
                  />
                </div>

                {/* End Time */}
                <div>
                  <input
                    type="time"
                    value={day.endTime}
                    disabled={!day.isOpen || updateMut.isPending}
                    onChange={(e) => handleUpdate(day._id, 'endTime', e.target.value)}
                    className="bg-[#2C2C2E] border border-white/[0.08] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#0071E3] transition-all disabled:opacity-50"
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleUpdate(day._id, 'isOpen', !day.isOpen)}
                    disabled={updateMut.isPending}
                    className={`w-11 h-6 rounded-full relative transition-colors ${day.isOpen ? 'bg-[#34C759]' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${day.isOpen ? 'left-[22px]' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
