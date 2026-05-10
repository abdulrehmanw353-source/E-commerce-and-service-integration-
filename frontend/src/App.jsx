import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/queryClient';
import { useInitAuth } from './hooks/useInitAuth';

// Pages — Storefront
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ServicesPage from './pages/ServicesPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import NotFoundPage from './pages/NotFoundPage';

// Pages — Customer Auth
import CustomerLoginPage from './pages/auth/CustomerLoginPage';
import CustomerRegisterPage from './pages/auth/CustomerRegisterPage';

// Pages — Customer Account
import AccountPage from './pages/account/AccountPage';
import MyOrdersPage from './pages/account/MyOrdersPage';
import MyBookingsPage from './pages/account/MyBookingsPage';
import BookingDetailPage from './pages/account/BookingDetailPage';

// Pages — Admin Auth
import AdminLoginPage from './pages/admin/auth/AdminLoginPage';

// Pages — Admin Dashboard
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductCreatePage from './pages/admin/AdminProductCreatePage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCustomerDetailPage from './pages/admin/AdminCustomerDetailPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminBookingDetailPage from './pages/admin/AdminBookingDetailPage';
import AdminTimeSlotsPage from './pages/admin/AdminTimeSlotsPage';
import AdminChatPage from './pages/admin/AdminChatPage';

// Components / Layout
import LoadingScreen from './components/ui/LoadingScreen';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/admin/AdminLayout';

// Guards
import GuestRoute from './components/guards/GuestRoute';
import AdminRoute from './components/guards/AdminRoute';
import CustomerRoute from './components/guards/CustomerRoute';

function AppContent() {
  const { isLoading } = useInitAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* ─── Storefront (with Navbar + Footer) ─── */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        {/* Services — requires auth */}
        <Route path="services" element={<CustomerRoute><ServicesPage /></CustomerRoute>} />
        {/* Cart checkout — no auth required */}
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        <Route path="booking-success" element={<CustomerRoute><BookingSuccessPage /></CustomerRoute>} />
        {/* Protected customer account routes */}
        <Route path="account" element={<CustomerRoute><AccountPage /></CustomerRoute>} />
        <Route path="account/orders" element={<CustomerRoute><MyOrdersPage /></CustomerRoute>} />
        <Route path="account/bookings" element={<CustomerRoute><MyBookingsPage /></CustomerRoute>} />
        <Route path="account/bookings/:id" element={<CustomerRoute><BookingDetailPage /></CustomerRoute>} />
      </Route>

      {/* ─── Customer Auth (standalone, no main layout) ─── */}
      <Route path="/login" element={
        <GuestRoute>
          <CustomerLoginPage />
        </GuestRoute>
      } />
      <Route path="/register" element={
        <GuestRoute>
          <CustomerRegisterPage />
        </GuestRoute>
      } />

      {/* ─── Admin Auth (standalone, dark theme) ─── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* ─── Admin Dashboard (protected, dark layout) ─── */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/create" element={<AdminProductCreatePage />} />
        <Route path="products/:id/edit" element={<AdminProductEditPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="users/:id" element={<AdminCustomerDetailPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="bookings/:id" element={<AdminBookingDetailPage />} />
        <Route path="time-slots" element={<AdminTimeSlotsPage />} />
        <Route path="chat" element={<AdminChatPage />} />
      </Route>

      {/* ─── 404 ─── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#FFFFFF',
              color: '#000000',
              border: '0.5px solid rgba(60, 60, 67, 0.12)',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '400',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
              padding: '12px 16px',
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
            },
            success: {
              iconTheme: { primary: '#34C759', secondary: '#FFFFFF' },
            },
            error: {
              iconTheme: { primary: '#FF3B30', secondary: '#FFFFFF' },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
