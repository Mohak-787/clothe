# Store Backend

Simple Express + Neon Postgres backend for product CRUD.

## Quick Start

```bash
npm install
```

Create a `.env` file:

```env
PORT=3001
PGHOST=your_neon_host
PGDATABASE=your_database_name
PGUSER=your_database_user
PGPASSWORD=your_database_password
ARCJET_KEY=your_arcjet_key
```

Run locally:

```bash
npm run dev
```

Production:

```bash
npm start
```

## API

Base URL: `http://localhost:3001/api/products`

- `GET /` - Get all products
- `GET /:id` - Get one product
- `POST /` - Create product
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product

## Notes

- The `products` table is created automatically on server start.
- Security/rate limiting is handled with Arcjet.
