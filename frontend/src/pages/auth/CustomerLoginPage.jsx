import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

import AuthFormWrapper from '../../components/auth/AuthFormWrapper';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';

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

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
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
      const { data } = await api.post('/auth/customer/login', formData);
      setAuth(data.data.user, data.data.accessToken);
      toast.success(`Welcome back, ${data.data.user.firstName}!`);
      navigate('/', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="Sign in."
      subtitle="Access your TechStore account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" id="customer-login-form">
        <InputField
          label="Email Address"
          type="email"
          name="email"
          placeholder="name@example.com"
          register={register}
          error={errors.email?.message}
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          register={register}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          id="customer-login-btn"
        >
          <LogIn className="w-[18px] h-[18px]" strokeWidth={1.5} />
          Sign In
        </Button>
      </form>

      {/* Register Link */}
      <div className="mt-6 pt-5 border-t border-separator text-center">
        <p className="text-[15px] text-label-secondary">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="apple-link font-medium"
            id="login-to-register-link"
          >
            Create one now
          </Link>
        </p>
      </div>
    </AuthFormWrapper>
  );
}
