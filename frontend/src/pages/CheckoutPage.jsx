import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ShoppingBag, ChevronRight, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import InputField from '../components/ui/InputField';

// ─── Validation ───────────────────────────────────────────────
const guestSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName:  yup.string().required('Last name is required'),
  email:     yup.string().email('Enter a valid email').required('Email is required'),
  phone:     yup.string().min(7, 'Enter a valid phone number').required('Phone is required'),
  address:   yup.string().min(5, 'Enter your street address').required('Address is required'),
  city:      yup.string().required('City is required'),
  country:   yup.string().required('Country is required'),
});

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, subtotal } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [placing, setPlacing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(guestSchema),
    defaultValues: isAuthenticated && user ? {
      firstName: user.firstName || '',
      lastName:  user.lastName  || '',
      email:     user.email     || '',
      phone:     user.phoneNo   || '',
    } : {},
  });

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

  const onSubmit = async (formData) => {
    if (!isAuthenticated) {
      // Guest: store checkout info in sessionStorage and redirect to login
      sessionStorage.setItem('checkout-intent', JSON.stringify(formData));
      toast('Please sign in to place your order — your cart is saved!', { icon: '🔑', duration: 4000 });
      navigate('/login?redirect=/checkout');
      return;
    }

    setPlacing(true);
    try {
      // Authenticated: sync cart to backend then create order
      // First: push each local cart item to backend cart
      for (const item of items) {
        await api.post('/cart/', { productId: item.productId, quantity: item.quantity });
      }
      // Then: create order from backend cart
      const { data } = await api.post('/orders/create');
      const order = data.data ?? data;
      clearCart();
      navigate(`/order-success?orderId=${order._id}`);
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
                          <p className="text-[14px] font-semibold text-white">No account? No problem.</p>
                          <p className="text-[13px] text-white/50 mt-0.5">
                            Fill in details below. You'll be asked to sign in at the final step.
                            {' '}
                            <Link to="/login?redirect=/checkout" className="text-[#d7ccff] font-semibold hover:text-white transition-colors">
                              Sign in now
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
                      <InputField label="Email" type="email" name="email" placeholder="you@example.com" register={register} error={errors.email?.message} />
                      <InputField label="Phone" type="tel" name="phone" placeholder="0300 1234567" register={register} error={errors.phone?.message} />
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="ds-card p-5 sm:p-6">
                    <h2 className="text-[15px] font-semibold text-white mb-5">Shipping Address</h2>
                    <div className="space-y-4">
                      <InputField label="Street Address" name="address" placeholder="Street, house, area" register={register} error={errors.address?.message} />
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

                  {/* Place Order — mobile CTA */}
                  <button type="submit" disabled={placing}
                    className="lg:hidden w-full py-3.5 ds-btn-primary disabled:opacity-60 text-white rounded-xl text-[14px] font-semibold transition-all active:scale-[0.98]">
                    {placing ? 'Placing Order…' : isAuthenticated ? 'Place Order' : 'Continue to Sign In →'}
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
                      {placing ? 'Placing Order…' : isAuthenticated
                        ? <><CheckCircle className="w-4 h-4" strokeWidth={2} /> Place Order</>
                        : <>Continue to Sign In <ChevronRight className="w-4 h-4" strokeWidth={2.25} /></>
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
