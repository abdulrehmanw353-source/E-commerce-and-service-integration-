# 🚀 Frontend Integration & Development Guide

This guide provides the complete blueprint for developing the frontend using **Vite + React**. It includes the approved tech stack, detailed API data contracts, and a phased development plan broken down into actionable tasks.

---

## 🛠️ 1. Approved Tech Stack

Based on the backend architecture, the following packages are selected for the frontend (`frontend/` folder):

| Category | Package | Purpose |
|----------|---------|---------|
| **Core Framework** | `vite` + `react` | Fast, modern development environment. |
| **Routing** | `react-router-dom` | Navigation, nested layouts, protected routes. |
| **API Fetching** | `axios` | Essential for interceptors (handling 401 token refresh). |
| **Data/Caching** | `@tanstack/react-query` | Caching, pagination, and loading/error states. |
| **Global State** | `zustand` | Lightweight state for User Auth and local Cart UI. |
| **Forms** | `react-hook-form` + `yup` | Performant forms with schema-based validation. |
| **Styling** | `tailwindcss` | Rapid UI development with utility classes. |
| **Icons & UI** | `lucide-react` + `react-hot-toast`| Icons and beautiful success/error popups. |
| **Real-time** | `socket.io-client` | Required to connect to the backend chat server. |

---

## 🔌 2. API Endpoints & Data Contracts

When calling protected routes, **ALWAYS** include the header:
`Authorization: Bearer <accessToken>`

### 🔐 Auth Endpoints
| Action | Method | Endpoint | Expected Payload (Body) | Returns (Data) |
|--------|--------|----------|--------------------------|----------------|
| **Login** | POST | `/api/v1/auth/customer/login` | `{ email, password }` | `{ user: {...}, accessToken }` (refresh token in HttpOnly cookie) |
| **Register** | POST | `/api/v1/auth/customer/register` | `{ firstName, lastName, email, password, phoneNo, address: { street, city, state, country } }` | `{ user: {...} }` |
| **Refresh** | POST | `/api/v1/auth/customer/refresh-token` | *None* | `{ accessToken }` |

### 🛒 E-Commerce Endpoints
| Action | Method | Endpoint | Expected Payload (Body) | Returns (Data) |
|--------|--------|----------|--------------------------|----------------|
| **Get Products** | GET | `/api/v1/products?page=1` | *None* | `{ products: [...], totalProducts, totalPages }` |
| **Add to Cart** | POST | `/api/v1/cart` | `{ productId, quantity }` | `{ items: [{product, quantity, price}] }` |
| **Create Order** | POST | `/api/v1/orders` | *None* (Backend reads your cart) | `{ _id, items, totalAmount, status }` |
| **My Orders** | GET | `/api/v1/orders` | *None* | Array of Order Objects |

### 🔧 Service Booking Endpoints
*⚠️ Bookings require Images. You MUST use `FormData` instead of standard JSON.*

| Action | Method | Endpoint | Expected Payload (`FormData`) | Returns (Data) |
|--------|--------|----------|--------------------------|----------------|
| **Create** | POST | `/api/v1/bookings` | `problemTitle`, `problemDescription`, `deviceType`, `preferredDate`, `images` (File array) | `{ _id, status, images: [...] }` |
| **My Bookings**| GET | `/api/v1/bookings` | *None* | `{ bookings: [...], totalPages }` |

### 💬 Chat Endpoints
| Action | Method | Endpoint | Expected Payload (Body) | Returns (Data) |
|--------|--------|----------|--------------------------|----------------|
| **Start Chat** | POST | `/api/v1/chat/conversations` | *None* | `{ _id, status, lastMessage }` |
| **Get Messages**| GET | `/api/v1/chat/conversations/:id/messages` | *None* | `{ messages: [{ sender, content, isRead }], totalPages }` |

---

## 📅 3. Frontend Development Plan

This is your step-by-step roadmap to build the frontend, divided into logical phases.

### 🏗️ Phase 1: Project Setup & Foundation
*Goal: Get the basic infrastructure running.*

- [ ] **Task 1.1: Initialize App**
  - Run `npm create vite@latest frontend -- --template react`
  - Install Tailwind CSS and configure `tailwind.config.js`.
  - Install all approved packages (`axios`, `react-router-dom`, `zustand`, etc.).
- [ ] **Task 1.2: Setup Axios & Interceptors**
  - Create an `api.js` file with a base Axios instance (`withCredentials: true`).
  - Create a Response Interceptor: If response is `401`, call `/refresh-token`, update the token, and retry the original request.
- [ ] **Task 1.3: Setup Zustand Store & React Query**
  - Create `useAuthStore` to hold `user` and `accessToken`.
  - Wrap the `App` component in `QueryClientProvider`.

### 🔓 Phase 2: Public Pages & Auth
*Goal: Let users browse products and log in.*

- [ ] **Task 2.1: Core Layout**
  - Create `Navbar`, `Footer`, and `Sidebar` components.
  - Setup React Router with a Main Layout.
- [ ] **Task 2.2: Product Catalog**
  - Build the Home page fetching products via React Query.
  - Implement Search bar and Category filters.
  - Build the Single Product detail page.
- [ ] **Task 2.3: Authentication**
  - Build Login and Registration forms using `react-hook-form` and `yup`.
  - On successful login, save the `user` and `accessToken` to Zustand and redirect.

### 🛍️ Phase 3: E-Commerce Flow
*Goal: Users can add items to cart and checkout.*

- [ ] **Task 3.1: Cart Management**
  - Build the Slide-out Cart or Cart Page.
  - Connect Add/Remove/Update buttons to the `/api/v1/cart` endpoints.
- [ ] **Task 3.2: Checkout**
  - Build a Checkout confirmation page.
  - Call `/api/v1/orders` to convert the cart into an order.
  - Show a success page and clear the local cart state.
- [ ] **Task 3.3: Customer Dashboard (Orders)**
  - Build an "Order History" page fetching from `/api/v1/orders`.

### 🔧 Phase 4: Service Booking Flow
*Goal: Users can request repairs with image uploads.*

- [ ] **Task 4.1: Booking Form**
  - Build a multi-step form or long form for repair requests.
  - Implement a file picker for images.
  - Construct `FormData` correctly on submit and POST to the backend.
- [ ] **Task 4.2: Bookings Dashboard**
  - Add a "My Bookings" tab in the Customer Dashboard.
  - Show booking status (pending, approved, in-progress) with colored badges.

### 💬 Phase 5: Real-Time Chat Integration
*Goal: Connect the Socket.io client for live support.*

- [ ] **Task 5.1: Socket Context**
  - Create a React Context or custom Hook to initialize `socket.io-client`.
  - Pass the `accessToken` in the socket `auth` object.
- [ ] **Task 5.2: Chat UI**
  - Build a floating Chat Widget or a dedicated Chat Page.
  - Call REST API to load old messages.
  - Emit `joinConversation` and `sendMessage`.
  - Listen for `newMessage` and update the UI instantly.
  - Implement "Typing..." indicators.

### 👑 Phase 6: Admin Dashboard
*Goal: Secure area for admins to manage the platform.*

- [ ] **Task 6.1: Protected Admin Layout**
  - Create a Route Guard that checks `user.role === 'admin'`. If not, redirect to Home.
  - Build an Admin Sidebar navigation.
- [ ] **Task 6.2: Analytics Dashboard**
  - Fetch from `/api/v1/admin/dashboard/stats`.
  - Display KPI cards (Total Revenue, Orders, Users).
  - Optional: Use a charting library like `recharts` for revenue graphs.
- [ ] **Task 6.3: Management Tables**
  - Build a reusable Data Table component (with pagination).
  - Implement Products table (Add/Edit/Delete).
  - Implement Orders table (Update status to Shipped/Delivered).
  - Implement Bookings table (Approve, Reject, Assign Technician).
