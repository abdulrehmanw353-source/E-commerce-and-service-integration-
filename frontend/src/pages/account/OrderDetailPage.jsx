import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Package, MapPin, CheckCircle, Clock, ShoppingBag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const fetchOrder = (id) =>
  api.get(`/orders/${id}`).then(r => r.data.data ?? r.data);

const STATUS_COLOR = {
  pending:    'bg-yellow-500/15 text-yellow-300 border border-yellow-500/25',
  paid:       'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  shipped:    'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25',
  delivered:  'bg-green-500/15 text-green-300 border border-green-500/25',
  cancelled:  'bg-red-500/15 text-red-300 border border-red-500/25',
  failed:     'bg-red-500/15 text-red-300 border border-red-500/25',
};

export default function OrderDetailPage() {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['my-order', id],
    queryFn: () => fetchOrder(id),
    enabled: !!id,
  });

  const cancelMut = useMutation({
    mutationFn: () => api.put(`/orders/${id}/cancel`),
    onSuccess: () => {
      toast.success('Order cancelled successfully');
      queryClient.invalidateQueries(['my-order', id]);
      queryClient.invalidateQueries(['my-orders']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    },
  });

  if (isLoading) return (
    <div className="min-h-screen">
      <div className="apple-section-wide pt-8 pb-16 space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-white/[0.06] rounded-full" />
        <div className="h-48 bg-white/[0.06] rounded-2xl" />
      </div>
    </div>
  );

  if (isError || !order) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 ds-card">
        <Package className="w-12 h-12 text-white/25 mx-auto mb-4" strokeWidth={1.5} />
        <h2 className="text-[21px] font-semibold text-white mb-2">Order not found</h2>
        <Link to="/account/orders"
          className="inline-flex items-center gap-1.5 px-6 py-3 ds-btn-primary rounded-xl text-[14px] font-semibold transition-all">
          Back to Orders
        </Link>
      </div>
    </div>
  );

  const items = order.items ?? order.orderItems ?? [];
  const shippingAddr = order.shippingAddress ?? {};

  return (
    <div className="min-h-screen">
      <div className="apple-section-wide pt-8 pb-16">
        {/* Back nav */}
        <Link to="/account/orders"
          className="inline-flex items-center gap-1.5 text-[14px] text-white/45 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" strokeWidth={2} /> My Orders
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[26px] sm:text-[32px] font-extrabold tracking-[-0.03em] text-white">
              Order <span className="font-mono text-white/50">#{id?.slice(-8)?.toUpperCase()}</span>
            </h1>
            <p className="text-[14px] text-white/45 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              })}
            </p>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <span className={`text-[12px] font-semibold uppercase px-3 py-1 rounded-full ${STATUS_COLOR[order.status] || 'bg-white/[0.06] text-white/45'}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* Left: Items */}
          <div className="space-y-5">
            <div className="ds-card p-5 sm:p-6">
              <h2 className="text-[15px] font-bold text-white mb-5">Order Items</h2>
              <div className="space-y-4">
                {items.map((item, i) => {
                  const product = item.product ?? {};
                  const image = item.image ?? product.images?.[0];
                  const title = item.title ?? product.title ?? 'Unknown';
                  const price = item.price ?? product.price ?? 0;
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/[0.04] border border-white/[0.06] rounded-xl flex-shrink-0 overflow-hidden">
                        {image
                          ? <img src={image} alt={title} className="w-full h-full object-contain p-1" />
                          : <ShoppingBag className="w-6 h-6 text-white/20 m-auto mt-5" strokeWidth={1.5} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-white line-clamp-1">{title}</p>
                        <p className="text-[13px] text-white/45 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-[15px] font-bold text-white flex-shrink-0">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price * (item.quantity ?? 1))}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Summary & Info */}
          <div className="space-y-5">
            <div className="ds-card p-5 sm:p-6">
              <h2 className="text-[15px] font-bold text-white mb-4">Summary</h2>
              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between">
                  <span className="text-white/45">Items</span>
                  <span className="text-white">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/45">Payment Status</span>
                  <span className={`capitalize font-medium ${order.paymentStatus === 'paid' ? 'text-[#00f5d4]' : 'text-yellow-400'}`}>
                    {order.paymentStatus ?? 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/[0.06]">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-[20px] font-bold text-[#00f5d4]">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalAmount ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            {(shippingAddr.street || shippingAddr.city) && (
              <div className="ds-card p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[#7a5cff]" strokeWidth={2} />
                  <h2 className="text-[15px] font-bold text-white">Shipping Address</h2>
                </div>
                <p className="text-[14px] text-white/60 leading-relaxed">
                  {shippingAddr.street}{shippingAddr.city ? `, ${shippingAddr.city}` : ''}
                  {shippingAddr.state ? `, ${shippingAddr.state}` : ''}
                  {shippingAddr.country ? `, ${shippingAddr.country}` : ''}
                </p>
              </div>
            )}

            {order.status === 'pending' && (
              <div className="ds-card p-5 sm:p-6">
                <h2 className="text-[15px] font-bold text-white mb-3">Cancel Order</h2>
                <p className="text-[13px] text-white/50 mb-4">You can cancel this order before it is processed or shipped.</p>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
                      cancelMut.mutate();
                    }
                  }}
                  disabled={cancelMut.isPending}
                  className="w-full py-3.5 bg-[#ff3b57]/10 hover:bg-[#ff3b57]/20 border border-[#ff3b57]/30 text-[#ff5e7d] rounded-xl text-[13px] font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                  {cancelMut.isPending ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
