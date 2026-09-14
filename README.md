<div align="center">

# ☕ Cafe POS

### A full-stack point-of-sale workspace for café orders, inventory, staff, and reporting

[![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?logo=javascript&logoColor=000)](https://github.com/muhammad-abbas-10/Cafe-POS)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=000)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=fff)
![Express](https://img.shields.io/badge/Express-5-000?logo=express&logoColor=fff)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=fff)
[![Vercel](https://img.shields.io/badge/Vercel-Configured-000?logo=vercel&logoColor=fff)](https://github.com/muhammad-abbas-10/Cafe-POS/blob/main/vercel.json)

[Repository](https://github.com/muhammad-abbas-10/Cafe-POS) · [Local setup](#-local-development) · [API reference](#-api-overview)

</div>

## Overview

Cafe POS is a responsive administrator-facing application for running the core workflow of a café counter. It brings catalog browsing, customizable order entry, recorded checkout, printable receipts, menu and recipe maintenance, ingredient stock, staff shifts, business settings, and sales reporting into a single interface.

An operator signs in with configured administrator credentials, builds a dine-in, takeaway, or delivery order, applies item-specific modifiers, and records payment. The Express API recalculates the order from database values, snapshots the sale, and—when the order is completed—deducts recipe ingredients and records the stock movement within one PostgreSQL transaction.

## 🚀 Deployment Status

The repository contains a Vercel Services configuration for separate Vite and Express services, but it does not record a verified public deployment URL. The application can be run locally using the instructions below or deployed through the included `vercel.json` configuration.

## 🧭 Product Experience

### Counter workflow

1. Sign in through the administrator login.
2. Browse menu categories or search for an item.
3. Choose the order type and provide a table number or delivery address when applicable.
4. Configure size, temperature, sugar, ice, add-ons, quantity, and line notes.
5. Review server-backed tax and delivery settings, then continue to checkout.
6. Record cash, card, e-wallet, or split payment; alternatively, save the order as a draft.
7. Print the generated receipt and review the order later from history.

### Management workflow

The same protected workspace provides menu and category maintenance, recipe composition, stock adjustments, low-stock visibility, staff and shift administration, receipt and pricing settings, and sales analytics. Navigation adapts between a desktop sidebar and a mobile bottom bar.

## ✨ Core Features

| Feature | Verified behavior |
| --- | --- |
| 🛒 Responsive order builder | Category browsing, catalog search, quantity controls, notes, and mobile cart presentation. |
| 🍽️ Fulfilment modes | Dine-in, takeaway, and delivery orders with table/address capture where relevant. |
| 🧋 Product modifiers | Drink sizes, hot/iced selection, sugar levels, ice levels, active add-ons, and per-line notes. |
| 💳 Recorded checkout | Cash, card, e-wallet, and two-method split payments. Card and e-wallet choices record externally completed payments; no gateway is connected. |
| 🧾 Drafts and receipts | Save an order for later, generate receipt data from saved snapshots, and print or reprint through the browser. |
| 📚 Order history | Search by order number or amount, filter by payment method, inspect line/payment details, and mark completed orders as refunded. |
| 🍴 Menu administration | Create, edit, remove, filter, and toggle the availability of menu items; create, rename, and remove categories. |
| 🧪 Recipe mapping | Associate each menu item with positive ingredient quantities used per sale. |
| 📦 Inventory control | Ingredient CRUD, reorder thresholds, low-stock warnings, deliveries, wastage, corrections, stocktakes, and adjustment history. |
| 🔒 Atomic stock deduction | Completed orders lock relevant ingredient rows, reject insufficient stock, deduct recipe quantities, and audit each deduction transactionally. |
| 👥 Staff and shifts | Admin, manager, and cashier records; clock-in/out actions; and opening/closing till values. |
| 📊 Sales reporting | Completed sales, order count, average order value, refunded/voided count, Pakistan-time hourly revenue, and top sellers. |
| ⚙️ Business settings | Receipt identity, tax rate, delivery fee, business hours, and stored printer preference. |
| 🔐 Protected administration | Environment-configured admin login, 12-hour JWTs, protected application routes, and automatic logout on unauthorized API responses. |

## 🧩 Technology Stack

<table align="center">
  <tr>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/javascript/F7DF1E" width="42" alt="JavaScript"/><br/>
      <sub><b>JavaScript</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/react/61DAFB" width="42" alt="React"/><br/>
      <sub><b>React 18</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/vite/646CFF" width="42" alt="Vite"/><br/>
      <sub><b>Vite 6</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" width="42" alt="Tailwind CSS"/><br/>
      <sub><b>Tailwind CSS 3</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/reactrouter/CA4245" width="42" alt="React Router"/><br/>
      <sub><b>React Router</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/nodedotjs/5FA04E" width="42" alt="Node.js"/><br/>
      <sub><b>Node.js</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/express/000000" width="42" alt="Express"/><br/>
      <sub><b>Express 5</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/postgresql/4169E1" width="42" alt="PostgreSQL"/><br/>
      <sub><b>PostgreSQL</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/reactquery/FF4154" width="42" alt="TanStack Query"/><br/>
      <sub><b>TanStack Query</b></sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/vercel/000000" width="42" alt="Vercel"/><br/>
      <sub><b>Vercel</b></sub>
    </td>
  </tr>
</table>

| Area | Technologies |
| --- | --- |
| Frontend | React 18, React Router 6, Vite 6, Tailwind CSS 3, Radix UI primitives, TanStack Query |
| Interaction and charts | Framer Motion, Lucide React, Recharts |
| Backend | Node.js, Express 5, JSON Web Tokens, CORS |
| Persistence | PostgreSQL, `pg`, versioned SQL migrations |
| Tooling | npm, ESLint, TypeScript type-checking through `jsconfig.json`, PostCSS, Autoprefixer |
| Deployment configuration | Vercel Services with Vite and Express service definitions |

React owns the interface and in-progress cart state. Its REST adapter communicates with Express, where services validate business rules and repositories execute PostgreSQL queries. Vite proxies the API in development, while Vercel rewrites provide the same URL shape in deployment.

> [!NOTE]
> Base44 configuration and entity definitions remain under `frontend/base44/`. The current operational screens read and write through the Express/PostgreSQL API; `frontend/src/api/base44Client.js` is a compatibility stub rather than the live data path.

## 🏗️ System Architecture

```mermaid
flowchart LR
    Operator[Administrator / counter operator]

    subgraph Browser
        SPA[React + Vite SPA]
        Cart[Cart context]
        Print[Browser receipt printing]
        SPA <--> Cart
        SPA --> Print
    end

    subgraph Application
        Auth[JWT authentication]
        API[Express REST API]
        Services[Business services]
        Repositories[SQL repositories]
        API --> Auth
        API --> Services
        Services --> Repositories
    end

    DB[(PostgreSQL)]

    Operator --> SPA
    SPA -->|/api + Bearer token| API
    Repositories --> DB
```

- Vite serves the SPA at `127.0.0.1:5173` and proxies `/api` to Express at `127.0.0.1:5000` during development.
- Login is public; every other backend route passes through JWT verification.
- Backend modules follow routes → controllers → services → repositories.
- Services recalculate monetary values from persisted menu, add-on, tax, and delivery data instead of trusting client totals.
- PostgreSQL stores operational data, immutable sale snapshots, adjustment history, settings, and the migration ledger.

## 🔄 End-to-End Order Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Operator
    participant SPA as React POS
    participant API as Express API
    participant DB as PostgreSQL

    Operator->>SPA: Submit administrator credentials
    SPA->>API: POST /api/auth/login
    API-->>SPA: 12-hour JWT and admin profile
    Operator->>SPA: Build and confirm an order
    SPA->>API: POST /api/orders with Bearer JWT
    API->>DB: Resolve menu items, add-ons, and settings
    API->>DB: BEGIN and lock recipe ingredient rows
    alt Sufficient inventory
        API->>DB: Insert order and line/add-on snapshots
        API->>DB: Deduct ingredients and log adjustments
        API->>DB: COMMIT
        API-->>SPA: Saved order and receipt data
        SPA-->>Operator: Display print action
    else Insufficient inventory
        API->>DB: ROLLBACK
        API-->>SPA: 409 inventory error
    end
```

Draft orders follow the same validation and snapshot flow but do not lock or deduct recipe inventory. The backend stores completed payment details as recorded metadata; it does not contact a payment processor.

## 🧱 Application Modules

| Module | Responsibility |
| --- | --- |
| Authentication | Admin credential validation, token issuance, browser token persistence, protected routing, and logout. |
| Order and cart | Menu loading, filters, fulfilment selection, item modifiers, notes, quantities, and local total preview. |
| Checkout | Draft/completed order submission, recorded single/split payments, and receipt generation. |
| Order history | Order listing, search, payment filtering, detail retrieval, refund status changes, and receipt reprinting. |
| Catalog | Category, menu item, availability, image, add-on retrieval, and recipe administration. |
| Inventory | Ingredients, thresholds, manual changes, audit entries, and sale-driven recipe deductions. |
| Staff and shifts | Staff records, roles, shift state, and till values. |
| Settings | Receipt header, tax, delivery fee, hours, and printer preference persisted as key/value pairs. |
| Reporting | Aggregate completed sales, hourly revenue, refund/void count, and product rankings. |

## 🗄️ Data Model

PostgreSQL is the system of record. Schema changes are stored as ordered SQL migrations and recorded in `schema_migrations` when applied.

```mermaid
erDiagram
    CATEGORIES ||--o{ MENU_ITEMS : contains
    MENU_ITEMS ||--o{ ITEM_INGREDIENTS : defines
    INGREDIENTS ||--o{ ITEM_INGREDIENTS : composes
    STAFF ||--o{ SHIFTS : works
    STAFF o|--o{ ORDERS : serves
    STAFF o|--o{ INVENTORY_ADJUSTMENTS : records
    INGREDIENTS ||--o{ INVENTORY_ADJUSTMENTS : changes
    ORDERS ||--|{ ORDER_LINES : contains
    MENU_ITEMS o|--o{ ORDER_LINES : snapshots
    ORDER_LINES ||--o{ ORDER_LINE_ADDONS : includes
    ADDONS o|--o{ ORDER_LINE_ADDONS : snapshots
```

| Table | Purpose |
| --- | --- |
| `categories` | Ordered menu group names. |
| `menu_items` | Product identity, price, image, category, drink flag, and availability. |
| `ingredients` | Stock quantity, unit, and reorder threshold. |
| `item_ingredients` | Many-to-many recipe quantities between menu items and ingredients. |
| `addons` | Optional active modifiers with prices. |
| `staff` | Named staff records with admin, manager, or cashier roles. |
| `shifts` | Clock-in/out timestamps and optional opening/closing till values. |
| `orders` | Order metadata, status, server-calculated totals, payment details, and receipt settings snapshots. |
| `order_lines` | Product name/price snapshots, modifiers, notes, quantity, and line total. |
| `order_line_addons` | Add-on and price snapshots attached to order lines. |
| `inventory_adjustments` | Signed stock changes, reason, optional staff link, and timestamp. |
| `settings` | Application settings stored by key. |
| `schema_migrations` | Applied migration names and timestamps, created by the migration runner. |

Foreign-key indexes support common joins, `orders.created_at` is indexed for recent-first history, and a partial unique index prevents more than one open shift per staff member.

## 🔌 API Overview

All paths except login require `Authorization: Bearer <token>`.

| Area | Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- | --- |
| Auth | `POST` | `/api/auth/login` | Validate configured admin credentials and issue a JWT. | Public |
| Categories | `GET` | `/api/categories` | List categories. | Protected |
| Categories | `GET` | `/api/categories/:id` | Retrieve one category. | Protected |
| Categories | `POST` | `/api/categories` | Create a category. | Protected |
| Categories | `PUT` | `/api/categories/:id` | Replace editable category values. | Protected |
| Categories | `DELETE` | `/api/categories/:id` | Remove a category. | Protected |
| Menu | `GET` | `/api/menu-items` | List menu items. | Protected |
| Menu | `GET` | `/api/menu-items/:id` | Retrieve one menu item. | Protected |
| Menu | `POST` | `/api/menu-items` | Create a menu item. | Protected |
| Menu | `PUT` | `/api/menu-items/:id` | Replace editable menu item values. | Protected |
| Menu | `DELETE` | `/api/menu-items/:id` | Remove a menu item. | Protected |
| Recipes | `GET` | `/api/menu-items/:id/ingredients` | Retrieve an item's recipe. | Protected |
| Recipes | `PUT` | `/api/menu-items/:id/ingredients` | Replace an item's recipe. | Protected |
| Ingredients | `GET` | `/api/ingredients` | List ingredients. | Protected |
| Ingredients | `GET` | `/api/ingredients/:id` | Retrieve one ingredient. | Protected |
| Ingredients | `POST` | `/api/ingredients` | Create an ingredient. | Protected |
| Ingredients | `PUT` | `/api/ingredients/:id` | Replace editable ingredient values. | Protected |
| Ingredients | `DELETE` | `/api/ingredients/:id` | Remove an ingredient. | Protected |
| Add-ons | `GET` | `/api/addons` | List add-ons. | Protected |
| Add-ons | `GET` | `/api/addons/:id` | Retrieve one add-on. | Protected |
| Add-ons | `POST` | `/api/addons` | Create an add-on. | Protected |
| Add-ons | `PUT` | `/api/addons/:id` | Replace editable add-on values. | Protected |
| Add-ons | `DELETE` | `/api/addons/:id` | Remove an add-on. | Protected |
| Inventory | `GET` | `/api/inventory-adjustments` | List recent adjustment records. | Protected |
| Inventory | `GET` | `/api/inventory-adjustments/:id` | Retrieve one adjustment. | Protected |
| Inventory | `GET` | `/api/inventory-adjustments/ingredient/:ingredientId` | List adjustments for an ingredient. | Protected |
| Inventory | `POST` | `/api/inventory-adjustments` | Apply and audit a signed stock change. | Protected |
| Staff | `GET` | `/api/staff` | List staff. | Protected |
| Staff | `GET` | `/api/staff/:id` | Retrieve one staff member. | Protected |
| Staff | `POST` | `/api/staff` | Create a staff member. | Protected |
| Staff | `PUT` | `/api/staff/:id` | Replace editable staff values. | Protected |
| Staff | `DELETE` | `/api/staff/:id` | Remove a staff member. | Protected |
| Shifts | `GET` | `/api/shifts` | List shifts. | Protected |
| Shifts | `GET` | `/api/shifts/:id` | Retrieve one shift. | Protected |
| Shifts | `POST` | `/api/shifts` | Clock a staff member in. | Protected |
| Shifts | `PATCH` | `/api/shifts/:id/clock-out` | Clock out and record the closing till. | Protected |
| Shifts | `DELETE` | `/api/shifts/:id` | Remove a shift. | Protected |
| Orders | `GET` | `/api/orders` | List orders newest first. | Protected |
| Orders | `GET` | `/api/orders/:id` | Retrieve an order with lines and add-ons. | Protected |
| Orders | `POST` | `/api/orders` | Validate and create a draft or completed order. | Protected |
| Orders | `PATCH` | `/api/orders/:id/status` | Set completed, voided, or refunded status. | Protected |
| Reports | `GET` | `/api/orders/reports/summary` | Return aggregate, hourly, and top-seller data. | Protected |
| Settings | `GET` | `/api/settings` | List settings. | Protected |
| Settings | `GET` | `/api/settings/:key` | Retrieve one setting. | Protected |
| Settings | `PUT` | `/api/settings/:key` | Upsert one setting. | Protected |
| Settings | `DELETE` | `/api/settings/:key` | Remove one setting. | Protected |

## 🔐 Security

- **Credential handling:** login compares SHA-256 digests with `crypto.timingSafeEqual`; configured credentials remain in environment variables.
- **JWT sessions:** successful login issues a signed token with an administrator role and a 12-hour expiry. The API verifies the signature and expiry for protected requests.
- **Client session checks:** the frontend validates token shape, role, and expiry before rendering protected routes and clears stored auth data after a `401` response.
- **Query safety:** repositories use positional PostgreSQL parameters for application-provided values.
- **Input validation:** service modules validate required fields, allowed enums, numeric ranges, foreign-key existence, recipe uniqueness, payment splits, and inventory availability.
- **Transactional consistency:** migrations use an advisory transaction lock; stock-changing operations and completed order creation run inside database transactions.
- **CORS policy:** local Vite origins are allowed outside production unless `CORS_ORIGINS` supplies an explicit allowlist.
- **Secret hygiene:** `.env` files are ignored by Git. Real credentials, tokens, and database URLs should not be committed.

The repository does not implement rate limiting or security-header middleware, so those protections should be evaluated before exposing the API publicly.

## 🖼️ Image Handling

Menu photos are handled without an external storage service:

- The editor accepts files through an `image/*` browser input.
- Images are drawn to a canvas, scaled so the longest side is at most 900 pixels, flattened onto a white background, and encoded as JPEG.
- The client tries quality levels from `0.82` down to `0.54` and accepts the first result at or below 700 KiB.
- The resulting data URL is persisted in the menu item's `image_url` text column through the REST API.
- Packaged product images provide name-based fallbacks for matching seeded menu items that have no stored image.

## ⚡ Performance and Reliability

- PostgreSQL indexes cover menu/category joins, shifts, order history, order lines, add-ons, inventory adjustments, and recipe ingredient lookups.
- Report summary, hourly revenue, and top-seller queries execute concurrently on the backend.
- Recipe ingredient rows are locked during completed checkout to prevent competing deductions from overselling stock.
- The PostgreSQL pool is capped at one connection per warm application instance to fit the repository's Vercel transaction-pooler strategy.
- Frontend menu filtering and report chart shaping use memoized calculations.
- Database migrations are ordered, idempotently recorded, and protected by an advisory lock across concurrent startup attempts.

## 📁 Project Structure

```text
Cafe-POS/
├── backend/
│   ├── local-db/
│   │   └── 004_seed.sql          # Optional sample catalog and settings
│   ├── migrations/               # Ordered PostgreSQL schema migrations
│   ├── scripts/
│   │   └── migrate.js            # Standalone migration command
│   ├── src/
│   │   ├── config/               # Database pool and CORS policy
│   │   ├── controllers/          # HTTP request/response adapters
│   │   ├── middleware/           # JWT, async, 404, and error handling
│   │   ├── repositories/         # Parameterized PostgreSQL queries
│   │   ├── routes/               # REST endpoint definitions
│   │   ├── services/             # Validation and business rules
│   │   └── app.js                # Express application composition
│   ├── package.json
│   └── server.js                 # Local API entry point
├── frontend/
│   ├── base44/                   # Retained Base44 config and entities
│   ├── public/
│   │   └── manifest.json         # Installable web-app metadata
│   ├── src/
│   │   ├── api/                  # Base44 compatibility client
│   │   ├── assets/               # Packaged menu product photography
│   │   ├── components/           # Layout, receipt, modifiers, UI primitives
│   │   ├── hooks/                # Responsive interface hooks
│   │   ├── lib/                  # Auth, cart, REST, and catalog adapters
│   │   ├── pages/                # POS feature screens
│   │   ├── App.jsx               # Routes and application providers
│   │   └── main.jsx              # React entry point
│   ├── package.json
│   └── vite.config.js            # Development server and API proxy
├── AGENTS.md                     # Repository agent guidance
├── vercel.json                   # Vite/Express service routing
└── README.md
```

## 🔑 Environment Variables

Values belong in `backend/.env` for local development or the deployment platform's environment configuration. Only names and safe purposes are documented here.

| Variable | Purpose | Required |
| --- | --- | :---: |
| `DATABASE_URL` | PostgreSQL connection string. | Yes |
| `ADMIN_USERNAME` | Administrator login name accepted by the auth service. | Yes |
| `ADMIN_PASSWORD` | Administrator login password accepted by the auth service. | Yes |
| `JWT_SECRET` | Signs and verifies session tokens. | Yes |
| `PORT` | Express listen port; defaults to `5000`. | No |
| `CORS_ORIGINS` | Comma-separated browser-origin allowlist. | No |
| `SEED_DATABASE` | Set to `true` to apply the optional sample seed once. | No |
| `SEED_LOCAL_DB` | Legacy alias for `SEED_DATABASE`. | No |
| `VITE_API_URL` | Overrides the frontend's default same-origin `/api` base URL. | No |

## 🧑‍💻 Local Development

### Prerequisites

- Node.js and npm
- A reachable PostgreSQL database
- Git, if cloning the repository

### Clone

```bash
git clone https://github.com/muhammad-abbas-10/Cafe-POS.git
cd Cafe-POS
```

### Install

Run from the repository root:

```powershell
npm install --prefix backend
npm install --prefix frontend
```

### Configure

Create `backend/.env` using safe values for your environment:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password
JWT_SECRET=your-long-random-signing-secret
```

Set `SEED_DATABASE=true` only if you want the included sample categories, menu, add-ons, ingredients, staff, and settings. The migration ledger applies that seed at most once.

### Run

Start the two processes in separate terminals:

```powershell
npm run dev --prefix backend
```

```powershell
npm run dev --prefix frontend
```

Open `http://127.0.0.1:5173` and sign in using the configured administrator credentials. Backend startup verifies PostgreSQL and applies unapplied migrations before listening on port `5000` by default.

### Validate and build

```powershell
npm run lint --prefix frontend
npm run typecheck --prefix frontend
npm run build --prefix frontend
```

The repository currently contains no automated unit, integration, or end-to-end test suite. The backend's `test` script is only the default placeholder and is not a validation command.

### Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev --prefix frontend` | Start the Vite development server. |
| `npm run build --prefix frontend` | Create a production frontend build. |
| `npm run preview --prefix frontend` | Preview the built frontend. |
| `npm run lint --prefix frontend` | Run ESLint. |
| `npm run lint:fix --prefix frontend` | Apply ESLint fixes. |
| `npm run typecheck --prefix frontend` | Type-check through `jsconfig.json`. |
| `npm run dev --prefix backend` | Start Express with Nodemon. |
| `npm start --prefix backend` | Start Express with Node.js. |
| `npm run migrate --prefix backend` | Apply migrations without keeping the API server running. |

## ☁️ Deployment

The root `vercel.json` defines the deployment topology already reflected in the architecture:

| Service | Root | Framework | Behavior |
| --- | --- | --- | --- |
| Frontend | `frontend/` | Vite | Builds the SPA and rewrites client-side routes to `index.html`. |
| Backend | `backend/` | Express | Uses `src/app.js` as the service entry point. |

Top-level rewrites route `/api/*` to the backend service and all remaining paths to the frontend service. Configure `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `JWT_SECRET` in the Vercel environment before deployment. `CORS_ORIGINS` is not needed for the included same-origin rewrite arrangement.

No deployment CLI command or CI workflow is defined in this repository; deployment is driven by the checked-in Vercel service configuration.

## ✅ Project Status

| Area | Current repository state |
| --- | --- |
| Application | Functional full-stack POS implementation with protected frontend routes and persistent PostgreSQL operations. |
| Database | Versioned schema, optional one-time seed, migration ledger, and transactional business operations. |
| Deployment | Vercel Services configuration is present; no verified public URL is recorded. |
| Quality automation | Frontend lint, type-check, and build scripts are available; no automated test suite or CI workflow is present. |
| Licensing | No repository-level license file is present. |

## 🛣️ Potential Future Improvements

These are clearly separated from the implemented functionality:

- Connect card and e-wallet selections to a real payment processor.
- Add frontend, API integration, and transaction-level automated tests.
- Define refund/void inventory reversal rules; current status changes do not restock ingredients.
- Introduce role-specific login and authorization if manager/cashier access is required beyond staff records.
- Move menu image data URLs to dedicated object storage for larger catalogs.
- Add production hardening such as rate limiting and security headers.

## 🤝 Contributing

1. Fork the repository and create a focused branch.
2. Install both workspaces and configure a local PostgreSQL database.
3. Follow the existing React → REST adapter and route → controller → service → repository patterns.
4. Run frontend linting, type-checking, and the production build.
5. Open a pull request describing the behavior changed and how it was verified.

Please do not commit `.env` files, credentials, generated build output, or unrelated formatting changes.

## GitHub Topics

`cafe-pos` `point-of-sale` `react` `vite` `express` `nodejs` `postgresql` `inventory-management` `restaurant-management` `sales-dashboard` `vercel`

---

<div align="center">

**[Cafe POS](https://github.com/muhammad-abbas-10/Cafe-POS)**

Orders, stock, staff, and reporting in one full-stack café workspace.

</div>
