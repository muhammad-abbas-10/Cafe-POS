# Cafe POS

This project runs locally as two processes:

- `frontend/`: React and Vite at `http://127.0.0.1:5173`
- `backend/`: Express API at `http://127.0.0.1:5000`

Vite proxies browser requests from `/api` to the local Express server. The
backend uses an embedded PostgreSQL-compatible database stored under
`backend/.data/`. No deployed service, Docker process, Base44 development
server, or frontend environment file is required.

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

On its first start, the backend creates `backend/.data/cafe-pos`, applies the
schema, and adds sample menu data. `backend/.env` configures this local database
and is ignored by git. To stop the app, press Ctrl+C in both terminals.

## Database migrations

The embedded database applies new migrations automatically when the backend
starts. With the backend stopped, you can also apply them explicitly with:

```powershell
npm run migrate --prefix backend
```

## Production build check

To verify that the frontend can compile locally without deploying it:

```powershell
npm run build --prefix frontend
```
