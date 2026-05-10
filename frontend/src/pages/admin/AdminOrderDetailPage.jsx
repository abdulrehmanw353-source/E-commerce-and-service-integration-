import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';
import StatusBadge from '../../components/admin/StatusBadge';

const fetchOrder = (id) => adminApi.get(`/admin/orders/${id}`).then(r => r.data.data ?? r.data);
const updateStatus = ({ id, status }) => adminApi.patch(`/admin/orders/${id}/status`, { status }).then(r => r.data);

const ORDER_STATUSES = ['pending','processing','shipped','delivered','cancelled'];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => fetchOrder(id),
    enabled: !!id,
  });

  const statusMut = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => { qc.invalidateQueries(['admin-order', id]); qc.invalidateQueries(['admin-orders']); toast.success('Status updated!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update status.'),
  });

  if (isLoading) return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-6 w-48 bg-white/[0.06] rounded-full" />
      <div className="h-48 bg-white/[0.06] rounded-2xl" />
    </div>
  );

  if (isError || !order) return (
    <div className="p-6 flex flex-col items-center justify-center py-24">
      <Package className="w-12 h-12 text-white/20 mb-4" strokeWidth={1.5} />
      <p className="text-[15px] text-white/40">Order not found</p>
      <button onClick={() => navigate('/admin/orders')}
        className="mt-4 text-[13px] text-[#0071E3] hover:opacity-80">← Back to Orders</button>
    </div>
  );

  const o = order.order ?? order;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" strokeWidth={1.75} /> Orders
      </button>

      {/* Header Card */}
      <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold text-white/35 uppercase tracking-wider mb-1">Order</p>
            <h2 className="text-[20px] font-bold text-white tracking-[-0.02em] font-mono">
              #{o._id?.slice(-10)?.toUpperCase()}
            </h2>
            <p className="text-[12px] text-white/35 mt-1">
              {new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <StatusBadge status={o.status} />
            {/* Status Update */}
            <select
              value={o.status}
              onChange={e => statusMut.mutate({ id: o._id, status: e.target.value })}
              disabled={statusMut.isPending}
              className="bg-[#2C2C2E] border border-white/[0.08] rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#0071E3] cursor-pointer transition-all"
            >
              {ORDER_STATUSES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Customer */}
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider mb-4">Customer</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0071E3]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[14px] font-bold text-[#0071E3]">{o.user?.firstName?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white">{o.user?.firstName} {o.user?.lastName}</p>
              <p className="text-[12px] text-white/40">{o.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider mb-4">Payment</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-[14px] font-bold">
              <span className="text-white">Total</span>
              <span className="text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(o.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-[12px] pt-1">
              <span className="text-white/40">Payment</span>
              <StatusBadge status={o.paymentStatus ?? (o.isPaid ? 'paid' : 'pending')} />
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl overflow-hidden">
        <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider px-5 py-4 border-b border-white/[0.06]">
          Order Items ({o.items?.length || 0})
        </h3>
        <div className="divide-y divide-white/[0.04]">
          {(o.items || []).map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              {item.image
                ? <img src={item.image} alt={item.title} className="w-12 h-12 object-contain rounded-xl bg-white/[0.04] flex-shrink-0" />
                : <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex-shrink-0" />
              }
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white truncate">{item.title}</p>
                <p className="text-[11px] text-white/35 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="text-[14px] font-semibold text-white flex-shrink-0">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping */}
      {o.shippingAddress && (
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-[12px] font-semibold text-white/35 uppercase tracking-wider mb-3">Shipping Address</h3>
          <div className="text-[13px] text-white/60 space-y-0.5">
            <p>{o.shippingAddress.address}</p>
            <p>{o.shippingAddress.city}, {o.shippingAddress.postalCode}</p>
            <p>{o.shippingAddress.country}</p>
          </div>
        </div>
      )}
    </div>
  );
}
