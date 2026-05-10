import { useQuery } from '@tanstack/react-query';
import {
  DollarSign, ShoppingBag, Users, Calendar,
  TrendingUp, Package, ChevronRight, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import adminApi from '../../lib/adminAxios';
import StatusBadge from '../../components/admin/StatusBadge';

// ─── Fetchers ─────────────────────────────────────────────────
const fetchStats       = () => adminApi.get('/admin/dashboard/stats').then(r => r.data.data);
const fetchRecentOrders= () => adminApi.get('/admin/dashboard/recent-orders').then(r => r.data.data);
const fetchRevenue     = () => adminApi.get('/admin/dashboard/analytics/revenue').then(r => r.data.data);
const fetchOrderStats  = () => adminApi.get('/admin/dashboard/analytics/orders').then(r => r.data.data);
const fetchCategories  = () => adminApi.get('/admin/dashboard/analytics/categories').then(r => r.data.data);
const fetchRecentCustomers = () => adminApi.get('/admin/dashboard/recent-customers').then(r => r.data.data);

const PIE_COLORS = ['#0071E3','#34C759','#FF9500','#AF52DE','#FF2D55','#5AC8FA'];

// ─── Stat Card ──────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
        </div>
        <TrendingUp className="w-4 h-4 text-green-400 opacity-60" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[13px] text-white/40 font-medium mb-0.5">{label}</p>
        <p className="text-[28px] font-bold text-white tracking-[-0.03em] leading-tight">{value ?? '—'}</p>
        {sub && <p className="text-[12px] text-white/30 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Chart Tooltip ───────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#2C2C2E] border border-white/[0.08] rounded-xl px-3 py-2 text-[13px]">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: stats }    = useQuery({ queryKey: ['admin-stats'],        queryFn: fetchStats,        staleTime: 60_000 });
  const { data: orders }   = useQuery({ queryKey: ['admin-recent-orders'],queryFn: fetchRecentOrders, staleTime: 60_000 });
  const { data: revenue }  = useQuery({ queryKey: ['admin-revenue'],      queryFn: fetchRevenue,      staleTime: 60_000 });
  const { data: orderAna } = useQuery({ queryKey: ['admin-order-stats'],  queryFn: fetchOrderStats,   staleTime: 60_000 });
  const { data: cats }     = useQuery({ queryKey: ['admin-categories'],   queryFn: fetchCategories,   staleTime: 60_000 });
  const { data: customers }= useQuery({ queryKey: ['admin-customers'],    queryFn: fetchRecentCustomers, staleTime: 60_000 });

  const fmt = (n) => n !== undefined && n !== null
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
    : '—';

  // Normalise revenue data
  const revenueData = Array.isArray(revenue) ? revenue : (revenue?.monthly || revenue?.daily || []);
  const orderData   = Array.isArray(orderAna) ? orderAna : (orderAna?.monthly || orderAna?.daily || []);
  const catData     = Array.isArray(cats) ? cats : (cats?.categories || []);
  const recentOrders  = Array.isArray(orders) ? orders : (orders?.orders || []);
  const recentCustomers = Array.isArray(customers) ? customers : (customers?.customers || customers?.users || []);

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={fmt(stats?.totalRevenue ?? stats?.revenue)}
          icon={DollarSign}
          color="bg-[#0071E3]"
          sub="All time"
        />
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders ?? stats?.orders ?? '—'}
          icon={ShoppingBag}
          color="bg-[#34C759]"
          sub="All time"
        />
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? stats?.users ?? '—'}
          icon={Users}
          color="bg-[#AF52DE]"
          sub="Registered"
        />
        <StatCard
          label="Total Bookings"
          value={stats?.totalBookings ?? stats?.bookings ?? '—'}
          icon={Calendar}
          color="bg-[#FF9500]"
          sub="All time"
        />
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[14px] font-semibold text-white">Revenue</h3>
              <p className="text-[12px] text-white/35 mt-0.5">Monthly trend</p>
            </div>
          </div>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"   stopColor="#0071E3" stopOpacity={0.3} />
                    <stop offset="95%"  stopColor="#0071E3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey={Object.keys(revenueData[0] || {}).find(k => k !== 'revenue' && k !== 'total') || '_id'}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0071E3"
                  strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#0071E3' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center">
              <p className="text-[13px] text-white/25">No revenue data yet</p>
            </div>
          )}
        </div>

        {/* Category Pie */}
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
          <div className="mb-5">
            <h3 className="text-[14px] font-semibold text-white">Categories</h3>
            <p className="text-[12px] text-white/35 mt-0.5">Product distribution</p>
          </div>
          {catData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={catData} dataKey="count" nameKey="_id" cx="50%" cy="45%"
                  innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {catData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center">
              <p className="text-[13px] text-white/25">No category data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Orders Bar ─── */}
      {orderData.length > 0 && (
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5">
          <div className="mb-5">
            <h3 className="text-[14px] font-semibold text-white">Orders</h3>
            <p className="text-[12px] text-white/35 mt-0.5">Monthly volume</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={orderData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey={Object.keys(orderData[0] || {}).find(k => k !== 'count' && k !== 'orders') || '_id'}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="Orders" fill="#34C759" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ─── Recent Orders + Customers ─── */}
      <div className="grid xl:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-[14px] font-semibold text-white">Recent Orders</h3>
            <Link to="/admin/orders" className="text-[12px] text-[#0071E3] flex items-center gap-0.5 hover:opacity-80">
              View all <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-[13px] text-white/25 text-center">No recent orders</p>
            ) : recentOrders.slice(0, 5).map((order) => (
              <Link
                key={order._id}
                to={`/admin/orders/${order._id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-white truncate">
                    #{order._id?.slice(-8)?.toUpperCase()}
                  </p>
                  <p className="text-[11px] text-white/35 truncate mt-0.5">
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <StatusBadge status={order.status} />
                  <span className="text-[13px] font-semibold text-white">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalAmount)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-[14px] font-semibold text-white">Recent Customers</h3>
            <Link to="/admin/users" className="text-[12px] text-[#0071E3] flex items-center gap-0.5 hover:opacity-80">
              View all <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentCustomers.length === 0 ? (
              <p className="px-5 py-8 text-[13px] text-white/25 text-center">No recent customers</p>
            ) : recentCustomers.slice(0, 5).map((u) => (
              <div key={u._id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-8 h-8 rounded-full bg-[#0071E3]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-bold text-[#0071E3]">
                    {u.firstName?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-white truncate">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-[11px] text-white/35 truncate">{u.email}</p>
                </div>
                <StatusBadge status={u.role} />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
