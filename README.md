# E-commerce with service integration

### By "@devsiffy"

#### Backend

```
- express server initialized
- packages: cors, cookie-parser, json, dotenv are setup
- dev packages: nodemon
- mongodb atlas connected
- odm: mongoose
- creating folder structure
- creating core utilities
- defining error handling middleware
- creating user model
- customer (user) register route and controller is implemented
- set userSchema transform function to remove password field from response
- customer (user) login route and controller is implemented
- access and refresh tokens generators are defined and used
- creating role middleware
- new refresh and access token route and controller is implemented for customer
- customer logout route and controller is implemented
- do some fixes/improvements
- creating product model
- defining product creation service, route & controller for admin is implemented
- do some fixes/improvements
- getting all products service, route & controller for admin is implemented
- getting single product service, route & controller for admin is implemented
- updating product service, route & controller for admin is implemented
- deleting product service, route & controller for admin is implemented (soft delete)
- FIX: make the product title unique in product model
- FIX: correcting the product create route endpoint
- creating public products routes, services & controller to get all products
- creating public products routes, services & controller to get single product
- fixing product unique constraint using compound index (title + isDeleted)
- implementing mongodb text search for product search functionality
- adding case-insensitive category filtering
- improving sorting with allowed fields validation
- implementing relevance-based sorting for search queries
- fixing pagination and query handling for public products API
- adding the review models and its routes for the products
- implementing cart create & get model, services, controllers & routes
- implementing update, remove & clear cart routes, services & controllers
- implementing get all orders, single order, create order routes, services & controllers
- implementing admin auth login, logout, refresh-roken routes & controllers
- FIX: adding missing ApiError import in order controller
- implementing admin get all orders service, controller & route (paginated, filterable by status/paymentStatus)
- implementing admin get single order service, controller & route (with user details)
- implementing customer get profile service, controller & route
- implementing customer update profile service, controller & route (firstName, lastName, phoneNo, address)
- implementing customer change password service, controller & route (with current password verification)
- implementing admin get all users service, controller & route (paginated, searchable by name/email, filterable by role)
- implementing admin get single user service, controller & route
- implementing admin update user role service, controller & route
- implementing admin dashboard stats API (total customers, products, orders, revenue, pending/delivered/cancelled)
- implementing admin dashboard activity APIs (recent orders, recent customers, recent reviews)
- implementing admin dashboard analytics APIs (revenue, orders, product performance, category distribution)
- creating booking model (problem details, device details, images, scheduling, status lifecycle, admin assignment, pricing)
- implementing customer create booking service, controller & route (with future date validation)
- implementing customer get bookings service, controller & route (paginated, filterable by status)
- implementing customer get single booking service, controller & route (scoped to owner)
- implementing customer cancel booking service, controller & route (pending only)
- creating timeSlot model (date, startTime, endTime, availability, capacity tracking)
- implementing time slot CRUD services, controllers & routes (admin: create, list, update, delete)
- implementing public get available slots by date route
- implementing admin get all bookings service, controller & route (paginated, filterable by status, with customer details)
- implementing admin get single booking service, controller & route (with customer & timeSlot details)
- implementing admin approve/reject booking services, controllers & routes (pending only)
- implementing admin assign technician service, controller & route
- implementing admin update booking status service, controller & route
- setting up Cloudinary configuration and Multer memory storage (image upload system)
- implementing Cloudinary upload/delete utilities (single, multiple, buffer-based)
- integrating image upload with booking creation (multipart/form-data with up to 5 images)
- adding CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to environment config
- creating conversation model (customer, admin, status, lastMessage tracking)
- creating message model (conversation, sender, senderRole, content, isRead tracking)
- implementing chat service (start/get conversation, send message, get messages, mark read, close)
- implementing customer chat routes (start conversation, list conversations, send/get messages, mark read)
- implementing admin chat routes (list all conversations, get/send messages, close conversation)
- setting up Socket.io server with JWT authentication middleware
- implementing real-time messaging events (joinConversation, sendMessage, typing indicators, markRead)
- updating server.js to use HTTP server with Socket.io attached
- creating admin seed script (npm run seed:admin) for default admin user creation
- packages: multer, cloudinary, socket.io are added
```

#### Frontend

```
- initializing Vite + React project in frontend/ folder
- installing approved packages: axios, react-router-dom, @tanstack/react-query, zustand, react-hook-form, yup, @hookform/resolvers, tailwindcss, @tailwindcss/vite, lucide-react, react-hot-toast, socket.io-client
- configuring Vite with Tailwind CSS v4 plugin and API/WebSocket proxy to backend
- setting up Apple HIG design system (system font stack, semantic light-mode colors, glassmorphism, Apple-style buttons and cards)
- creating Axios instance with withCredentials and response interceptor (auto token refresh on 401, request queuing and retry)
- creating Zustand auth store with localStorage persistence for user data (access token kept in-memory only)
- setting up React Query client with QueryClientProvider
- creating useInitAuth hook for session restoration on app load via refresh token
- building App shell with React Router, QueryClientProvider, and Apple-styled Toaster
- building HomePage with Apple HIG UI (frosted glass nav, hero section, feature cards, trust strip, footer)
- building NotFoundPage with Apple-style minimal design
- building LoadingScreen component with subtle spinner
- creating reusable Navbar, Footer, and Sidebar layout components with Apple styling, and setting up React Router with MainLayout wrapper
- creating reusable InputField component (Apple-styled, password toggle, validation errors, focus ring)
- creating reusable Button component (primary/secondary/ghost/danger variants, loading state, pill shape)
- creating AuthFormWrapper component (centered card layout with brand header and slide-up animation)
- building CustomerLoginPage with react-hook-form + yup validation, Zustand auth integration, and redirect
- building CustomerRegisterPage with full form (name, email, phone, password, address), validation, and API call
- updating Navbar with functional Sign In link, authenticated user dropdown (avatar, name, account, logout)
- updating Sidebar with auth-aware state (guest: sign in/register, authenticated: profile info + logout)
- adding customer auth routes (/login, /register) to App.jsx as standalone pages
- creating separate Zustand admin auth store with independent localStorage persistence
- creating separate admin Axios instance with admin refresh token interceptor
- creating useInitAdminAuth hook for admin session restoration
- building AdminLoginPage with dark professional theme (dark bg, lock icon, glass card)
- creating CustomerRoute guard (redirects to /login if not authenticated)
- creating AdminRoute guard (checks admin auth + role, redirects to /admin/login)
- creating GuestRoute guard (prevents authenticated users from accessing login/register)
- integrating all route guards into App.jsx with admin login route (/admin/login)
- UI POLISH: fixing input fields (visible #D2D2D7 borders, #F5F5F7 bg, focus ring, 14px labels)
- UI POLISH: fixing auth pages (clean #F5F5F7 bg, proper card shadow, better spacing)
- UI POLISH: fixing Button component (reliable blue backgrounds, hover color shifts, font-medium)
- UI POLISH: fixing homepage text spacing bug (repairs.Get → repairs. Get)
- UI POLISH: using Apple's exact colors across all pages (#1D1D1F, #86868B, #F5F5F7, #D2D2D7, #6E6E73)
- adding "Expert Repair Services" dark promotional section to HomePage with gradient and CTA
- making feature cards clickable links to respective routes
- creating AnnouncementBar component (dark bg, teal accent, dismissible, free shipping promo)
- enhancing Navbar with search dropdown, quick links, My Orders/My Bookings in user menu
- enhancing Footer with 4-column layout (Shop, Repair, Account, Support), repair mini-banner
- integrating AnnouncementBar into MainLayout above Navbar
- SPACING FIX: increased card padding (px-7 py-8 / sm:px-10 sm:py-10) on auth forms
- SPACING FIX: increased field gaps (gap-7), button margin (mt-3), separator margins
- SPACING FIX: changed input bg from #F5F5F7 to white for clear visibility on white cards
- SPACING FIX: homepage repair promo section proper padding (py-14/20), trust strip gaps
- creating ProductCard component (Apple-styled, image, title, price, ratings, hover cart icon)
- creating ProductGrid component (responsive 2/3/4 cols, loading skeletons, empty state)
- creating useProducts hooks (useProducts, useFeaturedProducts, useProduct) with React Query
- adding "Featured Products" section to HomePage with useFeaturedProducts integration
- adding "Shop by Category" section with 6 category tiles (Laptops, Phones, Desktops, Tablets, Audio, Gaming)
- PHASE 3C: creating ProductsPage with search, category filter, sort, URL params sync, pagination
- PHASE 3C: creating ProductFilters component (search input, category/sort dropdowns, mobile responsive)
- PHASE 3C: creating Pagination component (circular page buttons, prev/next, active state)
- PHASE 3C: creating ProductDetailPage (breadcrumb, image gallery, quantity selector, add-to-cart, reviews)
- PHASE 3C: adding /products and /products/:id routes to App.jsx inside MainLayout
- UI FIX: AuthFormWrapper card padding via inline styles (40px 44px) with visible border
- UI FIX: InputField bg changed to #FAFAFA with inline styles to prevent CSS specificity override
- UI FIX: Admin login inline style margins (24px fields, 32px before button, 48px header/footer)
- UI FIX: Customer login explicit margin spacing (24px, 32px) with inline styles
- UI FIX: Register page explicit margins (20px fields, 28px sections) with shipping address separator
```

### By "Pull Requests"

#### Backend

```
- creating constants.js for defining .env variables
```
