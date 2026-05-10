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

// ─── Fetchers ────────────────────────────────────────────────
const fetchSlots = (date) =>
  api.get('/time-slots/', { params: { date } }).then(r => r.data.data ?? r.data);

// ─── Schema ──────────────────────────────────────────────────
const schema = yup.object({
  problemTitle:       yup.string().min(5, 'Min 5 characters').required('Problem title is required'),
  problemDescription: yup.string().min(20, 'Min 20 characters').required('Description is required'),
  deviceType:         yup.string().oneOf(['laptop','desktop','mobile','tablet','other']).required('Select a device type'),
  deviceBrand:        yup.string().optional(),
  deviceModel:        yup.string().optional(),
  preferredDate:      yup.string().required('Select a date'),
  preferredTimeSlot:  yup.string().optional(),
});

const DEVICE_TYPES = [
  { key: 'laptop',  label: 'Laptop',  icon: Laptop },
  { key: 'desktop', label: 'Desktop', icon: Monitor },
  { key: 'mobile',  label: 'Phone',   icon: Smartphone },
  { key: 'tablet',  label: 'Tablet',  icon: Tablet },
  { key: 'other',   label: 'Other',   icon: Package },
];

const SERVICES = [
  { title: 'Screen Repair', desc: 'Cracked or broken display', icon: '📱', price: 'From $49' },
  { title: 'Battery Replacement', desc: 'Restore battery life', icon: '🔋', price: 'From $39' },
  { title: 'Data Recovery', desc: 'Recover lost or corrupted files', icon: '💾', price: 'From $79' },
  { title: 'Hardware Upgrade', desc: 'RAM, SSD & performance upgrades', icon: '⚡', price: 'From $59' },
  { title: 'Virus Removal', desc: 'Clean malware and secure your device', icon: '🛡️', price: 'From $49' },
  { title: 'Diagnostics', desc: 'Full device health check', icon: '🔍', price: 'From $29' },
];

// ─── Field ───────────────────────────────────────────────────
function Field({ label, error, children, hint }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#1D1D1F] mb-1.5">{label}</label>
      {hint && <p className="text-[12px] text-[#86868B] mb-1.5">{hint}</p>}
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

  const { data: slotsData } = useQuery({
    queryKey: ['time-slots', selectedDate],
    queryFn: () => fetchSlots(selectedDate),
    enabled: !!selectedDate,
    staleTime: 60_000,
  });
  const slots = Array.isArray(slotsData) ? slotsData : (slotsData?.slots ?? slotsData?.timeSlots ?? []);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { deviceType: '' },
  });

  const deviceType = watch('deviceType');

  const bookMut = useMutation({
    mutationFn: (body) => api.post('/bookings/', body).then(r => r.data),
    onSuccess: () => {
      toast.success('Booking submitted! We\'ll confirm shortly.');
      navigate('/account/bookings');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit booking.'),
  });

  // Minimum date: tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="bg-white min-h-screen">

      {/* ─── Hero ─── */}
      <section className="pt-16 pb-12 bg-[#1D1D1F] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,113,227,0.15)_0%,_transparent_70%)]" />
        <div className="apple-section relative z-10">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
            <Wrench className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-[44px] sm:text-[56px] font-bold tracking-[-0.04em] text-white leading-tight mb-4">
            Expert Repair Services.
          </h1>
          <p className="text-[19px] text-white/60 font-medium max-w-lg mx-auto mb-8">
            Certified technicians. Genuine parts. Same-day service available.
          </p>
          <button
            onClick={() => {
              if (!isAuthenticated) { toast.error('Please sign in to book a repair.'); navigate('/login'); return; }
              setShowForm(true);
              setTimeout(() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1D1D1F] rounded-full text-[17px] font-semibold hover:bg-[#F5F5F7] hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
          >
            Book a Repair <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </section>

      {/* ─── Services Grid ─── */}
      <section className="py-16 sm:py-20">
        <div className="apple-section-wide">
          <div className="text-center mb-12">
            <h2 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-3">What we fix.</h2>
            <p className="text-[17px] text-[#86868B]">Professional repairs for all major devices.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {SERVICES.map(s => (
              <div key={s.title} className="bg-[#F5F5F7] rounded-2xl p-6 hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border hover:border-[#E8E8ED] transition-all group">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="text-[17px] font-semibold text-[#1D1D1F] mb-1">{s.title}</h3>
                <p className="text-[14px] text-[#86868B] mb-3">{s.desc}</p>
                <p className="text-[14px] font-semibold text-[#0071E3]">{s.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Booking Form ─── */}
      {showForm && (
        <section id="booking-form" className="py-16 bg-[#F5F5F7]">
          <div className="apple-section-wide max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-2">Book a Repair</h2>
              <p className="text-[15px] text-[#86868B]">Fill in the details below and we'll get back to you shortly.</p>
            </div>

            <form onSubmit={handleSubmit((data) => bookMut.mutate(data))} className="space-y-6">

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
                    className="w-full bg-white border border-[#D2D2D7] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" />
                </Field>
                <Field label="Model (optional)" error={errors.deviceModel?.message}>
                  <input placeholder="e.g. MacBook Pro 2023"
                    {...register('deviceModel')}
                    className="w-full bg-white border border-[#D2D2D7] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" />
                </Field>
              </div>

              {/* Problem */}
              <Field label="Problem Title" error={errors.problemTitle?.message}>
                <input placeholder="e.g. Cracked screen, won't turn on"
                  {...register('problemTitle')}
                  className="w-full bg-white border border-[#D2D2D7] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" />
              </Field>

              <Field label="Problem Description" error={errors.problemDescription?.message}
                hint="Describe the issue in detail (minimum 20 characters)">
                <textarea rows={4} placeholder="Tell us what's happening with your device..."
                  {...register('problemDescription')}
                  className="w-full bg-white border border-[#D2D2D7] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all resize-none" />
              </Field>

              {/* Date */}
              <Field label="Preferred Date" error={errors.preferredDate?.message}>
                <input type="date" min={minDateStr}
                  {...register('preferredDate')}
                  onChange={(e) => { register('preferredDate').onChange(e); setSelectedDate(e.target.value); }}
                  className="w-full bg-white border border-[#D2D2D7] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" />
              </Field>

              {/* Time Slots */}
              {slots.length > 0 && (
                <Field label="Preferred Time Slot (optional)" error={errors.preferredTimeSlot?.message}>
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

              <button type="submit" disabled={bookMut.isPending}
                className="w-full py-4 bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-60 text-white rounded-full text-[17px] font-semibold transition-all">
                {bookMut.isPending ? 'Submitting…' : 'Submit Booking Request'}
              </button>
            </form>
          </div>
        </section>
      )}

    </div>
  );
}
