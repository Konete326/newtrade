# Agent Guide (AGENT_GUIDE.md)
# Trader Desktop — AI Agent Development Guide

---

## Document Control

| Field | Value |
|---|---|
| Document Title | Agent Guide |
| Product Name | Trader Desktop |
| Project Codename | newtrade |
| Version | 1.0 |
| Related Documents | PRD.md, SRD.md, TRD.md, rules.md, VERCEL_DEPLOY.md |

---

## Table of Contents

1. [Purpose of This Guide](#1-purpose-of-this-guide)
2. [Mandatory Rules (Non-Negotiable)](#2-mandatory-rules-non-negotiable)
3. [Project Overview & Context](#3-project-overview--context)
4. [Technology Stack Reference](#4-technology-stack-reference)
5. [Folder Structure & Where Things Go](#5-folder-structure--where-things-go)
6. [Milestone-Based Development Plan](#6-milestone-based-development-plan)
7. [Coding Standards & Conventions](#7-coding-standards--conventions)
8. [Reusable Global Components](#8-reusable-global-components)
9. [Backend Development Patterns](#9-backend-development-patterns)
10. [Frontend Development Patterns](#10-frontend-development-patterns)
11. [Security Checklist](#11-security-checklist)
12. [Environment Setup](#12-environment-setup)
13. [Agent Workflow Per Task](#13-agent-workflow-per-task)
14. [End-of-Task Report Requirements](#14-end-of-task-report-requirements)
15. [Troubleshooting & Common Pitfalls](#15-troubleshooting--common-pitfalls)

---

## 1. Purpose of This Guide

This document is the **operational manual for any AI agent** working on the Trader Desktop
project. It defines exactly how to approach tasks, what rules to follow, where files go,
and how to maintain quality.

**Read this document fully before starting any task.** The rules in `rules.md` are
non-negotiable and are reinforced here with implementation-level detail.

---

## 2. Mandatory Rules (Non-Negotiable)

These rules come from `rules.md` and are binding on every task. Violating any of them
is a defect.

### 2.1 Modular Architecture & File Size Limits

- **Strict Structural Organization:** Follow the existing `client/` and `server/` folder
  structures. Everything must be categorized into proper routes, models, controllers,
  services, and middleware.
- **Frontend Components:** Always split React code into proper, reusable components. Never
  write massive components containing 1200-1300 lines. Every distinct UI part is its own
  component.
- **Backend File Limit:** A single server file **MUST NOT exceed 120 lines**. Only exceed
  this if absolutely necessary and unavoidable. If approaching the limit, split the file.

### 2.2 Fully Functional & Secure Implementations

- **No Dummy Code:** Everything implemented must be **properly functional**. No dummy data,
  no placeholder functions, no fake UI elements.
- **Security & Stability:** Ensure zero security vulnerabilities or logical issues. Code
  must be safe and production-ready.

### 2.3 Clean Code Requirements

- **No Comments:** Absolutely **no comments** in generated code. Zero. None.

### 2.4 UI & Design Standards

- **Professional Icons:** Use Lucide React. Do not use generic icons that look
  AI-generated or amateurish. All UI must feel professional and premium.
- **No Native Alerts:** Never use native browser `alert()` or `confirm()`. Always implement
  custom modals or alert dialogs.
- **Tailwind CSS Only:** Use latest Tailwind CSS + custom CSS for responsiveness. **No
  Bootstrap.**
- **Single Theme:** Do NOT implement theme layout changes. One stable professional theme.
  Theme switching causes issues and is explicitly prohibited.

### 2.5 Dependencies & Installations

- **Latest Versions Only:** Every package, library, or framework installed MUST be the
  latest available stable version. This applies to all future dependencies.

### 2.6 Proactive Suggestions & Issue Reporting

- **End-of-Task Reports:** After finishing any task, the agent MUST suggest related new
  features or improvements.
- **Troubleshooting:** If the agent spots a potential issue or flaw, it MUST report it and
  suggest a fix immediately.

---

## 3. Project Overview & Context

Trader Desktop is a B2B/B2C SaaS Multi-Tenant ERP for Pakistani wholesale markets (Jodia
Bazar, Akbari Mandi, FMCG distribution). It is built on the MERN stack.

**Key architectural concepts every agent must understand:**

| Concept | Summary |
|---|---|
| Multi-Tenant | Database-per-tenant isolation. Each wholesale company gets its own MongoDB database. |
| Offline-First (Desktop) | Realm local DB + sync engine (future milestone). Web is online-only. |
| Hierarchical Units | Stock stored in base units (pieces); displayed as Bori/Peti/Piece. |
| Landed Cost | True per-piece cost including proportional expenses (freight, labor, weighing). |
| RBAC | 5 roles: SUPER_ADMIN, ADMIN, MANAGER, SALES, VIEWER. |
| Khata (Ledger) | Auto-updating financial ledger for customers and vendors. |
| DSR | Daily Sales Report per salesman with currency denomination verification. |
| Silent Printing | Electron native printing (desktop); browser print (web). |

**Read the full PRD.md and SRD.md for complete business requirements.** Read TRD.md for
the technical architecture, data models, and API design.

---

## 4. Technology Stack Reference

### 4.1 Frontend

| Layer | Technology |
|---|---|
| Framework | React (latest) |
| Build Tool | Vite (latest) |
| Styling | Tailwind CSS (latest) + custom CSS |
| Routing | React Router DOM (latest) |
| HTTP | Axios (latest) |
| Forms | React Hook Form (latest) |
| Icons | Lucide React (latest) |
| Charts | Recharts (latest) |
| Notifications | Sonner or React Hot Toast (latest) |

### 4.2 Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js (latest LTS) |
| Framework | Express.js (latest) |
| Database | MongoDB Atlas |
| ODM | Mongoose (latest) |
| Auth | jsonwebtoken (latest) |
| Validation | Joi (latest) |
| Uploads | Multer + Cloudinary SDK |
| Security | Helmet, express-mongo-sanitize, cors, express-rate-limit |
| PDF | Puppeteer (latest) |

### 4.3 Version Policy

**Always install the latest stable version.** When adding a new dependency, check for the
latest version. Never pin to an old version unless there is a documented compatibility
issue.

---

## 5. Folder Structure & Where Things Go

### 5.1 Frontend (`client/src/`)

| What You're Creating | Where It Goes |
|---|---|
| Reusable UI component (DataTable, Modal, etc.) | `src/components/<ComponentName>/` |
| Page-level component | `src/pages/<module>/<PageName>.jsx` |
| Layout wrapper | `src/layouts/` |
| API service (Axios wrapper per module) | `src/services/` |
| React Context provider | `src/context/` |
| Custom hook | `src/hooks/` |
| Utility function (unit conversion, formatters) | `src/utils/` |
| Route definitions | `src/routes/` |
| Static assets | `src/assets/` |

### 5.2 Backend (`server/src/`)

| What You're Creating | Where It Goes |
|---|---|
| Mongoose schema/model | `src/models/<Name>Model.js` |
| Express route definition | `src/routes/<name>Routes.js` |
| Controller (request/response handling) | `src/controllers/<name>Controller.js` |
| Service (business logic) | `src/services/<name>Service.js` |
| Middleware | `src/middleware/<name>Middleware.js` |
| Joi validation schema | `src/validators/<name>Validator.js` |
| Configuration | `src/config/<name>.js` |
| Utility function | `src/utils/<name>.js` |

### 5.3 Golden Rule

**If a backend file approaches 120 lines, split it.** Extract business logic into a service
file. Split a controller by sub-feature. Never let a file grow unbounded.

---

## 6. Milestone-Based Development Plan

The project is built milestone-by-milestone. Each milestone is a self-contained deliverable.
**Do not skip ahead.** Complete each milestone fully before moving to the next.

### Milestone M0 — Project Scaffolding

**Goal:** Runnable empty app with proper folder structure and env config.

**Tasks:**
- Initialize `client/` with Vite + React + Tailwind CSS.
- Initialize `server/` with Express + Mongoose + security middleware.
- Create `.env.example` files for both client and server.
- Set up folder structure per TRD.md section 12.
- Configure Vite proxy for local API calls.
- Configure Tailwind CSS with custom theme tokens (single theme, no switching).
- Create base layout component with sidebar and header.
- Set up React Router with placeholder routes.

**Deliverable:** App runs locally with `npm run dev` (client) and `npm run dev` (server).

---

### Milestone M1 — Auth System, RBAC & Multi-Tenant DB

**Goal:** Login works, tenant isolation is enforced, RBAC is operational.

**Tasks:**
- Implement `DatabaseManager.js` with LRU connection pool.
- Implement `authMiddleware.js` (JWT decode → companyId extraction).
- Implement `tenantMiddleware.js` (resolve tenant DB connection).
- Implement `rbacMiddleware.js` (role-based route protection).
- Create `UserModel.js` with role enum.
- Implement auth controller: login, refresh, logout, me.
- Implement password hashing (bcrypt).
- Implement SUPER_ADMIN auto-creation from env vars.
- Create login page UI with custom modal (no native alert).
- Create auth context provider (store encrypted token).
- Create route guard component (AuthGuard).
- Create Axios interceptor for auth token injection.
- Implement rate limiting on auth endpoints.
- Set up Helmet, express-mongo-sanitize, CORS.

**Deliverable:** User can log in, JWT is issued, tenant DB is resolved, RBAC blocks
unauthorized access.

---

### Milestone M2 — Product & Stock Management

**Goal:** Products can be created with unit hierarchy; stock is tracked in base units.

**Tasks:**
- Create `ProductModel.js` with unitHierarchy, pricing tiers, stock thresholds.
- Create `unitConverter.js` service (Bori/Peti/Piece conversion logic).
- Implement product CRUD controller + routes.
- Implement barcode lookup endpoint.
- Create product list page with reusable DataTable component.
- Create product create/edit form with unit hierarchy builder.
- Implement stock overview endpoint.
- Implement wastage/damage adjustment endpoint.
- Implement low-stock threshold notification logic.
- Create stock overview page.
- Implement pricing tier management.
- Create the reusable `UnitConverter` display component.
- Create the reusable `BarcodeInput` component.
- Mask purchase cost for SALES/VIEWER roles in API responses.

**Deliverable:** Products with Bori/Peti/Piece hierarchy can be created, stock displays in
hierarchical format, low-stock alerts work.

---

### Milestone M3 — Sales Module, Quick POS & Print

**Goal:** Sale invoices can be created in under 30 seconds; Quick POS works; printing works.

**Tasks:**
- Create `SaleModel.js`.
- Implement sale creation controller with:
  - DSR auto-linking.
  - Customer selection (Cash vs. Credit).
  - Credit limit enforcement (`creditCheckService.js`).
  - Tier-based auto-pricing.
  - Item-level + bill-level discounts.
  - Stock deduction.
  - Customer ledger debit entry.
- Implement `creditCheckService.js`.
- Implement credit limit override with manager authorization.
- Create sale list page (DataTable with filters).
- Create new sale page (keyboard-first, barcode-driven).
- Create Quick POS page (touch-friendly).
- Implement print endpoint (HTML template generation).
- Implement browser print fallback.
- Create `AmountInput` reusable component.
- Create `SearchableSelect` reusable component.
- Create `StatusBadge` reusable component.
- Implement keyboard shortcuts (F2 = New Sale).
- Create `ConfirmDialog` reusable component (for credit limit override confirmation).

**Deliverable:** Complete sale invoice in < 30s via keyboard; POS works; print produces receipt.

---

### Milestone M4 — Returns, Delivery Challan & Status Lifecycle

**Goal:** Returns process correctly; challans track logistics with status lifecycle.

**Tasks:**
- Create `ReturnModel.js`.
- Implement return creation (reference original invoice, auto-calc refund).
- Implement stock re-addition on return.
- Implement customer ledger credit (reverse) entry on return.
- Create return list and create pages.
- Create `ChallanModel.js`.
- Implement challan creation (DSR link, logistics info, required vs. supplied qty).
- Implement shortage auto-calculation.
- Implement status lifecycle (Pending → Dispatched → Delivered → Partially Delivered → Returned).
- Implement status update endpoint with timestamp + user logging.
- Create challan list page with status filter + color-coded badges.
- Create challan create page.
- Create challan detail page with status timeline.
- Add compound indexes: `companyId + status + isDeleted`.

**Deliverable:** Returns adjust stock + ledger; challans track delivery with full status history.

---

### Milestone M5 — DSR, Currency Breakdown & Salesman Sheet

**Goal:** DSR system manages salesman daily activities with cash verification.

**Tasks:**
- Create `DsrModel.js`.
- Implement DSR auto-number generation (`DSR-YYYYMMDD-NAME-###`).
- Implement route/beat assignment.
- Implement DSR-sales linking (auto or manual).
- Implement currency denomination breakdown module.
- Implement cash verification (counted vs. collected).
- Implement salesman expense tracking.
- Implement net deposit calculation.
- Implement printable salesman sheet generation.
- Create DSR list page.
- Create DSR detail/settlement page with currency breakdown form.
- Create printable salesman sheet view.
- Create `expenseForm` component for DSR expenses.

**Deliverable:** Salesman DSR with currency verification and printable end-of-day sheet.

---

### Milestone M6 — Khata (Ledger), Payments & Expense Approvals

**Goal:** Financial ledger auto-updates; payments process; expenses use Maker-Checker.

**Tasks:**
- Create `TransactionModel.js` (ledger entries).
- Create `PaymentModel.js`.
- Create `ExpenseModel.js`.
- Implement `TransactionModel` auto-update on sale/purchase/return/payment.
- Implement customer ledger endpoint (date-range filterable).
- Implement vendor ledger endpoint.
- Implement payment receive (customer) and payment make (vendor).
- Implement running balance calculation.
- Implement expense creation (status: PENDING).
- Implement expense approval/rejection (Maker-Checker).
- Implement expense ledger deduction on approval only.
- Create customer ledger page.
- Create vendor ledger page.
- Create payment receive/make forms.
- Create expense list page with approval status badges.
- Create expense approval interface for managers.

**Deliverable:** Financial ledger is accurate; payments update balances; expenses require approval.

---

### Milestone M7 — WhatsApp Sharing, Print Template Editor & PDF

**Goal:** Ledger sharing via WhatsApp; customizable invoice templates; server-side PDF.

**Tasks:**
- Implement `whatsappService.js` (WhatsApp Cloud API integration).
- Implement `pdfService.js` (Puppeteer server-side PDF generation).
- Implement one-click WhatsApp ledger sharing (PDF → API).
- Create `PrintTemplateModel.js`.
- Implement print template CRUD.
- Implement invoice template editor (drag-and-drop visual builder).
- Support template types: Thermal (58mm/80mm), A4/Letter.
- Implement logo, terms & conditions, digital signature customization.
- Create WhatsApp sharing button on customer ledger page.
- Create print template editor page.
- Create `PageHeader` reusable component (if not already).

**Deliverable:** WhatsApp sharing works; invoice templates are customizable; PDF generation works.

---

### Milestone M8 — Dashboard, Reports & Jarvis AI

**Goal:** Real-time dashboard; comprehensive reports; AI assistant for queries.

**Tasks:**
- Implement dashboard metrics endpoint (total sales, cash, credit, low-stock count).
- Implement sales report endpoint (date-range, product-wise).
- Implement stock report endpoint.
- Implement profit/loss report (landed cost based).
- Implement outstanding balance report.
- Implement `aiService.js` (Gemini API integration for Jarvis).
- Implement Jarvis query endpoint (read-only, natural language).
- Create dashboard page with metrics cards + charts.
- Create reports page with date-range filters.
- Create Jarvis assistant UI (text + optional voice).
- Create `LoadingSpinner` and `EmptyState` reusable components (if not already).
- Implement low-stock alert notifications on dashboard.

**Deliverable:** Dashboard shows real-time metrics; reports are filterable; Jarvis answers queries.

---

### Milestone M9 — Offline Sync Engine (Desktop)

**Goal:** Electron desktop app with Realm offline-first and cloud sync.

**Tasks:**
- Set up Electron main process with IPC handlers (printing).
- Integrate Realm SDK for local database.
- Implement `syncCore.js` (connectivity monitoring, sync trigger).
- Implement `syncProcessor.js` (batch push/pull, conflict resolution).
- Implement LWW conflict resolution (default).
- Implement document metadata fields (v, lastModifiedAt, deviceId, isSynced, syncedAt).
- Implement exponential backoff retry for failed syncs.
- Package Electron app for Windows.
- Implement auto-updater.
- Test offline → online sync with real data.

**Deliverable:** Desktop app works offline; data syncs to cloud when online; no data loss.

---

### Milestone M10 — Testing, Optimization & Deployment

**Goal:** Production-ready, tested, optimized, deployed.

**Tasks:**
- Write unit tests for services (unitConverter, landedCostCalculator, creditCheckService).
- Write integration tests for critical API endpoints.
- Write component tests for reusable components.
- Test multi-tenant isolation.
- Test RBAC enforcement.
- Optimize database indexes.
- Optimize frontend bundle size (code splitting).
- Set up Vercel deployment (per VERCEL_DEPLOY.md).
- Configure production environment variables.
- Verify all acceptance criteria (SRD.md section 11).
- Final code review (file size limits, no comments, no native alerts).

**Deliverable:** Production deployment on Vercel; all acceptance criteria pass.

---

## 7. Coding Standards & Conventions

### 7.1 Naming Conventions

| Element | Convention | Example |
|---|---|---|
| React Component | PascalCase | `DataTable.jsx` |
| React Component file | PascalCase | `DataTable.jsx` |
| JS utility file | camelCase | `unitConverter.js` |
| Mongoose model file | PascalCase + Model suffix | `SaleModel.js` |
| Controller file | camelCase + Controller suffix | `saleController.js` |
| Route file | camelCase + Routes suffix | `saleRoutes.js` |
| Service file | camelCase + Service suffix | `whatsappService.js` |
| Middleware file | camelCase + Middleware suffix | `authMiddleware.js` |
| Environment variable | UPPER_SNAKE_CASE | `JWT_SECRET` |
| Frontend env variable | VITE_ prefix | `VITE_API_URL` |
| API endpoint | kebab-case | `/api/v1/delivery-challans` |

### 7.2 Code Style

- **No comments.** Zero comments in any generated code.
- Use `const` and `let`; never `var`.
- Use arrow functions for React components and handlers.
- Use `async/await` for asynchronous operations; avoid raw `.then()` chains.
- Destructure function parameters.
- Keep functions short and focused (single responsibility).
- Use early returns to reduce nesting.

### 7.3 Response Format (Backend)

Every API response follows this structure:

**Success:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "meta": { "page": 1, "limit": 20, "total": 150 }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

### 7.4 Frontend Patterns

- Use functional components with hooks. No class components.
- Use React Hook Form for all forms.
- Use the reusable `ConfirmDialog` for all confirmations — never `confirm()`.
- Use the reusable `FormModal` for create/edit operations.
- Use the reusable `DataTable` for all list views.
- Wrap routes in `AuthGuard` with required role.
- Use the Axios service layer (`src/services/`) for all API calls — never call Axios
  directly from components.

---

## 8. Reusable Global Components

These components MUST be created early and reused everywhere. Do not duplicate their
functionality.

| Component | Created In | Used For |
|---|---|---|
| `DataTable` | M2 | All list views (products, sales, challans, etc.) |
| `FormModal` | M2 | All create/edit forms |
| `ConfirmDialog` | M3 | All confirmations (replaces native confirm) |
| `SearchableSelect` | M3 | Customer/product/vendor selection dropdowns |
| `BarcodeInput` | M2 | Barcode scanner input fields |
| `AmountInput` | M3 | Currency-formatted numeric inputs |
| `UnitConverter` | M2 | Display stock as Bori/Peti/Piece |
| `StatusBadge` | M4 | Color-coded status badges |
| `PageHeader` | M2 | Standardized page headers |
| `EmptyState` | M2 | Empty data placeholders |
| `LoadingSpinner` | M2 | Loading indicators |
| `ErrorBoundary` | M1 | Graceful error handling |
| `AuthGuard` | M1 | Route protection by role |
| `ToastProvider` | M1 | Global toast notifications |

---

## 9. Backend Development Patterns

### 9.1 Creating a New Resource (Example: Product)

1. **Model:** Create `src/models/ProductModel.js` with Mongoose schema.
2. **Validator:** Create `src/validators/productValidator.js` with Joi schema.
3. **Service:** Create `src/services/productService.js` with business logic (if complex).
4. **Controller:** Create `src/controllers/productController.js` with request/response handling.
5. **Route:** Create `src/routes/productRoutes.js` with endpoint definitions + RBAC middleware.
6. **Register:** Mount routes in `src/app.js`.

### 9.2 Controller Pattern

```javascript
const productService = require('../services/productService');
const { asyncHandler } = require('../utils/asyncHandler');

exports.getProducts = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const companyId = req.user.companyId;
  const result = await productService.getProducts(companyId, { page, limit, search });
  res.json({
    success: true,
    message: 'Products fetched successfully',
    data: result.products,
    meta: { page: result.page, limit: result.limit, total: result.total }
  });
});
```

### 9.3 Multi-Tenant Query Pattern

Every query MUST include `companyId`:

```javascript
const products = await Product.find({ companyId, isDeleted: false })
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 });
```

### 9.4 RBAC Masking Pattern

For SALES/VIEWER roles, mask sensitive fields:

```javascript
if (req.user.role === 'SALES' || req.user.role === 'VIEWER') {
  products = products.map(p => {
    const obj = p.toObject();
    obj.purchasePrice = null;
    obj.landedCost = null;
    return obj;
  });
}
```

---

## 10. Frontend Development Patterns

### 10.1 API Service Layer

Create one service file per module in `src/services/`:

```javascript
import api from './apiClient';

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  findByBarcode: (code) => api.get(`/products/barcode/${code}`)
};
```

### 10.2 Page Component Pattern

```javascript
import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import DataTable from '../../components/DataTable/DataTable';
import PageHeader from '../../components/PageHeader/PageHeader';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await productService.getAll();
    setProducts(response.data.data);
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="Products" />
      <DataTable columns={columns} data={products} loading={loading} />
    </div>
  );
}
```

### 10.3 Form Modal Pattern

Use the reusable `FormModal` component for all create/edit operations. Use React Hook Form
for form state. Use the `ConfirmDialog` for delete confirmations.

---

## 11. Security Checklist

Before marking any task complete, verify:

- [ ] No hardcoded secrets (all via `.env`).
- [ ] No `console.log` of sensitive data.
- [ ] `companyId` filter on every database query.
- [ ] RBAC middleware on every route.
- [ ] Sensitive fields masked for SALES/VIEWER roles.
- [ ] Input validation (Joi) on every write endpoint.
- [ ] Rate limiting on auth endpoints.
- [ ] No SQL/NoSQL injection vectors (express-mongo-sanitize active).
- [ ] Passwords hashed (bcrypt).
- [ ] No native `alert()` or `confirm()`.
- [ ] No comments in code.
- [ ] No file exceeds 120 lines (backend) or is a monolith (frontend).
- [ ] Soft delete used (not hard delete) with audit trail.

---

## 12. Environment Setup

### 12.1 Local Development

**Prerequisites:**
- Node.js (latest LTS)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Code editor (VS Code recommended)

**Setup Steps:**
1. Clone the repository.
2. `cd client && npm install`
3. `cd server && npm install`
4. Create `client/.env` from `client/.env.example`.
5. Create `server/.env` from `server/.env.example`.
6. Fill in all environment variables (MongoDB URI, JWT secrets, Cloudinary keys, etc.).
7. `cd server && npm run dev` (start backend).
8. `cd client && npm run dev` (start frontend).
9. Open the Vite dev URL in browser.

### 12.2 Environment Variables

See TRD.md section 13 for the complete list. See VERCEL_DEPLOY.md for production setup.

**Critical:** Never commit `.env` files. They are gitignored.

---

## 13. Agent Workflow Per Task

Follow this workflow for every task:

### Step 1: Understand
- Read the task description carefully.
- Identify which milestone the task belongs to.
- Read relevant sections of PRD.md, SRD.md, and TRD.md.

### Step 2: Plan
- Break the task into sub-tasks.
- Identify which files to create or modify.
- Identify which reusable components to use.
- Check the file size limit (120 lines backend).

### Step 3: Implement
- Create/modify files following the folder structure.
- Follow coding standards (no comments, no dummy code, latest versions).
- Use reusable components.
- Implement full functionality — no placeholders.

### Step 4: Verify
- Check for compilation/lint errors.
- Verify file size limits.
- Verify no comments exist.
- Verify no native alerts.
- Verify security checklist.

### Step 5: Report
- Summarize what was done.
- Suggest related features or improvements (mandatory per rules.md).
- Report any potential issues spotted.
- Update AGENT_PROGRESS.md with task status.

---

## 14. End-of-Task Report Requirements

After completing any task, the agent MUST provide:

1. **Summary:** What was implemented (files created/modified, functionality added).
2. **Verification:** Confirmation that code compiles, no lint errors, rules followed.
3. **Suggestions:** At least one related feature or improvement suggestion.
4. **Issues Spotted:** Any potential problems in the codebase with suggested fixes.
5. **Progress Update:** Update AGENT_PROGRESS.md with the current milestone and task status.

---

## 15. Troubleshooting & Common Pitfalls

### 15.1 Multi-Tenant Data Leakage

**Problem:** One tenant can see another tenant's data.
**Cause:** Missing `companyId` filter in a query.
**Fix:** Every query MUST include `companyId` from `req.user.companyId`. Add a test that
verifies cross-tenant access returns empty results.

### 15.2 File Too Large

**Problem:** A backend file exceeds 120 lines.
**Cause:** Too much logic in one controller.
**Fix:** Extract business logic into a service file. Split the controller by sub-feature.

### 15.3 Native Alert/Confirm

**Problem:** Code uses `alert()` or `confirm()`.
**Cause:** Habit or oversight.
**Fix:** Replace with the `ConfirmDialog` or `FormModal` reusable component.

### 15.4 Comments in Code

**Problem:** Comments exist in generated code.
**Cause:** Habit.
**Fix:** Remove all comments. Code must be self-documenting through clear naming.

### 15.5 Hardcoded Secrets

**Problem:** API keys or passwords in source code.
**Cause:** Convenience.
**Fix:** Move all secrets to `.env` files. Use `process.env.VARIABLE_NAME`.

### 15.6 Dummy/Placeholder Code

**Problem:** Functions return fake data or have TODO placeholders.
**Cause:** Rushing or incomplete implementation.
**Fix:** Implement full, functional logic. No dummy data, no placeholders.

### 15.7 Bootstrap Instead of Tailwind

**Problem:** Bootstrap classes appear in JSX.
**Cause:** Using Bootstrap out of habit.
**Fix:** Use Tailwind CSS utility classes only. No Bootstrap.

### 15.8 Theme Switching

**Problem:** Attempting to implement dark mode or theme switching.
**Cause:** Over-engineering.
**Fix:** Do NOT implement theme changes. One stable professional theme only.

### 15.9 Missing RBAC on Routes

**Problem:** A route is accessible by unauthorized roles.
**Cause:** Forgot to add RBAC middleware.
**Fix:** Every route MUST have RBAC middleware specifying the minimum required role.

### 15.10 Credit Limit Not Enforced

**Problem:** Credit sales exceed customer's credit limit.
**Cause:** Missing credit check in sale creation.
**Fix:** Use `creditCheckService.js` on every credit sale. Block if exceeded. Require
manager override for exceptions.

