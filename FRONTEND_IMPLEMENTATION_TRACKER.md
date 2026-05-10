# Frontend Implementation Tracker

This file is the single source of truth for frontend work only.

Rules for execution:
- Work on one part at a time.
- Mark a part complete only after implementation + verification.
- Do not modify backend code or backend routes.
- Follow provided UI screens strictly for layout, spacing, typography, and interactions.
- After each completed part:
  - Add a short update in `frontend/README.md`.
  - Use the suggested one-line commit message (or a close equivalent).

---

## 0) UI Screen Mapping (Required Before UI Work)

- [ ] Collect and organize all provided UI screens by flow:
  - Storefront (public shopping)
  - Booking (service flow)
  - Admin dashboard
- [ ] Build a screen-to-route map (`Screen Name -> Frontend Route`).
- [ ] Identify reusable design tokens from screens (colors, spacing, radius, typography, button/input styles).
- [ ] Mark which current pages are:
  - Keep
  - Redesign
  - Rebuild

### Completion note format (for `frontend/README.md`)
- `UI screens mapped to routes and design tokens; implementation now follows approved designs.`

### Suggested commit message
- `map provided UI screens to frontend routes and design tokens`

---

## Phase 1 - API Contract Lock & Integration Foundation

### Part 1.1 - Backend Route Truth Map
- [ ] Create a route truth map from backend route files (not old docs).
- [ ] Confirm exact paths, methods, auth requirements, and key payload fields.
- [ ] Document endpoint mismatches found in current frontend.

README note:
- `Locked frontend API contract from backend routes and documented integration mismatches.`

Commit message:
- `lock frontend api contract from backend route definitions`

### Part 1.2 - Central API Route Constants
- [ ] Add centralized frontend route constants for all API endpoints.
- [ ] Replace hardcoded endpoint strings in hooks/pages with constants.

README note:
- `Replaced hardcoded API paths with centralized route constants for safer integration.`

Commit message:
- `centralize frontend api endpoint constants`

### Part 1.3 - Shared Request/Response Handling
- [ ] Add shared API helpers for response normalization and error extraction.
- [ ] Standardize success/error toasts and mutation error handling.

README note:
- `Standardized API response parsing and error handling across frontend features.`

Commit message:
- `standardize api response and error handling in frontend`

### Part 1.4 - Query Keys & Cache Policy
- [ ] Define consistent React Query keys per domain (products, cart, orders, bookings, admin).
- [ ] Add consistent invalidation strategy after mutations.

README note:
- `Unified React Query keys and cache invalidation strategy across modules.`

Commit message:
- `unify react query keys and cache invalidation strategy`

---

## Phase 2 - Authentication & Role Routing Stability

### Part 2.1 - Customer Auth Flow Hardening
- [ ] Validate login/register/refresh/logout behavior with real API contract.
- [ ] Improve session restoration and protected redirects.

README note:
- `Hardened customer authentication flow with reliable session restore and redirects.`

Commit message:
- `harden customer auth flow and session restoration`

### Part 2.2 - Admin Auth Flow Hardening
- [ ] Validate admin login/refresh/logout behavior.
- [ ] Ensure admin routes are inaccessible to non-admin users.

README note:
- `Stabilized admin auth flow and strengthened role-based route protection.`

Commit message:
- `stabilize admin auth and role-protected routing`

### Part 2.3 - Auth UX and Edge Cases
- [ ] Handle token expiry, 401 retry loops, forced logout, and stale state cleanup.
- [ ] Add clear user messages for auth failures.

README note:
- `Improved auth edge-case handling for token expiry, retries, and forced logout states.`

Commit message:
- `improve auth edge case handling and user feedback`

---

## Phase 3 - Storefront Redesign & Commerce Integration

### Part 3.1 - Storefront UI System (from provided screens)
- [ ] Implement storefront visual tokens/components based on provided UI screens.
- [ ] Apply design consistency to public layout (navbar, footer, cards, sections).

README note:
- `Implemented storefront design system and aligned public layout to provided UI screens.`

Commit message:
- `apply new storefront design system from approved screens`

### Part 3.2 - Product Listing & Filtering
- [ ] Refine products page UX (search, filter, sort, pagination) to screen design.
- [ ] Validate query params and empty/loading/error states.

README note:
- `Refined product listing flow with reliable filtering, sorting, pagination, and states.`

Commit message:
- `refine products listing filters sorting and pagination`

### Part 3.3 - Product Detail & Reviews
- [ ] Align product detail page to provided UI.
- [ ] Ensure review list/create flow uses correct endpoints and refresh behavior.

README note:
- `Updated product detail and review flow to match UI and backend integration rules.`

Commit message:
- `update product detail and reviews integration flow`

### Part 3.4 - Cart API Integration (Replace local-only logic)
- [ ] Integrate cart with backend routes (`add`, `get`, `update`, `remove`, `clear`).
- [ ] Keep cart UI responsive with correct optimistic/pessimistic strategy.

README note:
- `Migrated cart from local-only behavior to full backend API integration.`

Commit message:
- `integrate cart flow with backend cart endpoints`

### Part 3.5 - Checkout & Order Placement
- [ ] Fix checkout auth handling and route gating.
- [ ] Use correct order creation endpoint and success flow.
- [ ] Validate order creation error cases clearly.

README note:
- `Completed checkout and order placement flow with correct auth and endpoint usage.`

Commit message:
- `complete checkout and order placement integration`

### Part 3.6 - My Orders (List + Detail)
- [ ] Ensure my orders list uses backend pagination/status fields correctly.
- [ ] Add/repair customer order detail route and page integration.

README note:
- `Finished customer orders experience with stable list and detail integration.`

Commit message:
- `finalize customer orders list and detail flow`

---

## Phase 4 - Booking Redesign & Service Flow Completion

### Part 4.1 - Booking UI System (from provided screens)
- [ ] Apply booking-specific visual style from provided screens (distinct from storefront/admin).
- [ ] Update service/booking page sections and component hierarchy.

README note:
- `Implemented booking-specific UI style aligned with provided service screens.`

Commit message:
- `apply booking ui redesign from provided screens`

### Part 4.2 - Booking Form & Slots Integration
- [ ] Use correct public slot endpoint (`/time-slots/available`) in customer flow.
- [ ] Validate multipart booking payload and image constraints.

README note:
- `Fixed booking form integration with correct time slot endpoint and multipart payload handling.`

Commit message:
- `fix booking form and available slots endpoint integration`

### Part 4.3 - Booking Success, List, and Detail
- [ ] Stabilize booking success redirect and booking history UX.
- [ ] Ensure list/detail/cancel lifecycle reflects backend states exactly.

README note:
- `Completed booking lifecycle UX for success, history, detail, and cancel states.`

Commit message:
- `complete customer booking lifecycle integration`

---

## Phase 5 - Admin Dashboard Redesign & Data Flows

### Part 5.1 - Admin Design System (from provided screens)
- [ ] Implement admin-specific design language from provided UI screens.
- [ ] Keep admin visuals distinct from storefront/booking.

README note:
- `Applied dedicated admin dashboard design system based on provided screens.`

Commit message:
- `apply dedicated admin dashboard design system`

### Part 5.2 - Admin Dashboard Analytics
- [ ] Validate stats/recent/analytics endpoints and chart data mapping.
- [ ] Improve loading and empty states for analytics widgets.

README note:
- `Stabilized admin analytics data mapping and dashboard state handling.`

Commit message:
- `stabilize admin dashboard analytics integration`

### Part 5.3 - Admin Products Management
- [ ] Verify list/create/edit/delete product flows against backend contract.
- [ ] Improve form validation and mutation feedback.

README note:
- `Improved admin product management flows with reliable validation and feedback.`

Commit message:
- `improve admin products crud flow and validation`

### Part 5.4 - Admin Orders Management
- [ ] Validate order list/detail/status update flows.
- [ ] Ensure status transitions and payment status updates are consistent.

README note:
- `Refined admin orders management and status update behavior.`

Commit message:
- `refine admin orders status management flow`

### Part 5.5 - Admin Users Management
- [ ] Validate users list/detail/role update integration.
- [ ] Ensure secure and clear role change UX.

README note:
- `Completed admin users management flow with stable role update integration.`

Commit message:
- `complete admin users list detail and role updates`

### Part 5.6 - Admin Bookings Management
- [ ] Validate admin booking list/detail and approve/reject/assign/status actions.
- [ ] Ensure action states and notes/reasons are handled correctly.

README note:
- `Completed admin bookings management flow for approve reject assign and status updates.`

Commit message:
- `complete admin bookings management action flows`

### Part 5.7 - Admin Time Slots Management
- [ ] Validate timeslot CRUD integration and constraints.
- [ ] Ensure calendar/grouping UI is clear and predictable.

README note:
- `Finalized admin time slots management with stable CRUD integration.`

Commit message:
- `finalize admin time slots crud integration`

---

## Phase 6 - Chat & Realtime Reliability

### Part 6.1 - Customer Chat Reliability
- [ ] Validate conversation create/list/messages/send/read flows.
- [ ] Improve reconnect behavior and message state sync.

README note:
- `Improved customer chat reliability for conversation and message synchronization.`

Commit message:
- `improve customer chat realtime reliability`

### Part 6.2 - Admin Chat Reliability
- [ ] Validate admin conversation list, reply flow, close conversation behavior.
- [ ] Improve live updates and unread/typing indicators.

README note:
- `Improved admin chat flow with stable live updates and conversation controls.`

Commit message:
- `improve admin chat live conversation flow`

---

## Phase 7 - Frontend Bug Fixes, UX Polish, and Performance

### Part 7.1 - Routing & Navigation Bug Sweep
- [ ] Fix broken links, missing routes, and redirect inconsistencies.
- [ ] Verify all navigation paths from navbar/footer/sidebars.

README note:
- `Resolved major routing and navigation issues across storefront booking and admin areas.`

Commit message:
- `fix frontend routing and navigation issues`

### Part 7.2 - Loading/Error/Empty States Audit
- [ ] Ensure each page/table/form has complete loading/error/empty handling.
- [ ] Standardize retry behavior and fallback messages.

README note:
- `Completed full loading error and empty state handling audit across frontend modules.`

Commit message:
- `complete frontend loading error and empty state audit`

### Part 7.3 - Responsive & Accessibility Audit
- [ ] Validate key breakpoints and keyboard accessibility.
- [ ] Fix focus states, form labels, aria basics, and contrast gaps.

README note:
- `Improved responsive behavior and baseline accessibility across critical user flows.`

Commit message:
- `improve frontend responsiveness and accessibility baseline`

### Part 7.4 - Performance Optimization Pass
- [ ] Add route-level lazy loading and optimize heavy renders.
- [ ] Reduce unnecessary refetches and improve perceived performance.

README note:
- `Applied frontend performance optimizations with lazy loading and query tuning.`

Commit message:
- `optimize frontend performance with lazy loading and query tuning`

---

## Phase 8 - Final Verification & Release Readiness

### Part 8.1 - Endpoint Coverage Verification
- [ ] Verify all required backend routes are used correctly in frontend.
- [ ] Document intentionally unused endpoints (if any).

README note:
- `Verified frontend endpoint coverage against backend routes and documented final status.`

Commit message:
- `verify frontend endpoint coverage against backend routes`

### Part 8.2 - End-to-End Flow Validation
- [ ] Validate full guest, customer, and admin journeys.
- [ ] Record final known limitations and next improvements.

README note:
- `Validated end-to-end frontend journeys for guest customer and admin roles.`

Commit message:
- `validate end to end frontend journeys for all roles`

---

## Working Protocol (Use for every completed part)

- [ ] Implement one part only.
- [ ] Verify functionally in UI and API behavior.
- [ ] Tick checkbox for that part in this file.
- [ ] Add one short line in `frontend/README.md`.
- [ ] Use one simple one-line commit message.

---

## Current Start Point

Next part to implement:
- `Phase 0 -> UI Screen Mapping`

Blocked items:
- Waiting for your provided UI screens to align implementation precisely.
