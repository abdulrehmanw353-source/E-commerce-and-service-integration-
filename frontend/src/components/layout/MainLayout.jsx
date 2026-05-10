import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import CartSlideOut from '../cart/CartSlideOut';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <CartSlideOut />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

