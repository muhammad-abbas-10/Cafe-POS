# Cafe POS

This project runs locally as two processes:

- `frontend/`: React and Vite at `http://127.0.0.1:5173`
- `backend/`: Express API at `http://127.0.0.1:5000`

Vite proxies browser requests from `/api` to the local Express server. The
backend connects to PostgreSQL using `DATABASE_URL`. For Vercel deployments,
use the Supabase Transaction pooler connection string and keep secrets in the
Vercel project environment rather than tracked files.

## Prerequisites

- Node.js and npm

## Install

From the repository root:

```powershell
npm install --prefix backend
npm install --prefix frontend
```

## Run locally

Open two terminals at the repository root.

Terminal 1:

```powershell
npm run dev --prefix backend
```

Terminal 2:

```powershell
npm run dev --prefix frontend
```

Open `http://127.0.0.1:5173` in your browser. Keep both terminals running while
you test the app. Use `admin` / `admin123` on the login page.

On its first start, the backend applies the SQL migrations. Set
`SEED_DATABASE=true` to add the sample menu data once. The legacy
`SEED_LOCAL_DB=true` setting is also supported. `backend/.env` configures the
local process and is ignored by git. To stop the app, press Ctrl+C in both
terminals.

## Database migrations

The backend applies new migrations automatically when it starts. You can also
apply them explicitly with:

```powershell
npm run migrate --prefix backend
```

## Vercel deployment

The root `vercel.json` deploys the Vite frontend and Express backend as one
Vercel Services project. Configure these variables for Production and Preview:

- `DATABASE_URL`: Supabase Transaction pooler URL (port `6543`) with
  `sslmode=require`
- `ADMIN_USERNAME`: administrator login name
- `ADMIN_PASSWORD`: administrator login password
- `JWT_SECRET`: long random signing secret

Set `SEED_DATABASE=true` only if you want the sample catalog inserted during
the first migration.

`CORS_ORIGINS` is optional for the same-origin deployment. Do not set `PORT` or
`VITE_API_URL` on Vercel.

## Production build check

To verify that the frontend can compile locally without deploying it:

```powershell
npm run build --prefix frontend
```
