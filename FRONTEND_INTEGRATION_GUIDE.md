# 🚀 Frontend Integration & Development Guide

This guide provides the complete blueprint for developing the frontend using **Vite + React**. It includes the approved tech stack, detailed API data contracts, and a phased development plan broken down into actionable tasks.

---

## 🛠️ 1. Approved Tech Stack

| Category | Package | Purpose |
|----------|---------|---------| 
| **Core Framework** | `vite` + `react` | Fast, modern development environment. |
| **Routing** | `react-router-dom` | Navigation, nested layouts, protected routes. |
| **API Fetching** | `axios` | Essential for interceptors (handling 401 token refresh). |
| **Data/Caching** | `@tanstack/react-query` | Caching, pagination, and loading/error states. |
| **Global State** | `zustand` | Lightweight state for User Auth and local Cart UI. |
| **Forms** | `react-hook-form` + `yup` | Performant forms with schema-based validation. |
| **Styling** | `tailwindcss` | Rapid UI development with utility classes. |
| **Charts** | `recharts` | Revenue, orders, and category analytics charts. |
| **Icons & UI** | `lucide-react` + `react-hot-toast`| Icons and beautiful success/error popups. |
| **Real-time** | `socket.io-client` | Required to connect to the backend chat server. |

---

## 🔌 2. API Endpoints & Data Contracts

### 🔐 Auth Endpoints
| Action | Method | Endpoint |
|--------|--------|----------|
| **Login** | POST | `/api/v1/auth/customer/login` |
| **Register** | POST | `/api/v1/auth/customer/register` |
| **Refresh** | POST | `/api/v1/auth/customer/refresh-token` |
| **Admin Login** | POST | `/api/v1/auth/admin/login` |

### 🛒 E-Commerce Endpoints
| Action | Method | Endpoint |
|--------|--------|----------|
| **Get Products** | GET | `/api/v1/products?page=1` |
| **Add to Cart** | POST | `/api/v1/cart` |
| **Create Order** | POST | `/api/v1/orders/create` |
| **My Orders** | GET | `/api/v1/orders/` |

### 🔧 Booking Endpoints
| Action | Method | Endpoint |
|--------|--------|----------|
| **Create Booking** | POST | `/api/v1/bookings/` (multipart/form-data) |
| **My Bookings** | GET | `/api/v1/bookings/` |
| **Cancel Booking** | PATCH | `/api/v1/bookings/:id/cancel` |

### 💬 Chat Endpoints
| Action | Method | Endpoint |
|--------|--------|----------|
| **Start Chat** | POST | `/api/v1/chat/conversations` |
| **Get Messages** | GET | `/api/v1/chat/conversations/:id/messages` |
| **Send Message** | POST | `/api/v1/chat/conversations/:id/messages` |

---

## 📅 3. Frontend Development Plan

### 🏗️ Phase 1: Project Setup & Foundation ✅ COMPLETE
- [x] **1.1** Initialize Vite + React, install all packages
- [x] **1.2** Setup Axios instance with 401 interceptor + token refresh
- [x] **1.3** Setup Zustand stores (customer auth + admin auth)
- [x] **1.4** Setup React Query client + `useInitAuth` hook

### 🔓 Phase 2: Public Pages & Auth ✅ COMPLETE
- [x] **2.1** Core Layout — Navbar, Footer, Sidebar, AnnouncementBar, MainLayout
- [x] **2.2** HomePage — hero, featured products, categories, repair promo, footer
- [x] **2.3** ProductsPage — search, category filter, sort, pagination
- [x] **2.4** ProductDetailPage — image gallery, quantity selector, add to cart, reviews
- [x] **2.5** CustomerLoginPage + CustomerRegisterPage (react-hook-form + yup)
- [x] **2.6** Route guards — GuestRoute, CustomerRoute, AdminRoute
- [x] **2.7** NotFoundPage + LoadingScreen components
- [x] **2.8** UI Polish — Apple HIG spacing, glassmorphic navbar, ProductCard consistency

### 🛍️ Phase 3: E-Commerce Flow ✅ COMPLETE (Pages built, Cart pending)
- [x] **3.1** ProductCard + ProductGrid with loading skeletons
- [x] **3.2** useProducts / useFeaturedProducts / useProduct hooks (React Query)
- [x] **3.3** MyOrdersPage — order list with status badges, total, items count
- [ ] **3.4** Cart Drawer / Cart Page — add/remove/update items via `/api/v1/cart`
- [ ] **3.5** Checkout Page — confirm cart → POST `/api/v1/orders/create` → success page

### 🔧 Phase 4: Service Booking Flow ✅ COMPLETE
- [x] **4.1** ServicesPage — hero banner, 6-service catalog, booking form (device picker, date, time slot)
- [x] **4.2** AccountPage — profile edit + password change (tabbed)
- [x] **4.3** MyBookingsPage — device icon, status, cancel, admin notes display
- [x] **4.4** Image upload support with FormData (multipart)

### 💬 Phase 5: Real-Time Chat Integration 🔲 PENDING
- [ ] **5.1** Socket context / custom hook (`useSocket`) with JWT auth
- [ ] **5.2** Customer chat widget — floating button + chat drawer
- [ ] **5.3** Chat page — start conversation, send/receive messages, typing indicator

### 👑 Phase 6: Admin Dashboard ✅ COMPLETE (Shopify-style full pages)
- [x] **6.1** AdminLayout — dark shell, collapsible sidebar, topbar
- [x] **6.2** AdminDashboardPage — 4 stat cards, revenue chart, category pie, orders bar, recent tables
- [x] **6.3** AdminProductsPage — full product list with search, pagination
- [x] **6.4** AdminProductCreatePage — dedicated full page form (Shopify-style)
- [x] **6.5** AdminProductEditPage — dedicated full page edit form
- [x] **6.6** AdminOrdersPage — filterable orders table with status tabs
- [x] **6.7** AdminOrderDetailPage — order items, payment, inline status update
- [x] **6.8** AdminUsersPage — users table, promote-to-admin action
- [x] **6.9** AdminBookingsPage — bookings table, quick approve/reject
- [x] **6.10** AdminBookingDetailPage — device info, problem, images, admin notes, rejection reason
- [x] **6.11** AdminChatPage — conversations list + message thread + send reply
- [x] **6.12** StatusBadge component for all status types

### 🧹 Phase 7: Polish & Production ⬜ PENDING
- [ ] **7.1** Cart icon badge (item count)
- [ ] **7.2** Order success page
- [ ] **7.3** 404 and empty state improvements
- [ ] **7.4** Performance: React.lazy + Suspense for code splitting
- [ ] **7.5** SEO meta tags per page
