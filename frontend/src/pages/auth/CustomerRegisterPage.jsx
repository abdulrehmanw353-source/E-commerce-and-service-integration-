import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

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
        <div className="grid grid-cols-2 gap-3">
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
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Min. 6 characters"
            register={register}
            error={errors.password?.message}
          />
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter password"
            register={register}
            error={errors.confirmPassword?.message}
          />
        </div>

        {/* Address Section */}
        <div className="pt-2">
          <p className="text-[13px] font-medium text-label-secondary tracking-tight pl-1 mb-3">
            Shipping Address <span className="text-label-quaternary font-normal">(optional)</span>
          </p>
          <div className="flex flex-col gap-3">
            <InputField
              name="street"
              placeholder="Street address"
              register={register}
              error={errors.street?.message}
            />
            <div className="grid grid-cols-2 gap-3">
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
        >
          <UserPlus className="w-[18px] h-[18px]" strokeWidth={1.5} />
          Create Account
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-6 pt-5 border-t border-separator text-center">
        <p className="text-[15px] text-label-secondary">
          Already have an account?{' '}
          <Link
            to="/login"
            className="apple-link font-medium"
            id="register-to-login-link"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthFormWrapper>
  );
}
