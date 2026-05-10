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

const loginSchema = yup.object({
  email: yup.string().email('Please enter a valid email address.').required('Email is required.'),
  password: yup.string().min(6, 'Password must be at least 6 characters.').required('Password is required.'),
});

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const setAuth = useAdminAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
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
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    padding: '14px 16px',
    backgroundColor: 'rgba(255,255,255,0.06)',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] px-5">
      <div className="w-full max-w-[440px] animate-scale-in">
        {/* Brand */}
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <div
            className="mx-auto flex items-center justify-center border border-white/[0.08]"
            style={{ width: '64px', height: '64px', borderRadius: '18px', backgroundColor: '#1D1D1F', marginBottom: '28px' }}
          >
            <Lock className="w-7 h-7 text-white/70" strokeWidth={1.5} />
          </div>
          <h1 className="text-[34px] font-bold tracking-[-0.03em] text-white leading-tight">
            Admin Console
          </h1>
          <p className="text-[15px] text-white/40 font-normal" style={{ marginTop: '12px' }}>
            Sign in to manage your platform.
          </p>
        </div>

        {/* Form Card */}
        <div
          className="border border-white/[0.06]"
          style={{ backgroundColor: '#1C1C1E', borderRadius: '20px', padding: '40px 44px' }}
        >
          <form onSubmit={handleSubmit(onSubmit)} id="admin-login-form">
            {/* Email */}
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="admin-email" className="block text-[13px] font-semibold text-white/50 uppercase tracking-[0.04em]" style={{ marginBottom: '10px' }}>
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@admin.com"
                className={`
                  w-full border rounded-xl text-[17px] text-white placeholder:text-white/25
                  font-normal tracking-[-0.022em] outline-none
                  transition-all duration-200 ease-out
                  focus:border-apple-blue focus:ring-[3px] focus:ring-apple-blue/20
                  ${errors.email ? 'border-apple-red/60' : 'border-white/[0.10]'}
                `}
                style={inputStyle}
                {...register('email')}
              />
              {errors.email && <span className="block text-[13px] text-apple-red font-normal" style={{ marginTop: '8px' }}>{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '32px' }}>
              <label htmlFor="admin-password" className="block text-[13px] font-semibold text-white/50 uppercase tracking-[0.04em]" style={{ marginBottom: '10px' }}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="Enter your password"
                className={`
                  w-full border rounded-xl text-[17px] text-white placeholder:text-white/25
                  font-normal tracking-[-0.022em] outline-none
                  transition-all duration-200 ease-out
                  focus:border-apple-blue focus:ring-[3px] focus:ring-apple-blue/20
                  ${errors.password ? 'border-apple-red/60' : 'border-white/[0.10]'}
                `}
                style={inputStyle}
                {...register('password')}
              />
              {errors.password && <span className="block text-[13px] text-apple-red font-normal" style={{ marginTop: '8px' }}>{errors.password.message}</span>}
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} id="admin-login-btn">
              Sign In
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[12px] text-white/20" style={{ marginTop: '48px' }}>
          TechStore Admin Console
        </p>
      </div>
    </div>
  );
}
