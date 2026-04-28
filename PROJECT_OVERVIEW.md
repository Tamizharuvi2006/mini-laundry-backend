# Mini Laundry Order Management System - Project Overview

## 1) Assignment Objective
Build a lightweight dry-cleaning/laundry order management system that supports:
- Order creation
- Order status tracking
- Billing calculation
- Basic dashboard analytics
- AI-first development workflow documentation

## 2) Live Links
- Frontend: https://mini-laundry-frontend.vercel.app/
- Backend: https://mini-laundry-backend.onrender.com

## 3) Demo Credentials
- Email: `admin@laundry.com`
- Password: `admin123`

## 4) Core Features Implemented

### A. Create Order
- Customer name and phone capture
- Multiple garments per order (dynamic add/remove rows)
- Quantity and price per garment
- Backend-side bill calculation (final source of truth)
- Unique order ID generation
- Estimated delivery date support

### B. Order Status Management
- Statuses supported:
  - `RECEIVED`
  - `PROCESSING`
  - `READY`
  - `DELIVERED`
  - `REFUNDED` (extended for real-world handling)
- Status transition updates from UI
- Refunded orders locked from further workflow changes

### C. View Orders
- List all orders
- Filters:
  - By status
  - By customer name/phone
  - By garment type
- Pagination with total order count
- Mobile-responsive table behavior

### D. Dashboard
- Total orders
- Net revenue
- Refunded amount
- Orders per status
- Today's orders/net/refunds
- Revenue vs refund trend chart
- Net/Gross toggle on chart
- Date-range filtering for dashboard analytics

## 5) Extra Upgrades Added (Beyond Minimum)
- Refund-aware accounting (net revenue becomes negative impact for refunds)
- Order activity timeline (`order_events`) in order details
- CSV export for orders
- Quick "Mark Delivered" action
- Deep-link auth guard behavior:
  - Opening protected URLs directly redirects to login when not authenticated
  - After login, user returns to intended page
- Vercel SPA rewrites for reliable direct route access (e.g., `/dashboard`)

## 6) Backend/API Highlights
- REST API with Express
- Authentication endpoint with protected routes
- Order CRUD + status + refund handling
- Dashboard metrics endpoint with date range support:
  - `GET /api/dashboard?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- Pagination support:
  - `GET /api/orders?limit=10&offset=0`
- Response includes `total`, `page`, `pageSize`, `totalPages`

## 7) Database (Supabase/Postgres)
- Main table: `orders`
- Event audit table: `order_events`
- Revenue and status metrics computed from persisted orders

Optional performance indexes recommended:
```sql
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_orders_status_created_at on orders(status, created_at desc);
```

## 8) AI-First Execution Summary
AI tools were used heavily for:
- Scaffolding initial API/UI structure
- Drafting and accelerating feature implementation
- Error diagnosis and deployment fixes
- Iterative enhancements and documentation support

Manual engineering improvements were applied for:
- Refund correctness in dashboard/net calculations
- Route protection + deep-link redirect behavior
- Production rewrite handling on Vercel
- UI responsiveness and evaluator-facing polish
- API consistency and edge-case handling

## 9) Submission Artifacts
- Public frontend repo
- Public backend repo
- README files with setup + AI usage report
- Postman/screenshots support folder
- Deployment links (frontend + backend)

## 10) Evaluator Quick Check
This project is production-demo ready for internship evaluation:
- Functional core requirements complete
- Bonus features implemented with practical scope
- Live hosted links working
- Auth, analytics, and mobile UX included
