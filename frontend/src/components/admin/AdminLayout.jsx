import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} />

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopbar onToggleSidebar={() => setCollapsed(c => !c)} />
        <main className="flex-1 overflow-y-auto bg-[#0A0A0A]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
