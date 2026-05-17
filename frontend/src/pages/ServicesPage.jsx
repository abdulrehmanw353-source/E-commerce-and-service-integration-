import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ChevronRight, Laptop, Smartphone, Monitor, Tablet, Package, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { useServices } from '../hooks/useServices';
import LocationPicker from '../components/ui/LocationPicker';

// ─── Schema ──────────────────────────────────────────────────
const schema = yup.object({
  problemTitle: yup.string().min(5, 'Min 5 characters').required('Problem title is required'),
  problemDescription: yup.string().min(20, 'Min 20 characters').required('Description is required'),
  deviceType: yup.string().oneOf(['laptop', 'desktop', 'mobile', 'tablet', 'other']).required('Select a device type'),
  deviceBrand: yup.string().optional(),
  deviceModel: yup.string().optional(),
  preferredDate: yup.string().required('Please select a date'),
  preferredTime: yup.string().required('Please select a time'),
  paymentMethod: yup.string().oneOf(['cod', 'jazzcash', 'easypaisa', 'bank_transfer']).required('Select a payment method'),
});

const DEVICE_TYPES = [
  { key: 'laptop', label: 'Laptop', icon: Laptop },
  { key: 'desktop', label: 'Desktop', icon: Monitor },
  { key: 'mobile', label: 'Phone', icon: Smartphone },
  { key: 'tablet', label: 'Tablet', icon: Tablet },
  { key: 'other', label: 'Other', icon: Package },
];

// Removed static PAYMENT_METHODS as we will use dynamic paymentSettings

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
  const [bookingLocation, setBookingLocation] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(150);

  // ─── useForm MUST be declared before any useQuery that references `watch` ───
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { deviceType: '', paymentMethod: 'cod' },
  });

  const preferredDate = watch('preferredDate');
  const paymentMethod = watch('paymentMethod');

  // ─── Data fetching ─────────────────────────────────────────
  const { data: servicesData, isLoading: servicesLoading } = useServices();
  const services = Array.isArray(servicesData) ? servicesData : (servicesData?.services || []);

  const filteredServices = services.filter((s) => {
    if (selectedCategories.length > 0) {
      const normalizedTitle = s.title === "PC Build & Repair" ? "PC Builds & Repair" : s.title;
      if (!selectedCategories.includes(normalizedTitle)) return false;
    }
    const price = typeof s.startingPrice === 'number' ? s.startingPrice : s.price || 0;
    if (price > maxPrice) return false;
    return true;
  });

  const { data: slotsData } = useQuery({
    queryKey: ['time-slots', preferredDate],
    queryFn: () => api.get('/time-slots/available', { params: { date: preferredDate } }).then(r => r.data.data ?? r.data),
    enabled: !!preferredDate,
    staleTime: 60_000,
  });
  const slots = Array.isArray(slotsData) ? slotsData : (slotsData?.slots ?? []);

  const { data: paymentSettings } = useQuery({
    queryKey: ['payment-settings'],
    queryFn: () => api.get('/payment-settings').then(r => r.data.data ?? r.data),
  });

  const { data: serviceSettingsData } = useQuery({
    queryKey: ['service-settings'],
    queryFn: () => api.get('/service-settings/').then(r => r.data.data ?? r.data),
  });
  const serviceSettings = serviceSettingsData || {};

  const isLocationAllowed = () => {
    if (!bookingLocation) return true; // wait until they select
    if (serviceSettings.isServiceActive === false) return false;

    const { address, city, state, country } = bookingLocation;
    
    const isMatch = (allowedList, value1, value2) => {
      if (!allowedList || allowedList.length === 0) return true;
      const str1 = (value1 || '').toLowerCase();
      const str2 = (value2 || '').toLowerCase();
      return allowedList.some(allowed => {
        const allowedLower = allowed.toLowerCase();
        return str1.includes(allowedLower) || str2.includes(allowedLower);
      });
    };

    if (!isMatch(serviceSettings.allowedCities, city, address)) return false;
    if (!isMatch(serviceSettings.allowedStates, state, address)) return false;
    if (!isMatch(serviceSettings.allowedCountries, country, address)) return false;

    return true;
  };

  const bookMut = useMutation({
    mutationFn: (body) => {
      if (bookingLocation) {
        body.location = bookingLocation;
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
                {['Phone Repair', 'Laptop Repair', 'PC Builds & Repair', 'Tablet Repair', 'Data Recovery'].map((c) => {
                  const isSelected = selectedCategories.includes(c);
                  return (
                    <div
                      key={c}
                      onClick={() => {
                        if (isSelected) setSelectedCategories(prev => prev.filter(cat => cat !== c));
                        else setSelectedCategories(prev => [...prev, c]);
                      }}
                      className={`px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${isSelected
                          ? 'border-[#8b72ff] text-white bg-[#8b72ff]/10'
                          : 'border-white/10 text-white/85 bg-white/[0.02] hover:bg-white/[0.05]'
                        }`}
                    >
                      {c}
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white font-semibold mb-3">Filter Options</p>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white/65 text-sm">Price</p>
                  <p className="text-white text-sm font-semibold">${maxPrice}</p>
                </div>
                <input
                  type="range"
                  min="0" max="300" step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full my-3 appearance-none cursor-pointer accent-[#8b72ff]"
                />
              </div>
            </aside>

            <div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {(servicesLoading ? Array.from({ length: 6 }).map((_, i) => ({ _skeleton: true, i })) : filteredServices).map((s, i) => (
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
                          if (serviceSettings.isServiceActive === false) { toast.error('Service is currently inactive.'); return; }
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

                {/* Preferred Date */}
                <Field label="Preferred Date" error={errors.preferredDate?.message}>
                  <input
                    type="date"
                    {...register('preferredDate')}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#1a1f33] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-[15px] text-white outline-none focus:bg-[#1a1f33] focus:border-[#7a5cff] focus:ring-4 focus:ring-[#7a5cff]/10 transition-all appearance-none cursor-pointer"
                  />
                </Field>

                {/* Time Slots */}
                {preferredDate && slots.length > 0 && (
                  <Field label="Available Appointments" error={errors.preferredTime?.message}>
                    <div className="relative">
                      <select
                        {...register('preferredTime')}
                        className="w-full bg-[#1a1f33] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-[15px] text-white outline-none focus:bg-[#1a1f33] focus:border-[#7a5cff] focus:ring-4 focus:ring-[#7a5cff]/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select an available time</option>
                        {slots.map((slot) => (
                          <option key={slot.time} value={slot.time}>
                            {slot.time} (Available Capacity: {slot.availableCapacity})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </Field>
                )}
                {preferredDate && slots.length === 0 && (
                  <p className="text-[12px] text-[#ff9aad]">No available slots for this date. Please select another date.</p>
                )}

                {/* Payment Method */}
                <div className="space-y-3 mt-6">
                  <h3 className="text-[14px] font-semibold text-white/90">Payment Method</h3>
                  
                  {serviceSettings.defaultPaymentModeRule === 'advance_required' || serviceSettings.defaultPaymentModeRule === 'partial_advance' ? (
                    <div className="p-3 bg-[#ff9aad]/10 border border-[#ff9aad]/20 rounded-xl mb-4">
                      <p className="text-[13px] text-[#ff9aad] font-semibold mb-1">Advance Payment Required</p>
                      <p className="text-[12px] text-white/70">
                        {serviceSettings.defaultPaymentModeRule === 'partial_advance' 
                          ? `A partial advance of ${serviceSettings.advancePaymentPercentage || 0}% is required to confirm your booking.` 
                          : 'Please complete the advance payment and send a screenshot for verification.'}
                      </p>
                    </div>
                  ) : null}

                  {errors.paymentMethod && (
                    <p className="text-[12px] text-[#ff9aad]">{errors.paymentMethod.message}</p>
                  )}

                  {paymentSettings?.codEnabled && (
                    <label className={`
                      flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                      ${paymentMethod === 'cod' ? 'bg-[#7a5cff]/10 border-[#7a5cff]' : 'bg-[#1a1f33] border-white/10 hover:border-white/20'}
                    `}>
                      <input type="radio" value="cod" {...register('paymentMethod')}
                        className="w-4 h-4 text-[#7a5cff] bg-[#0b0f1d] border-white/20 focus:ring-[#7a5cff]/30" />
                      <div>
                        <p className="text-[14px] font-semibold text-white">Cash / Pay Later</p>
                        <p className="text-[12px] text-white/60">Pay after inspection or service completion</p>
                      </div>
                    </label>
                  )}

                  {paymentSettings?.jazzcashEnabled && (
                    <label className={`
                      flex flex-col gap-3 p-4 rounded-xl border cursor-pointer transition-all
                      ${paymentMethod === 'jazzcash' ? 'bg-[#7a5cff]/10 border-[#7a5cff]' : 'bg-[#1a1f33] border-white/10 hover:border-white/20'}
                    `}>
                      <div className="flex items-center gap-3">
                        <input type="radio" value="jazzcash" {...register('paymentMethod')}
                          className="w-4 h-4 text-[#7a5cff] bg-[#0b0f1d] border-white/20 focus:ring-[#7a5cff]/30" />
                        <div>
                          <p className="text-[14px] font-semibold text-white">JazzCash</p>
                          <p className="text-[12px] text-white/60">Pay via JazzCash and send screenshot</p>
                        </div>
                      </div>
                      {paymentMethod === 'jazzcash' && (
                        <div className="pl-7 mt-1 animate-fade-in space-y-3">
                          <div className="p-3 rounded-lg bg-[#0b0f1d] border border-white/5 text-[13px]">
                            <p className="text-white/60 mb-1">Send payment to:</p>
                            <p className="text-white font-semibold">{paymentSettings.jazzcashAccountName}</p>
                            <p className="text-[#00f5d4] font-bold text-[16px] mt-0.5 tracking-wide">{paymentSettings.jazzcashAccountNumber}</p>
                          </div>
                          {paymentSettings.whatsappNumber && (
                            <a href={`https://wa.me/${paymentSettings.whatsappNumber.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-lg text-[13px] font-semibold transition-colors">
                              Open WhatsApp to send screenshot
                            </a>
                          )}
                          {paymentSettings.paymentInstructions && (
                            <p className="text-[12px] text-[#ff9aad] italic">{paymentSettings.paymentInstructions}</p>
                          )}
                        </div>
                      )}
                    </label>
                  )}

                  {paymentSettings?.easypaisaEnabled && (
                    <label className={`
                      flex flex-col gap-3 p-4 rounded-xl border cursor-pointer transition-all
                      ${paymentMethod === 'easypaisa' ? 'bg-[#7a5cff]/10 border-[#7a5cff]' : 'bg-[#1a1f33] border-white/10 hover:border-white/20'}
                    `}>
                      <div className="flex items-center gap-3">
                        <input type="radio" value="easypaisa" {...register('paymentMethod')}
                          className="w-4 h-4 text-[#7a5cff] bg-[#0b0f1d] border-white/20 focus:ring-[#7a5cff]/30" />
                        <div>
                          <p className="text-[14px] font-semibold text-white">EasyPaisa</p>
                          <p className="text-[12px] text-white/60">Pay via EasyPaisa and send screenshot</p>
                        </div>
                      </div>
                      {paymentMethod === 'easypaisa' && (
                        <div className="pl-7 mt-1 animate-fade-in space-y-3">
                          <div className="p-3 rounded-lg bg-[#0b0f1d] border border-white/5 text-[13px]">
                            <p className="text-white/60 mb-1">Send payment to:</p>
                            <p className="text-white font-semibold">{paymentSettings.easypaisaAccountName}</p>
                            <p className="text-[#00f5d4] font-bold text-[16px] mt-0.5 tracking-wide">{paymentSettings.easypaisaAccountNumber}</p>
                          </div>
                          {paymentSettings.whatsappNumber && (
                            <a href={`https://wa.me/${paymentSettings.whatsappNumber.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-lg text-[13px] font-semibold transition-colors">
                              Open WhatsApp to send screenshot
                            </a>
                          )}
                          {paymentSettings.paymentInstructions && (
                            <p className="text-[12px] text-[#ff9aad] italic">{paymentSettings.paymentInstructions}</p>
                          )}
                        </div>
                      )}
                    </label>
                  )}

                  {paymentSettings?.bankEnabled && (
                    <label className={`
                      flex flex-col gap-3 p-4 rounded-xl border cursor-pointer transition-all
                      ${paymentMethod === 'bank_transfer' ? 'bg-[#7a5cff]/10 border-[#7a5cff]' : 'bg-[#1a1f33] border-white/10 hover:border-white/20'}
                    `}>
                      <div className="flex items-center gap-3">
                        <input type="radio" value="bank_transfer" {...register('paymentMethod')}
                          className="w-4 h-4 text-[#7a5cff] bg-[#0b0f1d] border-white/20 focus:ring-[#7a5cff]/30" />
                        <div>
                          <p className="text-[14px] font-semibold text-white">Bank Transfer</p>
                          <p className="text-[12px] text-white/60">Direct bank transfer and send screenshot</p>
                        </div>
                      </div>
                      {paymentMethod === 'bank_transfer' && (
                        <div className="pl-7 mt-1 animate-fade-in space-y-3">
                          <div className="p-3 rounded-lg bg-[#0b0f1d] border border-white/5 text-[13px]">
                            <p className="text-white/60 mb-1">Bank Name: <span className="text-white">{paymentSettings.bankName}</span></p>
                            <p className="text-white/60 mb-1">Account Title: <span className="text-white">{paymentSettings.bankAccountName}</span></p>
                            <p className="text-[#00f5d4] font-bold text-[16px] mt-0.5 tracking-wide">{paymentSettings.bankAccountNumber}</p>
                            {paymentSettings.bankIBAN && <p className="text-white/60 mt-1">IBAN: <span className="text-white text-[11px]">{paymentSettings.bankIBAN}</span></p>}
                          </div>
                          {paymentSettings.whatsappNumber && (
                            <a href={`https://wa.me/${paymentSettings.whatsappNumber.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-lg text-[13px] font-semibold transition-colors">
                              Open WhatsApp to send screenshot
                            </a>
                          )}
                          {paymentSettings.paymentInstructions && (
                            <p className="text-[12px] text-[#ff9aad] italic">{paymentSettings.paymentInstructions}</p>
                          )}
                        </div>
                      )}
                    </label>
                  )}

                </div>

                {/* Location */}
                <Field label="Your Location" hint="Help our technician find you faster">
                  <LocationPicker
                    onLocationSelect={(loc) => {
                      setBookingLocation({
                        address: loc.address,
                        city: loc.city,
                        state: loc.state,
                        zip: loc.zip,
                        country: loc.country,
                        lat: loc.lat,
                        lng: loc.lng,
                      });
                    }}
                  />
                  {bookingLocation?.address && (
                    <div className="mt-2 flex items-start gap-2 p-3 rounded-xl bg-[#00f5d4]/5 border border-[#00f5d4]/15">
                      <MapPin className="w-4 h-4 text-[#00f5d4] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                      <p className="text-[13px] text-white/70 line-clamp-2">
                        {[bookingLocation.address, bookingLocation.city, bookingLocation.state, bookingLocation.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  )}
                  {bookingLocation && !isLocationAllowed() && (
                    <p className="text-[13px] text-[#ff5e7d] mt-2">
                      Service is not available in your area. Currently serving: {serviceSettings.allowedCities?.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}.
                    </p>
                  )}
                </Field>

                <button type="submit" disabled={bookMut.isPending || (bookingLocation && !isLocationAllowed())}
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
