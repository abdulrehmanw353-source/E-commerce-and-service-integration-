# 🖥️ Frontend Development Plan
## E-commerce & Service Integration Platform

> **Design Language:** Apple HIG — Light mode, system fonts, subtle glassmorphism, pill buttons, micro-interactions
> **Tech Stack:** Vite + React + Tailwind CSS v4 + Zustand + React Query + Axios + React Hook Form + Yup

---

## Current State (What's Already Built)

| Area | Status | Files |
|------|--------|-------|
| Vite + React + Tailwind v4 setup | ✅ Done | `vite.config.js`, `package.json` |
| Apple HIG Design System (CSS) | ✅ Done | `index.css` |
| Axios + Token Refresh Interceptor | ✅ Done | `lib/axios.js` |
| Admin Axios Instance | ✅ Done | `lib/adminAxios.js` |
| Zustand Auth Store (persist) | ✅ Done | `store/authStore.js` |
| Zustand Admin Auth Store | ✅ Done | `store/adminAuthStore.js` |
| React Query Client | ✅ Done | `lib/queryClient.js` |
| `useInitAuth` + `useInitAdminAuth` Hooks | ✅ Done | `hooks/useInit*.js` |
| MainLayout + Navbar + Footer + Sidebar | ✅ Done | `components/layout/*` |
| AnnouncementBar | ✅ Done | `components/layout/AnnouncementBar.jsx` |
| HomePage (Hero, Features, Repair Promo, Trust) | ✅ Done | `pages/HomePage.jsx` |
| NotFoundPage (404) | ✅ Done | `pages/NotFoundPage.jsx` |
| LoadingScreen | ✅ Done | `components/ui/LoadingScreen.jsx` |
| InputField, Button (UI Components) | ✅ Done | `components/ui/*` |
| Customer Login/Register Pages | ✅ Done | `pages/auth/*` |
| Admin Login Page | ✅ Done | `pages/admin/auth/*` |
| Route Guards (Customer, Admin, Guest) | ✅ Done | `components/guards/*` |
| ProductCard, ProductGrid | ✅ Done | `components/product/*` |
| useProducts, useFeaturedProducts, useProduct hooks | ✅ Done | `hooks/useProducts.js` |
| Proxy (API + Socket.io) | ✅ Done | `vite.config.js` |
| recharts installed | ✅ Done | `package.json` |

---

## 📋 Phase 1: Foundation & Setup — ✅ COMPLETED

> *Already done — Vite, Tailwind, Zustand, Axios, React Query, basic layout, HomePage, 404, design tokens.*

---

## 📋 Phase 2: Authentication System — ✅ COMPLETED

> **Goal:** Separate auth flows for Customer (storefront) and Admin (dashboard). Route guards. Session management.

### Part 2A — Customer Authentication Pages ✅

| # | Task | Status |
|---|------|--------|
| 2A.1 | `pages/auth/CustomerLoginPage.jsx` | ✅ |
| 2A.2 | `pages/auth/CustomerRegisterPage.jsx` | ✅ |
| 2A.3 | `components/auth/AuthFormWrapper.jsx` | ✅ |
| 2A.4 | `components/ui/InputField.jsx` | ✅ |
| 2A.5 | `components/ui/Button.jsx` | ✅ |
| 2A.6 | Customer auth routes in `App.jsx` (`/login`, `/register`) | ✅ |
| 2A.7 | Navbar Sign In → `/login`, authenticated user dropdown | ✅ |
| 2A.8 | Sidebar auth-aware state | ✅ |

### Part 2B — Admin Authentication Pages ✅

| # | Task | Status |
|---|------|--------|
| 2B.1 | `pages/admin/auth/AdminLoginPage.jsx` | ✅ |
| 2B.2 | `store/adminAuthStore.js` | ✅ |
| 2B.3 | `lib/adminAxios.js` | ✅ |
| 2B.4 | `hooks/useInitAdminAuth.js` | ✅ |
| 2B.5 | `/admin/login` route in `App.jsx` | ✅ |

### Part 2C — Route Guards & Protected Routes ✅

| # | Task | Status |
|---|------|--------|
| 2C.1 | `components/guards/CustomerRoute.jsx` | ✅ |
| 2C.2 | `components/guards/AdminRoute.jsx` | ✅ |
| 2C.3 | `components/guards/GuestRoute.jsx` | ✅ |
| 2C.4 | Guards integrated into `App.jsx` | ✅ |

---

## 📋 Phase 3: Storefront Core Pages — ✅ COMPLETED

### Part 3A — Announcement Bar & Global Layout Enhancement ✅

| # | Task | Status |
|---|------|--------|
| 3A.1 | `components/layout/AnnouncementBar.jsx` | ✅ |
| 3A.2 | Enhanced `Navbar.jsx` (search dropdown, user menu, 44px) | ✅ |
| 3A.3 | Enhanced `Footer.jsx` (4-column layout, repair banner) | ✅ |
| 3A.4 | `MainLayout.jsx` with AnnouncementBar | ✅ |

### Part 3B — Homepage Enhancement ✅

| # | Task | Status |
|---|------|--------|
| 3B.1 | Featured Products section in `HomePage` | ✅ |
| 3B.2 | `components/product/ProductCard.jsx` | ✅ |
| 3B.3 | Repair Services promo section | ✅ |
| 3B.4 | Categories section (6 tiles) | ✅ |
| 3B.5 | Hero section polish | ✅ |

### Part 3C — Products & Collections Pages ✅

| # | Task | Status |
|---|------|--------|
| 3C.1 | `pages/ProductsPage.jsx` (search, filter, sort, pagination) | ✅ |
| 3C.2 | `components/product/ProductGrid.jsx` | ✅ |
| 3C.3 | `components/product/ProductFilters.jsx` | ✅ |
| 3C.4 | `components/ui/Pagination.jsx` | ✅ |
| 3C.5 | `pages/ProductDetailPage.jsx` (gallery, qty, reviews) | ✅ |
| 3C.6 | Image gallery with thumbnails | ✅ |
| 3C.7 | Reviews list display | ✅ |
| 3C.8 | Review submit form (authenticated) | ✅ |
| 3C.9 | Storefront routes in `App.jsx` | ✅ |

---

## 📋 Phase 4: E-Commerce Flow — 🔄 IN PROGRESS

> **Goal:** Cart, checkout, order management, customer account.

### Part 4A — Cart System ✅ COMPLETED

| # | Task | Status |
|---|------|--------|
| 4A.1 | `store/cartStore.js` — Zustand cart UI state (open/close, item count) | ✅ |
| 4A.2 | `hooks/useCart.js` — useGetCart, useAddToCart, useUpdateCartItem, useRemoveCartItem, useClearCart | ✅ |
| 4A.3 | `components/cart/CartSlideOut.jsx` — Apple slide-out drawer, items, totals, Checkout CTA | ✅ |
| 4A.4 | `components/cart/CartItem.jsx` — image, name, price, quantity stepper, remove | ✅ |
| 4A.5 | Wire "Add to Cart" on `ProductDetailPage` | ✅ |
| 4A.6 | Wire Navbar cart icon → CartSlideOut, item count badge | ✅ |

### Part 4B — Checkout & Orders ✅ COMPLETED

| # | Task | Status |
|---|------|--------|
| 4B.1 | `pages/CheckoutPage.jsx` — guest-friendly (email + phone), pre-fills from auth store | ✅ |
| 4B.2 | `pages/OrderSuccessPage.jsx` — animated checkmark, order summary, CTAs | ✅ |
| 4B.3 | `pages/account/MyOrdersPage.jsx` — order list, status badges | ✅ |
| 4B.4 | `pages/admin/AdminOrderDetailPage.jsx` — full rebuild: items, customer, status dropdowns | ✅ |
| 4B.5 | Checkout + success routes in `App.jsx` | ✅ |

### Part 4C — Customer Account ✅ COMPLETED

| # | Task | Status |
|---|------|--------|
| 4C.1 | `pages/account/AccountPage.jsx` — tabbed: Profile + Password | ✅ |
| 4C.2 | Profile edit form (`PATCH /customer/profile`) | ✅ |
| 4C.3 | Change password form (`PATCH /customer/change-password`) | ✅ |
| 4C.4 | Customer logout wired in Navbar | ✅ |
| 4C.5 | Account routes in `App.jsx` | ✅ |

---

## 📋 Phase 5: Service Booking System — 🔄 PARTIAL

### Part 5A — Service Landing & Booking Pages ✅ COMPLETED

| # | Task | Status |
|---|------|--------|
| 5A.1 | `pages/ServicesPage.jsx` — hero banner, service catalog, CTA | ✅ |
| 5A.2 | Booking form in `ServicesPage` — device picker, date, time slots, FormData submit | ✅ |
| 5A.3 | `TimeSlotPicker` — fetches & displays available slots | ✅ |
| 5A.4 | `DeviceTypeSelector` — visual icon buttons | ✅ |
| 5A.5 | Service routes in `App.jsx` (`/services`) | ✅ |
| 5A.6 | `BookingSuccessPage` — redirect after booking | ⬜ |

### Part 5B — Customer Booking Dashboard ✅ COMPLETED

| # | Task | Status |
|---|------|--------|
| 5B.1 | `pages/account/MyBookingsPage.jsx` — list, status badges, cancel | ✅ |
| 5B.2 | `pages/account/BookingDetailPage.jsx` — full detail, status banner, pricing, cancel | ✅ |
| 5B.3 | Booking list cards link to BookingDetailPage | ✅ |
| 5B.4 | `StatusBadge` component (admin version built ✅) | ✅ |
| 5B.5 | Booking routes in `App.jsx` | ✅ |
| 5B.6 | Navbar/Footer wired to `/services` | ✅ |

---

## 📋 Phase 6: Admin Dashboard — ✅ COMPLETED (Shopify-style full pages)

### Part 6A — Admin Layout & Dashboard Home ✅

| # | Task | Status |
|---|------|--------|
| 6A.1 | `components/admin/AdminLayout.jsx` | ✅ |
| 6A.2 | `components/admin/AdminSidebar.jsx` | ✅ |
| 6A.3 | `components/admin/AdminTopbar.jsx` (dynamic titles) | ✅ |
| 6A.4 | `pages/admin/AdminDashboardPage.jsx` — stats, charts, recent panels | ✅ |
| 6A.5 | StatCard (inline in dashboard) | ✅ |
| 6A.6 | Recent orders + recent customers panels | ✅ |
| 6A.7 | Admin layout route in `App.jsx` | ✅ |

### Part 6B — Admin Analytics ✅

| # | Task | Status |
|---|------|--------|
| 6B.1 | recharts installed | ✅ |
| 6B.2 | Revenue area chart | ✅ |
| 6B.3 | Orders bar chart | ✅ |
| 6B.4 | Category donut chart | ✅ |

### Part 6C — Product Management ✅

| # | Task | Status |
|---|------|--------|
| 6C.1 | `pages/admin/AdminProductsPage.jsx` — list, search, pagination, row actions | ✅ |
| 6C.2 | `pages/admin/AdminProductCreatePage.jsx` — Shopify-style full page | ✅ |
| 6C.3 | `pages/admin/AdminProductEditPage.jsx` — Shopify-style full page with delete | ✅ |
| 6C.4 | Delete with confirmation modal | ✅ |

### Part 6D — Order Management ✅

| # | Task | Status |
|---|------|--------|
| 6D.1 | `pages/admin/AdminOrdersPage.jsx` — status filter tabs, table | ✅ |
| 6D.2 | `pages/admin/AdminOrderDetailPage.jsx` — items, payment, status update | ✅ |

### Part 6E — Customer Management ✅

| # | Task | Status |
|---|------|--------|
| 6E.1 | `pages/admin/AdminUsersPage.jsx` — search, promote-to-admin | ✅ |
| 6E.2 | Customer detail page | ✅ |

### Part 6F — Booking Management ✅

| # | Task | Status |
|---|------|--------|
| 6F.1 | `pages/admin/AdminBookingsPage.jsx` — list, approve/reject actions | ✅ |
| 6F.2 | `pages/admin/AdminBookingDetailPage.jsx` — device, problem, images, notes | ✅ |
| 6F.3 | BookingActions (approve, reject, assign, status) | ✅ |

### Part 6G — Time Slot Management ✅ COMPLETED

| # | Task | Status |
|---|------|--------|
| 6G.1 | `pages/admin/AdminTimeSlotsPage.jsx` — grouped by date, capacity bars | ✅ |
| 6G.2 | Create/edit modal form + delete confirm | ✅ |
| 6G.3 | Time Slots nav item in AdminSidebar | ✅ |

### Part 6H — Admin Chat ✅

| # | Task | Status |
|---|------|--------|
| 6H.1 | `pages/admin/AdminChatPage.jsx` — conversations + message thread | ✅ |
| 6H.2 | All admin routes in `App.jsx` | ✅ |

---

## 📋 Phase 7: Real-Time Chat & Final Polish — ⬜ PENDING

### Part 7A — Chat System (Customer Side) ✅ COMPLETED

| # | Task | Status |
|---|------|--------|
| 7A.1 | `lib/socket.js` — socket.io-client setup with auth token | ✅ |
| 7A.2 | `hooks/useSocket.js` — useSocket + useConversation, typing, markRead | ✅ |
| 7A.3 | `components/chat/ChatWidget.jsx` — floating bubble, unread badge, ESC close | ✅ |
| 7A.4 | `components/chat/ChatPanel.jsx` — messages, auto-scroll, textarea, send | ✅ |
| 7A.5 | `components/chat/ChatMessage.jsx` — own/agent bubbles, timestamp on hover | ✅ |
| 7A.6 | Typing indicators (emit/listen, bounce dots) | ✅ |
| 7A.7 | ChatWidget in `MainLayout` (authenticated only) | ✅ |

### Part 7B — Chat System (Admin Side) ✅ COMPLETED

| # | Task | Status |
|---|------|--------|
| 7B.1 | `pages/admin/AdminChatPage.jsx` — conversations + messages (polling) | ✅ |
| 7B.2 | Real-time socket integration for admin | ✅ |
| 7B.3 | Close conversation action | ✅ |

### Part 7C — Final Polish ⬜

| # | Task | Status |
|---|------|--------|
| 7C.1 | Full responsive audit (375px / 768px / 1280px) | ⬜ |
| 7C.2 | Micro-interaction audit (hover/active/focus states) | ⬜ |
| 7C.3 | Loading & error states on every page | ⬜ |
| 7C.4 | Toast notification consistency | ⬜ |
| 7C.5 | Accessibility audit (ARIA, keyboard nav) | ⬜ |
| 7C.6 | Performance: React.lazy + Suspense, bundle analysis | ⬜ |

---

## Execution Order Summary

| Phase | Parts | Status |
|-------|-------|--------|
| **Phase 1** — Foundation | Setup, Design System, Axios, Zustand, Layout, HomePage | ✅ Done |
| **Phase 2** — Authentication | 2A ✅ → 2B ✅ → 2C ✅ | ✅ Done |
| **Phase 3** — Storefront Core | 3A ✅ → 3B ✅ → 3C ✅ | ✅ Done |
| **Phase 4** — E-Commerce Flow | 4A ✅ → 4B ✅ → 4C ✅ | ✅ Done |
| **Phase 5** — Service Booking | 5A ✅ → 5B ✅ | ✅ Done |
| **Phase 6** — Admin Dashboard | 6A ✅ → 6B ✅ → 6C ✅ → 6D ✅ → 6E ✅ → 6F ✅ → 6G ✅ → 6H ✅ | ✅ Done |
| **Phase 7** — Chat & Polish | 7A ✅ → 7B ✅ → 7C ⬜ | 🔄 Partial |

---

> [!IMPORTANT]
> We execute **one Part at a time**, following each task sequentially. After completing every Part, we:
> 1. Update the README.md under the Frontend heading
> 2. Suggest a Git commit message
> 3. Move to the next Part
