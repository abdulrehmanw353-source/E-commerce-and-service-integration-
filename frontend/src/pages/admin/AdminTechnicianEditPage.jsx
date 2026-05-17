import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Wrench } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';

const fetchTechnician = (id) => adminApi.get(`/technicians/${id}`).then((r) => r.data.data ?? r.data);
const updateTechnician = ({ id, payload }) => adminApi.patch(`/technicians/${id}`, payload).then((r) => r.data);

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

export default function AdminTechnicianEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-technician', id],
    queryFn: () => fetchTechnician(id),
    enabled: !!id,
    staleTime: 30_000,
  });

  const technician = useMemo(() => data?.technician ?? data?.data?.technician ?? data?.data ?? data, [data]);

  useEffect(() => {
    if (!technician) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      ...emptyForm,
      ...technician,
      expertise: Array.isArray(technician.expertise) ? technician.expertise.join(', ') : (technician.expertise || ''),
      address: { ...emptyForm.address, ...(technician.address || {}) },
      isAvailable: technician.isAvailable ?? true,
    });
  }, [technician]);

  const updateMut = useMutation({
    mutationFn: updateTechnician,
    onSuccess: () => {
      qc.invalidateQueries(['admin-technicians']);
      qc.invalidateQueries(['admin-technician', id]);
      toast.success('Technician updated');
      navigate('/admin/technicians');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update technician'),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const expertise = String(form.expertise || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateMut.mutate({
      id,
      payload: {
        ...form,
        email: form.email?.trim().toLowerCase(),
        expertise,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-56 bg-white/[0.06] rounded-xl" />
        <div className="h-64 bg-white/[0.06] rounded-2xl" />
      </div>
    );
  }

  if (isError || !technician) {
    return (
      <div className="p-6 text-center">
        <p className="text-white/45">Technician not found.</p>
        <button onClick={() => navigate('/admin/technicians')} className="mt-3 text-[13px] text-[#d7ccff] hover:opacity-80">
          ← Back to Technicians
        </button>
      </div>
    );
  }

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
            <h1 className="text-[20px] font-bold text-white tracking-[-0.02em]">Edit Technician</h1>
            <p className="text-[13px] text-white/35 mt-0.5 font-mono">{String(id || '').slice(-10).toUpperCase()}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-white/45 text-[12px]">
          <Wrench className="w-4 h-4" strokeWidth={1.75} />
          Technician Profile
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
          <button type="submit" disabled={updateMut.isPending} className="px-4 py-2.5 rounded-xl ds-btn-primary text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60">
            <Save className={`w-4 h-4 ${updateMut.isPending ? 'animate-spin' : ''}`} />
            {updateMut.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

