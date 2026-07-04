# Print3D — 3D Printing Service

A web application for a 3D printing service. Customers upload STL files, choose materials, get instant quotes, and place orders. Admins manage the order queue.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Backend | Express.js (REST API) |
| Frontend | React + Vite |
| Database | SQLite (via better-sqlite3) |
| Auth | JWT (access + refresh tokens), bcrypt hashing |
| Logging | Custom JSON logger + Morgan HTTP logger |

## Setup & Run

### Prerequisites
- Node.js 22.x (the frontend uses Vite 8 which requires Node 22)
- npm

### 1. Backend

```bash
cd backend
npm install
npm run seed          # Creates DB tables + seeds demo users & materials
npm run dev           # Starts API on http://localhost:4000
```

Default `.env` values (already in `backend/.env`):

```
PORT=4000
JWT_SECRET=change_this_to_a_random_string_in_production
JWT_REFRESH_SECRET=change_this_to_another_random_string
DB_PATH=./db/print3d.sqlite
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev           # Starts Vite dev server on http://localhost:5173
```

The frontend calls the backend API at `http://localhost:4000/api` (hardcoded in `frontend/src/api/client.js`). CORS is configured on the backend.

### Demo Accounts (seeded)

| Role | Email | Password |
|---|---|---|
| Admin | admin@print3d.com | admin123 |
| Customer | customer@print3d.com | customer123 |

## Database Schema (DDL)

See `backend/db/schema.sql` for the full DDL script.

### Tables

- **users** — id, name, email (UNIQUE), password_hash, role (customer|admin), created_at
- **materials** — id, name, color, price_per_cm3 (cents)
- **refresh_tokens** — id, user_id (FK→users), token (UNIQUE), expires_at, created_at
- **orders** — id, user_id (FK→users), filename, material_id (FK→materials), quality (draft|standard|fine), infill (10-100%), color, volume_cm3, quote_cents, status (pending|printing|shipped|cancelled), created_at, updated_at

### ER Diagram

```
┌──────────┐       ┌──────────────┐       ┌───────────┐
│  users   │       │    orders    │       │ materials │
├──────────┤       ├──────────────┤       ├───────────┤
│ id (PK)  │──1─<──│ user_id (FK) │       │ id (PK)   │
│ name     │       │ id (PK)      │──>─1──│ name      │
│ email    │       │ filename     │       │ color     │
│ hash     │       │ material_id  │       │ price_cm3 │
│ role     │       │ quality      │       └───────────┘
│ created  │       │ infill       │
└──────────┘       │ color        │
      │            │ volume_cm3   │
      │            │ quote_cents  │
      │            │ status       │
      │            │ created_at   │
      │            │ updated_at   │
      │            └──────────────┘
      │
      │         ┌──────────────────┐
      └───1─<──│  refresh_tokens  │
                ├──────────────────┤
                │ id (PK)          │
                │ user_id (FK)     │
                │ token (UNIQUE)   │
                │ expires_at       │
                └──────────────────┘
```

## API Endpoints

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register new customer |
| POST | /api/auth/login | No | Login, returns JWT + refresh token |
| POST | /api/auth/refresh | No | Refresh access token |
| POST | /api/auth/logout | No | Revoke refresh token |

### Materials
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/materials | No | List all materials |

### Orders
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/orders | Customer | Create order (multipart: stl_file + form fields) |
| GET | /api/orders/mine | Customer | List own orders |
| GET | /api/orders | Admin | List all orders |
| PATCH | /api/orders/:id/status | Admin | Update order status |

## Quoting Formula

```
quote = (200¢ base + volume_cm3 × material_price_per_cm3) × quality_factor × infill_factor
```

- quality_factor: draft=0.8, standard=1.0, fine=1.3
- infill_factor: 0.4 + (infill% / 100) × 0.6
- Volume estimated from STL file size: `volume_cm3 = fileSizeBytes / 600`

## Extra Features (beyond course scope)

- **Refresh tokens** — secure token rotation, stored in DB with expiry
- **Role-based access control (RBAC)** — admin vs customer with middleware enforcement
- **Input validation** — express-validator on auth endpoints
- **Rate limiting** — login/register limited to 20 requests per 15 minutes
- **Helmet** — security headers
- **File upload** — multer for STL files with size (50MB) and type validation
- **JSON structured logging** — file-based + console

## Project Structure

```
tenu/
├── backend/
│   ├── src/
│   │   ├── config/        db.js, env.js
│   │   ├── controllers/   authController, materialController, orderController
│   │   ├── middleware/     auth, role, validate, errorHandler, logger
│   │   ├── models/         userModel, materialModel, orderModel, refreshTokenModel
│   │   ├── routes/         authRoutes, materialRoutes, orderRoutes
│   │   ├── utils/          stlVolume, quote
│   │   ├── app.js
│   │   └── server.js
│   ├── db/                 schema.sql, seed.js, print3d.sqlite
│   ├── uploads/            STL file storage (gitignored)
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/            client.js (fetch wrapper + JWT auto-refresh)
│   │   ├── components/     Navbar, OrderCard, UploadForm, QuoteCard
│   │   ├── context/        AuthContext
│   │   ├── pages/          Login, Register, Dashboard, NewOrder, MyOrders, AdminOrders
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
└── README.md
```
