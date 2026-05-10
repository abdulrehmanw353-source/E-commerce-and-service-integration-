import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, ShoppingBag, Package, MapPin, User, Calendar,
  AlertCircle, ChevronRight, Clock
} from 'lucide-react';
import adminApi from '../../lib/adminAxios';

const fetchOrder = (id) =>
  adminApi.get(`/admin/orders/${id}`).then(r => r.data.data ?? r.data);
const updateStatus = ({ id, status, paymentStatus }) =>
  adminApi.patch(`/admin/orders/${id}/status`, { status, paymentStatus }).then(r => r.data);

import toast from 'react-hot-toast';

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed'];

const STATUS_COLOR = {
  pending:    'bg-yellow-500/15 text-yellow-300',
  paid:       'bg-emerald-500/15 text-emerald-300',
  shipped:    'bg-indigo-500/15 text-indigo-300',
  delivered:  'bg-green-500/15 text-green-300',
  cancelled:  'bg-red-500/15 text-red-300',
  failed:     'bg-red-500/15 text-red-300',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => fetchOrder(id),
    enabled: !!id,
  });

  const statusMut = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      qc.invalidateQueries(['admin-order', id]);
      qc.invalidateQueries(['admin-orders']);
      toast.success('Order status updated.');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update.'),
  });

  if (isLoading) return (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-8 w-48 bg-white/[0.06] rounded-xl" />
      <div className="h-64 bg-white/[0.06] rounded-2xl" />
    </div>
  );

  if (isError || !order) return (
    <div className="p-6 text-center">
      <AlertCircle className="w-10 h-10 text-white/20 mx-auto mb-3" strokeWidth={1.5} />
      <p className="text-white/40">Order not found.</p>
      <Link to="/admin/orders" className="text-[#0071E3] text-[13px] mt-2 inline-block">← Back to Orders</Link>
    </div>
  );

  const items = order.items ?? order.orderItems ?? [];
  const customer = order.user ?? order.customer ?? {};
  const shippingAddr = order.shippingAddress ?? customer.address ?? {};

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/orders"
          className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
        </Link>
        <div>
          <h1 className="text-[18px] font-semibold text-white">
            Order <span className="font-mono text-white/50">#{id?.slice(-8)?.toUpperCase()}</span>
          </h1>
          <p className="text-[12px] text-white/35 mt-0.5">
            {order.createdAt && new Date(order.createdAt).toLocaleDateString('en-US', {
              weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1fr_340px] gap-5">
        {/* ─── Left ─── */}
        <div className="space-y-5">
          {/* Items */}
          <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-white/40" strokeWidth={1.75} />
                <h2 className="text-[14px] font-semibold text-white/70 uppercase tracking-wider">
                  Items ({items.length})
                </h2>
              </div>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {items.length === 0
                ? <p className="px-5 py-8 text-center text-[13px] text-white/25">No items</p>
                : items.map((item, i) => {
                    const product = item.product ?? {};
                    const image = item.image ?? product.images?.[0];
                    const title = item.title ?? product.title ?? 'Unknown';
                    const price = item.price ?? product.price ?? 0;
                    return (
                      <div key={i} className="flex items-center gap-4 px-5 py-4">
                        <div className="w-14 h-14 bg-white/[0.04] rounded-xl flex-shrink-0 overflow-hidden">
                          {image
                            ? <img src={image} alt={title} className="w-full h-full object-contain p-1" />
                            : <ShoppingBag className="w-6 h-6 text-white/20 m-auto mt-4" strokeWidth={1.5} />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-medium text-white line-clamp-1">{title}</p>
                          <p className="text-[12px] text-white/40 mt-0.5">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-[14px] font-semibold text-white flex-shrink-0">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price * (item.quantity ?? 1))}
                        </p>
                      </div>
                    );
                  })
              }
            </div>
            <div className="px-5 py-4 border-t border-white/[0.06] flex justify-between items-center">
              <span className="text-[14px] font-bold text-white/70">Total</span>
              <span className="text-[20px] font-bold text-white">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalAmount ?? 0)}
              </span>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-white/40" strokeWidth={1.75} />
              <h2 className="text-[13px] font-semibold text-white/50 uppercase tracking-wider">Customer</h2>
            </div>
            <p className="text-[15px] font-semibold text-white">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="text-[13px] text-white/40 mt-0.5">{customer.email}</p>
            {customer.phoneNo && <p className="text-[13px] text-white/40 mt-0.5">{customer.phoneNo}</p>}
          </div>

          {/* Shipping */}
          {(shippingAddr.street || shippingAddr.city) && (
            <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-white/40" strokeWidth={1.75} />
                <h2 className="text-[13px] font-semibold text-white/50 uppercase tracking-wider">Shipping Address</h2>
              </div>
              <p className="text-[14px] text-white/70 leading-relaxed">
                {shippingAddr.street}{shippingAddr.city ? `, ${shippingAddr.city}` : ''}
                {shippingAddr.state ? `, ${shippingAddr.state}` : ''}
                {shippingAddr.country ? `, ${shippingAddr.country}` : ''}
              </p>
            </div>
          )}
        </div>

        {/* ─── Right ─── */}
        <div className="space-y-5">
          {/* Current Status */}
          <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
            <h2 className="text-[13px] font-semibold text-white/50 uppercase tracking-wider mb-4">Order Status</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-[12px] font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLOR[order.status] || 'bg-white/[0.06] text-white/50'}`}>
                {order.status}
              </span>
              <span className={`text-[12px] font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLOR[order.paymentStatus] || 'bg-white/[0.06] text-white/50'}`}>
                {order.paymentStatus ?? 'pending'}
              </span>
            </div>

            {/* Update Status */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-white/35 uppercase tracking-wider mb-1.5 block">Order Status</label>
                <select
                  defaultValue={order.status}
                  onChange={e => statusMut.mutate({ id, status: e.target.value })}
                  disabled={statusMut.isPending}
                  className="w-full bg-[#2C2C2E] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none focus:border-[#0071E3] transition-all cursor-pointer"
                >
                  {ORDER_STATUSES.map(s => (
                    <option key={s} value={s} className="bg-[#1C1C1E] capitalize">{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-white/35 uppercase tracking-wider mb-1.5 block">Payment Status</label>
                <select
                  defaultValue={order.paymentStatus ?? 'pending'}
                  onChange={e => statusMut.mutate({ id, paymentStatus: e.target.value })}
                  disabled={statusMut.isPending}
                  className="w-full bg-[#2C2C2E] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none focus:border-[#0071E3] transition-all cursor-pointer"
                >
                  {PAYMENT_STATUSES.map(s => (
                    <option key={s} value={s} className="bg-[#1C1C1E] capitalize">{s}</option>
                  ))}
                </select>
              </div>
              {statusMut.isPending && (
                <p className="text-[12px] text-white/35 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 animate-spin" /> Saving…
                </p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5 space-y-2.5">
            <h2 className="text-[13px] font-semibold text-white/50 uppercase tracking-wider mb-3">Summary</h2>
            <div className="flex justify-between text-[13px]">
              <span className="text-white/40">Items</span>
              <span className="text-white/70">{items.length}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-white/40">Payment</span>
              <span className={`capitalize font-medium ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                {order.paymentStatus ?? 'Pending'}
              </span>
            </div>
            <div className="flex justify-between text-[15px] pt-2 border-t border-white/[0.06]">
              <span className="text-white font-semibold">Total</span>
              <span className="text-white font-bold">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalAmount ?? 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
