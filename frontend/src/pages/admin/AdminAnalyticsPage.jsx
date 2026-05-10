import { useState } from 'react';
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
  const [tab, setTab] = useState('revenue');
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
      <div className="flex flex-wrap gap-2">
        {['revenue', 'orders', 'products', 'categories'].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize ${tab === item ? 'ds-btn-primary' : 'ds-btn-outline'}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="ds-card p-4 sm:p-5 min-h-[420px]">
        {tab === 'revenue' && (
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="anaRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9d84ff" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#9d84ff" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey={revenueLabelKey} tick={{ fill: '#d4ccf0', fontSize: 12 }} />
                <YAxis tick={{ fill: '#d4ccf0', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#131a2f', border: '1px solid rgba(157,132,255,0.5)', borderRadius: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#b8a8ff" fill="url(#anaRevenue)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === 'orders' && (
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey={ordersLabelKey} tick={{ fill: '#d4ccf0', fontSize: 12 }} />
                <YAxis tick={{ fill: '#d4ccf0', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#131a2f', border: '1px solid rgba(157,132,255,0.5)', borderRadius: 12 }} />
                <Bar dataKey="count" fill="#9d84ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === 'products' && (
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productsData}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey={(d) => d.title?.slice(0, 14) || 'N/A'} tick={{ fill: '#d4ccf0', fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={70} />
                <YAxis tick={{ fill: '#d4ccf0', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#131a2f', border: '1px solid rgba(157,132,255,0.5)', borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="revenue" fill="#57b3ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === 'categories' && (
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoriesData} dataKey="count" nameKey="_id" innerRadius={90} outerRadius={140}>
                  {categoriesData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#131a2f', border: '1px solid rgba(157,132,255,0.5)', borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
