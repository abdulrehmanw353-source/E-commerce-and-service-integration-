import { Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

function getPageTitle(pathname) {
  if (pathname === '/admin') return 'Dashboard';
  if (pathname === '/admin/products') return 'Products';
  if (pathname === '/admin/products/create') return 'Add Product';
  if (/^\/admin\/products\/.+\/edit$/.test(pathname)) return 'Edit Product';
  if (pathname === '/admin/orders') return 'Orders';
  if (/^\/admin\/orders\/.+$/.test(pathname)) return 'Order Detail';
  if (pathname === '/admin/bookings') return 'Bookings';
  if (/^\/admin\/bookings\/.+$/.test(pathname)) return 'Booking Detail';
  if (pathname === '/admin/time-slots') return 'Time Slots';
  if (pathname === '/admin/users') return 'Users';
  if (pathname === '/admin/chat') return 'Support Chat';
  return 'Admin';
}

export default function AdminTopbar({ onToggleSidebar }) {
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);

  return (
    <header className="h-[52px] flex items-center justify-between px-4 sm:px-6 bg-[#111111] border-b border-white/[0.06] flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all duration-150"
        >
          <Menu className="w-4 h-4" strokeWidth={1.75} />
        </button>
        <h1 className="text-[15px] font-semibold text-white tracking-[-0.01em]">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all duration-150">
          <Bell className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}
