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
const fetchSlots = (technicianId) =>
  api.get('/time-slots/available', { params: { technicianId } }).then(r => r.data.data ?? r.data);
const fetchTechnicians = () =>
  api.get('/technicians/available').then((r) => r.data.data ?? r.data);

// ─── Schema ──────────────────────────────────────────────────
const schema = yup.object({
  problemTitle:       yup.string().min(5, 'Min 5 characters').required('Problem title is required'),
  problemDescription: yup.string().min(20, 'Min 20 characters').required('Description is required'),
  deviceType:         yup.string().oneOf(['laptop','desktop','mobile','tablet','other']).required('Select a device type'),
  deviceBrand:        yup.string().optional(),
  deviceModel:        yup.string().optional(),
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
      {hint && <p className="text-[12px] text-white/40 mb-1.5">{hint}</p>}
      {children}
      {error && <p className="text-[12px] text-[#ff5e7d] mt-1">{error}</p>}
    </div>
  );
}

export default function ServicesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
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
    queryKey: ['time-slots', selectedTechnicianId],
    queryFn: () => fetchSlots(selectedTechnicianId),
    enabled: !!selectedTechnicianId,
    staleTime: 60_000,
  });
  const slots = Array.isArray(slotsData) ? slotsData : (slotsData?.slots ?? slotsData?.timeSlots ?? []);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { deviceType: '', technicianId: '' },
  });

  const deviceType = watch('deviceType');

  const bookMut = useMutation({
    mutationFn: (body) => {
      // Find the selected slot to extract the date
      const selectedSlotObj = slots.find(s => s._id === body.preferredTimeSlot);
      if (selectedSlotObj) {
        body.preferredDate = selectedSlotObj.date;
      }
      return api.post('/bookings/', body).then(r => r.data);
    },
    onSuccess: (data) => {
      navigate('/booking-success', { state: { booking: data.data || data } });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit booking.'),
  });


  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="apple-section-wide">
        <section className="ds-shell p-4 sm:p-6">
          <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-5">
            <aside className="ds-card p-5">
              <p className="text-white font-semibold text-[20px] mb-4">Service Categories</p>
              <div className="space-y-2 text-[15px]">
                {['Phone Repair', 'Laptop Repair', 'PC Builds & Repair', 'Tablet Repair', 'Data Recovery'].map((c) => (
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
                <div className="relative">
                  <select
                    {...register('deviceType')}
                    className="w-full bg-[#1a1f33] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-[15px] text-white outline-none focus:bg-[#1a1f33] focus:border-[#7a5cff] focus:ring-4 focus:ring-[#7a5cff]/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select device type</option>
                    {DEVICE_TYPES.map(({ key, label }) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </Field>

              {/* Device Details */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Brand (optional)" error={errors.deviceBrand?.message}>
                  <input placeholder="e.g. Apple, Dell, Samsung"
                    {...register('deviceBrand')}
                    className="w-full bg-[#1a1f33] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-white/30 outline-none focus:bg-[#1a1f33] focus:border-[#7a5cff] focus:ring-4 focus:ring-[#7a5cff]/10 transition-all" />
                </Field>
                <Field label="Model (optional)" error={errors.deviceModel?.message}>
                  <input placeholder="e.g. MacBook Pro 2023"
                    {...register('deviceModel')}
                    className="w-full bg-[#1a1f33] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-white/30 outline-none focus:bg-[#1a1f33] focus:border-[#7a5cff] focus:ring-4 focus:ring-[#7a5cff]/10 transition-all" />
                </Field>
              </div>

              {/* Problem */}
              <Field label="Problem Title" error={errors.problemTitle?.message}>
                <input placeholder="e.g. Cracked screen, won't turn on"
                  {...register('problemTitle')}
                  className="w-full bg-[#1a1f33] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-white/30 outline-none focus:bg-[#1a1f33] focus:border-[#7a5cff] focus:ring-4 focus:ring-[#7a5cff]/10 transition-all" />
              </Field>

              <Field label="Problem Description" error={errors.problemDescription?.message}
                hint="Describe the issue in detail (minimum 20 characters)">
                <textarea rows={4} placeholder="Tell us what's happening with your device..."
                  {...register('problemDescription')}
                  className="w-full bg-[#1a1f33] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-white/30 outline-none focus:bg-[#1a1f33] focus:border-[#7a5cff] focus:ring-4 focus:ring-[#7a5cff]/10 transition-all resize-none" />
              </Field>

              {/* Technician */}
              <Field label="Select Technician" error={errors.technicianId?.message}>
                <div className="relative">
                  <select
                    {...register('technicianId')}
                    onChange={(e) => {
                      register('technicianId').onChange(e);
                      setSelectedTechnicianId(e.target.value);
                      setValue('preferredTimeSlot', '');
                    }}
                    className="w-full bg-[#1a1f33] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-[15px] text-white outline-none focus:bg-[#1a1f33] focus:border-[#7a5cff] focus:ring-4 focus:ring-[#7a5cff]/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a technician</option>
                    {technicians.map((tech) => (
                      <option key={tech._id} value={tech._id}>
                        {tech.firstName} {tech.lastName || ''} - {(tech.expertise || []).join(', ') || 'General'}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </Field>

              {/* Time Slots */}
              {selectedTechnicianId && slots.length > 0 && (
                <Field label="Available Appointments" error={errors.preferredTimeSlot?.message}>
                  <div className="relative">
                    <select
                      {...register('preferredTimeSlot')}
                      className="w-full bg-[#1a1f33] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-[15px] text-white outline-none focus:bg-[#1a1f33] focus:border-[#7a5cff] focus:ring-4 focus:ring-[#7a5cff]/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select an available date & time</option>
                      {slots.map((slot) => {
                        const dateStr = new Date(slot.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                        return (
                          <option key={slot._id} value={slot._id} disabled={!slot.isAvailable}>
                            {dateStr} — {slot.startTime} to {slot.endTime} {!slot.isAvailable ? '(Unavailable)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </Field>
              )}
              {selectedTechnicianId && slots.length === 0 && (
                <p className="text-[12px] text-[#ff9aad]">No available slots for this technician.</p>
              )}

              <button type="submit" disabled={bookMut.isPending}
                className="w-full py-4 mt-2 bg-[#00f5d4] hover:bg-[#00f5d4]/90 disabled:opacity-60 text-[#0b0f1d] rounded-full text-[15px] font-bold transition-all shadow-[0_0_20px_rgba(0,245,212,0.25)] hover:shadow-[0_0_25px_rgba(0,245,212,0.4)] active:scale-[0.98]">
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
