import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Clock, Plus, Trash2, Pencil, X, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';

// ─── API ──────────────────────────────────────────────────────
const fetchSlots   = ()         => adminApi.get('/time-slots/').then(r => r.data.data ?? r.data);
const createSlot   = (body)     => adminApi.post('/time-slots/', body).then(r => r.data);
const updateSlot   = (id, body) => adminApi.patch(`/time-slots/${id}`, body).then(r => r.data);
const deleteSlot   = (id)       => adminApi.delete(`/time-slots/${id}`).then(r => r.data);

// ─── Validation ───────────────────────────────────────────────
const schema = yup.object({
  date:        yup.string().required('Date is required'),
  startTime:   yup.string().required('Start time is required'),
  endTime:     yup.string().required('End time is required'),
  maxBookings: yup.number().integer().min(1, 'Minimum 1').max(50, 'Maximum 50').required('Required'),
});

const INPUT = "w-full bg-[#2C2C2E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3]/30 transition-all";

function SlotForm({ slot, onClose, onSubmit, isPending }) {
  const isEdit = !!slot;
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: slot ? {
      date:        slot.date?.slice(0, 10) ?? '',
      startTime:   slot.startTime ?? '',
      endTime:     slot.endTime ?? '',
      maxBookings: slot.maxBookings ?? 1,
    } : { maxBookings: 4 },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[17px] font-semibold text-white">
            {isEdit ? 'Edit Time Slot' : 'New Time Slot'}
          </h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-all">
            <X className="w-4 h-4 text-white/60" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-[12px] font-medium text-white/80 mb-1.5 block">Date <span className="text-red-400">*</span></label>
            <input type="date" {...register('date')} className={INPUT}
              min={new Date().toISOString().split('T')[0]} />
            {errors.date && <p className="text-[11px] text-red-400 mt-1">{errors.date.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-white/80 mb-1.5 block">Start Time <span className="text-red-400">*</span></label>
              <input type="time" {...register('startTime')} className={INPUT} />
              {errors.startTime && <p className="text-[11px] text-red-400 mt-1">{errors.startTime.message}</p>}
            </div>
            <div>
              <label className="text-[12px] font-medium text-white/80 mb-1.5 block">End Time <span className="text-red-400">*</span></label>
              <input type="time" {...register('endTime')} className={INPUT} />
              {errors.endTime && <p className="text-[11px] text-red-400 mt-1">{errors.endTime.message}</p>}
            </div>
          </div>
          <div>
            <label className="text-[12px] font-medium text-white/80 mb-1.5 block">Max Bookings <span className="text-red-400">*</span></label>
            <input type="number" {...register('maxBookings')} min={1} max={50} className={INPUT} />
            {errors.maxBookings && <p className="text-[11px] text-red-400 mt-1">{errors.maxBookings.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white/80 bg-white/[0.06] hover:bg-white/[0.1] transition-all">
              Cancel
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-60 transition-all">
              {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminTimeSlotsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null); // null | 'create' | { slot }
  const [deleteId, setDeleteId] = useState(null);
  const [filterDate, setFilterDate] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-time-slots'],
    queryFn: fetchSlots,
    staleTime: 30_000,
  });

  const slots = Array.isArray(data) ? data : (data?.slots ?? data?.timeSlots ?? []);

  // Filter by date
  const filtered = filterDate
    ? slots.filter(s => s.date?.slice(0, 10) === filterDate)
    : slots;

  const createMut = useMutation({
    mutationFn: createSlot,
    onSuccess: () => { qc.invalidateQueries(['admin-time-slots']); toast.success('Time slot created!'); setModal(null); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create slot.'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, ...body }) => updateSlot(id, body),
    onSuccess: () => { qc.invalidateQueries(['admin-time-slots']); toast.success('Slot updated!'); setModal(null); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update slot.'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteSlot,
    onSuccess: () => { qc.invalidateQueries(['admin-time-slots']); toast.success('Slot deleted.'); setDeleteId(null); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete.'),
  });

  const handleCreate = (data) => createMut.mutate(data);
  const handleUpdate = (data) => updateMut.mutate({ id: modal.slot._id, ...data });

  // Group slots by date
  const grouped = filtered.reduce((acc, slot) => {
    const d = slot.date?.slice(0, 10) ?? 'Unknown';
    if (!acc[d]) acc[d] = [];
    acc[d].push(slot);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-semibold text-white">Time Slots</h2>
          <p className="text-[13px] text-white/35 mt-0.5">{slots.length} total slots</p>
        </div>
        <button onClick={() => setModal('create')}
          className="inline-flex items-center gap-2 px-4 py-2.5 ds-btn-primary text-[13px] font-semibold rounded-xl transition-all">
          <Plus className="w-4 h-4" strokeWidth={2} /> Add Time Slot
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Calendar className="w-4 h-4 text-white/30" strokeWidth={1.75} />
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="bg-[#1C1C1E] border border-white/[0.06] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#0071E3] transition-all"
        />
        {filterDate && (
          <button onClick={() => setFilterDate('')}
            className="text-[12px] text-white/40 hover:text-white/70 transition-colors">
            Clear
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/[0.04] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sortedDates.length === 0 ? (
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl flex flex-col items-center justify-center py-16">
          <Clock className="w-10 h-10 text-white/15 mb-3" strokeWidth={1.5} />
          <p className="text-[14px] font-medium text-white/30 mb-2">No time slots found</p>
          <button onClick={() => setModal('create')}
            className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-[#0071E3] hover:opacity-80 transition-opacity">
            <Plus className="w-3.5 h-3.5" strokeWidth={2} /> Create your first slot
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-white/30" strokeWidth={1.75} />
                <h3 className="text-[13px] font-semibold text-white/80">
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </h3>
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[11px] text-white/25">{grouped[date].length} slots</span>
              </div>

              {/* Slots grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {grouped[date]
                  .sort((a, b) => (a.startTime > b.startTime ? 1 : -1))
                  .map(slot => {
                    const booked = slot.currentBookings ?? 0;
                    const max = slot.maxBookings ?? 1;
                    const full = booked >= max;
                    return (
                      <div key={slot._id}
                        className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.12] transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-[15px] font-semibold text-white">
                              {slot.startTime} – {slot.endTime}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              {full
                                ? <span className="text-[11px] font-semibold text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" strokeWidth={2} /> Full
                                  </span>
                                : <span className="text-[11px] font-semibold text-green-400 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" strokeWidth={2} /> Available
                                  </span>
                              }
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => setModal({ slot })}
                              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.08] transition-all">
                              <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                            </button>
                            <button onClick={() => setDeleteId(slot._id)}
                              className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                            </button>
                          </div>
                        </div>

                        {/* Capacity bar */}
                        <div>
                          <div className="flex justify-between text-[11px] text-white/35 mb-1.5">
                            <span>Bookings</span>
                            <span>{booked} / {max}</span>
                          </div>
                          <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${full ? 'bg-red-400' : 'bg-[#0071E3]'}`}
                              style={{ width: `${Math.min((booked / max) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modal && (
        <SlotForm
          slot={modal === 'create' ? null : modal.slot}
          onClose={() => setModal(null)}
          onSubmit={modal === 'create' ? handleCreate : handleUpdate}
          isPending={createMut.isPending || updateMut.isPending}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5 text-red-400" strokeWidth={1.75} />
            </div>
            <h3 className="text-[16px] font-semibold text-white mb-1">Delete this slot?</h3>
            <p className="text-[13px] text-white/45 mb-5">Customers with existing bookings for this slot may be affected.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white/60 bg-white/[0.06] hover:bg-white/[0.1] transition-all">
                Cancel
              </button>
              <button onClick={() => deleteMut.mutate(deleteId)} disabled={deleteMut.isPending}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-red-500 hover:bg-red-400 disabled:opacity-60 transition-all">
                {deleteMut.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
