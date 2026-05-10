import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Lock, ChevronRight } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-[#000000]">
      <div className="w-full max-w-[400px] px-6 animate-scale-in">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-[18px] bg-[#1D1D1F] flex items-center justify-center border border-white/[0.08]">
            <Lock className="w-7 h-7 text-white/70" strokeWidth={1.5} />
          </div>
          <h1 className="text-[32px] font-bold tracking-[-0.03em] text-white leading-tight mb-2">
            Admin Console
          </h1>
          <p className="text-[15px] text-white/40 font-normal">
            Sign in to manage your platform.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-white/[0.06]">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" id="admin-login-form">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-email" className="text-[14px] font-medium text-white/60 tracking-[-0.01em]">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@admin.com"
                className={`
                  w-full px-4 py-[13px]
                  bg-white/[0.06]
                  border border-white/[0.10]
                  rounded-[12px]
                  text-[17px] text-white
                  placeholder:text-white/25
                  font-normal tracking-[-0.022em]
                  transition-all duration-200 ease-out
                  outline-none
                  focus:border-apple-blue focus:ring-[3px] focus:ring-apple-blue/20 focus:bg-white/[0.08]
                  ${errors.email ? 'border-apple-red/60' : ''}
                `}
                {...register('email')}
              />
              {errors.email && (
                <span className="text-[13px] text-apple-red font-normal">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-password" className="text-[14px] font-medium text-white/60 tracking-[-0.01em]">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="Enter your password"
                className={`
                  w-full px-4 py-[13px]
                  bg-white/[0.06]
                  border border-white/[0.10]
                  rounded-[12px]
                  text-[17px] text-white
                  placeholder:text-white/25
                  font-normal tracking-[-0.022em]
                  transition-all duration-200 ease-out
                  outline-none
                  focus:border-apple-blue focus:ring-[3px] focus:ring-apple-blue/20 focus:bg-white/[0.08]
                  ${errors.password ? 'border-apple-red/60' : ''}
                `}
                {...register('password')}
              />
              {errors.password && (
                <span className="text-[13px] text-apple-red font-normal">{errors.password.message}</span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              id="admin-login-btn"
              className="mt-2"
            >
              Sign In
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[12px] text-white/20 mt-8">
          TechStore Admin Console
        </p>
      </div>
    </div>
  );
}
