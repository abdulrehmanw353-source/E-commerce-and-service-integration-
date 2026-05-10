import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(max-width: 639px)')?.matches ?? false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 639px)');
    const onChange = (e) => setCollapsed(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return (
    <div className="h-screen overflow-hidden p-3 sm:p-5 bg-transparent" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif" }}>
      <div className="ds-shell h-full flex overflow-hidden">
        <AdminSidebar collapsed={collapsed} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <AdminTopbar onToggleSidebar={() => setCollapsed(c => !c)} />
          <main className="flex-1 overflow-y-auto bg-transparent">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
