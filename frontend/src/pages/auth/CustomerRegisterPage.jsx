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

const registerSchema = yup.object({
  firstName: yup.string().trim().min(2, 'First name must be at least 2 characters.').required('First name is required.'),
  lastName: yup.string().trim(),
  email: yup.string().email('Please enter a valid email address.').required('Email is required.'),
  password: yup.string().min(6, 'Password must be at least 6 characters.').required('Password is required.'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match.').required('Please confirm your password.'),
  phoneNo: yup.string().trim(),
  street: yup.string().trim(),
  city: yup.string().trim(),
  state: yup.string().trim(),
  country: yup.string().trim(),
});

export default function CustomerRegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', password: '',
      confirmPassword: '', phoneNo: '', street: '', city: '', state: '', country: '',
    },
  });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const payload = {
        firstName: formData.firstName, lastName: formData.lastName,
        email: formData.email, password: formData.password, phoneNo: formData.phoneNo,
        address: { street: formData.street, city: formData.city, state: formData.state, country: formData.country },
      };
      await api.post('/auth/customer/register', payload);
      toast.success('Account created! Please sign in.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormWrapper title="Create your account." subtitle="Join DoorSetFix today.">
      <form onSubmit={handleSubmit(onSubmit)} id="customer-register-form">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '20px' }}>
          <InputField label="First Name" name="firstName" placeholder="Ali" register={register} error={errors.firstName?.message} />
          <InputField label="Last Name" name="lastName" placeholder="Khan" register={register} error={errors.lastName?.message} />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '20px' }}>
          <InputField label="Email Address" type="email" name="email" placeholder="name@example.com" register={register} error={errors.email?.message} />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: '20px' }}>
          <InputField label="Phone Number" type="tel" name="phoneNo" placeholder="+92 300 1234567" register={register} error={errors.phoneNo?.message} />
        </div>

        {/* Password Row */}
        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '28px' }}>
          <InputField label="Password" type="password" name="password" placeholder="Min. 6 chars" register={register} error={errors.password?.message} />
          <InputField label="Confirm" type="password" name="confirmPassword" placeholder="Re-enter" register={register} error={errors.confirmPassword?.message} />
        </div>

        {/* Shipping Address */}
        <div className="pt-5 mb-7 border-t border-white/10">
          <p className="text-[11px] font-semibold text-white/45 uppercase tracking-[0.08em] mb-5">
            Shipping Address
            <span className="font-medium normal-case tracking-normal text-[12px] text-white/35 ml-1.5">(optional)</span>
          </p>
          <div style={{ marginBottom: '16px' }}>
            <InputField name="street" placeholder="Street address" register={register} error={errors.street?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
            <InputField name="city" placeholder="City" register={register} error={errors.city?.message} />
            <InputField name="state" placeholder="State" register={register} error={errors.state?.message} />
          </div>
          <InputField name="country" placeholder="Country" register={register} error={errors.country?.message} />
        </div>

        {/* Submit */}
        <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} id="customer-register-btn">
          Create Account
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </Button>
      </form>

      <div className="text-center mt-8 pt-6 border-t border-white/10">
        <p className="text-[13px] text-white/55">
          Already have an account?{' '}
          <Link to="/login" className="text-[#d7ccff] font-semibold hover:text-white transition-colors" id="register-to-login-link">
            Sign in
          </Link>
        </p>
      </div>
    </AuthFormWrapper>
  );
}
