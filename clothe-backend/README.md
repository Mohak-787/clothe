# Clothè Backend

This is the backend of clothè website.

## Setup

1. Copy `.env.example` to `.env`
2. Fill all env values
3. Install dependencies: `npm install`
4. Run dev server: `npm run dev`

## Auth Rules

- User/customer endpoints are public (no login required)
- Admin endpoints require JWT verification

## API

### Public product routes

- `GET /api/v1/products/`
- `GET /api/v1/products/id/:id`
- `GET /api/v1/products/name/:name`
- `GET /api/v1/products/category/:category`

### Public order route (no login)

- `POST /api/v1/orders`
  - body: `fullName, email, phone, address, payment, shipping, productId, size, quantity`
  - `payment`: `cod | khalti | esewa | card | bank-transfer`
  - `shipping`: `standard | express | pickup`

### Admin auth routes

- `POST /api/v1/admin/register`
- `POST /api/v1/admin/login`
- `POST /api/v1/admin/refresh-token`
- `POST /api/v1/admin/logout` (JWT required)
- `GET /api/v1/admin/me` (JWT required)

### Admin product routes (JWT required)

- `GET /api/v1/admin/products`
- `POST /api/v1/admin/products`
- `PATCH /api/v1/admin/products/:id`
- `DELETE /api/v1/admin/products/:id`
- `GET /api/v1/admin/orders`
