# IS-Audit — Backend (Express + MongoDB)

REST API backend for the IS-Audit ISMS/audit-management frontend, completing
the MERN stack (MongoDB, Express, React, Node).

## What this adds

The frontend (`/src`) originally read every list — audits, findings, CAPAs,
risks, evidence, checklist items, reports, users, dashboard stats — from
static arrays in `src/data/*.ts`. Nothing was persisted, there was no
authentication, and nothing could actually be created, edited, or deleted.
This server replaces that static data with a real database and a documented
REST API, one resource per frontend data file, plus authentication and a
live dashboard-aggregation endpoint.

## Setup

```bash
cd server
npm install
cp .env.example .env      # then edit .env — at minimum set MONGO_URI and JWT_SECRET
npm run seed               # populate MongoDB with data equivalent to the old mock data
npm run dev                 # starts on http://localhost:5000 (nodemon, auto-restart)
```

Requires a running MongoDB instance — either local (`mongodb://127.0.0.1:27017/is-audit`)
or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster; put the
connection string in `MONGO_URI`.

The seed script also prints a ready-to-use admin login:
`admin@company.com` / whatever `SEED_ADMIN_PASSWORD` is set to in `.env`
(defaults to `ChangeMe123!`). Every other seeded user gets the password
`Password123!`.

To wipe everything the seed script created: `npm run seed:destroy`.

## Authentication

JWT bearer tokens. Every route except `/api/auth/register` and
`/api/auth/login` requires `Authorization: Bearer <token>`.

```
POST /api/auth/register   { name, email, password, department, role? }
POST /api/auth/login      { email, password }
GET  /api/auth/me         (requires auth)
```

Destructive actions (delete, and most create/update operations) are
additionally restricted by role (`Admin`, `Lead Auditor`, `Auditor`,
`Auditee`, `Viewer`) — see the `restrictTo(...)` calls in each `routes/*.js`
file for the exact rule per endpoint.

## Resources

All list endpoints below support the same query conventions:

- `?search=keyword` — case-insensitive search across the resource's key text fields
- `?status=Open&department=IT` — exact-match filtering on any field
- `?sort=-createdAt,title` — sort (comma-separated, `-` prefix = descending)
- `?fields=title,status` — return only selected fields
- `?page=2&limit=25` — pagination (default limit 50, max 200)

| Resource | Base path | Notes |
|---|---|---|
| Audits | `/api/audits` | `auditor` populated from Users; `findingsCount` is a live virtual |
| Findings | `/api/findings` | linked to an Audit and an assignee User |
| CAPAs | `/api/capas` | linked to a Finding and an owner User |
| Risks | `/api/risks` | `riskScore`/`level` are always server-computed from `likelihood x impact`, never trusted from client input |
| Evidence | `/api/evidence` | `POST` accepts `multipart/form-data` with a `file` field (PDF/Word/Excel/PNG/JPEG, 20MB max); `GET /api/evidence/:id/download` streams the file back |
| Checklist | `/api/checklist` | ISO clause checklist items |
| Reports | `/api/reports` | |
| Users | `/api/users` | Admin-only create/update/delete |
| Settings | `/api/settings` | singleton document — `GET` returns it (creating defaults on first call), `PATCH` updates it (Admin only) |
| Dashboard | `/api/dashboard/*` | see below |

Every resource supports the standard REST verbs: `GET /`, `GET /:id`,
`POST /`, `PATCH /:id`, `DELETE /:id`.

Every created document gets a human-readable `code` matching the frontend's
existing ID style (`A-001`, `F-002`, `CL-010`, ...), generated atomically so
concurrent creates never collide — this keeps the UI's existing "ID" columns
and cross-references working unchanged once it's wired to the API.

### Dashboard

The frontend's `dashboardData.ts` was static — 48 total audits, 8 overdue,
etc., no matter what was actually in the system. These endpoints compute the
same shapes live from the database:

```
GET /api/dashboard/overview                  { statCards, complianceByDepartment, ncTrend }
GET /api/dashboard/stats                      statCards only
GET /api/dashboard/compliance-by-department   avg. audit compliance grouped by department
GET /api/dashboard/nc-trend                   findings by month/severity, last 6 months
```

## Security measures

- Passwords hashed with bcrypt (cost factor 12), never returned in API responses
- JWT auth with configurable expiry
- `helmet` for standard security headers
- Rate limiting: 300 req/15min general, 20 req/15min on login/register (brute-force protection)
- `express-mongo-sanitize` strips `$`/`.` operators from input to prevent NoSQL injection
- `hpp` guards against HTTP parameter pollution on filter query strings
- CORS locked to the configured frontend origin(s)
- Centralised error handler that never leaks stack traces or internal error
  detail outside of `NODE_ENV=development`
- File uploads restricted by MIME type and size (20MB) via `multer`

## Project structure

```
server/
  src/
    server.js          entrypoint (env, DB connect, listen, graceful shutdown)
    app.js              Express app: middleware + route mounting
    config/db.js         Mongoose connection
    models/               one file per collection
    controllers/
      crudControllerFactory.js   shared getAll/getOne/create/update/delete logic
      *.js                        per-resource controllers (built on the factory, or bespoke where needed — auth, users, evidence uploads, settings, dashboard)
    routes/                one file per resource, wires auth + role checks to controllers
    middleware/            auth (JWT), upload (multer), error handling
    utils/                  AppError, asyncHandler, APIFeatures (filter/search/sort/paginate), generateCode
    seed/seed.js            populates the DB with data equivalent to the old frontend mocks
```

## Connecting the frontend

The frontend isn't wired to this API yet — it still imports from
`src/data/*.ts`. To connect it: replace each page's static import
(e.g. `import { audits } from '../data/auditData'`) with a `fetch` (or a
small API client) to the matching endpoint, store the result in state, and
send the JWT from `/api/auth/login` as a Bearer token on every request. CORS
is already configured for `http://localhost:5173` (Vite's default dev port)
via `CLIENT_ORIGIN` in `.env`.
