import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock3, ShoppingBag, ChevronRight, PlusCircle, UserCog, LifeBuoy } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminApi from '../../lib/adminAxios';
import StatusBadge from '../../components/admin/StatusBadge';

const fetchStats = () => adminApi.get('/admin/dashboard/stats').then((r) => r.data.data ?? r.data);
const fetchRecentOrders = () => adminApi.get('/admin/dashboard/recent-orders').then((r) => r.data.data ?? r.data);

function StatCard({ label, value, icon: Icon, sub }) {
  return (
    <div className="ds-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-white/70 text-[16px] font-semibold">{label}</p>
        <div className="w-9 h-9 rounded-xl bg-[#7a5cff]/20 border border-[#7a5cff]/40 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#b7a7ff]" />
        </div>
      </div>
      <p className="text-[56px] leading-none mt-4 font-bold tracking-[-0.03em] text-[#9d84ff]">{value ?? '—'}</p>
      <p className="text-[13px] text-white/45 mt-2">{sub}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: fetchStats, staleTime: 60_000 });
  const { data: orders } = useQuery({ queryKey: ['admin-recent-orders'], queryFn: fetchRecentOrders, staleTime: 60_000 });
  const recentOrders = Array.isArray(orders) ? orders : (orders?.orders || []);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-[48px] leading-none font-extrabold tracking-[-0.04em] text-white">
        Welcome back, <span className="text-[#8f74ff]">Admin!</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          label="Active Bookings"
          value={stats?.pendingBookings ?? stats?.totalBookings ?? '—'}
          icon={Clock3}
          sub="Currently in progress"
        />
        <StatCard
          label="Completed Services"
          value={stats?.completedBookings ?? '—'}
          icon={CheckCircle2}
          sub="Total successfully fixed"
        />
        <StatCard
          label="Pending Orders"
          value={stats?.pendingOrders ?? stats?.totalOrders ?? '—'}
          icon={ShoppingBag}
          sub="Awaiting parts or confirmation"
        />
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-4">
        <div className="ds-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
            <h3 className="text-[18px] font-semibold text-white">Recent Bookings</h3>
            <Link to="/admin/orders" className="text-[12px] text-[#9d84ff] flex items-center gap-0.5 hover:opacity-80">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-[13px] text-white/35 text-center">No recent bookings</p>
            ) : recentOrders.slice(0, 5).map((order) => (
              <div key={order._id} className="grid grid-cols-[1fr_160px_120px] gap-3 px-5 py-3.5 items-center">
                <div>
                  <p className="text-[14px] font-semibold text-white">#{order._id?.slice(-8)?.toUpperCase()}</p>
                  <p className="text-[12px] text-white/40">{order.user?.firstName} {order.user?.lastName}</p>
                </div>
                <StatusBadge status={order.status} />
                <Link to={`/admin/orders/${order._id}`} className="justify-self-end px-3 py-1.5 rounded-lg text-[12px] ds-btn-outline">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="ds-card p-5">
            <h3 className="text-[18px] font-semibold text-white">Upcoming Appointment</h3>
            <p className="text-white/55 text-sm mt-2">Next assigned technician details</p>
            <p className="text-white font-semibold mt-3">
              {recentOrders[0]?.user?.firstName ? `${recentOrders[0].user.firstName} ${recentOrders[0].user.lastName || ''}` : 'No appointment yet'}
            </p>
            <p className="text-white/45 text-xs mt-1">
              {recentOrders[0]?.createdAt ? new Date(recentOrders[0].createdAt).toLocaleString() : 'No schedule'}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="rounded-xl py-2 ds-btn-primary text-[13px] font-semibold">Contact</button>
              <button className="rounded-xl py-2 ds-btn-outline text-[13px] font-semibold">Reschedule</button>
            </div>
          </div>

          <div className="ds-card p-4">
            <h3 className="text-[18px] font-semibold text-white px-1 pb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/admin/bookings" className="ds-card p-4 text-center">
                <PlusCircle className="w-5 h-5 mx-auto text-[#9d84ff]" />
                <p className="text-[12px] mt-2 text-white/85">New Booking</p>
              </Link>
              <Link to="/admin/orders" className="ds-card p-4 text-center">
                <ShoppingBag className="w-5 h-5 mx-auto text-[#9d84ff]" />
                <p className="text-[12px] mt-2 text-white/85">View Orders</p>
              </Link>
              <Link to="/admin/users" className="ds-card p-4 text-center">
                <UserCog className="w-5 h-5 mx-auto text-[#9d84ff]" />
                <p className="text-[12px] mt-2 text-white/85">Manage Users</p>
              </Link>
              <Link to="/admin/chat" className="ds-card p-4 text-center">
                <LifeBuoy className="w-5 h-5 mx-auto text-[#9d84ff]" />
                <p className="text-[12px] mt-2 text-white/85">Support</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
