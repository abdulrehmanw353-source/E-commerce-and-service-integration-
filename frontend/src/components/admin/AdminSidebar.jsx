import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, ShoppingBag, Package, Users, Calendar,
  MessageSquare, LogOut, Zap, Clock, Wrench, BarChart3, ChevronUp, Layers, CreditCard, Truck, Shield
} from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import adminApi from '../../lib/adminAxios';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard',   to: '/admin',              icon: LayoutDashboard, end: true },
  { label: 'Products',    to: '/admin/products',     icon: Package },
  { label: 'Orders',      to: '/admin/orders',       icon: ShoppingBag },
  { label: 'Bookings',    to: '/admin/bookings',     icon: Calendar },
  { label: 'Services',    to: '/admin/services',     icon: Layers },
  { label: 'Time Slots',  to: '/admin/time-slots',   icon: Clock },
  { label: 'Customers',   to: '/admin/customers',    icon: Users },
  { label: 'Technicians', to: '/admin/technicians',  icon: Wrench },
  { label: 'Analytics',   to: '/admin/analytics',    icon: BarChart3 },
  { label: 'Payments',    to: '/admin/payments',     icon: CreditCard },
  { label: 'Delivery & Taxes', to: '/admin/delivery-tax', icon: Truck },
  { label: 'Service Rules', to: '/admin/service-settings', icon: Shield },
  { label: 'Support',     to: '/admin/chat',         icon: MessageSquare },
];

export default function AdminSidebar({ collapsed }) {
  const navigate = useNavigate();
  const { logout, user } = useAdminAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try { await adminApi.post('/auth/admin/logout'); } catch { /* ignore */ }
    logout();
    toast.success('Signed out.');
    navigate('/admin/login');
  };

  return (
    <aside className={`
      flex flex-col h-full bg-[#0f1425] border-r border-white/[0.08]
      transition-all duration-300 ease-out
      ${collapsed ? 'w-[64px]' : 'w-[220px]'}
    `}>
      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.08] flex-shrink-0`}>
        <div className="w-8 h-8 rounded-[10px] bg-[#7a5cff] flex items-center justify-center flex-shrink-0 shadow-[0_0_18px_rgba(122,92,255,0.45)]">
          <Zap className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-white tracking-[-0.01em] leading-tight truncate">DoorSetFix</p>
            <p className="text-[11px] text-white/35 leading-tight">Admin Console</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            id={`admin-nav-${label.toLowerCase()}`}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
              transition-all duration-150 group
              ${isActive
                ? 'bg-gradient-to-r from-[#6f50ff] to-[#8c72ff] text-white shadow-[0_0_20px_rgba(122,92,255,0.35)]'
                : 'text-white/80 hover:text-white/90 hover:bg-white/[0.05]'}
              ${collapsed ? 'justify-center px-2' : ''}
            `}
            title={collapsed ? label : undefined}
          >
            <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-2 py-3 border-t border-white/[0.08] space-y-1 flex-shrink-0">
        {!collapsed && user && (
          <div className="relative">
          <button
            onClick={() => setShowProfileMenu((s) => !s)}
            className="w-full flex items-center justify-between gap-2.5 px-3 py-2 mb-1 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] transition-all"
          >
            <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#7a5cff] flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-white">{user.firstName?.[0]?.toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-white/80 truncate leading-tight">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-white/35 truncate leading-tight capitalize">{user.role}</p>
            </div>
            </div>
            <ChevronUp className={`w-3.5 h-3.5 text-white/55 transition-transform ${showProfileMenu ? '' : 'rotate-180'}`} />
          </button>
          {showProfileMenu && (
            <div className="absolute left-0 right-0 bottom-[52px] rounded-xl border border-white/10 bg-[#11182e] shadow-2xl overflow-hidden z-20">
              <Link to="/admin/settings" className="block px-3 py-2.5 text-[12px] text-white/85 hover:bg-white/[0.06]">
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 text-[12px] font-semibold text-white bg-[#ff3b57] hover:bg-[#ff5e7d] transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
          </div>
        )}
        {collapsed && (
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
              text-[#ffc4d1] bg-[#ff5e7d]/10 border border-[#ff5e7d]/30 hover:bg-[#ff5e7d]/20 hover:text-white transition-all duration-150
              justify-center px-2
            `}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </aside>
  );
}
