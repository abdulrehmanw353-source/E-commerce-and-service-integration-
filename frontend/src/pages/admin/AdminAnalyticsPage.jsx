import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import adminApi from '../../lib/adminAxios';

const COLORS = ['#9d84ff', '#57b3ff', '#6ee7b7', '#f59e0b', '#f472b6', '#a78bfa'];

const fetchRevenue = () => adminApi.get('/admin/dashboard/analytics/revenue').then((r) => r.data.data ?? r.data);
const fetchOrders = () => adminApi.get('/admin/dashboard/analytics/orders').then((r) => r.data.data ?? r.data);
const fetchProducts = () => adminApi.get('/admin/dashboard/analytics/products').then((r) => r.data.data ?? r.data);
const fetchCategories = () => adminApi.get('/admin/dashboard/analytics/categories').then((r) => r.data.data ?? r.data);

export default function AdminAnalyticsPage() {
  const { data: revenueRaw } = useQuery({ queryKey: ['ana-revenue'], queryFn: fetchRevenue, staleTime: 60_000 });
  const { data: ordersRaw } = useQuery({ queryKey: ['ana-orders'], queryFn: fetchOrders, staleTime: 60_000 });
  const { data: productsRaw } = useQuery({ queryKey: ['ana-products'], queryFn: fetchProducts, staleTime: 60_000 });
  const { data: categoriesRaw } = useQuery({ queryKey: ['ana-categories'], queryFn: fetchCategories, staleTime: 60_000 });

  const revenueData = Array.isArray(revenueRaw) ? revenueRaw : (revenueRaw?.monthly || revenueRaw?.daily || []);
  const ordersData = Array.isArray(ordersRaw) ? ordersRaw : (ordersRaw?.monthly || ordersRaw?.daily || []);
  const productsData = Array.isArray(productsRaw) ? productsRaw : (productsRaw?.products || []);
  const categoriesData = Array.isArray(categoriesRaw) ? categoriesRaw : (categoriesRaw?.categories || []);

  const revenueLabelKey = Object.keys(revenueData[0] || {}).find((k) => k !== 'revenue' && k !== 'total') || '_id';
  const ordersLabelKey = Object.keys(ordersData[0] || {}).find((k) => k !== 'count' && k !== 'orders') || '_id';

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <h2 className="text-[28px] font-bold text-white tracking-[-0.02em]">Analytics Overview</h2>

      <div className="grid gap-5">
        <section className="ds-card p-4 sm:p-5">
          <h3 className="text-[18px] font-semibold text-white mb-4">Revenue Trend</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="anaRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9d84ff" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#9d84ff" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey={revenueLabelKey} tick={{ fill: '#e2dcff', fontSize: 12 }} />
                <YAxis tick={{ fill: '#e2dcff', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#131a2f', border: '1px solid rgba(157,132,255,0.5)', borderRadius: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#c8baff" fill="url(#anaRevenue)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="ds-card p-4 sm:p-5">
          <h3 className="text-[18px] font-semibold text-white mb-4">Orders Volume</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey={ordersLabelKey} tick={{ fill: '#e2dcff', fontSize: 12 }} />
                <YAxis tick={{ fill: '#e2dcff', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#131a2f', border: '1px solid rgba(157,132,255,0.5)', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="count" fill="#9d84ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="ds-card p-4 sm:p-5">
          <h3 className="text-[18px] font-semibold text-white mb-4">Top Products Performance</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productsData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey={(d) => d.title?.slice(0, 14) || 'N/A'} tick={{ fill: '#e2dcff', fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={70} />
                <YAxis tick={{ fill: '#e2dcff', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#131a2f', border: '1px solid rgba(157,132,255,0.5)', borderRadius: 12, color: '#fff' }} />
                <Legend />
                <Bar dataKey="revenue" fill="#57b3ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="ds-card p-4 sm:p-5">
          <h3 className="text-[18px] font-semibold text-white mb-4">Category Distribution</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoriesData} dataKey="count" nameKey="_id" innerRadius={90} outerRadius={140}>
                  {categoriesData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#131a2f', border: '1px solid rgba(157,132,255,0.5)', borderRadius: 12, color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
