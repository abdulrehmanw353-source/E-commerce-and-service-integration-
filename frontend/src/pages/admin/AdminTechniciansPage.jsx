import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';
import StatusBadge from '../../components/admin/StatusBadge';

const fetchTechnicians = (params) => adminApi.get('/technicians', { params }).then((r) => r.data.data ?? r.data);
const createTechnician = (payload) => adminApi.post('/technicians', payload).then((r) => r.data);
const updateTechnician = ({ id, payload }) => adminApi.patch(`/technicians/${id}`, payload).then((r) => r.data);
const deleteTechnician = (id) => adminApi.delete(`/technicians/${id}`).then((r) => r.data);

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

export default function AdminTechniciansPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-technicians', search],
    queryFn: () => fetchTechnicians({ search, limit: 100 }),
    staleTime: 30_000,
  });
  const technicians = Array.isArray(data) ? data : (data?.technicians || []);

  const createMut = useMutation({
    mutationFn: createTechnician,
    onSuccess: () => { qc.invalidateQueries(['admin-technicians']); toast.success('Technician created'); setIsOpen(false); setForm(emptyForm); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create technician'),
  });
  const updateMut = useMutation({
    mutationFn: updateTechnician,
    onSuccess: () => { qc.invalidateQueries(['admin-technicians']); toast.success('Technician updated'); setIsOpen(false); setEditing(null); setForm(emptyForm); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update technician'),
  });
  const deleteMut = useMutation({
    mutationFn: deleteTechnician,
    onSuccess: () => { qc.invalidateQueries(['admin-technicians']); toast.success('Technician deleted'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete technician'),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      ...emptyForm,
      ...t,
      expertise: Array.isArray(t.expertise) ? t.expertise.join(', ') : '',
      address: { ...emptyForm.address, ...(t.address || {}) },
    });
    setIsOpen(true);
  };

  const onSubmit = () => {
    const payload = {
      ...form,
      expertise: form.expertise,
      email: form.email?.trim().toLowerCase(),
    };
    if (editing) {
      updateMut.mutate({ id: editing._id, payload });
    } else {
      createMut.mutate(payload);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Technicians</h2>
        <button onClick={openCreate} className="ds-btn-primary px-4 py-2 rounded-xl inline-flex gap-2 items-center font-semibold text-sm">
          <Plus className="w-4 h-4" /> Add Technician
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search technicians..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1d2440] border border-white/10 text-white placeholder:text-white/35"
        />
      </div>

      <div className="ds-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-white/55">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Expertise</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Tasks</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td className="px-4 py-6 text-white/40" colSpan={6}>Loading technicians...</td></tr>
              ) : technicians.length === 0 ? (
                <tr><td className="px-4 py-6 text-white/40" colSpan={6}>No technicians found</td></tr>
              ) : technicians.map((t) => (
                <tr key={t._id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white">{t.firstName} {t.lastName}</td>
                  <td className="px-4 py-3 text-white/65">{t.email}</td>
                  <td className="px-4 py-3 text-white/65">{Array.isArray(t.expertise) ? t.expertise.join(', ') : '-'}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-white/70">{t.activeTasks ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(t)} className="px-3 py-1.5 rounded-lg ds-btn-outline text-xs mr-2">Edit</button>
                    <button onClick={() => deleteMut.mutate(t._id)} className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-300 text-xs inline-flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setIsOpen(false)} />
          <div className="relative ds-card p-6 w-full max-w-2xl">
            <h3 className="text-lg text-white font-semibold mb-4">{editing ? 'Edit Technician' : 'Add Technician'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <input value={form.firstName} onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))} placeholder="First Name" className="bg-[#1d2440] border border-white/10 rounded-xl px-3 py-2.5 text-white" />
              <input value={form.lastName} onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))} placeholder="Last Name" className="bg-[#1d2440] border border-white/10 rounded-xl px-3 py-2.5 text-white" />
              <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="Email" className="bg-[#1d2440] border border-white/10 rounded-xl px-3 py-2.5 text-white" />
              <input value={form.phoneNo} onChange={(e) => setForm((s) => ({ ...s, phoneNo: e.target.value }))} placeholder="Phone No" className="bg-[#1d2440] border border-white/10 rounded-xl px-3 py-2.5 text-white" />
              <input value={form.cnicImage} onChange={(e) => setForm((s) => ({ ...s, cnicImage: e.target.value }))} placeholder="CNIC Image URL" className="col-span-2 bg-[#1d2440] border border-white/10 rounded-xl px-3 py-2.5 text-white" />
              <input value={form.address.street} onChange={(e) => setForm((s) => ({ ...s, address: { ...s.address, street: e.target.value } }))} placeholder="Street" className="bg-[#1d2440] border border-white/10 rounded-xl px-3 py-2.5 text-white" />
              <input value={form.address.city} onChange={(e) => setForm((s) => ({ ...s, address: { ...s.address, city: e.target.value } }))} placeholder="City" className="bg-[#1d2440] border border-white/10 rounded-xl px-3 py-2.5 text-white" />
              <input value={form.address.state} onChange={(e) => setForm((s) => ({ ...s, address: { ...s.address, state: e.target.value } }))} placeholder="State" className="bg-[#1d2440] border border-white/10 rounded-xl px-3 py-2.5 text-white" />
              <input value={form.address.country} onChange={(e) => setForm((s) => ({ ...s, address: { ...s.address, country: e.target.value } }))} placeholder="Country" className="bg-[#1d2440] border border-white/10 rounded-xl px-3 py-2.5 text-white" />
              <input value={form.expertise} onChange={(e) => setForm((s) => ({ ...s, expertise: e.target.value }))} placeholder="Expertise (comma separated)" className="col-span-2 bg-[#1d2440] border border-white/10 rounded-xl px-3 py-2.5 text-white" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <label className="text-white/70 text-sm">Available</label>
              <input type="checkbox" checked={!!form.isAvailable} onChange={(e) => setForm((s) => ({ ...s, isAvailable: e.target.checked }))} />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl ds-btn-outline text-sm">Cancel</button>
              <button onClick={onSubmit} disabled={createMut.isPending || updateMut.isPending} className="px-4 py-2 rounded-xl ds-btn-primary text-sm font-semibold">
                {editing ? 'Save Changes' : 'Create Technician'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
