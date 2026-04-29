# Backend Documentation — E-commerce & Service Integration Platform

---

## 1. Project Overview

This is a **Scalable Multi-Purpose E-commerce Platform with Service Booking Integration** built with a production-oriented backend architecture.

**It combines:**
- 🛒 Traditional E-commerce System (products, cart, orders, COD payments)
- 🔧 Service Booking System (repair/service requests with scheduling)
- 👤 Customer Portal (profile, orders, bookings, chat)
- 🛠️ Admin Management System (dashboard, users, orders, bookings)
- 💬 Real-Time Customer Support Chat (Socket.io)
- ☁️ Cloudinary Image Upload System

---

## 2. Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js (v5) | Web Framework |
| MongoDB | Database |
| Mongoose (v9) | ODM |
| JWT (jsonwebtoken) | Authentication |
| bcrypt | Password Hashing |
| Socket.io | Real-Time Chat |
| Cloudinary | Image Storage |
| Multer | File Upload Handling |
| cookie-parser | Cookie Management |
| cors | Cross-Origin Requests |
| dotenv | Environment Variables |
| nodemon | Dev Auto-Restart |

---

## 3. Folder Structure

```
backend/
├── .env                         # Environment variables
├── package.json                 # Dependencies & scripts
└── src/
    ├── server.js                # Entry point (HTTP + Socket.io)
    ├── app.js                   # Express app (routes + middleware)
    ├── constants.js             # Env variable exports
    │
    ├── config/
    │   ├── db.js                # MongoDB connection
    │   ├── cloudinary.js        # Cloudinary v2 config
    │   └── multer.js            # Multer memory storage config
    │
    ├── models/
    │   ├── user.model.js        # User (customer/admin)
    │   ├── product.model.js     # Product catalog
    │   ├── review.model.js      # Product reviews
    │   ├── cart.model.js        # Shopping cart
    │   ├── order.model.js       # Orders (item snapshots)
    │   ├── booking.model.js     # Service/repair bookings
    │   ├── timeSlot.model.js    # Admin-managed time slots
    │   ├── conversation.model.js # Chat conversations
    │   └── message.model.js     # Chat messages
    │
    ├── services/                # Business logic layer
    │   ├── product.service.js
    │   ├── public.product.service.js
    │   ├── review.service.js
    │   ├── cart.service.js
    │   ├── order.service.js
    │   ├── customer.service.js
    │   ├── booking.service.js
    │   ├── chat.service.js
    │   ├── timeSlot.service.js
    │   ├── admin.order.service.js
    │   ├── admin.user.service.js
    │   ├── admin.dashboard.service.js
    │   └── admin.booking.service.js
    │
    ├── controllers/             # Thin request/response handlers
    │   ├── auth.controller.js
    │   ├── product.controller.js
    │   ├── public.product.controller.js
    │   ├── review.controller.js
    │   ├── cart.controller.js
    │   ├── order.controller.js
    │   ├── customer.controller.js
    │   ├── booking.controller.js
    │   ├── chat.controller.js
    │   ├── timeSlot.controller.js
    │   ├── admin.order.controller.js
    │   ├── admin.user.controller.js
    │   ├── admin.dashboard.controller.js
    │   └── admin.booking.controller.js
    │
    ├── routes/                  # Endpoint definitions
    │   ├── auth.routes.js
    │   ├── product.routes.js
    │   ├── public.product.routes.js
    │   ├── review.routes.js
    │   ├── cart.routes.js
    │   ├── order.routes.js
    │   ├── customer.routes.js
    │   ├── booking.routes.js
    │   ├── chat.routes.js
    │   ├── timeSlot.routes.js
    │   ├── admin.order.routes.js
    │   ├── admin.user.routes.js
    │   ├── admin.dashboard.routes.js
    │   ├── admin.booking.routes.js
    │   └── admin.chat.routes.js
    │
    ├── middlewares/
    │   ├── auth.middleware.js    # JWT verification (verifyJWT)
    │   ├── role.middleware.js    # Role-based access (authorizeRoles)
    │   └── error.middleware.js   # Global error handler
    │
    ├── utils/
    │   ├── ApiError.js          # Custom error class
    │   ├── ApiResponse.js       # Standardized response class
    │   ├── asyncHandler.js      # Async error wrapper
    │   ├── token.utils.js       # JWT token generation
    │   └── cloudinary.upload.js # Upload/delete helpers
    │
    ├── socket/
    │   └── socket.js            # Socket.io server + events
    │
    ├── scripts/
    │   └── seed.admin.js        # Admin user seeder
    │
    └── validators/              # (Reserved for future validation)
```

---

## 4. Models Reference

### 4.1 User Model
| Field | Type | Details |
|-------|------|---------|
| firstName | String | Required, trimmed |
| lastName | String | Trimmed |
| phoneNo | String | Optional |
| address | Object | { street, city, state, country } |
| email | String | Required, unique, lowercase |
| password | String | Required, select: false (hidden by default) |
| role | String | "customer" or "admin", default: "customer" |
| refreshToken | String | For JWT refresh flow |

**Features:** Pre-save password hashing, comparePassword method, toJSON/toObject transform (strips password, refreshToken, __v)

### 4.2 Product Model
| Field | Type | Details |
|-------|------|---------|
| title | String | Required, indexed |
| description | String | Required, max 5000 |
| price | Number | Required, min 0 |
| stock | Number | Required, min 0 |
| images | [String] | Array of URLs |
| category | String | Required, indexed |
| brand | String | Optional |
| ratings | Number | 0-5, default 0 |
| numReviews | Number | Default 0 |
| createdBy | ObjectId → User | Required |
| isDeleted | Boolean | Soft delete flag |

### 4.3 Review Model
| Field | Type | Details |
|-------|------|---------|
| user | ObjectId → User | Required |
| product | ObjectId → Product | Required |
| rating | Number | 1-5, required |
| comment | String | Max 1000 |

**Index:** { user, product } unique — prevents duplicate reviews

### 4.4 Cart Model
| Field | Type | Details |
|-------|------|---------|
| user | ObjectId → User | Required |
| items | Array | [{ product, quantity, price }] |

### 4.5 Order Model
| Field | Type | Details |
|-------|------|---------|
| user | ObjectId → User | Required |
| items | Array | Snapshot: [{ product, title, price, quantity, image }] |
| totalAmount | Number | Required |
| status | String | pending / paid / shipped / delivered / cancelled |
| paymentStatus | String | pending / paid / failed |

### 4.6 Booking Model
| Field | Type | Details |
|-------|------|---------|
| customer | ObjectId → User | Required |
| problemTitle | String | Required |
| problemDescription | String | Required, max 3000 |
| deviceType | String | laptop / desktop / mobile / tablet / other |
| deviceBrand | String | Optional |
| deviceModel | String | Optional |
| images | [String] | Cloudinary URLs |
| preferredDate | Date | Required, must be future |
| preferredTimeSlot | ObjectId → TimeSlot | Optional |
| status | String | pending / approved / in-progress / completed / rejected / cancelled |
| assignedTechnician | String | Admin-set |
| adminNotes | String | Admin-set |
| rejectionReason | String | Admin-set |
| estimatedCost | Number | Admin-set |
| finalCost | Number | Admin-set |

### 4.7 TimeSlot Model
| Field | Type | Details |
|-------|------|---------|
| date | Date | Required |
| startTime | String | Required (e.g. "09:00") |
| endTime | String | Required (e.g. "10:00") |
| isAvailable | Boolean | Default true |
| maxBookings | Number | Default 1 |
| currentBookings | Number | Default 0 |
| createdBy | ObjectId → User | Admin who created |

**Index:** { date, startTime } unique

### 4.8 Conversation Model
| Field | Type | Details |
|-------|------|---------|
| customer | ObjectId → User | Required |
| admin | ObjectId → User | Optional (assigned later) |
| status | String | "open" or "closed" |
| lastMessage | String | Preview text |
| lastMessageAt | Date | For sorting |

### 4.9 Message Model
| Field | Type | Details |
|-------|------|---------|
| conversation | ObjectId → Conversation | Required |
| sender | ObjectId → User | Required |
| senderRole | String | "customer" or "admin" |
| content | String | Required, max 2000 |
| isRead | Boolean | Default false |

---

## 5. Complete API Routes

### 5.1 Authentication — `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/customer/register` | ❌ | Register new customer |
| POST | `/customer/login` | ❌ | Login customer |
| POST | `/customer/refresh-token` | ❌ | Refresh access token |
| POST | `/customer/logout` | 🔒 JWT | Logout customer |
| POST | `/admin/login` | ❌ | Login admin |
| POST | `/admin/refresh-token` | ❌ | Refresh admin token |
| POST | `/admin/logout` | 🔒 JWT | Logout admin |

### 5.2 Customer Profile — `/api/v1/customer`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile` | 🔒 JWT | Get own profile |
| PATCH | `/profile` | 🔒 JWT | Update profile (firstName, lastName, phoneNo, address) |
| PATCH | `/change-password` | 🔒 JWT | Change password (currentPassword + newPassword) |

### 5.3 Products (Admin) — `/api/v1/admin/products`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | 🔒 Admin | Create product |
| GET | `/` | 🔒 Admin | Get all products |
| GET | `/:id` | 🔒 Admin | Get single product |
| PATCH | `/:id` | 🔒 Admin | Update product |
| DELETE | `/:id` | 🔒 Admin | Soft delete product |

### 5.4 Products (Public) — `/api/v1/products`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Browse products (search, filter, sort, paginate) |
| GET | `/:id` | ❌ | Get single product details |

### 5.5 Reviews — `/api/v1/reviews`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/:productId` | 🔒 JWT | Create review |
| GET | `/:productId` | ❌ | Get product reviews |
| DELETE | `/:reviewId` | 🔒 JWT | Delete own review |

### 5.6 Cart — `/api/v1/cart`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | 🔒 JWT | Add to cart |
| GET | `/` | 🔒 JWT | Get cart |
| PATCH | `/:itemId` | 🔒 JWT | Update quantity |
| DELETE | `/:itemId` | 🔒 JWT | Remove item |
| DELETE | `/clear` | 🔒 JWT | Clear cart |

### 5.7 Orders (Customer) — `/api/v1/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | 🔒 JWT | Create order from cart |
| GET | `/` | 🔒 JWT | Get my orders |
| GET | `/:id` | 🔒 JWT | Get single order |

### 5.8 Orders (Admin) — `/api/v1/admin/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | 🔒 Admin | All orders (?status, ?paymentStatus, ?page, ?limit) |
| GET | `/:id` | 🔒 Admin | Single order with user details |
| PATCH | `/:id/status` | 🔒 Admin | Update order/payment status |

### 5.9 Admin Users — `/api/v1/admin/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | 🔒 Admin | All users (?search, ?role, ?page, ?limit) |
| GET | `/:id` | 🔒 Admin | Single user details |
| PATCH | `/:id/role` | 🔒 Admin | Update user role |

### 5.10 Admin Dashboard — `/api/v1/admin/dashboard`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/stats` | 🔒 Admin | Summary stats |
| GET | `/recent-orders` | 🔒 Admin | Recent orders (?limit) |
| GET | `/recent-customers` | 🔒 Admin | Recent signups (?limit) |
| GET | `/recent-reviews` | 🔒 Admin | Recent reviews (?limit) |
| GET | `/analytics/revenue` | 🔒 Admin | Monthly revenue (?months) |
| GET | `/analytics/orders` | 🔒 Admin | Monthly orders by status |
| GET | `/analytics/products` | 🔒 Admin | Top products by revenue |
| GET | `/analytics/categories` | 🔒 Admin | Category distribution |

### 5.11 Bookings (Customer) — `/api/v1/bookings`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | 🔒 JWT | Create booking (multipart, up to 5 images) |
| GET | `/` | 🔒 JWT | My bookings (?status, ?page, ?limit) |
| GET | `/:id` | 🔒 JWT | Single booking (owner only) |
| PATCH | `/:id/cancel` | 🔒 JWT | Cancel booking (pending only) |

### 5.12 Bookings (Admin) — `/api/v1/admin/bookings`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | 🔒 Admin | All bookings (?status, ?page, ?limit) |
| GET | `/:id` | 🔒 Admin | Single booking with customer details |
| PATCH | `/:id/approve` | 🔒 Admin | Approve (pending only) |
| PATCH | `/:id/reject` | 🔒 Admin | Reject (pending only) |
| PATCH | `/:id/assign` | 🔒 Admin | Assign technician |
| PATCH | `/:id/status` | 🔒 Admin | Update status + optional finalCost |

### 5.13 Time Slots — `/api/v1/time-slots`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/available` | ❌ | Available slots by date (?date) |
| POST | `/` | 🔒 Admin | Create time slot |
| GET | `/` | 🔒 Admin | All slots (?date, ?isAvailable, ?page) |
| PATCH | `/:id` | 🔒 Admin | Update slot |
| DELETE | `/:id` | 🔒 Admin | Delete slot (no active bookings) |

### 5.14 Chat (Customer) — `/api/v1/chat`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/conversations` | 🔒 JWT | Start/get open conversation |
| GET | `/conversations` | 🔒 JWT | My conversations |
| GET | `/conversations/:id/messages` | 🔒 JWT | Get messages (?page, ?limit) |
| POST | `/conversations/:id/messages` | 🔒 JWT | Send message |
| PATCH | `/conversations/:id/read` | 🔒 JWT | Mark as read |

### 5.15 Chat (Admin) — `/api/v1/admin/chat`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/conversations` | 🔒 Admin | All conversations (?status) |
| GET | `/conversations/:id/messages` | 🔒 Admin | Get messages |
| POST | `/conversations/:id/messages` | 🔒 Admin | Admin reply |
| PATCH | `/conversations/:id/close` | 🔒 Admin | Close conversation |

---

## 6. Socket.io Events

**Connection:** Client sends JWT token via `socket.handshake.auth.token`

| Event (Client → Server) | Payload | Description |
|--------------------------|---------|-------------|
| `joinConversation` | conversationId | Join a chat room |
| `leaveConversation` | conversationId | Leave a chat room |
| `sendMessage` | { conversationId, content } | Send + save message |
| `typing` | conversationId | Notify typing |
| `stopTyping` | conversationId | Stop typing |
| `markRead` | conversationId | Mark messages read |

| Event (Server → Client) | Payload | Description |
|--------------------------|---------|-------------|
| `newMessage` | message object | New message in room |
| `conversationUpdated` | { conversationId, lastMessage, ... } | Broadcast update |
| `userTyping` | { userId, firstName, role } | Typing indicator |
| `userStoppedTyping` | { userId } | Stop typing |
| `messagesRead` | { conversationId, readBy } | Read receipt |
| `messageError` | { message } | Error feedback |

---

## 7. Middlewares

| Middleware | File | Purpose |
|------------|------|---------|
| `verifyJWT` | auth.middleware.js | Extracts Bearer token, verifies JWT, attaches `req.user` |
| `authorizeRoles` | role.middleware.js | Checks `req.user.role` against allowed roles |
| `errorHandler` | error.middleware.js | Global catch-all, returns `{ success, message, errors }` |

---

## 8. Utilities

| Utility | File | Purpose |
|---------|------|---------|
| `ApiError` | ApiError.js | Custom error class with `statusCode`, `message`, `errors` |
| `ApiResponse` | ApiResponse.js | Standardized response: `{ statusCode, data, message, success }` |
| `asyncHandler` | asyncHandler.js | Wraps async controller functions, catches errors → `next()` |
| `token.utils.js` | token.utils.js | JWT access + refresh token generation |
| `uploadToCloudinary` | cloudinary.upload.js | Upload buffer → Cloudinary, returns secure URL |
| `deleteFromCloudinary` | cloudinary.upload.js | Delete image by public ID |
| `uploadMultipleToCloudinary` | cloudinary.upload.js | Batch upload, returns array of URLs |

---

## 9. Seed Script

**Purpose:** Creates a default admin user in the database.

**Usage:**
```bash
cd backend
npm run seed:admin
```

**Default Credentials:**
| Field | Value |
|-------|-------|
| Email | admin@admin.com |
| Password | admin123 |
| Role | admin |

**Behavior:**
- If admin already exists → skips and prints existing email
- If no admin → creates one and prints credentials
- Password is auto-hashed by the User model's pre-save middleware

---

## 10. Environment Variables (.env)

```env
NODE_ENV=development

PORT=3000

FRONTEND_URI=*

MONGO_URI=mongodb://localhost:27017/your-db-name

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### What you need to set up:

- [ ] **MONGO_URI** — Your MongoDB connection string (local or Atlas)
- [ ] **ACCESS_TOKEN_SECRET** — A strong random secret string for JWT
- [ ] **REFRESH_TOKEN_SECRET** — A different strong random secret for refresh tokens
- [ ] **CLOUDINARY_CLOUD_NAME** — From your Cloudinary dashboard
- [ ] **CLOUDINARY_API_KEY** — From your Cloudinary dashboard
- [ ] **CLOUDINARY_API_SECRET** — From your Cloudinary dashboard
- [ ] **FRONTEND_URI** — Your frontend URL (for CORS), use `*` for development

---

## 11. NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `nodemon src/server.js` | Start dev server with auto-restart |
| `start` | `node src/server.js` | Start production server |
| `seed:admin` | `node src/scripts/seed.admin.js` | Create default admin user |

---

## 12. Implementation Checklist

### ✅ Completed Features

- [x] **Authentication** — Register, Login, Logout, Refresh Token (Customer + Admin)
- [x] **Product Management** — Admin CRUD with soft delete
- [x] **Public Products** — Browse, search, filter, sort, paginate
- [x] **Reviews** — Create, list by product, delete own review
- [x] **Cart** — Add, get, update quantity, remove item, clear
- [x] **Orders** — Create from cart (with stock deduction), list, view
- [x] **Admin Orders** — List all (paginated/filterable), view, update status
- [x] **Customer Profile** — Get, update (whitelisted fields), change password
- [x] **Admin User Management** — List (search/filter), view, update role
- [x] **Admin Dashboard** — Stats, recent activity, analytics (revenue, orders, products, categories)
- [x] **Booking System** — Create (with image upload), list, view, cancel
- [x] **Time Slot System** — Admin CRUD, public available slots query
- [x] **Admin Booking Management** — List, view, approve, reject, assign technician, update status
- [x] **Cloudinary + Multer** — Image upload config, utilities, booking integration
- [x] **Chat System (REST)** — Conversations, messages, mark read, close
- [x] **Chat System (Real-time)** — Socket.io with JWT auth, rooms, typing indicators
- [x] **Admin Seed Script** — Default admin user creation

### ⬜ Pending (Your Side)

- [ ] Set up your `.env` variables (especially Cloudinary credentials)
- [ ] Run `npm run seed:admin` to create the default admin
- [ ] Set `FRONTEND_URI` to your actual frontend URL before deploying
- [ ] Replace default JWT secrets with strong random strings for production
- [ ] Consider adding rate limiting middleware (e.g., `express-rate-limit`)
- [ ] Consider adding input validation middleware (e.g., `express-validator`)
- [ ] Add payment gateway integration if needed (Stripe, etc.)
- [ ] Build the frontend application

---

## 13. Quick Start Guide

```bash
# 1. Clone the repo
git clone <your-repo-url>

# 2. Install dependencies
cd backend
npm install

# 3. Set up environment variables
# Copy and edit the .env file with your values

# 4. Start MongoDB (if local)
# Make sure MongoDB is running on localhost:27017

# 5. Seed the admin user
npm run seed:admin

# 6. Start the development server
npm run dev

# Server starts on http://localhost:3000
# Socket.io runs on the same port
```

---

## 14. Architecture Pattern

```
Client Request
    ↓
Express Router (routes/)
    ↓
Middleware (auth + role check)
    ↓
Controller (thin — req/res only)
    ↓
Service (all business logic)
    ↓
Model (Mongoose → MongoDB)
    ↓
Response (ApiResponse / ApiError)
```

**Key Principle:** Controllers NEVER contain business logic. They only extract request data and call service functions. All validation, database operations, and business rules live in the service layer.

---
