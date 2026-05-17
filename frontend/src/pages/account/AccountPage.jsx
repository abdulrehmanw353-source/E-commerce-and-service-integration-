import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Lock, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';

// ─── Fetchers ────────────────────────────────────────────────
const fetchProfile = () => api.get('/customer/profile').then(r => r.data.data ?? r.data);
const updateProfile = (body) => api.patch('/customer/profile', body).then(r => r.data);
const changePassword = (body) => api.patch('/customer/change-password', body).then(r => r.data);

// ─── Schemas ─────────────────────────────────────────────────
const profileSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName:  yup.string().required('Last name is required'),
  phoneNo:   yup.string().optional(),
  street:    yup.string().optional(),
  city:      yup.string().optional(),
  state:     yup.string().optional(),
  country:   yup.string().optional(),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().min(6).required('Current password is required'),
  newPassword:     yup.string().min(6, 'Minimum 6 characters').required('New password is required'),
});

export default function AccountPage() {
  const [tab, setTab] = useState('profile'); // 'profile' | 'password'
  const { user: storeUser, setAuth } = useAuthStore();

  const { data: profile } = useQuery({
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
      street:    profile.address?.street  || '',
      city:      profile.address?.city    || '',
      state:     profile.address?.state   || '',
      country:   profile.address?.country || '',
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
    <div className="min-h-screen">
      <div className="apple-section-wide pt-8 pb-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#7a5cff]/20 border border-[#7a5cff]/45 flex items-center justify-center flex-shrink-0 shadow-[0_0_18px_rgba(122,92,255,0.35)]">
              <span className="text-[20px] font-bold text-white">{u?.firstName?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-white">
                {u?.firstName} {u?.lastName}
              </h1>
              <p className="text-[13px] text-white/45">{u?.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white/[0.06] border border-white/10 rounded-xl p-1 w-fit">
            {[['profile', 'Profile'], ['password', 'Password']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-5 py-2 rounded-[10px] text-[13px] font-semibold transition-all ${
                  tab === key ? 'ds-btn-primary text-white' : 'text-white/55 hover:text-white hover:bg-white/[0.06]'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-2xl">
          {/* Profile Tab */}
          {tab === 'profile' && (
            <form
              onSubmit={hsP((data) => profileMut.mutate({
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNo: data.phoneNo,
                address: {
                  street: data.street,
                  city: data.city,
                  state: data.state,
                  country: data.country,
                },
              }))}
              className="space-y-5"
            >
              <div className="ds-card p-5 sm:p-6">
                <h2 className="text-[15px] font-semibold text-white mb-5">Profile</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="First Name" name="firstName" placeholder="First name" register={rP} error={eP.firstName?.message} />
                  <InputField label="Last Name" name="lastName" placeholder="Last name" register={rP} error={eP.lastName?.message} />
                  <InputField label="Phone" name="phoneNo" placeholder="0300 1234567" register={rP} error={eP.phoneNo?.message} />
                </div>
              </div>

              <div className="ds-card p-5 sm:p-6">
                <h2 className="text-[15px] font-semibold text-white mb-5">Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <InputField label="Street" name="street" placeholder="Street, area" register={rP} error={eP.street?.message} />
                  </div>
                  <InputField label="City" name="city" placeholder="City" register={rP} error={eP.city?.message} />
                  <InputField label="State" name="state" placeholder="State" register={rP} error={eP.state?.message} />
                  <InputField label="Country" name="country" placeholder="Country" register={rP} error={eP.country?.message} />
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" disabled={profileMut.isPending}>
                <Check className="w-4 h-4" strokeWidth={2} /> {profileMut.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </form>
          )}

          {/* Password Tab */}
          {tab === 'password' && (
            <form onSubmit={hsPw((data) => passwordMut.mutate(data))} className="space-y-5">
              <div className="ds-card p-5 sm:p-6">
                <h2 className="text-[15px] font-semibold text-white mb-5">Password</h2>
                <div className="space-y-4">
                  <InputField label="Current Password" type="password" name="currentPassword" placeholder="Current password" register={rPw} error={ePw.currentPassword?.message} />
                  <InputField label="New Password" type="password" name="newPassword" placeholder="Minimum 6 characters" register={rPw} error={ePw.newPassword?.message} />
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" disabled={passwordMut.isPending}>
                <Lock className="w-4 h-4" strokeWidth={2} /> {passwordMut.isPending ? 'Updating…' : 'Update Password'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
