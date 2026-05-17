import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';

const createTechnician = (payload) => adminApi.post('/technicians', payload).then((r) => r.data);

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNo: '',
  cnicImage: '',
  expertise: '',
  isAvailable: true,
  address: { street: '', city: '', state: '', country: '' },
};

const INPUT =
  'w-full bg-[#1c2340] border border-[#7a5cff]/25 hover:border-[#9a84ff]/45 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-[#a894ff] focus:bg-[#242c4b] focus:ring-4 focus:ring-[#8f74ff]/20 transition-all shadow-inner';

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-white/70 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function AdminTechnicianCreatePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);

  const createMut = useMutation({
    mutationFn: createTechnician,
    onSuccess: () => {
      qc.invalidateQueries(['admin-technicians']);
      toast.success('Technician created');
      navigate('/admin/technicians');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create technician'),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const expertise = String(form.expertise || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    createMut.mutate({
      ...form,
      email: form.email?.trim().toLowerCase(),
      expertise,
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/technicians')}
            className="p-2 rounded-xl text-white hover:bg-white/[0.06] transition-all"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <div>
            <h1 className="text-[20px] font-bold text-white tracking-[-0.02em]">Add Technician</h1>
            <p className="text-[13px] text-white/35 mt-0.5">Create a new technician profile</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="ds-card p-5">
          <h3 className="text-[13px] font-semibold text-white/80 uppercase tracking-wider mb-4">Basic Info</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="First Name">
              <input value={form.firstName} onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))} className={INPUT} placeholder="First name" />
            </Field>
            <Field label="Last Name">
              <input value={form.lastName} onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))} className={INPUT} placeholder="Last name" />
            </Field>
            <Field label="Email">
              <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} className={INPUT} placeholder="email@domain.com" />
            </Field>
            <Field label="Phone No">
              <input value={form.phoneNo} onChange={(e) => setForm((s) => ({ ...s, phoneNo: e.target.value }))} className={INPUT} placeholder="Phone number" />
            </Field>
            <div className="md:col-span-2">
              <Field label="CNIC Image URL">
                <input value={form.cnicImage} onChange={(e) => setForm((s) => ({ ...s, cnicImage: e.target.value }))} className={INPUT} placeholder="https://..." />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Expertise (comma separated)">
                <input value={form.expertise} onChange={(e) => setForm((s) => ({ ...s, expertise: e.target.value }))} className={INPUT} placeholder="mobile, laptop, gaming..." />
              </Field>
            </div>
            <div className="md:col-span-2 flex items-center gap-3 pt-1">
              <span className="text-[13px] text-white/70 font-medium">Available</span>
              <button
                type="button"
                onClick={() => setForm((s) => ({ ...s, isAvailable: !s.isAvailable }))}
                className={`h-9 w-16 rounded-full border transition-all ${form.isAvailable ? 'bg-[#7a5cff] border-[#7a5cff]/70' : 'bg-white/[0.06] border-white/10'}`}
                aria-label="Toggle availability"
              >
                <span className={`block w-7 h-7 bg-white rounded-full transition-transform ${form.isAvailable ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="ds-card p-5">
          <h3 className="text-[13px] font-semibold text-white/80 uppercase tracking-wider mb-4">Address</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Street">
              <input value={form.address.street} onChange={(e) => setForm((s) => ({ ...s, address: { ...s.address, street: e.target.value } }))} className={INPUT} placeholder="Street" />
            </Field>
            <Field label="City">
              <input value={form.address.city} onChange={(e) => setForm((s) => ({ ...s, address: { ...s.address, city: e.target.value } }))} className={INPUT} placeholder="City" />
            </Field>
            <Field label="State">
              <input value={form.address.state} onChange={(e) => setForm((s) => ({ ...s, address: { ...s.address, state: e.target.value } }))} className={INPUT} placeholder="State" />
            </Field>
            <Field label="Country">
              <input value={form.address.country} onChange={(e) => setForm((s) => ({ ...s, address: { ...s.address, country: e.target.value } }))} className={INPUT} placeholder="Country" />
            </Field>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button type="button" onClick={() => navigate('/admin/technicians')} className="px-4 py-2.5 rounded-xl ds-btn-outline text-sm">
            Cancel
          </button>
          <button type="submit" disabled={createMut.isPending} className="px-4 py-2.5 rounded-xl ds-btn-primary text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60">
            <Save className={`w-4 h-4 ${createMut.isPending ? 'animate-spin' : ''}`} />
            {createMut.isPending ? 'Creating…' : 'Create Technician'}
          </button>
        </div>
      </form>
    </div>
  );
}

