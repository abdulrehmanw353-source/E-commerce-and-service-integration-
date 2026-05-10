import { Menu, Bell } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAdminSocket, initAdminSocket } from '../../lib/socket';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import toast from 'react-hot-toast';

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
  const { accessToken } = useAdminAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    
    // Ensure socket is initialized (it's safe to call multiple times)
    const socket = initAdminSocket(accessToken);

    const onConversationUpdated = (data) => {
      // Only notify if the customer sent the message
      if (data.senderRole === 'customer') {
        const newNotif = {
          id: Date.now(),
          text: `New message: "${data.lastMessage}"`,
          time: new Date(),
          link: '/admin/chat'
        };
        setNotifications(prev => [newNotif, ...prev].slice(0, 5)); // keep last 5
        toast.success(`New message from customer!`);
      }
    };

    socket.on('conversationUpdated', onConversationUpdated);

    return () => {
      socket.off('conversationUpdated', onConversationUpdated);
    };
  }, [accessToken]);

  const unreadCount = notifications.length;

  return (
    <header className="h-[64px] flex items-center justify-between px-4 sm:px-6 bg-[#12182a] border-b border-white/[0.08] flex-shrink-0 z-40 relative">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-150"
        >
          <Menu className="w-4 h-4" strokeWidth={1.75} />
        </button>
        <h1 className="text-[16px] font-semibold text-white tracking-[-0.01em]">{title}</h1>
      </div>

      <div className="flex items-center gap-2 relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 relative border ${showDropdown || unreadCount > 0 ? 'text-white border-[#7a5cff]/30 bg-[#7a5cff]/10' : 'text-white/60 border-transparent hover:bg-white/[0.08]'}`}
        >
          <Bell className="w-4 h-4" strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff5e7d]" />
          )}
        </button>

        {showDropdown && (
          <div className="absolute top-12 right-0 w-72 bg-[#1a1f33] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
            <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center">
              <span className="text-[13px] font-semibold text-white">Notifications</span>
              {unreadCount > 0 && (
                <button 
                  onClick={() => setNotifications([])}
                  className="text-[11px] text-[#7a5cff] hover:text-white transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-[12px] text-white/40 text-center py-6">No new notifications</p>
              ) : (
                notifications.map(n => (
                  <Link 
                    key={n.id} 
                    to={n.link}
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                  >
                    <p className="text-[12px] text-white/90 truncate">{n.text}</p>
                    <p className="text-[10px] text-white/40 mt-1">
                      {n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
