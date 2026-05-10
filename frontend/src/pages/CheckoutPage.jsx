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

// ─── Helpers ─────────────────────────────────────────────────
function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#1D1D1F] mb-1.5">
        {label}{required && <span className="text-[#FF3B30] ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[12px] text-[#FF3B30] mt-1">{error}</p>}
    </div>
  );
}

const INPUT = "w-full bg-[#F5F5F7] border border-[#E8E8ED] rounded-xl px-4 py-3 text-[15px] text-[#1D1D1F] outline-none focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 transition-all placeholder:text-[#C7C7CC]";

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
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-[#D2D2D7]" strokeWidth={1.5} />
          </div>
          <h2 className="text-[21px] font-bold text-[#1D1D1F] mb-2">Your cart is empty</h2>
          <p className="text-[15px] text-[#86868B] mb-6">Add some products before checking out.</p>
          <Link to="/products"
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#0071E3] text-white rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-all">
            Browse Products <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
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
    <div className="bg-[#F5F5F7] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8ED]">
        <div className="apple-section-wide">
          <div className="flex items-center justify-between h-[52px]">
            <Link to="/" className="text-[17px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">TechStore</Link>
            <div className="flex items-center gap-1.5 text-[13px] text-[#86868B]">
              <Lock className="w-3.5 h-3.5" strokeWidth={1.75} /> Secure Checkout
            </div>
          </div>
        </div>
      </div>

      <div className="apple-section-wide py-8">
        <Link to="/" onClick={() => history.back()} className="inline-flex items-center gap-1.5 text-[14px] text-[#0071E3] hover:opacity-80 mb-6">
          <ArrowLeft className="w-4 h-4" strokeWidth={2} /> Back
        </Link>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">

            {/* ─── Left — Contact + Shipping ─── */}
            <div className="space-y-5">

              {/* Guest notice */}
              {!isAuthenticated && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                  <User className="w-5 h-5 text-[#0071E3] flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div>
                    <p className="text-[14px] font-semibold text-[#1D1D1F]">No account? No problem.</p>
                    <p className="text-[13px] text-[#86868B] mt-0.5">
                      Fill in your details below. You'll be asked to sign in at the final step to place your order.
                      Already have an account? <Link to="/login?redirect=/checkout" className="text-[#0071E3] hover:underline">Sign in now</Link>
                    </p>
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <h2 className="text-[17px] font-bold text-[#1D1D1F] mb-5">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name" required error={errors.firstName?.message}>
                    <input {...register('firstName')} placeholder="John" className={INPUT} />
                  </Field>
                  <Field label="Last Name" required error={errors.lastName?.message}>
                    <input {...register('lastName')} placeholder="Doe" className={INPUT} />
                  </Field>
                  <Field label="Email Address" required error={errors.email?.message}>
                    <input type="email" {...register('email')} placeholder="you@example.com" className={INPUT} />
                  </Field>
                  <Field label="Phone Number" required error={errors.phone?.message}>
                    <input type="tel" {...register('phone')} placeholder="+1 (555) 000-0000" className={INPUT} />
                  </Field>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <h2 className="text-[17px] font-bold text-[#1D1D1F] mb-5">Shipping Address</h2>
                <div className="space-y-4">
                  <Field label="Street Address" required error={errors.address?.message}>
                    <input {...register('address')} placeholder="123 Main Street, Apt 4B" className={INPUT} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="City" required error={errors.city?.message}>
                      <input {...register('city')} placeholder="New York" className={INPUT} />
                    </Field>
                    <Field label="State / Province" error={errors.state?.message}>
                      <input {...register('state')} placeholder="NY" className={INPUT} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Postal Code" error={errors.zip?.message}>
                      <input {...register('zip')} placeholder="10001" className={INPUT} />
                    </Field>
                    <Field label="Country" required error={errors.country?.message}>
                      <input {...register('country')} placeholder="United States" className={INPUT} />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Place Order — mobile CTA */}
              <button type="submit" disabled={placing}
                className="lg:hidden w-full py-4 bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-60 text-white rounded-full text-[17px] font-semibold transition-all active:scale-[0.98]">
                {placing ? 'Placing Order…' : isAuthenticated ? 'Place Order' : 'Continue to Sign In →'}
              </button>
            </div>

            {/* ─── Right — Order Summary ─── */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] sticky top-6">
                <h2 className="text-[17px] font-bold text-[#1D1D1F] mb-4">
                  Order Summary <span className="text-[14px] font-normal text-[#86868B]">({itemCount} items)</span>
                </h2>

                {/* Items */}
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 mb-4">
                  {items.map(item => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#F5F5F7] rounded-xl flex-shrink-0 overflow-hidden">
                        {item.image
                          ? <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1" />
                          : <div className="w-full h-full" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[#1D1D1F] line-clamp-1">{item.title}</p>
                        <p className="text-[12px] text-[#86868B]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-[14px] font-semibold text-[#1D1D1F] flex-shrink-0">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#F5F5F7] pt-4 space-y-2">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#86868B]">Subtotal</span>
                    <span className="text-[#1D1D1F] font-medium">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#86868B]">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-[17px] font-bold pt-2 border-t border-[#F5F5F7]">
                    <span className="text-[#1D1D1F]">Total</span>
                    <span className="text-[#1D1D1F]">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}
                    </span>
                  </div>
                </div>

                {/* Place Order — desktop CTA */}
                <button type="submit" disabled={placing}
                  className="hidden lg:flex items-center justify-center gap-2 w-full mt-5 py-4 bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-60 text-white rounded-full text-[16px] font-semibold transition-all active:scale-[0.98]">
                  {placing ? 'Placing Order…' : isAuthenticated
                    ? <><CheckCircle className="w-4 h-4" strokeWidth={2} /> Place Order</>
                    : <>Continue to Sign In <ChevronRight className="w-4 h-4" strokeWidth={2.5} /></>
                  }
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-3 text-[12px] text-[#86868B]">
                  <Lock className="w-3 h-3" strokeWidth={1.75} /> Secured with 256-bit SSL encryption
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
