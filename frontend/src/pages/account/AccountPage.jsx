import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Lock, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';

// ─── Fetchers ────────────────────────────────────────────────
const fetchProfile = () => api.get('/customer/profile').then(r => r.data.data ?? r.data);
const updateProfile = (body) => api.patch('/customer/profile', body).then(r => r.data);
const changePassword = (body) => api.patch('/customer/change-password', body).then(r => r.data);

// ─── Schemas ─────────────────────────────────────────────────
const profileSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName:  yup.string().required('Last name is required'),
  phoneNo:   yup.string().optional(),
  address:   yup.string().optional(),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().min(6).required('Current password is required'),
  newPassword:     yup.string().min(6, 'Minimum 6 characters').required('New password is required'),
});

// ─── Input ───────────────────────────────────────────────────
function Field({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-[#86868B] uppercase tracking-wider mb-1.5">{label}</label>
      <input
        {...props}
        className={`w-full bg-[#F5F5F7] border rounded-xl px-4 py-3 text-[15px] text-[#1D1D1F] outline-none transition-all
          focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20
          ${error ? 'border-red-400' : 'border-[#D2D2D7]'}`}
      />
      {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function AccountPage() {
  const [tab, setTab] = useState('profile'); // 'profile' | 'password'
  const { user: storeUser, setAuth } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['customer-profile'],
    queryFn: fetchProfile,
    staleTime: 60_000,
  });

  // Profile form
  const { register: rP, handleSubmit: hsP, formState: { errors: eP } } = useForm({
    resolver: yupResolver(profileSchema),
    values: profile ? {
      firstName: profile.firstName || '',
      lastName:  profile.lastName  || '',
      phoneNo:   profile.phoneNo   || '',
      address:   profile.address   || '',
    } : undefined,
  });

  // Password form
  const { register: rPw, handleSubmit: hsPw, reset: resetPw, formState: { errors: ePw } } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const profileMut = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success('Profile updated!');
      // update store name
      const u = data.data?.user ?? data.data ?? data;
      if (u?.firstName) setAuth(u, useAuthStore.getState().accessToken);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update.'),
  });

  const passwordMut = useMutation({
    mutationFn: changePassword,
    onSuccess: () => { toast.success('Password changed!'); resetPw(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to change password.'),
  });

  const u = profile ?? storeUser;

  return (
    <div className="bg-white min-h-screen">
      <div className="apple-section-wide pt-8 pb-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[#1D1D1F] flex items-center justify-center flex-shrink-0">
              <span className="text-[20px] font-bold text-white">{u?.firstName?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#1D1D1F]">
                {u?.firstName} {u?.lastName}
              </h1>
              <p className="text-[15px] text-[#86868B]">{u?.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#F5F5F7] rounded-xl p-1 w-fit">
            {[['profile', 'Profile'], ['password', 'Password']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-5 py-2 rounded-[10px] text-[14px] font-medium transition-all ${
                  tab === key ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-lg">
          {/* Profile Tab */}
          {tab === 'profile' && (
            <form onSubmit={hsP((data) => profileMut.mutate(data))} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" placeholder="First name" {...rP('firstName')} error={eP.firstName?.message} />
                <Field label="Last Name"  placeholder="Last name"  {...rP('lastName')}  error={eP.lastName?.message} />
              </div>
              <Field label="Phone Number" placeholder="+1 (555) 000-0000" {...rP('phoneNo')} error={eP.phoneNo?.message} />
              <Field label="Address" placeholder="123 Main St, City, Country" {...rP('address')} error={eP.address?.message} />
              <button type="submit" disabled={profileMut.isPending}
                className="flex items-center gap-2 px-6 py-3 bg-[#1D1D1F] hover:bg-[#3A3A3C] disabled:opacity-60 text-white rounded-full text-[15px] font-medium transition-all">
                {profileMut.isPending ? 'Saving…' : <><Check className="w-4 h-4" strokeWidth={2.5} /> Save Changes</>}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {tab === 'password' && (
            <form onSubmit={hsPw((data) => passwordMut.mutate(data))} className="space-y-5">
              <Field label="Current Password" type="password" placeholder="Current password" {...rPw('currentPassword')} error={ePw.currentPassword?.message} />
              <Field label="New Password" type="password" placeholder="Minimum 6 characters" {...rPw('newPassword')} error={ePw.newPassword?.message} />
              <button type="submit" disabled={passwordMut.isPending}
                className="flex items-center gap-2 px-6 py-3 bg-[#1D1D1F] hover:bg-[#3A3A3C] disabled:opacity-60 text-white rounded-full text-[15px] font-medium transition-all">
                {passwordMut.isPending ? 'Updating…' : <><Lock className="w-4 h-4" strokeWidth={2} /> Update Password</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
