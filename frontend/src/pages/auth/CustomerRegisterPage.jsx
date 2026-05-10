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
import api from '../../lib/axios';

// ─── Validation Schema ─────────────────────
const registerSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters.')
    .required('First name is required.'),
  lastName: yup
    .string()
    .trim(),
  email: yup
    .string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .required('Password is required.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.'),
  phoneNo: yup
    .string()
    .trim(),
  street: yup.string().trim(),
  city: yup.string().trim(),
  state: yup.string().trim(),
  country: yup.string().trim(),
});

export default function CustomerRegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNo: '',
      street: '',
      city: '',
      state: '',
      country: '',
    },
  });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // Shape the payload to match backend expectations
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNo: formData.phoneNo,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
      };

      await api.post('/auth/customer/register', payload);
      toast.success('Account created successfully! Please sign in.');
      navigate('/login', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="Create your account."
      subtitle="Join TechStore today."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" id="customer-register-form">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="First Name"
            name="firstName"
            placeholder="John"
            register={register}
            error={errors.firstName?.message}
          />
          <InputField
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            register={register}
            error={errors.lastName?.message}
          />
        </div>

        <InputField
          label="Email Address"
          type="email"
          name="email"
          placeholder="name@example.com"
          register={register}
          error={errors.email?.message}
        />

        <InputField
          label="Phone Number"
          type="tel"
          name="phoneNo"
          placeholder="+1 (555) 000-0000"
          register={register}
          error={errors.phoneNo?.message}
        />

        {/* Password Row */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Min. 6 chars"
            register={register}
            error={errors.password?.message}
          />
          <InputField
            label="Confirm"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter"
            register={register}
            error={errors.confirmPassword?.message}
          />
        </div>

        {/* Address Section */}
        <div className="pt-3 border-t border-[#D2D2D7]/40">
          <p className="text-[14px] font-medium text-label-primary tracking-[-0.01em] mb-4">
            Shipping Address{' '}
            <span className="text-[#86868B] font-normal text-[13px]">(optional)</span>
          </p>
          <div className="flex flex-col gap-4">
            <InputField
              name="street"
              placeholder="Street address"
              register={register}
              error={errors.street?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="city"
                placeholder="City"
                register={register}
                error={errors.city?.message}
              />
              <InputField
                name="state"
                placeholder="State"
                register={register}
                error={errors.state?.message}
              />
            </div>
            <InputField
              name="country"
              placeholder="Country"
              register={register}
              error={errors.country?.message}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          id="customer-register-btn"
          className="mt-1"
        >
          Create Account
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-8 pt-6 border-t border-[#D2D2D7]/50 text-center">
        <p className="text-[15px] text-[#86868B]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-apple-blue font-medium hover:underline"
            id="register-to-login-link"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthFormWrapper>
  );
}
