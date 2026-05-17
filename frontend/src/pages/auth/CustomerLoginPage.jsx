import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { ChevronRight } from 'lucide-react';

import AuthFormWrapper from '../../components/auth/AuthFormWrapper';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';
import { GoogleLogin } from '@react-oauth/google';

const loginSchema = yup.object({
  email: yup.string().email('Please enter a valid email address.').required('Email is required.'),
  password: yup.string().min(6, 'Password must be at least 6 characters.').required('Password is required.'),
});

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/customer/login', formData);
      setAuth(data.data.user, data.data.accessToken);
      toast.success(`Welcome back, ${data.data.user.firstName}!`);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/customer/google', {
        token: credentialResponse.credential,
        role: 'customer'
      });
      setAuth(data.data.user, data.data.accessToken);
      toast.success(`Welcome back, ${data.data.user.firstName}!`);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormWrapper title="Sign in." subtitle="Access your DoorSetFix account.">
      <form onSubmit={handleSubmit(onSubmit)} id="customer-login-form">
        <div style={{ marginBottom: '24px' }}>
          <InputField
            label="Email Address"
            type="email"
            name="email"
            placeholder="name@example.com"
            register={register}
            error={errors.email?.message}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            register={register}
            error={errors.password?.message}
          />
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} id="customer-login-btn">
          Sign In
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </Button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="h-px bg-white/10 flex-1"></div>
        <span className="text-white/40 text-[13px] font-medium">OR</span>
        <div className="h-px bg-white/10 flex-1"></div>
      </div>
      
      <div className="flex justify-center" style={{ filter: 'invert(1) hue-rotate(180deg)' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error('Google Login failed')}
          useOneTap
        />
      </div>

      <div className="text-center mt-8 pt-6 border-t border-white/10">
        <p className="text-[13px] text-white/55">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#d7ccff] font-semibold hover:text-white transition-colors" id="login-to-register-link">
            Create one now
          </Link>
        </p>
      </div>
    </AuthFormWrapper>
  );
}
