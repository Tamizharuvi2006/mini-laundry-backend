# Mini Laundry Backend API

Backend service for the Mini Laundry Order Management System.

## Stack

- Node.js
- Express.js
- Supabase Postgres
- JWT authentication

## Features

- Admin login (`/api/auth/login`)
- Order CRUD and status updates
- Refund support
- Billing calculation on backend
- Dashboard metrics:
  - gross revenue
  - refunded amount
  - net revenue
  - daily trend
- Product (garment pricing) management
- Basic API smoke tests

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Runs on:
- `http://localhost:5000`

## Environment Variables

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=replace_with_a_strong_secret
ADMIN_EMAIL=admin@laundry.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
```

## Scripts

- `npm run dev` - start backend in watch mode
- `npm start` - start backend
- `npm test` - run API smoke tests

## Key Endpoints

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/:orderId/status`
- `PUT /api/orders/:orderId`
- `POST /api/orders/:orderId/refund`
- `DELETE /api/orders/:orderId`
- `GET /api/dashboard`
- `GET /api/products`

## Notes

- `.env` is gitignored, `.env.example` is committed.
- Supabase schema is maintained in the root repository `supabase-schema.sql`.

## Assignment Mapping (AI-First)

This backend covers the assignment core requirements:
- Create Order
- Order Status Management
- View Orders (with filter/search)
- Basic Dashboard (total orders, revenue, orders per status)

Implemented details:
- Backend bill calculation (source of truth)
- Unique order ID generation
- Status transitions
- Refund support (negative impact on net revenue)
- Pagination support for order listing

## AI Usage Report

### Tools Used
- ChatGPT (primary)
- GitHub Copilot (optional assist)

### Sample Prompts
- "Design Express routes/controllers/services for a laundry order management API."
- "Generate Supabase schema for orders with status tracking and garment JSON."
- "Add practical request validation and clean API response structure."

### Where AI Helped
- Initial API scaffolding
- Validation and schema drafts
- Endpoint structure and docs drafting

### What AI Got Wrong and Manual Fixes
- Billing needed to be enforced in backend, not frontend.
- Initial auth approach was too permissive and was tightened.
- Dashboard logic needed manual refinement for refund-aware net revenue.
