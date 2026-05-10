import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, ToggleLeft, ToggleRight, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';

const fetchServices = () => adminApi.get('/admin/services').then((r) => r.data.data ?? r.data);
const deleteService = (id) => adminApi.delete(`/admin/services/${id}`).then((r) => r.data);
const updateService = ({ id, payload }) => adminApi.patch(`/admin/services/${id}`, payload).then((r) => r.data);

export default function AdminServicesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: fetchServices,
    staleTime: 30_000,
  });

  const services = (data?.services || data?.data?.services || data) ?? [];
  const list = Array.isArray(services) ? services : [];
  const filtered = list.filter((s) =>
    (s.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.slug || '').toLowerCase().includes(search.toLowerCase())
  );

  const delMut = useMutation({
    mutationFn: deleteService,
    onSuccess: () => { qc.invalidateQueries(['admin-services']); toast.success('Service deleted'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete service'),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, isEnabled }) => updateService({ id, payload: { isEnabled } }),
    onSuccess: () => { qc.invalidateQueries(['admin-services']); toast.success('Updated'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update service'),
  });

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Booking Services</h2>
          <p className="text-[13px] text-white/45 mt-1">Manage the services shown in the storefront booking flow.</p>
        </div>
        <Link to="/admin/services/new" className="ds-btn-primary px-4 py-2 rounded-xl inline-flex gap-2 items-center font-semibold text-sm">
          <Plus className="w-4 h-4" /> Add Service
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1d2440] border border-white/10 text-white placeholder:text-white/35 outline-none focus:border-[#a894ff] focus:ring-4 focus:ring-[#8f74ff]/20 transition-all"
        />
      </div>

      <div className="ds-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-white/55">
              <tr>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Starting</th>
                <th className="px-4 py-3 text-left">Enabled</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td className="px-4 py-6 text-white/40" colSpan={5}>Loading services...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td className="px-4 py-6 text-white/40" colSpan={5}>No services found</td></tr>
              ) : filtered.map((s) => (
                <tr key={s._id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[18px]">
                        {s.icon || '🔧'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold truncate">{s.title}</p>
                        <p className="text-[12px] text-white/40 truncate">{s.shortDesc || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60 font-mono text-[12px]">{s.slug}</td>
                  <td className="px-4 py-3 text-white/70 font-semibold">{typeof s.startingPrice === 'number' ? `$${s.startingPrice}` : '—'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleMut.mutate({ id: s._id, isEnabled: !s.isEnabled })}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[12px] font-semibold transition-all ${
                        s.isEnabled ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/15' : 'bg-white/[0.06] text-white/55 border-white/10 hover:bg-white/[0.1]'
                      }`}
                    >
                      {s.isEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      {s.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/services/${s._id}/edit`} className="px-3 py-1.5 rounded-lg ds-btn-outline text-xs inline-flex items-center gap-1 mr-2">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Link>
                    <button
                      onClick={() => delMut.mutate(s._id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-300 text-xs inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

