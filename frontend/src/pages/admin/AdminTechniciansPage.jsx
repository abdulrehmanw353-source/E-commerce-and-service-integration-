import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';
import StatusBadge from '../../components/admin/StatusBadge';
import { Link, useNavigate } from 'react-router-dom';

const fetchTechnicians = (params) => adminApi.get('/technicians', { params }).then((r) => r.data.data ?? r.data);
const deleteTechnician = (id) => adminApi.delete(`/technicians/${id}`).then((r) => r.data);

export default function AdminTechniciansPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-technicians', search],
    queryFn: () => fetchTechnicians({ search, limit: 100 }),
    staleTime: 30_000,
  });
  const technicians = Array.isArray(data) ? data : (data?.technicians || []);
  const deleteMut = useMutation({
    mutationFn: deleteTechnician,
    onSuccess: () => { qc.invalidateQueries(['admin-technicians']); toast.success('Technician deleted'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete technician'),
  });

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Technicians</h2>
        <button onClick={() => navigate('/admin/technicians/new')} className="ds-btn-primary px-4 py-2 rounded-xl inline-flex gap-2 items-center font-semibold text-sm">
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
                    <Link to={`/admin/technicians/${t._id}/edit`} className="px-3 py-1.5 rounded-lg ds-btn-outline text-xs mr-2 inline-block">Edit</Link>
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
    </div>
  );
}
