import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Wrench, Calendar, ChevronRight, Laptop, Smartphone, Monitor, Tablet, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { useServices } from '../hooks/useServices';

// ─── Fetchers ────────────────────────────────────────────────
const fetchSlots = (date, technicianId) =>
  api.get('/time-slots/available', { params: { date, technicianId } }).then(r => r.data.data ?? r.data);
const fetchTechnicians = () =>
  api.get('/technicians/available').then((r) => r.data.data ?? r.data);

// ─── Schema ──────────────────────────────────────────────────
const schema = yup.object({
  problemTitle:       yup.string().min(5, 'Min 5 characters').required('Problem title is required'),
  problemDescription: yup.string().min(20, 'Min 20 characters').required('Description is required'),
  deviceType:         yup.string().oneOf(['laptop','desktop','mobile','tablet','other']).required('Select a device type'),
  deviceBrand:        yup.string().optional(),
  deviceModel:        yup.string().optional(),
  preferredDate:      yup.string().required('Select a date'),
  technicianId:       yup.string().required('Please select a technician'),
  preferredTimeSlot:  yup.string().required('Please select a time slot'),
});

const DEVICE_TYPES = [
  { key: 'laptop',  label: 'Laptop',  icon: Laptop },
  { key: 'desktop', label: 'Desktop', icon: Monitor },
  { key: 'mobile',  label: 'Phone',   icon: Smartphone },
  { key: 'tablet',  label: 'Tablet',  icon: Tablet },
  { key: 'other',   label: 'Other',   icon: Package },
];

// ─── Field ───────────────────────────────────────────────────
function Field({ label, error, children, hint }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-white/85 mb-1.5">{label}</label>
      {hint && <p className="text-[12px] text-white/55 mb-1.5">{hint}</p>}
      {children}
      {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function ServicesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const { data: servicesData, isLoading: servicesLoading } = useServices();
  const services = Array.isArray(servicesData) ? servicesData : (servicesData?.services || []);

  const { data: techniciansData } = useQuery({
    queryKey: ['public-technicians'],
    queryFn: fetchTechnicians,
    staleTime: 60_000,
  });
  const technicians = Array.isArray(techniciansData) ? techniciansData : (techniciansData?.technicians || []);

  const { data: slotsData } = useQuery({
    queryKey: ['time-slots', selectedDate, selectedTechnicianId],
    queryFn: () => fetchSlots(selectedDate, selectedTechnicianId),
    enabled: !!selectedDate && !!selectedTechnicianId,
    staleTime: 60_000,
  });
  const slots = Array.isArray(slotsData) ? slotsData : (slotsData?.slots ?? slotsData?.timeSlots ?? []);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { deviceType: '', technicianId: '' },
  });

  const deviceType = watch('deviceType');

  const bookMut = useMutation({
    mutationFn: (body) => api.post('/bookings/', body).then(r => r.data),
    onSuccess: (data) => {
      navigate('/booking-success', { state: { booking: data.data || data } });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit booking.'),
  });

  // Minimum date: tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="apple-section-wide">
        <section className="ds-shell p-4 sm:p-6">
          <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-5">
            <aside className="ds-card p-5">
              <p className="text-white font-semibold text-[20px] mb-4">Service Categories</p>
              <div className="space-y-2 text-[15px]">
                {['Home Maintenance', 'Installations', 'Repairs', 'Emergency Services', 'Commercial'].map((c) => (
                  <div key={c} className="px-3 py-2.5 rounded-xl border border-white/10 text-white/85 bg-white/[0.02]">{c}</div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white font-semibold mb-3">Filter Options</p>
                <p className="text-white/65 text-sm">Price</p>
                <div className="h-1 bg-white/10 rounded-full my-3">
                  <div className="h-1 w-2/3 rounded-full bg-[#8b72ff]" />
                </div>
                <p className="text-white/65 text-sm mt-4">Availability</p>
                <div className="w-12 h-6 rounded-full bg-white/10 mt-2 relative"><span className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5" /></div>
              </div>
            </aside>

            <div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {(servicesLoading ? Array.from({ length: 6 }).map((_, i) => ({ _skeleton: true, i })) : services).map((s, i) => (
                  s?._skeleton ? (
                    <div key={i} className="ds-card p-6 animate-pulse">
                      <div className="h-10 w-10 rounded-2xl bg-white/[0.08] mb-5" />
                      <div className="h-7 w-3/4 rounded-full bg-white/[0.08] mb-3" />
                      <div className="h-4 w-full rounded-full bg-white/[0.08] mb-2" />
                      <div className="h-4 w-2/3 rounded-full bg-white/[0.08] mb-6" />
                      <div className="h-10 w-full rounded-xl bg-white/[0.08]" />
                    </div>
                  ) : (
                  <div key={s.title} className={`ds-card p-6 flex flex-col ${i === 0 ? 'ds-card-glow' : ''}`}>
                    <div className="text-4xl mb-5">{s.icon || '🔧'}</div>
                    <h3 className="text-[28px] font-bold text-white tracking-[-0.02em] leading-tight mb-2">{s.title}</h3>
                    <p className="text-[15px] text-white/65 min-h-[60px]">{s.shortDesc || s.desc || s.description}</p>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) { toast.error('Please sign in to book a repair.'); navigate('/login'); return; }
                        setShowForm(true);
                        setTimeout(() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }}
                      className={`mt-5 rounded-full py-2.5 font-semibold transition-all ${i === 0 ? 'ds-btn-primary' : 'ds-btn-outline'}`}
                    >
                      Book Now
                    </button>
                    <p className="text-white/75 mt-4 text-[20px]">
                      Starting from{' '}
                      <span className="font-bold text-white">
                        {typeof s.startingPrice === 'number' ? `$${s.startingPrice}` : (s.price || '—')}
                      </span>
                    </p>
                  </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Booking Form ─── */}
      {showForm && (
        <section id="booking-form" className="py-16">
          <div className="apple-section-wide max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-[32px] font-bold tracking-[-0.03em] text-white mb-2">Book a Repair</h2>
              <p className="text-[15px] text-white/65">Fill in the details below and we'll get back to you shortly.</p>
            </div>

            <div className="ds-card p-6 sm:p-10 rounded-[32px]">
              <form onSubmit={handleSubmit((data) => bookMut.mutate(data))} className="space-y-8">

              {/* Device Type */}
              <Field label="Device Type" error={errors.deviceType?.message}>
                <div className="grid grid-cols-5 gap-2">
                  {DEVICE_TYPES.map(({ key, label, icon: Icon }) => (
                    <button
                      type="button" key={key}
                      onClick={() => setValue('deviceType', key, { shouldValidate: true })}
                      className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border-2 transition-all text-center ${
                        deviceType === key
                          ? 'border-[#0071E3] bg-[#0071E3]/5 text-[#0071E3]'
                          : 'border-[#E8E8ED] bg-white text-[#86868B] hover:border-[#D2D2D7]'
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                      <span className="text-[11px] font-semibold">{label}</span>
                    </button>
                  ))}
                </div>
              </Field>

              {/* Device Details */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Brand (optional)" error={errors.deviceBrand?.message}>
                  <input placeholder="e.g. Apple, Dell, Samsung"
                    {...register('deviceBrand')}
                    className="w-full bg-[#F5F5F7] border border-transparent hover:border-[#D2D2D7] rounded-xl px-4 py-3.5 text-[15px] text-[#1D1D1F] outline-none focus:bg-white focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/10 transition-all" />
                </Field>
                <Field label="Model (optional)" error={errors.deviceModel?.message}>
                  <input placeholder="e.g. MacBook Pro 2023"
                    {...register('deviceModel')}
                    className="w-full bg-[#F5F5F7] border border-transparent hover:border-[#D2D2D7] rounded-xl px-4 py-3.5 text-[15px] text-[#1D1D1F] outline-none focus:bg-white focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/10 transition-all" />
                </Field>
              </div>

              {/* Problem */}
              <Field label="Problem Title" error={errors.problemTitle?.message}>
                <input placeholder="e.g. Cracked screen, won't turn on"
                  {...register('problemTitle')}
                  className="w-full bg-[#F5F5F7] border border-transparent hover:border-[#D2D2D7] rounded-xl px-4 py-3.5 text-[15px] text-[#1D1D1F] outline-none focus:bg-white focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/10 transition-all" />
              </Field>

              <Field label="Problem Description" error={errors.problemDescription?.message}
                hint="Describe the issue in detail (minimum 20 characters)">
                <textarea rows={4} placeholder="Tell us what's happening with your device..."
                  {...register('problemDescription')}
                  className="w-full bg-[#F5F5F7] border border-transparent hover:border-[#D2D2D7] rounded-xl px-4 py-3.5 text-[15px] text-[#1D1D1F] outline-none focus:bg-white focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/10 transition-all resize-none" />
              </Field>

              {/* Technician */}
              <Field label="Select Technician" error={errors.technicianId?.message}>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {technicians.map((tech) => (
                    <button
                      key={tech._id}
                      type="button"
                      onClick={() => {
                        setSelectedTechnicianId(tech._id);
                        setValue('technicianId', tech._id, { shouldValidate: true });
                        setValue('preferredTimeSlot', '');
                      }}
                      className={`text-left rounded-xl border px-3 py-3 transition-all ${
                        selectedTechnicianId === tech._id
                          ? 'border-[#7a5cff] bg-[#7a5cff]/10 text-[#7a5cff]'
                          : 'border-[#E8E8ED] bg-white text-[#1D1D1F] hover:border-[#b7a7ff]'
                      }`}
                    >
                      <p className="font-semibold text-[14px]">{tech.firstName} {tech.lastName || ''}</p>
                      <p className="text-[11px] opacity-75 capitalize">{tech.status} • {(tech.expertise || []).join(', ') || 'General'}</p>
                    </button>
                  ))}
                </div>
              </Field>

              {/* Date */}
              <Field label="Preferred Date" error={errors.preferredDate?.message}>
                <input type="date" min={minDateStr}
                  {...register('preferredDate')}
                  onChange={(e) => { register('preferredDate').onChange(e); setSelectedDate(e.target.value); }}
                  className="w-full bg-[#F5F5F7] border border-transparent hover:border-[#D2D2D7] rounded-xl px-4 py-3.5 text-[15px] text-[#1D1D1F] outline-none focus:bg-white focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/10 transition-all" />
              </Field>

              {/* Time Slots */}
              {selectedTechnicianId && slots.length > 0 && (
                <Field label="Preferred Time Slot" error={errors.preferredTimeSlot?.message}>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map(slot => (
                      <button type="button" key={slot._id}
                        onClick={() => setValue('preferredTimeSlot', slot._id)}
                        disabled={!slot.isAvailable}
                        className={`py-2.5 px-3 rounded-xl border text-[13px] font-medium transition-all ${
                          watch('preferredTimeSlot') === slot._id
                            ? 'border-[#0071E3] bg-[#0071E3]/10 text-[#0071E3]'
                            : slot.isAvailable
                              ? 'border-[#E8E8ED] bg-white text-[#1D1D1F] hover:border-[#0071E3]'
                              : 'border-[#F5F5F7] bg-[#F5F5F7] text-[#D2D2D7] cursor-not-allowed'
                        }`}>
                        {slot.startTime} – {slot.endTime}
                      </button>
                    ))}
                  </div>
                </Field>
              )}
              {selectedTechnicianId && selectedDate && slots.length === 0 && (
                <p className="text-[12px] text-amber-600">No available slots for selected technician on this date.</p>
              )}

              <button type="submit" disabled={bookMut.isPending}
                className="w-full py-4 mt-2 bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-60 text-white rounded-full text-[17px] font-semibold transition-all shadow-[0_4px_14px_rgba(0,113,227,0.3)] hover:shadow-[0_6px_20px_rgba(0,113,227,0.4)] active:scale-[0.98]">
                {bookMut.isPending ? 'Submitting…' : 'Submit Booking Request'}
              </button>
            </form>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
