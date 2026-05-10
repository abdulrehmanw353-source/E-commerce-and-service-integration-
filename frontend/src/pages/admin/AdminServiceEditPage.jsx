import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';
import Button from '../../components/ui/Button';

const fetchService = (id) => adminApi.get(`/admin/services/${id}`).then((r) => r.data.data ?? r.data);
const updateService = ({ id, payload }) => adminApi.patch(`/admin/services/${id}`, payload).then((r) => r.data);

export default function AdminServiceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-service', id],
    queryFn: () => fetchService(id),
    enabled: !!id,
    staleTime: 30_000,
  });

  const service = data?.service || data?.data?.service || data;

  useEffect(() => {
    if (!service) return;
    setForm({
      title: service.title || '',
      slug: service.slug || '',
      icon: service.icon || '🔧',
      startingPrice: service.startingPrice ?? 0,
      shortDesc: service.shortDesc || '',
      description: service.description || '',
      isEnabled: !!service.isEnabled,
      sortOrder: service.sortOrder ?? 0,
    });
  }, [service]);

  const mut = useMutation({
    mutationFn: ({ payload }) => updateService({ id, payload }),
    onSuccess: () => {
      qc.invalidateQueries(['admin-services']);
      qc.invalidateQueries(['admin-service', id]);
      toast.success('Service updated');
      navigate('/admin/services');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update service'),
  });

  if (isLoading || !form) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-56 bg-white/[0.06] rounded-xl" />
        <div className="h-64 bg-white/[0.06] rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-white/45">Service not found.</p>
        <button onClick={() => navigate('/admin/services')} className="mt-3 text-[13px] text-[#d7ccff] hover:opacity-80">
          ← Back to Services
        </button>
      </div>
    );
  }

  const onSubmit = (e) => {
    e.preventDefault();
    mut.mutate({
      payload: {
        ...form,
        startingPrice: Number(form.startingPrice || 0),
        sortOrder: Number(form.sortOrder || 0),
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/services')} className="p-2 rounded-xl text-white hover:bg-white/[0.06] transition-all">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
        </button>
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-[-0.02em]">Edit Booking Service</h1>
          <p className="text-[13px] text-white/35 mt-0.5 font-mono">{String(id).slice(-10).toUpperCase()}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="ds-card p-5 sm:p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-white/45 uppercase tracking-[0.08em]">Title</label>
              <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className="mt-2 w-full bg-[#1c2340] border border-[#7a5cff]/25 hover:border-[#9a84ff]/45 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-[#a894ff] focus:ring-4 focus:ring-[#8f74ff]/20 transition-all" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-white/45 uppercase tracking-[0.08em]">Slug</label>
              <input value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} className="mt-2 w-full bg-[#1c2340] border border-[#7a5cff]/25 hover:border-[#9a84ff]/45 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-[#a894ff] focus:ring-4 focus:ring-[#8f74ff]/20 transition-all" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-white/45 uppercase tracking-[0.08em]">Icon (emoji)</label>
              <input value={form.icon} onChange={(e) => setForm((s) => ({ ...s, icon: e.target.value }))} className="mt-2 w-full bg-[#1c2340] border border-[#7a5cff]/25 hover:border-[#9a84ff]/45 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-[#a894ff] focus:ring-4 focus:ring-[#8f74ff]/20 transition-all" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-white/45 uppercase tracking-[0.08em]">Starting Price</label>
              <input type="number" value={form.startingPrice} onChange={(e) => setForm((s) => ({ ...s, startingPrice: e.target.value }))} className="mt-2 w-full bg-[#1c2340] border border-[#7a5cff]/25 hover:border-[#9a84ff]/45 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-[#a894ff] focus:ring-4 focus:ring-[#8f74ff]/20 transition-all" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-white/45 uppercase tracking-[0.08em]">Short Description</label>
              <input value={form.shortDesc} onChange={(e) => setForm((s) => ({ ...s, shortDesc: e.target.value }))} className="mt-2 w-full bg-[#1c2340] border border-[#7a5cff]/25 hover:border-[#9a84ff]/45 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-[#a894ff] focus:ring-4 focus:ring-[#8f74ff]/20 transition-all" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-white/45 uppercase tracking-[0.08em]">Full Description</label>
              <textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} rows={5} className="mt-2 w-full bg-[#1c2340] border border-[#7a5cff]/25 hover:border-[#9a84ff]/45 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-[#a894ff] focus:ring-4 focus:ring-[#8f74ff]/20 transition-all resize-none" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-white/45 uppercase tracking-[0.08em]">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((s) => ({ ...s, sortOrder: e.target.value }))} className="mt-2 w-full bg-[#1c2340] border border-[#7a5cff]/25 hover:border-[#9a84ff]/45 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-[#a894ff] focus:ring-4 focus:ring-[#8f74ff]/20 transition-all" />
            </div>
            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={() => setForm((s) => ({ ...s, isEnabled: !s.isEnabled }))}
                className={`h-10 w-20 rounded-full border transition-all ${form.isEnabled ? 'bg-[#7a5cff] border-[#7a5cff]/70' : 'bg-white/[0.06] border-white/10'}`}
              >
                <span className={`block w-8 h-8 bg-white rounded-full transition-transform ${form.isEnabled ? 'translate-x-10' : 'translate-x-1'}`} />
              </button>
              <span className="text-[13px] text-white/70 font-medium pb-2">{form.isEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/services')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={mut.isPending}>
            <Save className={`w-4 h-4 ${mut.isPending ? 'animate-spin' : ''}`} />
            {mut.isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

