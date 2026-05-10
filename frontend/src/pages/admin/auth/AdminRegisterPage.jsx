import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ShieldPlus, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import adminApi from '../../../lib/adminAxios';

const schema = yup.object({
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().optional(),
  email: yup.string().email('Enter a valid email.').required('Email is required.'),
  password: yup.string().min(6, 'At least 6 characters.').required('Password is required.'),
});

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await adminApi.get('/auth/admin/register-status');
        if (!mounted) return;
        if (!data?.data?.allowRegistration) {
          toast('Only one admin account is allowed. Please sign in.', { icon: '🔒' });
          navigate('/admin/login', { replace: true });
          return;
        }
      } catch {
        // ignore and allow attempting registration
      } finally {
        if (mounted) setCheckingStatus(false);
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await adminApi.post('/auth/admin/register', values);
      toast.success('Admin registered. You can login now.');
      navigate('/admin/login', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Admin registration failed.';
      toast.error(message);
      if (message.toLowerCase().includes('only one admin account')) {
        navigate('/admin/login', { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="ds-card p-8 text-white/75">Checking admin registration status...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-[500px] ds-card p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto bg-[#7a5cff]/25 border border-[#7a5cff]/55 flex items-center justify-center">
            <ShieldPlus className="w-7 h-7 text-[#bbaeff]" />
          </div>
          <h1 className="text-[34px] font-bold text-white mt-4">Create Admin Account</h1>
          <p className="text-white/55 mt-1">Register a new admin and access dashboard controls.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">First Name</label>
              <input {...register('firstName')} className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-white outline-none focus:border-[#8f74ff]" />
              {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Last Name</label>
              <input {...register('lastName')} className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-white outline-none focus:border-[#8f74ff]" />
              {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Email</label>
            <input type="email" {...register('email')} className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-white outline-none focus:border-[#8f74ff]" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Password</label>
            <input type="password" {...register('password')} className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-white outline-none focus:border-[#8f74ff]" />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button disabled={isLoading} type="submit" className="w-full ds-btn-primary rounded-full py-3 font-semibold mt-2 inline-flex justify-center items-center gap-2">
            {isLoading ? 'Creating...' : 'Register Admin'} <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-sm text-white/65 mt-5 text-center">
          Already have admin access? <Link to="/admin/login" className="text-[#a792ff] font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
