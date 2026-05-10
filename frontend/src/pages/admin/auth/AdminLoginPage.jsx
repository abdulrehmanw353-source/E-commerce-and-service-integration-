import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Lock, LogIn } from 'lucide-react';

import InputField from '../../../components/ui/InputField';
import Button from '../../../components/ui/Button';
import { useAdminAuthStore } from '../../../store/adminAuthStore';
import adminApi from '../../../lib/adminAxios';

// ─── Validation Schema ─────────────────────
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .required('Password is required.'),
});

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const setAuth = useAdminAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const { data } = await adminApi.post('/auth/admin/login', formData);
      setAuth(data.data.user, data.data.accessToken);
      toast.success('Welcome to the admin dashboard.');
      navigate('/admin', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-full max-w-[380px] px-6 animate-scale-in">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#1d1d1f] to-[#2d2d2f] flex items-center justify-center border border-white/[0.06] shadow-lg">
            <Lock className="w-7 h-7 text-white/80" strokeWidth={1.5} />
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-tight text-white leading-tight mb-2">
            Admin Console
          </h1>
          <p className="text-[15px] text-white/50 font-normal">
            Sign in to manage your platform.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1c1c1e] rounded-2xl p-6 sm:p-8 border border-white/[0.06] shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" id="admin-login-form">
            {/* Email — dark-themed override */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-email" className="text-[13px] font-medium text-white/60 tracking-tight pl-1">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@admin.com"
                className={`
                  w-full px-4 py-3 
                  bg-white/[0.06] 
                  border border-white/[0.08]
                  rounded-xl
                  text-[17px] text-white 
                  placeholder:text-white/30
                  font-normal
                  transition-all duration-200 ease-out
                  outline-none
                  focus:border-apple-blue focus:bg-white/[0.08] focus:shadow-sm
                  ${errors.email ? 'border-apple-red' : ''}
                `}
                {...register('email')}
              />
              {errors.email && (
                <span className="text-[13px] text-apple-red pl-1">{errors.email.message}</span>
              )}
            </div>

            {/* Password — dark-themed override */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-password" className="text-[13px] font-medium text-white/60 tracking-tight pl-1">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="Enter your password"
                className={`
                  w-full px-4 py-3 
                  bg-white/[0.06] 
                  border border-white/[0.08]
                  rounded-xl
                  text-[17px] text-white 
                  placeholder:text-white/30
                  font-normal
                  transition-all duration-200 ease-out
                  outline-none
                  focus:border-apple-blue focus:bg-white/[0.08] focus:shadow-sm
                  ${errors.password ? 'border-apple-red' : ''}
                `}
                {...register('password')}
              />
              {errors.password && (
                <span className="text-[13px] text-apple-red pl-1">{errors.password.message}</span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              id="admin-login-btn"
            >
              <LogIn className="w-[18px] h-[18px]" strokeWidth={1.5} />
              Sign In
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[12px] text-white/25 mt-6">
          TechStore Admin Console
        </p>
      </div>
    </div>
  );
}
