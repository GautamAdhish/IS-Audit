# IS-Audit 
IS-Audit is an Information Security / ISO 27001 audit-management application built as a MERN stack:

- **MongoDB** — persistent audit, findings, CAPA, risk, evidence, report, checklist, user and settings data
- **Express + Node.js** — authenticated REST API with role-based access control
- **React + Vite + TypeScript** — responsive management dashboard
- **JWT authentication** — protected SPA routes and API endpoints
- **Multer** — evidence/document uploads
- **Recharts** — live dashboard analytics

## Project structure

```text
IS-Audit-MERN/
├── client/          # React/Vite frontend
└── server/          # Express/Mongoose API
```

## What was merged

The original frontend's static `src/data/*.ts` demo data has been replaced by live API/database calls.

The frontend now supports:

- Login/logout and protected routes
- Live dashboard statistics and charts
- Audit-program calendar generated from database audits
- CRUD screens for audits, findings, CAPA, risks, checklist items, reports and users
- Role restrictions enforced by the backend
- Evidence upload and download
- Organisation/settings persistence
- MongoDB-backed seeded demo data
- API error/loading states
- Responsive existing dashboard UI

## Requirements

- Node.js 18+
- MongoDB 6+ (local MongoDB or MongoDB Atlas)

## 1. Start the backend

```bash
cd server
cp .env.example .env
npm install
```

Edit `.env` if you are using MongoDB Atlas.

Then seed the demo data:

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

The API runs on `http://localhost:5000`.

Health check:

```text
GET http://localhost:5000/api/health
```

## 2. Start the frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

The Vite development server proxies `/api` requests to `http://localhost:5000`.


## One-port demo / deployment mode

The merged project can also be served as a single application by Express. This is the recommended mode for a college/project demonstration.

First build the React frontend:

```bash
cd client
npm install
npm run build
```

Then start the backend:

```bash
cd ../server
npm install
npm start
```

Open:

```text
http://127.0.0.1:5000/is-audit
```

Express serves the React build at `/is-audit` and the MERN API at `/api/*`. React Router is configured with `/is-audit` as its basename, so refreshing routes such as `/is-audit/dashboard` continues to work.

If you are actively developing the React frontend, you can still use Vite:

```bash
cd client
npm run dev
```

and open `http://localhost:5173/is-audit`. The Vite server proxies `/api` to the Express server on port 5000.

## Demo login

The backend seed creates an administrator using:

```text
Email:    admin@company.com
Password: ChangeMe123!
```

Change the seed credentials in `server/.env` before using this outside a local/demo environment.

## Production notes

For a deployed frontend, set:

```text
VITE_API_URL=https://your-api-domain.example/api
```

and configure the backend:

```text
CLIENT_ORIGIN=https://your-frontend-domain.example
MONGO_URI=...
JWT_SECRET=...
```

Do not commit `.env` files or production JWT secrets.

## API resources

```text
/api/auth
/api/users
/api/audits
/api/findings
/api/capas
/api/risks
/api/evidence
/api/checklist
/api/reports
/api/settings
/api/dashboard
```

The backend already includes Helmet, CORS, rate limiting, Mongo sanitisation, HPP protection, JWT validation and role-based access controls.

## Reset seeded data

To remove the seeded collections:

```bash
cd server
npm run seed:destroy
```

Then seed again with:

```bash
npm run seed
```
