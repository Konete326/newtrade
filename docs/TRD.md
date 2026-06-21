# Technical Requirements Document (TRD)
# Trader Desktop — Pakistani Wholesale Market ERP

---

## Document Control

| Field | Value |
|---|---|
| Document Title | Technical Requirements Document (TRD) |
| Product Name | Trader Desktop |
| Project Codename | newtrade |
| Version | 1.0 |
| Status | Draft — Ready for Implementation |
| Related Documents | PRD.md, SRD.md, AGENT_GUIDE.md, rules.md, VERCEL_DEPLOY.md |

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Multi-Tenant Database Design](#5-multi-tenant-database-design)
6. [Data Models & Schemas](#6-data-models--schemas)
7. [API Design & Endpoint Specification](#7-api-design--endpoint-specification)
8. [Authentication & Security Architecture](#8-authentication--security-architecture)
9. [Offline-First Sync Engine](#9-offline-first-sync-engine)
10. [Image & File Storage Strategy](#10-image--file-storage-strategy)
11. [Print Engine Architecture](#11-print-engine-architecture)
12. [Folder Structure](#12-folder-structure)
13. [Environment Configuration](#13-environment-configuration)
14. [Deployment Architecture](#14-deployment-architecture)
15. [Performance & Optimization Strategy](#15-performance--optimization-strategy)
16. [Error Handling & Logging](#16-error-handling--logging)
17. [Testing Strategy](#17-testing-strategy)

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  ┌──────────────────┐    ┌───────────────────────────┐  │
│  │  Web App (React) │    │  Desktop App (Electron)   │  │
│  │  + Vite + TW     │    │  + Realm (offline DB)     │  │
│  │  Deployed: Vercel│    │  + Sync Engine            │  │
│  └────────┬─────────┘    └───────────┬───────────────┘  │
│           │       HTTPS / REST        │                  │
│           │      (JWT Bearer)         │  IPC (printing)  │
└───────────┼───────────────────────────┼──────────────────┘
            │                           │
┌───────────▼───────────────────────────▼──────────────────┐
│                  API GATEWAY LAYER                        │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Node.js + Express (Vercel Serverless / Dedicated)  │ │
│  │  - authMiddleware (JWT → companyId)                 │ │
│  │  - DatabaseManager (LRU connection pool)            │ │
│  │  - Rate limiting, Helmet, sanitization             │ │
│  └────────────────────────┬────────────────────────────┘ │
└───────────────────────────┼───────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────┐
│                  DATA LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ MongoDB Atlas│  │  Cloudinary  │  │ Redis (opt.)   │  │
│  │ DB-per-tenant│  │  Image/File  │  │  Cache         │  │
│  └──────────────┘  └──────────────┘  └────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

1. **Database-Per-Tenant Isolation:** Each tenant gets a dedicated MongoDB database.
   Strongest isolation boundary; zero cross-tenant data leakage.
2. **Offline-First (Desktop):** All writes go to local Realm DB first, then sync to cloud.
3. **Stateless API:** Backend is stateless (JWT-based), deployable as serverless functions.
4. **Modular Monolith:** Single Express app with strict module separation (routes, controllers,
   services, models, middleware). No premature microservices.
5. **Env-Driven Config:** All secrets and environment-specific values in `.env` files.
6. **Graceful Degradation:** Redis, WebSocket, and offline sync degrade gracefully when
   unavailable (especially on Vercel serverless).

---

## 2. Technology Stack

### 2.1 Frontend

| Component | Technology | Rationale |
|---|---|---|
| UI Framework | React (latest stable) | Component-based, ecosystem maturity |
| Build Tool | Vite (latest stable) | Fast HMR, optimized builds |
| Styling | Tailwind CSS (latest) + custom CSS | Utility-first, responsive, NO Bootstrap |
| Routing | React Router DOM (latest) | Standard SPA routing |
| HTTP Client | Axios (latest) | Interceptors for auth token injection |
| State Management | React Context + Hooks | Lightweight, no over-engineering |
| Form Handling | React Hook Form (latest) | Performant, uncontrolled inputs |
| Data Tables | Custom reusable DataTable component | Time-saving global component |
| Charts | Recharts (latest) | React-native charting |
| Icons | Lucide React (latest) | Professional icon set |
| Notifications | Sonner or React Hot Toast (latest) | Non-blocking toast notifications |
| Modals | Custom reusable Modal/Dialog component | No native alert()/confirm() |

### 2.2 Backend

| Component | Technology | Rationale |
|---|---|---|
| Runtime | Node.js (latest LTS) | JavaScript everywhere, async I/O |
| Framework | Express.js (latest) | Minimal, flexible, well-documented |
| Database | MongoDB Atlas | Managed, scalable, document model fits ERP |
| ODM | Mongoose (latest) | Schema validation, middleware, population |
| Auth | jsonwebtoken (latest) | JWT access + refresh tokens |
| Validation | Joi (latest) | Schema-based request validation |
| File Upload | Multer (latest) + Cloudinary SDK | Stream uploads to Cloudinary |
| Security | Helmet, express-mongo-sanitize, cors, express-rate-limit | Defense in depth |
| PDF | Puppeteer (latest) | Server-side PDF generation |
| Cache | ioredis (latest) — optional | Session cache, rate limit store |
| WhatsApp | WhatsApp Cloud API (HTTP) | Ledger sharing |
| AI | Google Gemini API (HTTP) | Jarvis assistant |

### 2.3 Desktop (Future Milestone)

| Component | Technology | Rationale |
|---|---|---|
| Desktop Wrapper | Electron.js (latest) | Cross-platform desktop, native printing |
| Local Database | Realm SDK (latest) | Offline-first, fast local persistence |
| Sync Engine | Custom syncCore.js + syncProcessor.js | Bi-directional conflict-aware sync |

### 2.4 Version Policy

**Every package, library, or framework installed MUST be the latest available stable
version.** This is a strict rule from `rules.md` and applies to all future dependencies.

---

## 3. Frontend Architecture

### 3.1 Design Principles

- **Modular Components:** Every distinct UI part is its own component. No monolithic
  1200-line files. Components are split by responsibility.
- **Reusable Global Components:** Time-consuming features are abstracted into reusable
  global components shared across the application.
- **Keyboard-First Navigation:** Hardcoded shortcuts (F2, F3, Ctrl+F, Tab, Enter).
- **Single Theme:** No theme switching or layout changes. One stable professional theme.
- **Responsive:** Tailwind CSS breakpoints for desktop (1920px+), tablet (768px+), mobile (375px+).
- **No Native Alerts:** All confirmations use custom modals/dialogs.

### 3.2 Reusable Global Components

The following reusable components MUST be created as global shared components:

| Component | Purpose |
|---|---|
| `DataTable` | Sortable, paginated, searchable data grid used across all list views |
| `FormModal` | Reusable modal wrapper for create/edit forms |
| `ConfirmDialog` | Custom confirmation dialog (replaces native confirm()) |
| `SearchableSelect` | Dropdown with search for customer/product/supplier selection |
| `BarcodeInput` | Input field optimized for barcode scanner input |
| `AmountInput` | Currency-formatted numeric input |
| `UnitConverter` | Display component for Bori/Peti/Piece hierarchical display |
| `StatusBadge` | Color-coded status badge for challan/expense/DSR statuses |
| `PageHeader` | Standardized page header with title, actions, breadcrumbs |
| `EmptyState` | Placeholder for empty data states |
| `LoadingSpinner` | Consistent loading indicator |
| `ToastProvider` | Global toast notification context |
| `AuthGuard` | Route protection wrapper based on RBAC roles |
| `ErrorBoundary` | Graceful error handling wrapper |

### 3.3 State Management Strategy

- **Global State:** React Context for auth (user, role, companyId), app settings, and toast
  notifications.
- **Server State:** Axios with a centralized interceptor layer for API calls. Response data
  cached in component state; no heavy client-side cache library required initially.
- **Form State:** React Hook Form for all form-heavy screens (sales, purchases, expenses).

### 3.4 Routing Structure

```
/                    → Dashboard
/login               → Login
/products            → Product list
/products/:id        → Product detail/edit
/stock               → Stock overview
/purchases           → Purchase list
/purchases/new       → New purchase (landed cost)
/sales               → Sales list
/sales/new           → New sale (invoice)
/pos                 → Quick POS
/returns             → Returns list
/returns/new         → New return
/challans            → Delivery challan list
/challans/new        → New challan
/dsr                 → DSR list
/dsr/:id             → DSR detail / settlement
/customers           → Customer list
/customers/:id       → Customer detail / ledger
/vendors             → Vendor list
/vendors/:id         → Vendor detail / ledger
/payments            → Payment receive/make
/expenses            → Expense list (with approval status)
/reports             → Reports dashboard
/settings            → Company settings
/settings/users      → User management
/settings/print      → Print template editor
/admin               → Super admin panel (SUPER_ADMIN only)
```

---

## 4. Backend Architecture

### 4.1 Layered Architecture

The backend follows a strict layered architecture. Each layer has a single responsibility.

```
Routes (route definitions + validation)
    ↓
Controllers (request parsing, response formatting)
    ↓
Services (business logic, multi-step operations)
    ↓
Models (Mongoose schemas, data access)
    ↓
MongoDB Atlas (tenant-isolated database)
```

### 4.2 File Size Constraint

**A single server file MUST NOT exceed 120 lines.** If a file approaches this limit, it must
be split into smaller files (e.g., split a large controller into multiple controller files
by sub-feature, or extract business logic into a service file). This is a strict rule from
`rules.md`.

### 4.3 Key Middleware

| Middleware | File | Purpose |
|---|---|---|
| authMiddleware | `middleware/authMiddleware.js` | Decode JWT, extract companyId, attach user |
| rbacMiddleware | `middleware/rbacMiddleware.js` | Enforce role-based permissions per route |
| tenantMiddleware | `middleware/tenantMiddleware.js` | Resolve tenant DB via DatabaseManager |
| errorHandler | `middleware/errorHandler.js` | Centralized error response formatting |
| rateLimiter | `middleware/rateLimiter.js` | Rate limiting on auth and write endpoints |
| validator | `middleware/validator.js` | Joi schema validation for request body/params |

### 4.4 DatabaseManager (Multi-Tenant Connection Pool)

The `DatabaseManager.js` is the core of the multi-tenant architecture.

**Responsibilities:**
1. Maintain an LRU cache of Mongoose connection objects keyed by `companyId`.
2. On each request, resolve the correct database connection from the cache or create a new one.
3. Evict least-recently-used connections to prevent pool exhaustion.
4. Provide a `getModel(companyId, modelName)` method that returns the Mongoose model bound
   to the correct tenant database.

**Connection Resolution Flow:**
```
Request → authMiddleware extracts companyId
       → DatabaseManager.getConnection(companyId)
       → Cache hit? Return cached connection
       → Cache miss? Create new Mongoose connection → cache → return
       → Controller uses getModel(companyId, 'Sale') to query
```

---

## 5. Multi-Tenant Database Design

### 5.1 Isolation Strategy

**Database-Per-Tenant:** Each tenant (wholesale company) receives a dedicated MongoDB
database within the MongoDB Atlas cluster. The database name is derived from the tenant's
`companyId` (e.g., `tenant_<companyId>`).

**Dual Security Layers:**
1. Physical isolation: separate database per tenant.
2. Logical isolation: `companyId` filter applied on every query as a secondary safeguard.

### 5.2 Shared Control Database

A single shared control database (`trader_desktop_control`) stores:
- Tenant registration records (companyId, name, status, subscription plan).
- SUPER_ADMIN user account.
- Platform-level metrics and configuration.

Tenant business data (users, products, sales, etc.) lives ONLY in the tenant-specific
database.

### 5.3 Indexing Strategy

Every collection in tenant databases uses compound indexes optimized for the most common
query patterns:

| Collection | Index Fields | Purpose |
|---|---|---|
| sales | `companyId + isDeleted + createdAt` | List sales by date |
| sales | `companyId + customerId + isDeleted` | Customer purchase history |
| challans | `companyId + status + isDeleted` | Filter challans by status |
| products | `companyId + isDeleted + name` | Product search |
| products | `companyId + isDeleted + barcode` | Barcode lookup |
| transactions | `companyId + partyId + isDeleted + date` | Ledger queries |
| dsr | `companyId + salesmanId + date` | DSR lookup by salesman/day |

---

## 6. Data Models & Schemas

Below are the core Mongoose schema definitions. All schemas include common metadata
fields: `companyId`, `isDeleted`, `isSynced`, `v`, `lastModifiedAt`, `deviceId`,
`syncedAt`.

### 6.1 User Model

```
User {
  _id: ObjectId
  companyId: String (ref to control DB tenant)
  name: String (required)
  email: String (required, unique per tenant)
  password: String (hashed, required)
  role: Enum [SUPER_ADMIN, ADMIN, MANAGER, SALES, VIEWER]
  phone: String
  avatar: String (Cloudinary URL)
  isActive: Boolean (default: true)
  lastLogin: Date
  statusHistory: [{ action, userId, timestamp, note }]
  // metadata fields
}
```

### 6.2 Customer Model

```
Customer {
  _id: ObjectId
  companyId: String (required)
  name: String (required)
  type: Enum [WHOLESALER, RETAILER, CUSTOM] (default: WHOLESALER)
  phone: String
  whatsapp: String
  email: String
  address: { line1, city, province }
  creditLimit: Number (default: 0)
  openingBalance: Number (default: 0)
  currentBalance: Number (default: 0)  // outstanding
  pricingTier: ObjectId (ref: PricingTier)
  isActive: Boolean (default: true)
  // metadata fields
}
```

### 6.3 Product Model

```
Product {
  _id: ObjectId
  companyId: String (required)
  name: String (required)
  sku: String (required, unique per tenant)
  barcode: String
  category: String
  unitHierarchy: {
    baseUnit: { name: "Piece", factor: 1 }
    secondaryUnit: { name: "Peti", factor: 12 }     // 1 Peti = 12 pieces
    tertiaryUnit: { name: "Bori", factor: 120 }     // 1 Bori = 120 pieces
  }
  purchasePrice: Number       // raw invoice cost (masked for SALES/VIEWER)
  landedCost: Number          // calculated true cost (masked for SALES/VIEWER)
  salePrices: {
    wholesale: Number
    retailer: Number
    custom: Number
  }
  minStockThreshold: Number
  currentStock: Number        // in base units (pieces)
  image: String (Cloudinary URL)
  isActive: Boolean (default: true)
  // metadata fields
}
```

### 6.4 Sale Model

```
Sale {
  _id: ObjectId
  companyId: String (required)
  invoiceNumber: String (required, unique per tenant)
  dsrId: ObjectId (ref: DSR)
  customerId: ObjectId (ref: Customer)  // null for cash walk-in
  saleType: Enum [CASH, CREDIT]
  items: [{
    productId: ObjectId
    name: String
    quantity: Number         // in base units
    unitPrice: Number
    discount: Number         // item-level
    total: Number
  }]
  subtotal: Number
  totalDiscount: Number      // bill-level
  totalAmount: Number
  paymentTerms: Enum [CASH, CREDIT]
  status: Enum [COMPLETED, RETURNED, PARTIALLY_RETURNED]
  printedAt: Date
  creditLimitOverride: { overridden: Boolean, authorizedBy: ObjectId }
  // metadata fields
}
```

### 6.5 Purchase Model

```
Purchase {
  _id: ObjectId
  companyId: String (required)
  vendorId: ObjectId (ref: Vendor)
  invoiceNumber: String
  invoiceDate: Date
  items: [{
    productId: ObjectId
    quantity: Number         // in base units
    unitCost: Number
    total: Number
    landedCostPerUnit: Number  // calculated
  }]
  invoiceTotal: Number
  directExpenses: {
    freight: Number
    palledari: Number
    hamali: Number
    tulai: Number
    other: Number
  }
  totalExtraCost: Number     // sum of directExpenses
  totalLandedCost: Number
  // metadata fields
}
```

### 6.6 DeliveryChallan Model

```
DeliveryChallan {
  _id: ObjectId
  companyId: String (required)
  challanNumber: String (required, unique per tenant)
  dsrId: ObjectId (ref: DSR)
  saleId: ObjectId (ref: Sale)
  logistics: {
    vehicleNumber: String
    driverName: String
    route: String
  }
  items: [{
    productId: ObjectId
    name: String
    requiredQty: Number
    suppliedQty: Number
    shortageQty: Number      // auto-calculated
  }]
  status: Enum [PENDING, DISPATCHED, DELIVERED, PARTIALLY_DELIVERED, RETURNED]
  statusHistory: [{
    status: String
    changedBy: ObjectId
    timestamp: Date
    note: String
  }]
  // metadata fields
}
```

### 6.7 DSR Model

```
DSR {
  _id: ObjectId
  companyId: String (required)
  dsrNumber: String (required, unique)  // DSR-YYYYMMDD-NAME-###
  salesmanId: ObjectId (ref: User)
  date: Date (required)
  route: String
  status: Enum [ACTIVE, SETTLED]
  linkedSales: [ObjectId] (ref: Sale)
  linkedReturns: [ObjectId] (ref: Return)
  currencyBreakdown: {
    n5000: Number, n1000: Number, n500: Number,
    n100: Number, n50: Number, n20: Number, n10: Number
  }
  totalCashCounted: Number
  totalCashCollected: Number
  cashVariance: Number      // counted - collected
  expenses: [{
    type: Enum [FUEL, FOOD, PARKING, LABOR, OTHER]
    amount: Number
    note: String
  }]
  totalExpenses: Number
  netDeposit: Number        // collected - expenses
  settledAt: Date
  settledBy: ObjectId
  // metadata fields
}
```

### 6.8 Transaction (Ledger Entry) Model

```
Transaction {
  _id: ObjectId
  companyId: String (required)
  partyType: Enum [CUSTOMER, VENDOR]
  partyId: ObjectId (required)
  type: Enum [DEBIT, CREDIT]
  amount: Number (required)
  referenceType: Enum [SALE, PURCHASE, RETURN, PAYMENT, ADJUSTMENT]
  referenceId: ObjectId
  description: String
  date: Date (required)
  runningBalance: Number
  // metadata fields
}
```

### 6.9 Payment Model

```
Payment {
  _id: ObjectId
  companyId: String (required)
  partyType: Enum [CUSTOMER, VENDOR]
  partyId: ObjectId (required)
  amount: Number (required)
  method: Enum [CASH, BANK_TRANSFER, CHEQUE]
  chequeNumber: String      // if method = CHEQUE
  bankName: String
  dsrId: ObjectId (ref: DSR)  // if salesman collection
  reference: String
  date: Date (required)
  // metadata fields
}
```

### 6.10 Expense Model

```
Expense {
  _id: ObjectId
  companyId: String (required)
  description: String (required)
  category: Enum [RENT, UTILITIES, SALARY, TRANSPORT, FOOD, MAINTENANCE, OTHER]
  amount: Number (required)
  status: Enum [PENDING, APPROVED, REJECTED]
  createdBy: ObjectId (required)
  approvedBy: ObjectId
  approvedAt: Date
  rejectionNote: String
  date: Date (required)
  // metadata fields
}
```

---

## 7. API Design & Endpoint Specification

### 7.1 API Conventions

- **Base URL:** `/api/v1`
- **Authentication:** Bearer token in `Authorization` header.
- **Content-Type:** `application/json`
- **Response Format:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { },
  "meta": { "page": 1, "limit": 20, "total": 150 }
}
```

- **Error Response Format:**

```json
{
  "success": false,
  "message": "Error description",
  "errors": [ { "field": "email", "message": "Email is required" } ]
}
```

### 7.2 Endpoint List

#### Authentication

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Login with email/password | Public |
| POST | `/api/v1/auth/refresh` | Refresh access token | Authenticated |
| POST | `/api/v1/auth/logout` | Logout (invalidate refresh) | Authenticated |
| GET | `/api/v1/auth/me` | Get current user profile | Authenticated |
| POST | `/api/v1/auth/google` | Google login (optional) | Public |

#### Users

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/v1/users` | List users | ADMIN, MANAGER |
| POST | `/api/v1/users` | Create user | ADMIN |
| PUT | `/api/v1/users/:id` | Update user | ADMIN |
| DELETE | `/api/v1/users/:id` | Soft delete user | ADMIN |

#### Products

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/v1/products` | List products (paginated, searchable) | All (cost masked for SALES/VIEWER) |
| GET | `/api/v1/products/:id` | Get product detail | All (cost masked) |
| POST | `/api/v1/products` | Create product | ADMIN, MANAGER |
| PUT | `/api/v1/products/:id` | Update product | ADMIN, MANAGER |
| DELETE | `/api/v1/products/:id` | Soft delete product | ADMIN |
| GET | `/api/v1/products/barcode/:code` | Lookup by barcode | All |

#### Stock

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/v1/stock` | Stock overview (all products) | All |
| POST | `/api/v1/stock/adjust` | Wastage/damage adjustment | ADMIN, MANAGER |
| POST | `/api/v1/stock/transfer` | Transfer between godowns | ADMIN, MANAGER |

#### Purchases

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/v1/purchases` | List purchases | ADMIN, MANAGER |
| POST | `/api/v1/purchases` | Create purchase (with landed cost) | ADMIN, MANAGER |
| GET | `/api/v1/purchases/:id` | Get purchase detail | ADMIN, MANAGER |

#### Sales

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/v1/sales` | List sales (paginated, filterable) | All |
| POST | `/api/v1/sales` | Create sale invoice | ADMIN, MANAGER, SALES |
| GET | `/api/v1/sales/:id` | Get sale detail | All |
| DELETE | `/api/v1/sales/:id` | Soft delete sale | ADMIN |

#### Returns

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/v1/returns` | List returns | All |
| POST | `/api/v1/returns` | Create return | ADMIN, MANAGER, SALES |
| GET | `/api/v1/returns/:id` | Get return detail | All |

#### Delivery Challans

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/v1/challans` | List challans (filterable by status) | All |
| POST | `/api/v1/challans` | Create challan | ADMIN, MANAGER, SALES |
| GET | `/api/v1/challans/:id` | Get challan detail | All |
| PATCH | `/api/v1/challans/:id/status` | Update challan status | ADMIN, MANAGER |

#### DSR

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/v1/dsr` | List DSRs | All |
| POST | `/api/v1/dsr` | Create DSR | ADMIN, MANAGER |
| GET | `/api/v1/dsr/:id` | Get DSR detail | All |
| POST | `/api/v1/dsr/:id/settle` | Settle DSR (currency + expenses) | ADMIN, MANAGER |
| GET | `/api/v1/dsr/:id/sheet` | Generate printable salesman sheet | ADMIN, MANAGER |

#### Customers

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/v1/customers` | List customers | All |
| POST | `/api/v1/customers` | Create customer | ADMIN, MANAGER |
| PUT | `/api/v1/customers/:id` | Update customer | ADMIN, MANAGER |
| GET | `/api/v1/customers/:id/ledger` | Get customer ledger | All |
| POST | `/api/v1/customers/:id/share-whatsapp` | Share ledger via WhatsApp | ADMIN, MANAGER |

#### Vendors

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/v1/vendors` | List vendors | ADMIN, MANAGER |
| POST | `/api/v1/vendors` | Create vendor | ADMIN, MANAGER |
| GET | `/api/v1/vendors/:id/ledger` | Get vendor ledger | ADMIN, MANAGER |

#### Payments

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| POST | `/api/v1/payments/receive` | Receive payment from customer | ADMIN, MANAGER, SALES |
| POST | `/api/v1/payments/make` | Make payment to vendor | ADMIN, MANAGER |

#### Expenses

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/v1/expenses` | List expenses | All |
| POST | `/api/v1/expenses` | Create expense (status: PENDING) | All (except VIEWER) |
| PATCH | `/api/v1/expenses/:id/approve` | Approve expense | ADMIN, MANAGER |
| PATCH | `/api/v1/expenses/:id/reject` | Reject expense | ADMIN, MANAGER |

#### Reports

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/v1/reports/dashboard` | Dashboard metrics | All |
| GET | `/api/v1/reports/sales` | Sales report (date range) | All |
| GET | `/api/v1/reports/stock` | Stock report | All |
| GET | `/api/v1/reports/profit` | Profit/loss report (landed cost based) | ADMIN, MANAGER |
| GET | `/api/v1/reports/outstanding` | Outstanding balances | ADMIN, MANAGER |

#### Print

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| POST | `/api/v1/print/invoice/:saleId` | Generate invoice PDF | All |
| GET | `/api/v1/print/templates` | List print templates | ADMIN, MANAGER |
| PUT | `/api/v1/print/templates/:id` | Update print template | ADMIN |

#### Super Admin

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/v1/admin/tenants` | List all tenants | SUPER_ADMIN |
| GET | `/api/v1/admin/tenants/:id/health` | Tenant health metrics | SUPER_ADMIN |

---

## 8. Authentication & Security Architecture

### 8.1 JWT Token Strategy

- **Access Token:** Short-lived (15 minutes), contains `userId`, `companyId`, `role`.
- **Refresh Token:** Long-lived (7 days), stored in httpOnly cookie or encrypted client storage.
- **Token Rotation:** On refresh, a new refresh token is issued (rotation) to detect theft.

### 8.2 Multi-Tenant Auth Flow

```
1. POST /api/v1/auth/login { email, password }
2. authMiddleware validates credentials against control DB or tenant DB
3. Server generates JWT with { userId, companyId, role }
4. Client stores access token (encrypted localStorage via VITE_STORAGE_ENCRYPTION_KEY)
5. Every request: Authorization: Bearer <access_token>
6. authMiddleware decodes JWT → extracts companyId
7. tenantMiddleware → DatabaseManager.getConnection(companyId)
8. Controller operates on tenant-specific database
```

### 8.3 Security Layers

| Layer | Tool/Method |
|---|---|
| HTTP Headers | Helmet |
| NoSQL Injection | express-mongo-sanitize |
| CORS | cors (whitelist FRONTEND_URL) |
| Rate Limiting | express-rate-limit (auth: 5/min, writes: 100/min) |
| CSRF | CSRF tokens for state-changing operations |
| Field Encryption | AES-256 for sensitive fields (FIELD_ENCRYPTION_KEY) |
| Password Hashing | bcrypt (12+ rounds) |
| Client Storage | Encrypted via VITE_STORAGE_ENCRYPTION_KEY |
| Soft Delete | isDeleted flag + 90-day audit trail |
| Audit Logging | statusHistory on every edit/delete |

### 8.4 RBAC Enforcement

- `rbacMiddleware` checks the user's role against the required role for each route.
- SALES role: purchase cost and landed cost fields are masked (set to null/0 in responses).
- VIEWER role: all write operations blocked.
- Credit limit override requires ADMIN or MANAGER authorization.

---

## 9. Offline-First Sync Engine

### 9.1 Desktop-Only Feature

The offline sync engine is a desktop-only feature (Electron + Realm). The web deployment
on Vercel operates in online-only mode (graceful degradation per VERCEL_DEPLOY.md).

### 9.2 Sync Architecture

```
┌─────────────────────────────────────────┐
│           DESKTOP APP (Electron)         │
│                                          │
│  ┌─────────┐    ┌────────────────────┐  │
│  │  React   │───→│  Realm Local DB    │  │
│  │  UI      │←───│  (isSynced: false) │  │
│  └─────────┘    └────────┬───────────┘  │
│                          │               │
│                 ┌────────▼───────────┐   │
│                 │  Sync Engine       │   │
│                 │  (syncCore.js)     │   │
│                 │  Monitors online   │   │
│                 └────────┬───────────┘   │
│                          │               │
└──────────────────────────┼───────────────┘
                           │ HTTPS
┌──────────────────────────▼───────────────┐
│           CLOUD (MongoDB Atlas)           │
│  ┌────────────────────────────────────┐  │
│  │  syncProcessor.js                  │  │
│  │  - Receives batched records        │  │
│  │  - Conflict resolution (LWW)       │  │
│  │  - Returns server-side changes     │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### 9.3 Sync Process

1. **Monitor:** `syncCore.js` polls connectivity every 30 seconds.
2. **Detect Online:** When connectivity is detected, trigger sync.
3. **Push:** Query Realm for `isSynced: false` records, batch them, POST to sync endpoint.
4. **Server Process:** `syncProcessor.js` processes each record:
   - Check for conflicts using `v` and `lastModifiedAt`.
   - Apply conflict resolution strategy (default: LWW).
   - Save to MongoDB Atlas.
   - Mark `isSynced: true` in response.
5. **Pull:** Server returns any records modified by other devices since last sync.
6. **Update Local:** Realm updates local records with `isSynced: true` and applies pulled changes.

### 9.4 Conflict Resolution

| Strategy | Behavior | Use Case |
|---|---|---|
| Last Write Wins (default) | Most recent `lastModifiedAt` wins | Most field updates |
| Field Merge | Non-overlapping field changes merged | Concurrent edits to different fields |
| Manual | Conflict flagged for manager review | Critical financial discrepancies |

### 9.5 Document Metadata Fields

Every syncable document includes:

| Field | Type | Purpose |
|---|---|---|
| `v` | Number | Version number for optimistic concurrency |
| `lastModifiedAt` | Date | ISO timestamp of last modification |
| `deviceId` | String | Originating device identifier |
| `isSynced` | Boolean | Sync status flag |
| `syncedAt` | Date | Timestamp of last successful sync |

---

## 10. Image & File Storage Strategy

### 10.1 Cloudinary Integration

All images and file uploads are stored on Cloudinary. MongoDB Atlas stores only the
Cloudinary secure URL and metadata. This keeps the database lightweight and leverages
Cloudinary's CDN for fast image delivery.

### 10.2 Upload Flow

```
1. Client selects file → Multer receives multipart upload
2. Backend uploads stream to Cloudinary (folder: trader-desktop)
3. Cloudinary returns { secure_url, public_id, format, width, height }
4. Backend stores secure_url + public_id in MongoDB document
5. Client receives and displays the Cloudinary URL
```

### 10.3 Managed File Types

| File Type | Storage | MongoDB Field |
|---|---|---|
| Product image | Cloudinary | `product.image` (URL) |
| Company logo | Cloudinary | `company.logo` (URL) |
| User avatar | Cloudinary | `user.avatar` (URL) |
| Document attachments | Cloudinary | `attachment.url` (URL) |
| Generated PDFs | Cloudinary (temp) | Returned as download URL |

### 10.4 Vercel Constraint

Vercel's filesystem is read-only. All file uploads MUST go to Cloudinary, never to local
disk. This is enforced in the Multer configuration (memory storage → Cloudinary stream).

---

## 11. Print Engine Architecture

### 11.1 Desktop (Electron) — Silent Printing

```
1. User clicks "Save & Print"
2. React UI sends IPC message to Electron main process
3. main.js IPC handler (get-printers, print-document)
4. Electron sends print job directly to configured printer
5. No dialog popup — silent mode
6. Receipt printed in < 2 seconds
```

### 11.2 Web — Browser Printing

```
1. User clicks "Save & Print"
2. Backend generates HTML invoice template
3. Frontend opens print-optimized window
4. Browser print dialog appears (web limitation)
5. User confirms print
```

### 11.3 Server-Side PDF (Puppeteer)

For email/WhatsApp delivery, the backend generates a styled PDF using Puppeteer:

```
1. Backend receives PDF generation request
2. Puppeteer launches headless Chromium
3. Renders HTML template with data
4. Generates PDF with background colors and styling
5. Uploads PDF to Cloudinary (temp)
6. Returns download URL or sends via WhatsApp/email
```

### 11.4 Invoice Template Editor

- Visual drag-and-drop editor for invoice layout.
- Template types: Thermal (58mm/80mm), A4/Letter.
- Customizable: company logo, terms & conditions, digital signature.
- Templates stored as JSON configuration in MongoDB.

---

## 12. Folder Structure

### 12.1 Overall Project Structure

```
newtrade/
├── client/                    # Frontend (React + Vite)
├── server/                    # Backend (Node.js + Express)
├── docs/                      # All documentation
│   ├── PRD.md
│   ├── SRD.md
│   ├── TRD.md
│   ├── AGENT_GUIDE.md
│   ├── AGENT_PROGRESS.md
│   ├── VERCEL_DEPLOY.md
│   └── rules.md
└── electron/                  # Desktop wrapper (future milestone)
```

### 12.2 Client (Frontend) Structure

```
client/
├── public/
├── src/
│   ├── assets/               # Static assets (images, fonts)
│   ├── components/           # Reusable global components
│   │   ├── DataTable/
│   │   ├── FormModal/
│   │   ├── ConfirmDialog/
│   │   ├── SearchableSelect/
│   │   ├── BarcodeInput/
│   │   ├── AmountInput/
│   │   ├── UnitConverter/
│   │   ├── StatusBadge/
│   │   ├── PageHeader/
│   │   ├── EmptyState/
│   │   ├── LoadingSpinner/
│   │   └── ErrorBoundary/
│   ├── layouts/              # Layout wrappers (main layout, auth layout)
│   ├── pages/                # Page-level components by module
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── stock/
│   │   ├── purchases/
│   │   ├── sales/
│   │   ├── pos/
│   │   ├── returns/
│   │   ├── challans/
│   │   ├── dsr/
│   │   ├── customers/
│   │   ├── vendors/
│   │   ├── payments/
│   │   ├── expenses/
│   │   ├── reports/
│   │   └── settings/
│   ├── context/              # React Context providers (auth, toast, app)
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API service layer (Axios wrappers per module)
│   ├── utils/                # Utility functions (unit conversion, formatters)
│   ├── routes/               # Route definitions + route guards
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css             # Tailwind CSS imports + custom CSS
├── .env                      # Frontend environment variables
├── vite.config.js
├── tailwind.config.js
├── package.json
└── index.html
```

### 12.3 Server (Backend) Structure

```
server/
├── src/
│   ├── config/               # Configuration (db, cloudinary, redis)
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── redis.js
│   ├── controllers/          # Request handlers (one file per resource/sub-feature)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── stockController.js
│   │   ├── purchaseController.js
│   │   ├── saleController.js
│   │   ├── returnController.js
│   │   ├── challanController.js
│   │   ├── dsrController.js
│   │   ├── customerController.js
│   │   ├── vendorController.js
│   │   ├── paymentController.js
│   │   ├── expenseController.js
│   │   ├── reportController.js
│   │   ├── printController.js
│   │   └── adminController.js
│   ├── services/             # Business logic (extracted from controllers)
│   │   ├── DatabaseManager.js    # Multi-tenant connection pool (LRU)
│   │   ├── syncCore.js           # Sync engine core
│   │   ├── syncProcessor.js      # Sync conflict processing
│   │   ├── whatsappService.js    # WhatsApp API
│   │   ├── pdfService.js         # Puppeteer PDF generation
│   │   ├── unitConverter.js      # Bori/Peti/Piece conversion
│   │   ├── landedCostCalculator.js
│   │   ├── creditCheckService.js
│   │   └── aiService.js          # Gemini AI (Jarvis)
│   ├── models/               # Mongoose schemas
│   │   ├── UserModel.js
│   │   ├── CustomerModel.js
│   │   ├── VendorModel.js
│   │   ├── ProductModel.js
│   │   ├── SaleModel.js
│   │   ├── PurchaseModel.js
│   │   ├── ReturnModel.js
│   │   ├── ChallanModel.js
│   │   ├── DsrModel.js
│   │   ├── TransactionModel.js
│   │   ├── PaymentModel.js
│   │   ├── ExpenseModel.js
│   │   └── PrintTemplateModel.js
│   ├── routes/               # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── stockRoutes.js
│   │   ├── purchaseRoutes.js
│   │   ├── saleRoutes.js
│   │   ├── returnRoutes.js
│   │   ├── challanRoutes.js
│   │   ├── dsrRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── vendorRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── printRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/           # Express middleware
│   │   ├── authMiddleware.js
│   │   ├── rbacMiddleware.js
│   │   ├── tenantMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validator.js
│   ├── validators/           # Joi validation schemas
│   ├── utils/                # Utility functions
│   └── app.js                # Express app setup
├── .env                      # Backend environment variables
├── package.json
└── server.js                 # Entry point
```

### 12.4 File Size Rules

- **Backend:** No file exceeds 120 lines. Split controllers by sub-feature; extract logic
  into services.
- **Frontend:** No component exceeds ~300 lines. Split into sub-components.
- **No comments** in any generated code file.

---

## 13. Environment Configuration

### 13.1 Backend `.env`

```env
# Database
MONGO_URI=<MongoDB Atlas connection string>

# Auth
JWT_SECRET=<32+ char random string>
JWT_REFRESH_SECRET=<32+ char random string>
FIELD_ENCRYPTION_KEY=<exactly 32 chars>

# Super Admin (auto-created on first run)
SUPER_ADMIN_EMAIL=<admin email>
SUPER_ADMIN_PASSWORD=<strong password>

# Environment
NODE_ENV=production
FRONTEND_URL=<frontend URL>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<from Cloudinary dashboard>
CLOUDINARY_API_KEY=<from Cloudinary dashboard>
CLOUDINARY_API_SECRET=<from Cloudinary dashboard>
CLOUDINARY_FOLDER=trader-desktop

# Optional
REDIS_URL=<Redis connection string>
GEMINI_API_KEY=<Google Gemini API key>
WHATSAPP_TOKEN=<WhatsApp Business API token>
WHATSAPP_PHONE_NUMBER_ID=<WhatsApp phone number ID>
```

### 13.2 Frontend `.env`

```env
VITE_STORAGE_ENCRYPTION_KEY=<32+ char random string>
VITE_API_URL=<backend API base URL>

# Optional
VITE_FIREBASE_API_KEY=<Firebase API key>
VITE_FIREBASE_AUTH_DOMAIN=<Firebase auth domain>
VITE_FIREBASE_PROJECT_ID=<Firebase project ID>
```

### 13.3 Rules

- **No secrets in code.** All credentials via `.env` files.
- `.env` files are gitignored and never committed.
- Frontend uses `VITE_` prefix (Vite requirement).
- See `VERCEL_DEPLOY.md` for production deployment environment variable setup.

---

## 14. Deployment Architecture

### 14.1 Web Deployment (Vercel)

```
GitHub Repo
    ├── client/ → Vercel Project 1 (Frontend)
    │   - Framework: Vite
    │   - Build: npm run build
    │   - Output: dist
    │
    └── server/ → Vercel Project 2 (Backend)
        - Framework: Other
        - Build: echo 'No build step'
        - Functions: serverless (API routes)
```

### 14.2 Vercel Limitations

| Feature | Status | Reason |
|---|---|---|
| Cloudinary uploads | Works | External service |
| WebSockets (Socket.IO) | Not supported | Serverless = no persistent connections |
| Real-time notifications | Not supported | Needs WebSocket server |
| Redis cache | Optional | Works if REDIS_URL set; degrades gracefully |
| Offline sync (Realm) | Desktop-only | Web has no local Realm |
| Scheduled jobs (cron) | Not supported | Serverless = stateless |
| Local file uploads | Not supported | Read-only filesystem |

### 14.3 Desktop Deployment (Future)

- Electron build packaged for Windows (.exe / .nsis installer).
- Realm database stored in user data directory.
- Auto-updater for patches and new versions.
- Sync engine runs as background service within Electron.

---

## 15. Performance & Optimization Strategy

### 15.1 Database Optimization

- Compound indexes on all frequently queried field combinations.
- `companyId + isDeleted` prefix on all indexes for tenant scoping.
- Pagination on all list endpoints (default 20, max 100 per page).
- Projection to exclude masked fields (purchase cost) for SALES/VIEWER roles.

### 15.2 Frontend Optimization

- Code splitting via React.lazy() for route-level components.
- Vite's built-in tree shaking and minification.
- Debounced search inputs to reduce API calls.
- Memoization (useMemo, useCallback) for expensive computations.
- Virtualized lists for large data tables.

### 15.3 Backend Optimization

- LRU connection pool prevents connection exhaustion.
- Rate limiting prevents abuse.
- Redis caching for frequently accessed, rarely changing data (optional).
- Batch processing for sync operations.

---

## 16. Error Handling & Logging

### 16.1 Centralized Error Handling

- `errorHandler.js` middleware catches all errors and formats consistent JSON responses.
- Errors are categorized: validation (400), auth (401), forbidden (403), not found (404),
  conflict (409), server (500).
- No stack traces exposed in production responses.

### 16.2 Audit Logging

- `statusHistory` array on every document tracks edits and status changes.
- Each entry: `{ action, userId, timestamp, note }`.
- Soft-deleted records retained for 90 days.
- Authentication events (login, logout, failed attempts) logged.

---

## 17. Testing Strategy

### 17.1 Testing Approach

| Level | Tool | Scope |
|---|---|---|
| Unit | Jest | Services, utilities, unit conversion |
| Integration | Jest + Supertest | API endpoints, multi-tenant isolation |
| Component | React Testing Library | Reusable components, form validation |
| E2E | (Future) Playwright | Critical flows (sale, return, sync) |

### 17.2 Critical Test Scenarios

1. **Multi-tenant isolation:** Verify Tenant A cannot access Tenant B's data.
2. **Credit limit enforcement:** Verify over-limit sales are blocked.
3. **Unit conversion:** Verify Bori/Peti/Piece calculations are accurate.
4. **Landed cost calculation:** Verify proportional expense distribution.
5. **RBAC masking:** Verify SALES role cannot see purchase cost.
6. **Soft delete:** Verify deleted records persist in audit trail.
7. **Sync conflict:** Verify LWW resolution produces correct result.
8. **Return ledger reversal:** Verify customer balance is correctly adjusted.
9. **Currency breakdown:** Verify counted cash matches collected cash.
10. **Expense approval:** Verify expenses only deduct on approval.
