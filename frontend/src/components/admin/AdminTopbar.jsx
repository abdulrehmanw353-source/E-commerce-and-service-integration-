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
  if (pathname === '/admin/services') return 'Services';
  if (pathname === '/admin/services/new') return 'Add Service';
  if (/^\/admin\/services\/.+\/edit$/.test(pathname)) return 'Edit Service';
  if (pathname === '/admin/time-slots') return 'Time Slots';
  if (pathname === '/admin/customers') return 'Customers';
  if (/^\/admin\/customers\/.+$/.test(pathname)) return 'Customer Detail';
  if (pathname === '/admin/technicians') return 'Technicians';
  if (pathname === '/admin/technicians/new') return 'Add Technician';
  if (/^\/admin\/technicians\/.+\/edit$/.test(pathname)) return 'Edit Technician';
  if (pathname === '/admin/analytics') return 'Analytics';
  if (pathname === '/admin/chat') return 'Support Chat';
  return 'Admin';
}

export default function AdminTopbar({ onToggleSidebar }) {
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);

  return (
    <header className="h-[64px] flex items-center justify-between px-4 sm:px-6 bg-[#12182a] border-b border-white/[0.08] flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-150"
        >
          <Menu className="w-4 h-4" strokeWidth={1.75} />
        </button>
        <h1 className="text-[16px] font-semibold text-white tracking-[-0.01em]">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-white hover:text-white hover:bg-[#7a5cff]/15 transition-all duration-150 relative border border-[#7a5cff]/30">
          <Bell className="w-4 h-4" strokeWidth={1.75} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff5e7d]" />
        </button>
      </div>
    </header>
  );
}
