import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Users, ChevronRight, ShieldCheck } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';
import StatusBadge from '../../components/admin/StatusBadge';

const fetchUsers = (params) =>
  adminApi.get('/admin/users/', { params }).then(r => r.data.data ?? r.data);
const updateRole = ({ id, role }) =>
  adminApi.patch(`/admin/users/${id}/role`, { role }).then(r => r.data);

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: () => fetchUsers({ page, limit: 15, keyword: search || undefined }),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  const users = Array.isArray(data) ? data : (data?.users || []);
  const totalPages = data?.totalPages || 1;

  const roleMut = useMutation({
    mutationFn: updateRole,
    onSuccess: () => { qc.invalidateQueries(['admin-users']); toast.success('Role updated.'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update role.'),
  });

  return (
    <div className="p-4 sm:p-6">
      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-[#1C1C1E] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-[#0071E3] transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold text-white/35 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-4 bg-white/[0.06] rounded-full animate-pulse" /></td>
                  ))}</tr>
                ))
                : users.length === 0
                  ? (
                    <tr><td colSpan={5} className="px-5 py-16 text-center">
                      <Users className="w-8 h-8 text-white/20 mx-auto mb-3" strokeWidth={1.5} />
                      <p className="text-[13px] text-white/25">No users found</p>
                    </td></tr>
                  )
                  : users.map(u => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0071E3]/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-[11px] font-bold text-[#0071E3]">{u.firstName?.[0]?.toUpperCase()}</span>
                          </div>
                          <span className="font-medium text-white">{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-white/50">{u.email}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={u.role} /></td>
                      <td className="px-5 py-3.5 text-white/40 whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3.5">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => roleMut.mutate({ id: u._id, role: 'admin' })}
                            disabled={roleMut.isPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white/50 bg-white/[0.06] hover:bg-[#0071E3]/20 hover:text-[#0071E3] disabled:opacity-40 transition-all"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
            <p className="text-[12px] text-white/35">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/50 bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-30 transition-all">Prev</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/50 bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-30 transition-all">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
