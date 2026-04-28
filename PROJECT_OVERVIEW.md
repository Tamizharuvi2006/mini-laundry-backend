# Mini Laundry Order Management System - Project Overview

## 1) Project Summary
This is a complete mini SaaS-style laundry order management project built for internship evaluation.  
It covers order operations, status workflow, billing logic, dashboard analytics, refund handling, and deployment-ready frontend/backend integration.

## 2) Live Deployments
- Frontend (Vercel): https://mini-laundry-frontend.vercel.app/
- Backend (Render): https://mini-laundry-backend.onrender.com

Demo Login:
- Email: `admin@laundry.com`
- Password: `admin123`

## 3) Tech Stack Used

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Icons

### Backend
- Node.js
- Express.js
- JWT-based auth flow
- CORS + middleware handling

### Database / Cloud
- Supabase Postgres
- JSONB garments storage in `orders`
- `order_events` table for timeline/audit logs

### Deployment
- Frontend deployed on Vercel
- Backend deployed on Render

## 4) Core Features Implemented

### Order Creation
- Customer name + phone
- Multiple garments in one order
- Dynamic garment row add/remove
- Quantity/price input
- Backend-side bill calculation (final amount source of truth)
- Unique order ID generation
- Estimated delivery date support

### Status Management
- `RECEIVED`, `PROCESSING`, `READY`, `DELIVERED`
- Extended practical status: `REFUNDED`
- Status updates from orders UI
- Refunded orders protected from invalid further flow changes

### Orders Listing and Filtering
- View all orders
- Filter by status
- Search by customer name/phone
- Filter by garment type
- Pagination with total count metadata
- Mobile-responsive table/actions

### Dashboard and Analytics
- Total orders
- Net revenue
- Refunded amount
- Orders per status
- Today's orders/net/refunds
- Net/Gross toggle chart
- Revenue vs refund trend
- Date-range filter (`startDate`, `endDate`)

## 5) Advanced Upgrades Added
- Refund-aware accounting (refund creates negative net impact)
- Order activity timeline in order details
- CSV export for orders
- Quick mark-delivered action
- Deep-link auth redirection:
  - Direct `/dashboard` access while logged out goes to login
  - After login, user returns to original target page
- Vercel SPA rewrite config for direct route reliability

## 6) API Highlights
- `POST /api/auth/login`
- `POST /api/orders`
- `GET /api/orders` (search/filter/garment/pagination)
- `GET /api/orders/:orderId`
- `PATCH /api/orders/:orderId/status`
- `PUT /api/orders/:orderId`
- `POST /api/orders/:orderId/refund`
- `GET /api/orders/:orderId/events`
- `GET /api/dashboard?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

Orders endpoint pagination response includes:
- `total`
- `page`
- `pageSize`
- `totalPages`

## 7) AI Usage (ChatGPT / Copilot Style Workflow)
AI tools were used heavily during implementation for:
- project scaffolding
- endpoint and component drafting
- iterative code suggestions
- debugging route/deployment/auth issues
- documentation drafting

Manual engineering improvements made after AI suggestions:
- fixed refund revenue logic in dashboard
- corrected deep-link auth redirect behavior
- added Vercel rewrite for SPA routes
- refined responsiveness and UX actions
- improved API consistency and edge case handling

## 8) What This Project Demonstrates
- Fast execution with practical architecture
- Strong ownership over debugging and production fixes
- Effective AI leverage with manual quality control
- Delivery of both minimum requirements and high-value upgrades

## 9) Optional DB Performance Improvement
No mandatory DB migration required for current features.  
Recommended indexes for scale:

```sql
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_orders_status_created_at on orders(status, created_at desc);
```
