import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/queryClient';
import { useInitAuth } from './hooks/useInitAuth';
import { useInitAdminAuth } from './hooks/useInitAdminAuth';
import ScrollToTop from './components/utils/ScrollToTop';

// Pages — Storefront
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ServicesPage from './pages/ServicesPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import StaticPage from './pages/StaticPage';
import { 
  aboutContent, 
  contactContent, 
  privacyPolicyContent, 
  termsOfUseContent, 
  salesAndRefundsContent, 
  legalContent 
} from './pages/staticContent';

// Pages — Customer Auth
import CustomerLoginPage from './pages/auth/CustomerLoginPage';
import CustomerRegisterPage from './pages/auth/CustomerRegisterPage';

// Pages — Customer Account
import AccountPage from './pages/account/AccountPage';
import MyOrdersPage from './pages/account/MyOrdersPage';
import OrderDetailPage from './pages/account/OrderDetailPage';
import MyBookingsPage from './pages/account/MyBookingsPage';
import BookingDetailPage from './pages/account/BookingDetailPage';

// Pages — Admin Auth
import AdminLoginPage from './pages/admin/auth/AdminLoginPage';
import AdminRegisterPage from './pages/admin/auth/AdminRegisterPage';

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
import AdminTechniciansPage from './pages/admin/AdminTechniciansPage';
import AdminTechnicianCreatePage from './pages/admin/AdminTechnicianCreatePage';
import AdminTechnicianEditPage from './pages/admin/AdminTechnicianEditPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminServiceCreatePage from './pages/admin/AdminServiceCreatePage';
import AdminServiceEditPage from './pages/admin/AdminServiceEditPage';
import AdminPaymentSettingsPage from './pages/admin/AdminPaymentSettingsPage';

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
  const { isLoading: isAdminLoading } = useInitAdminAuth();

  if (isLoading || isAdminLoading) {
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
        {/* Static Pages */}
        <Route path="about" element={<StaticPage title="About Us" content={aboutContent} />} />
        <Route path="contact" element={<StaticPage title="Contact Us" content={contactContent} />} />
        <Route path="privacy" element={<StaticPage title="Privacy Policy" content={privacyPolicyContent} />} />
        <Route path="terms" element={<StaticPage title="Terms of Use" content={termsOfUseContent} />} />
        <Route path="sales-refunds" element={<StaticPage title="Sales and Refunds" content={salesAndRefundsContent} />} />
        <Route path="legal" element={<StaticPage title="Legal" content={legalContent} />} />

        {/* Protected customer account routes */}
        <Route path="account" element={<CustomerRoute><AccountPage /></CustomerRoute>} />
        <Route path="account/orders" element={<CustomerRoute><MyOrdersPage /></CustomerRoute>} />
        <Route path="account/orders/:id" element={<CustomerRoute><OrderDetailPage /></CustomerRoute>} />
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
      <Route path="/admin/register" element={<AdminRegisterPage />} />

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
        <Route path="customers" element={<AdminUsersPage />} />
        <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
        <Route path="technicians" element={<AdminTechniciansPage />} />
        <Route path="technicians/new" element={<AdminTechnicianCreatePage />} />
        <Route path="technicians/:id/edit" element={<AdminTechnicianEditPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="payments" element={<AdminPaymentSettingsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="bookings/:id" element={<AdminBookingDetailPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="services/new" element={<AdminServiceCreatePage />} />
        <Route path="services/:id/edit" element={<AdminServiceEditPage />} />
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
        <ScrollToTop />
        <AppContent />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1f33',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '500',
              padding: '12px 16px',
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.2)',
            },
            success: {
              iconTheme: { primary: '#00f5d4', secondary: '#1a1f33' },
            },
            error: {
              iconTheme: { primary: '#ff3b57', secondary: '#1a1f33' },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
