import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Users, Calendar,
  MessageSquare, LogOut, Zap, Clock
} from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import adminApi from '../../lib/adminAxios';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard',   to: '/admin',              icon: LayoutDashboard, end: true },
  { label: 'Products',    to: '/admin/products',     icon: Package },
  { label: 'Orders',      to: '/admin/orders',       icon: ShoppingBag },
  { label: 'Bookings',    to: '/admin/bookings',     icon: Calendar },
  { label: 'Time Slots',  to: '/admin/time-slots',   icon: Clock },
  { label: 'Users',       to: '/admin/users',        icon: Users },
  { label: 'Support',     to: '/admin/chat',         icon: MessageSquare },
];

export default function AdminSidebar({ collapsed }) {
  const navigate = useNavigate();
  const { logout, user } = useAdminAuthStore();

  const handleLogout = async () => {
    try { await adminApi.post('/auth/admin/logout'); } catch {}
    logout();
    toast.success('Signed out.');
    navigate('/admin/login');
  };

  return (
    <aside className={`
      flex flex-col h-full bg-[#111111] border-r border-white/[0.06]
      transition-all duration-300 ease-out
      ${collapsed ? 'w-[64px]' : 'w-[220px]'}
    `}>
      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] flex-shrink-0`}>
        <div className="w-8 h-8 rounded-[10px] bg-[#0071E3] flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-white tracking-[-0.01em] leading-tight truncate">TechStore</p>
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
                ? 'bg-white/10 text-white'
                : 'text-white/45 hover:text-white/80 hover:bg-white/[0.05]'}
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
      <div className="px-2 py-3 border-t border-white/[0.06] space-y-1 flex-shrink-0">
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-[#0071E3] flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-white">{user.firstName?.[0]?.toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-white/80 truncate leading-tight">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-white/35 truncate leading-tight capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
            text-white/45 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150
            ${collapsed ? 'justify-center px-2' : ''}
          `}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
