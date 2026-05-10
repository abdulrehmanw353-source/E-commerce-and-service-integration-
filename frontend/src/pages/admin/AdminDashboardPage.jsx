import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock3, ShoppingBag, ChevronRight, PlusCircle, UserCog, LifeBuoy, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import adminApi from '../../lib/adminAxios';
import StatusBadge from '../../components/admin/StatusBadge';

const fetchStats = () => adminApi.get('/admin/dashboard/stats').then((r) => r.data.data ?? r.data);
const fetchRecentOrders = () => adminApi.get('/admin/dashboard/recent-orders').then((r) => r.data.data ?? r.data);
const fetchRevenue = () => adminApi.get('/admin/dashboard/analytics/revenue').then((r) => r.data.data ?? r.data);
const fetchOrdersAnalytics = () => adminApi.get('/admin/dashboard/analytics/orders').then((r) => r.data.data ?? r.data);

function StatCard({ label, value, icon: Icon, sub }) {
  return (
    <div className="ds-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-white/80 text-[16px] font-semibold">{label}</p>
        <div className="w-9 h-9 rounded-xl bg-[#7a5cff]/20 border border-[#7a5cff]/40 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#e5deff]" />
        </div>
      </div>
      <p className="text-[50px] leading-none mt-4 font-bold tracking-[-0.03em] text-[#b8a8ff]">{value ?? '—'}</p>
      <p className="text-[13px] text-white/50 mt-2">{sub}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('revenue');
  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: fetchStats, staleTime: 60_000 });
  const { data: orders } = useQuery({ queryKey: ['admin-recent-orders'], queryFn: fetchRecentOrders, staleTime: 60_000 });
  const { data: revenueDataRaw } = useQuery({ queryKey: ['admin-revenue'], queryFn: fetchRevenue, staleTime: 60_000 });
  const { data: orderDataRaw } = useQuery({ queryKey: ['admin-orders-analytics'], queryFn: fetchOrdersAnalytics, staleTime: 60_000 });
  const recentOrders = Array.isArray(orders) ? orders : (orders?.orders || []);
  const revenueData = Array.isArray(revenueDataRaw) ? revenueDataRaw : (revenueDataRaw?.monthly || revenueDataRaw?.daily || []);
  const ordersData = Array.isArray(orderDataRaw) ? orderDataRaw : (orderDataRaw?.monthly || orderDataRaw?.daily || []);

  const chartKeyRevenue = Object.keys(revenueData[0] || {}).find((k) => k !== 'revenue' && k !== 'total') || '_id';
  const chartKeyOrders = Object.keys(ordersData[0] || {}).find((k) => k !== 'count' && k !== 'orders') || '_id';

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-[48px] leading-none font-extrabold tracking-[-0.04em] text-white">
        Welcome back, <span className="text-[#8f74ff]">Admin!</span>
      </h2>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Revenue" value={`$${Math.round(stats?.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} sub="Total revenue" />
        <StatCard label="Active Bookings" value={stats?.pendingBookings ?? stats?.totalBookings ?? '—'} icon={Clock3} sub="Currently in progress" />
        <StatCard label="Completed Services" value={stats?.completedBookings ?? '—'} icon={CheckCircle2} sub="Total successfully fixed" />
        <StatCard label="Pending Orders" value={stats?.pendingOrders ?? stats?.totalOrders ?? '—'} icon={ShoppingBag} sub="Awaiting confirmation" />
      </div>

      <div className="ds-card p-4 sm:p-5">
        <div className="flex gap-2 mb-4">
          {[
            { key: 'revenue', label: 'Revenue' },
            { key: 'orders', label: 'Orders' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key ? 'ds-btn-primary' : 'ds-btn-outline'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="h-[260px]">
          {activeTab === 'revenue' ? (
            revenueData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="purpleRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9d84ff" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#9d84ff" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey={chartKeyRevenue} tick={{ fill: '#c9bfef', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#c9bfef', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#171d31', border: '1px solid rgba(157,132,255,0.4)', borderRadius: 10, color: '#fff' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#b8a8ff" fill="url(#purpleRevenue)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-white/40">No revenue data available</div>
          ) : (
            ordersData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey={chartKeyOrders} tick={{ fill: '#c9bfef', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#c9bfef', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#171d31', border: '1px solid rgba(157,132,255,0.4)', borderRadius: 10, color: '#fff' }} />
                  <Bar dataKey="count" fill="#9d84ff" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-white/40">No orders data available</div>
          )}
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-4">
        <div className="ds-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
            <h3 className="text-[18px] font-semibold text-white">Recent Orders</h3>
            <Link to="/admin/orders" className="text-[12px] text-[#d7ccff] flex items-center gap-0.5 hover:opacity-80">
              View all <ChevronRight className="w-3 h-3 text-white" />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-[13px] text-white/35 text-center">No recent orders</p>
            ) : recentOrders.slice(0, 5).map((order) => (
              <div key={order._id} className="grid grid-cols-[1fr_160px_130px] gap-3 px-5 py-3.5 items-center">
                <div>
                  <p className="text-[14px] font-semibold text-white">#{order._id?.slice(-8)?.toUpperCase()}</p>
                  <p className="text-[12px] text-white/50">{order.user?.firstName} {order.user?.lastName}</p>
                </div>
                <StatusBadge status={order.status} />
                <Link to={`/admin/orders/${order._id}`} className="justify-self-end px-3 py-1.5 rounded-lg text-[12px] ds-btn-outline text-white">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="ds-card p-5">
            <h3 className="text-[18px] font-semibold text-white">Upcoming Appointment</h3>
            <p className="text-white/55 text-sm mt-2">Next customer in queue</p>
            <p className="text-white font-semibold mt-3">
              {recentOrders[0]?.user?.firstName ? `${recentOrders[0].user.firstName} ${recentOrders[0].user.lastName || ''}` : 'No appointment yet'}
            </p>
            <p className="text-white/45 text-xs mt-1">
              {recentOrders[0]?.createdAt ? new Date(recentOrders[0].createdAt).toLocaleString() : 'No schedule'}
            </p>
          </div>

          <div className="ds-card p-4">
            <h3 className="text-[18px] font-semibold text-white px-1 pb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/admin/bookings" className="ds-card p-4 text-center">
                <PlusCircle className="w-5 h-5 mx-auto text-white" />
                <p className="text-[12px] mt-2 text-white">Bookings</p>
              </Link>
              <Link to="/admin/orders" className="ds-card p-4 text-center">
                <ShoppingBag className="w-5 h-5 mx-auto text-white" />
                <p className="text-[12px] mt-2 text-white">Orders</p>
              </Link>
              <Link to="/admin/customers" className="ds-card p-4 text-center">
                <UserCog className="w-5 h-5 mx-auto text-white" />
                <p className="text-[12px] mt-2 text-white">Customers</p>
              </Link>
              <Link to="/admin/chat" className="ds-card p-4 text-center">
                <LifeBuoy className="w-5 h-5 mx-auto text-white" />
                <p className="text-[12px] mt-2 text-white">Support</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
