import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ShoppingBag, ChevronRight, Lock, User, ArrowLeft, CheckCircle, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import InputField from '../components/ui/InputField';
import LocationPicker from '../components/ui/LocationPicker';

// ─── Validation Schema ───────────────────────────────────────
const checkoutSchema = yup.object({
  firstName: yup.string().trim().required('First name is required'),
  lastName:  yup.string().trim().required('Last name is required'),
  email: yup
    .string()
    .required('Email is required')
    .test('is-gmail', 'Only @gmail.com emails are accepted', (val) => {
      if (!val) return false;
      // Must end with @gmail.com
      if (!val.toLowerCase().endsWith('@gmail.com')) return false;
      // Part before @ must be valid: 6-30 chars, letters/digits/dots only, no consecutive dots, not start/end with dot
      const localPart = val.split('@')[0];
      if (!localPart || localPart.length < 6 || localPart.length > 30) return false;
      if (!/^[a-zA-Z0-9.]+$/.test(localPart)) return false;
      if (/\.\./.test(localPart)) return false;
      if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
      return true;
    }),
  phone: yup
    .string()
    .required('Phone number is required')
    .test('pk-phone', 'Enter a valid Pakistani phone number', (val) => {
      if (!val) return false;
      const cleaned = val.replace(/[\s\-()]/g, '');
      // +92 format: +92 followed by 10 digits (3xx...)
      if (cleaned.startsWith('+92')) {
        return /^\+92[3][0-9]{9}$/.test(cleaned);
      }
      // Local format: 03xx followed by 8 digits = 11 digits total
      if (cleaned.startsWith('0')) {
        return /^0[3][0-9]{9}$/.test(cleaned);
      }
      return false;
    }),
  address: yup.string().trim().min(5, 'Enter your full street address').required('Address is required'),
  city:    yup.string().trim().required('City is required'),
  state:   yup.string().trim(),
  zip:     yup.string().trim(),
  country: yup.string().trim().required('Country is required'),
});

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [placing, setPlacing] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const { data: paymentSettings } = useQuery({
    queryKey: ['payment-settings'],
    queryFn: () => api.get('/payment-settings').then(r => r.data.data ?? r.data),
  });

  // ─── Address Autocomplete State ──────────────────────
  const [addressQuery, setAddressQuery] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressDropdownRef = useRef(null);
  const debounceRef = useRef(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: isAuthenticated && user ? {
      firstName: user.firstName || '',
      lastName:  user.lastName  || '',
      email:     user.email     || '',
      phone:     user.phoneNo   || '',
    } : {},
  });

  // ─── Address Autocomplete — Nominatim (OpenStreetMap, free, no key) ──────
  const fetchAddressSuggestions = useCallback(async (query) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setAddressSuggestions(data);
    } catch {
      setAddressSuggestions([]);
    }
  }, []);

  const handleAddressInput = (e) => {
    const val = e.target.value;
    setAddressQuery(val);
    setValue('address', val, { shouldValidate: false });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchAddressSuggestions(val);
      setShowSuggestions(true);
    }, 350);
  };

  const selectAddress = (suggestion) => {
    const addr = suggestion.address || {};
    const street = [addr.road, addr.house_number, addr.neighbourhood, addr.suburb].filter(Boolean).join(', ') || suggestion.display_name?.split(',').slice(0, 2).join(',');

    setValue('address', street, { shouldValidate: true });
    setAddressQuery(street);
    setValue('city', addr.city || addr.town || addr.village || addr.county || '', { shouldValidate: true });
    setValue('state', addr.state || addr.state_district || '', { shouldValidate: true });
    setValue('zip', addr.postcode || '', { shouldValidate: true });
    setValue('country', addr.country || '', { shouldValidate: true });

    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addressDropdownRef.current && !addressDropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Empty cart → redirect back
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-6 ds-card p-10 max-w-[520px] w-full">
          <div className="w-16 h-16 bg-white/[0.06] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-white/25" strokeWidth={1.5} />
          </div>
          <h2 className="text-[20px] font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-[13px] text-white/45 mb-6">Add some products before checking out.</p>
          <Link to="/products"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl text-[14px] font-semibold ds-btn-primary transition-all">
            Browse Products <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
          </Link>
        </div>
      </div>
    );
  }

  // ─── Submit Handler ─────────────────────────────
  const onSubmit = async (formData) => {
    setPlacing(true);
    try {
      const payload = {
        contact: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
          ...(locationCoords ? { lat: locationCoords.lat, lng: locationCoords.lng } : {}),
        },
        paymentMethod,
      };

      if (isAuthenticated) {
        // Authenticated flow: sync cart to backend then create order
        try {
          await api.delete('/cart/clear');
        } catch (err) {
          // ignore
        }

        for (const item of items) {
          await api.post('/cart/add', { productId: item.productId, quantity: item.quantity });
        }

        const { data } = await api.post('/orders/create', payload);
        const order = data.data ?? data;
        clearCart();
        navigate(`/order-success?orderId=${order._id}`);
      } else {
        // Guest flow: send cart items directly
        payload.items = items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

        const { data } = await api.post('/orders/guest', payload);
        const order = data.data ?? data;
        clearCart();
        navigate(`/order-success?orderId=${order._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen">
      <div className="apple-section-wide py-8 sm:py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-[13px] text-white/70 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/[0.06] mb-6"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} /> Back
        </button>

        <div className="ds-shell p-3 sm:p-4">
          <div className="ds-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-[22px] sm:text-[28px] font-extrabold tracking-[-0.03em] text-white leading-tight">Checkout</h1>
                <p className="text-[13px] text-white/45 mt-1">Review your details and place your order securely.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[12px] text-white/55">
                <Lock className="w-4 h-4" strokeWidth={1.75} /> Secure Checkout
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">

                {/* ─── Left — Contact + Shipping ─── */}
                <div className="space-y-5">

                  {/* Guest notice */}
                  {!isAuthenticated && (
                    <div className="ds-card p-4 border border-[#2d8cff]/30">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#2d8cff]/15 border border-[#2d8cff]/35 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-[#93c5ff]" strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-white">Checking out as Guest</p>
                          <p className="text-[13px] text-white/50 mt-0.5">
                            No account needed! Fill in your details below to place your order.
                            {' '}
                            <Link to="/login?redirect=/checkout" className="text-[#d7ccff] font-semibold hover:text-white transition-colors">
                              Or sign in
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact */}
                  <div className="ds-card p-5 sm:p-6">
                    <h2 className="text-[15px] font-semibold text-white mb-5">Contact Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField label="First Name" name="firstName" placeholder="John" register={register} error={errors.firstName?.message} />
                      <InputField label="Last Name" name="lastName" placeholder="Doe" register={register} error={errors.lastName?.message} />
                      <InputField label="Email" type="email" name="email" placeholder="you@gmail.com" register={register} error={errors.email?.message} />
                      <InputField label="Phone" type="tel" name="phone" placeholder="0300 1234567" register={register} error={errors.phone?.message} />
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="ds-card p-5 sm:p-6">
                    <h2 className="text-[15px] font-semibold text-white mb-5">Shipping Address</h2>
                    <div className="space-y-4">
                      {/* Location Picker */}
                      <LocationPicker
                        onLocationSelect={(loc) => {
                          setLocationCoords({ lat: loc.lat, lng: loc.lng });
                          if (loc.address) {
                            setValue('address', loc.address, { shouldValidate: true });
                            setAddressQuery(loc.address);
                          }
                          if (loc.city) setValue('city', loc.city, { shouldValidate: true });
                          if (loc.state) setValue('state', loc.state, { shouldValidate: true });
                          if (loc.zip) setValue('zip', loc.zip, { shouldValidate: true });
                          if (loc.country) setValue('country', loc.country, { shouldValidate: true });
                        }}
                      />
                      {/* Address with autocomplete */}
                      <div ref={addressDropdownRef} className="relative">
                        <label htmlFor="address" className="text-[11px] font-semibold text-white/45 uppercase tracking-[0.08em] block mb-2">
                          Street Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" strokeWidth={1.5} />
                          <input
                            id="address"
                            type="text"
                            placeholder="Start typing your address..."
                            value={addressQuery}
                            onChange={handleAddressInput}
                            onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                            autoComplete="off"
                            className={`
                              w-full rounded-xl border text-[14px] text-white font-medium tracking-[-0.01em] outline-none
                              placeholder:text-white/35 transition-all duration-200 ease-out
                              bg-[#1c2340] pl-10 pr-4
                              focus:border-[#a894ff] focus:ring-[4px] focus:ring-[#8f74ff]/20 focus:bg-[#242c4b]
                              ${errors.address ? 'border-[#ff5e7d]/70' : 'border-[#7a5cff]/25 hover:border-[#9a84ff]/45'}
                            `}
                            style={{ padding: '12px 14px 12px 40px' }}
                            {...register('address', {
                              onChange: handleAddressInput,
                            })}
                          />
                        </div>
                        {errors.address && (
                          <div className="flex items-center gap-1.5 mt-2 animate-fade-in">
                            <span className="text-[12px] text-[#ff9aad] font-medium leading-tight">{errors.address.message}</span>
                          </div>
                        )}

                        {/* Suggestions Dropdown */}
                        {showSuggestions && addressSuggestions.length > 0 && (
                          <div className="absolute z-50 top-full mt-2 left-0 right-0 bg-[#141a2c] border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.45)] overflow-hidden">
                            {addressSuggestions.map((s) => (
                              <button
                                key={s.place_id}
                                type="button"
                                onClick={() => selectAddress(s)}
                                className="w-full text-left px-4 py-3 text-[13px] text-white/80 hover:bg-white/[0.06] hover:text-white transition-colors border-b border-white/[0.05] last:border-0 flex items-start gap-3"
                              >
                                <MapPin className="w-4 h-4 text-[#a894ff] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                                <span className="line-clamp-2">{s.display_name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="City" name="city" placeholder="Lahore" register={register} error={errors.city?.message} />
                        <InputField label="State" name="state" placeholder="Punjab" register={register} error={errors.state?.message} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="Postal Code" name="zip" placeholder="54000" register={register} error={errors.zip?.message} />
                        <InputField label="Country" name="country" placeholder="Pakistan" register={register} error={errors.country?.message} />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="ds-card p-5 sm:p-6">
                    <h2 className="text-[15px] font-semibold text-white mb-5">Payment Method</h2>
                    
                    <div className="space-y-3">
                      {paymentSettings?.codEnabled && (
                        <label className={`
                          flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                          ${paymentMethod === 'cod' ? 'bg-[#7a5cff]/10 border-[#7a5cff]' : 'bg-[#1c2340] border-white/10 hover:border-white/20'}
                        `}>
                          <input type="radio" name="paymentMethod" value="cod"
                            checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-[#7a5cff] bg-[#141a2c] border-white/20 focus:ring-[#7a5cff]/30" />
                          <div>
                            <p className="text-[14px] font-semibold text-white">Cash on Delivery (COD)</p>
                            <p className="text-[12px] text-white/50">Pay when you receive your order</p>
                          </div>
                        </label>
                      )}

                      {paymentSettings?.jazzcashEnabled && (
                        <label className={`
                          flex flex-col gap-3 p-4 rounded-xl border cursor-pointer transition-all
                          ${paymentMethod === 'jazzcash' ? 'bg-[#7a5cff]/10 border-[#7a5cff]' : 'bg-[#1c2340] border-white/10 hover:border-white/20'}
                        `}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="paymentMethod" value="jazzcash"
                              checked={paymentMethod === 'jazzcash'} onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-4 h-4 text-[#7a5cff] bg-[#141a2c] border-white/20 focus:ring-[#7a5cff]/30" />
                            <div>
                              <p className="text-[14px] font-semibold text-white">JazzCash</p>
                              <p className="text-[12px] text-white/50">Pay via JazzCash and send screenshot</p>
                            </div>
                          </div>
                          {paymentMethod === 'jazzcash' && (
                            <div className="pl-7 mt-1 animate-fade-in space-y-3">
                              <div className="p-3 rounded-lg bg-[#141a2c] border border-white/5 text-[13px]">
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
                          ${paymentMethod === 'easypaisa' ? 'bg-[#7a5cff]/10 border-[#7a5cff]' : 'bg-[#1c2340] border-white/10 hover:border-white/20'}
                        `}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="paymentMethod" value="easypaisa"
                              checked={paymentMethod === 'easypaisa'} onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-4 h-4 text-[#7a5cff] bg-[#141a2c] border-white/20 focus:ring-[#7a5cff]/30" />
                            <div>
                              <p className="text-[14px] font-semibold text-white">EasyPaisa</p>
                              <p className="text-[12px] text-white/50">Pay via EasyPaisa and send screenshot</p>
                            </div>
                          </div>
                          {paymentMethod === 'easypaisa' && (
                            <div className="pl-7 mt-1 animate-fade-in space-y-3">
                              <div className="p-3 rounded-lg bg-[#141a2c] border border-white/5 text-[13px]">
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

                    </div>
                  </div>

                  {/* Place Order — mobile CTA */}
                  <button type="submit" disabled={placing}
                    className="lg:hidden w-full py-3.5 ds-btn-primary disabled:opacity-60 text-white rounded-xl text-[14px] font-semibold transition-all active:scale-[0.98]">
                    {placing ? 'Placing Order…' : <><CheckCircle className="w-4 h-4 inline mr-1.5" strokeWidth={2} /> Place Order</>}
                  </button>
                </div>

                {/* ─── Right — Order Summary ─── */}
                <div className="space-y-4">
                  <div className="ds-card p-5 sticky top-6">
                    <h2 className="text-[15px] font-semibold text-white mb-4">
                      Order Summary <span className="text-[12px] font-medium text-white/45">({itemCount} items)</span>
                    </h2>

                    {/* Items */}
                    <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 mb-4">
                      {items.map(item => (
                        <div key={item.productId} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/[0.04] border border-white/[0.06] rounded-xl flex-shrink-0 overflow-hidden">
                            {item.image
                              ? <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1" />
                              : <div className="w-full h-full" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-white line-clamp-1">{item.title}</p>
                            <p className="text-[12px] text-white/45">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-[13px] font-bold text-white flex-shrink-0">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/[0.08] pt-4 space-y-2">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-white/45">Subtotal</span>
                        <span className="text-white font-semibold">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-white/45">Shipping</span>
                        <span className="text-green-300 font-semibold">Free</span>
                      </div>
                      <div className="flex justify-between text-[16px] font-bold pt-2 border-t border-white/[0.08]">
                        <span className="text-white">Total</span>
                        <span className="text-white">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}
                        </span>
                      </div>
                    </div>

                    {/* Place Order — desktop CTA */}
                    <button type="submit" disabled={placing}
                      className="hidden lg:flex items-center justify-center gap-2 w-full mt-5 py-3.5 ds-btn-primary disabled:opacity-60 text-white rounded-xl text-[14px] font-semibold transition-all active:scale-[0.98]">
                      {placing
                        ? 'Placing Order…'
                        : <><CheckCircle className="w-4 h-4" strokeWidth={2} /> Place Order</>
                      }
                    </button>

                    <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-white/35">
                      <Lock className="w-3 h-3" strokeWidth={1.75} /> Secured checkout
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
