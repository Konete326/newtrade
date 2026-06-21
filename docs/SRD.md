# Software Requirements Document (SRD)
# Trader Desktop — Pakistani Wholesale Market ERP

---

## Document Control

| Field | Value |
|---|---|
| Document Title | Software Requirements Document (SRD) |
| Product Name | Trader Desktop |
| Project Codename | newtrade |
| Version | 1.0 |
| Status | Draft — Ready for Implementation |
| Related Documents | PRD.md, TRD.md, AGENT_GUIDE.md, rules.md, VERCEL_DEPLOY.md |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Stakeholders & User Roles](#3-stakeholders--user-roles)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [User Stories](#6-user-stories)
7. [Use Cases](#7-use-cases)
8. [Data Requirements](#8-data-requirements)
9. [External Interface Requirements](#9-external-interface-requirements)
10. [Constraints & Assumptions](#10-constraints--assumptions)
11. [Acceptance Criteria](#11-acceptance-criteria)
12. [Glossary](#12-glossary)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Document (SRD) defines the complete functional and
non-functional requirements for Trader Desktop, a B2B/B2C SaaS Multi-Tenant ERP
system designed for Pakistani wholesale markets including Jodia Bazar (Karachi),
Akbari Mandi (Lahore), and FMCG distribution networks.

This document serves as the authoritative requirements reference for developers,
AI agents, QA engineers, and project stakeholders. It translates the business
vision in the PRD into verifiable, testable software requirements.

### 1.2 Scope

Trader Desktop encompasses the following major modules:

- **Authentication & Multi-Tenant Management** — JWT-based auth, RBAC, database-per-tenant isolation.
- **Stock & Inventory Management** — Hierarchical unit engine (Bori/Peti/Piece), landed cost calculation, barcode/QR generation, wastage tracking.
- **Sales Module** — Invoice creation, credit checks, tier-based pricing, Quick POS, returns management.
- **Delivery Challan System** — Logistics tracking, required vs. supplied quantity, status lifecycle.
- **DSR (Daily Sales Report)** — Salesman field force management, currency denomination breakdown, expense tracking, printable sheets.
- **Khata (Ledger) & Financial Management** — Customer/vendor ledgers, payment processing, expense approvals (Maker-Checker), WhatsApp sharing.
- **Print Engine** — Silent printing, invoice template editor, server-side PDF generation.
- **Reports & Dashboard** — Real-time analytics, low-stock alerts, business intelligence.
- **AI Assistant (Jarvis)** — Gemini-powered voice/text query assistant for reporting.
- **Offline Sync Engine** — Realm local database with bi-directional cloud sync (desktop only).

### 1.3 Definitions, Acronyms & Abbreviations

| Term | Definition |
|---|---|
| MERN | MongoDB, Express, React, Node.js |
| SaaS | Software as a Service |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token |
| DSR | Daily Sales Report |
| POS | Point of Sale |
| Bori | Sack — tertiary packaging unit (e.g., 1 Bori = 10 Peti) |
| Peti | Carton — secondary packaging unit (e.g., 1 Peti = 12 Pieces) |
| Palledari / Hamali | Labor charges for loading/unloading goods |
| Tulai | Weighing charges |
| Khata | Ledger — financial account record |
| Udhaar | Credit — deferred payment |
| Wapsi | Return — goods returned by customer |
| LWW | Last Write Wins — conflict resolution strategy |
| LRU | Least Recently Used — cache eviction policy |

---

## 2. Overall Description

### 2.1 Product Perspective

Trader Desktop is a standalone multi-tenant SaaS product. It is not a module
within an existing system. It operates as an independent platform that serves
multiple wholesale companies (tenants), each with complete data isolation.

The product has two deployment surfaces:

1. **Web Application (Primary Build Target):** React + Vite frontend deployed on
   Vercel, Node.js + Express backend deployed as Vercel serverless functions,
   MongoDB Atlas as the cloud database, Cloudinary for image storage.

2. **Desktop Application (Future Milestone):** Electron-wrapped version of the
   web app with Realm SDK for offline-first local database and a background sync
   engine for automatic cloud synchronization.

### 2.2 Product Functions

At a high level, Trader Desktop must:

- Authenticate users and resolve their tenant context with complete data isolation.
- Manage products with hierarchical unit conversion (Bori → Peti → Piece).
- Track inventory in base units with real-time stock level updates.
- Calculate landed costs with proportional expense allocation.
- Create sales invoices in under 30 seconds with keyboard-first navigation.
- Enforce dynamic credit limits on customer accounts.
- Process returns with automatic ledger reversal and stock re-addition.
- Manage delivery challans with required vs. supplied quantity tracking.
- Track salesman field activities via DSR with currency denomination verification.
- Maintain customer and vendor financial ledgers (khata).
- Process payments (cash, bank, cheque) with ledger updates.
- Manage business expenses with Maker-Checker approval workflow.
- Generate and print invoices (silent mode on desktop, browser print on web).
- Share ledger statements via WhatsApp API.
- Provide a real-time dashboard with low-stock alerts and business analytics.
- Offer a limited AI assistant (Jarvis) for natural language reporting queries.
- Synchronize offline data with the cloud when connectivity is restored (desktop).

### 2.3 User Characteristics

| User Type | Description | Technical Proficiency |
|---|---|---|
| Wholesale Trader / Owner | Business owner who manages the entire operation. Needs high-level dashboards, financial oversight, and approval authority. | Low to medium. Prefers simple, fast interfaces. |
| Manager / Munshi | Day-to-day operations manager. Handles approvals, oversees sales, manages ledgers. | Medium. Keyboard-fluent. |
| Data Entry Operator | Enters sales, purchases, and payments rapidly. Relies on keyboard shortcuts and barcode scanning. | Medium to high. Speed-critical. |
| Salesman (Field Force) | Creates sales in the field, collects cash, incurs expenses. Uses DSR for daily reporting. | Low to medium. Mobile/tablet usage. |
| Super Admin (SaaS Operator) | Manages all tenants, monitors system health, handles subscriptions. Does NOT access tenant data. | High. |

---

## 3. Stakeholders & User Roles

### 3.1 Role-Based Access Control (RBAC) Matrix

The system implements 5 hierarchical roles. Each role has strictly enforced
permission boundaries.

| Capability | SUPER_ADMIN | ADMIN | MANAGER | SALES | VIEWER |
|---|---|---|---|---|---|
| Manage all tenants | Yes | No | No | No | No |
| View system health metrics | Yes | No | No | No | No |
| Manage tenant subscription | Yes | No | No | No | No |
| Manage company settings | Yes | Yes | No | No | No |
| Manage users & roles | Yes | Yes | Yes | No | No |
| Create / edit products | Yes | Yes | Yes | No | No |
| Create purchases | Yes | Yes | Yes | No | No |
| Create sales / POS | Yes | Yes | Yes | Yes | No |
| Approve expenses | Yes | Yes | Yes | No | No |
| View purchase cost | Yes | Yes | Yes | No (masked) | No (masked) |
| View reports & dashboards | Yes | Yes | Yes | Limited | Yes |
| Delete records (soft) | Yes | Yes | No | No | No |
| Override credit limit | Yes | Yes | Yes | No | No |
| Manage print templates | Yes | Yes | No | No | No |

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization

| ID | Requirement | Priority |
|---|---|---|
| FR-AUTH-01 | The system shall authenticate users via email/password with JWT access tokens and refresh tokens. | Must |
| FR-AUTH-02 | The system shall extract `companyId` from the JWT and resolve the correct tenant database on every request. | Must |
| FR-AUTH-03 | The system shall enforce role-based access control on every API endpoint. | Must |
| FR-AUTH-04 | The system shall mask sensitive data (purchase cost) for SALES and VIEWER roles. | Must |
| FR-AUTH-05 | The system shall auto-create a SUPER_ADMIN account on first deployment using environment variables. | Must |
| FR-AUTH-06 | The system shall support optional Google login via Firebase. | Should |
| FR-AUTH-07 | The system shall log all authentication events (login, logout, failed attempts) in an audit trail. | Must |
| FR-AUTH-08 | The system shall implement rate limiting on authentication endpoints. | Must |

### 4.2 Multi-Tenant Management

| ID | Requirement | Priority |
|---|---|---|
| FR-TENANT-01 | The system shall isolate each tenant's data in a dedicated MongoDB database. | Must |
| FR-TENANT-02 | The system shall use an LRU-based connection pool cache to manage tenant database connections. | Must |
| FR-TENANT-03 | The system shall apply a `companyId` filter on every query as a secondary security layer. | Must |
| FR-TENANT-04 | The SUPER_ADMIN shall be able to view tenant health metrics (sync status, storage usage, API limits) without accessing tenant data. | Must |
| FR-TENANT-05 | The system shall prevent any cross-tenant data access or leakage. | Must |

### 4.3 Product & Stock Management

| ID | Requirement | Priority |
|---|---|---|
| FR-PROD-01 | The system shall allow creation of products with hierarchical unit definitions (Base, Secondary, Tertiary). | Must |
| FR-PROD-02 | The system shall store stock in base units (pieces) as the canonical value. | Must |
| FR-PROD-03 | The system shall display stock in the most readable hierarchical format (e.g., "1 Bori, 2 Peti, 6 Pieces"). | Must |
| FR-PROD-04 | The system shall dynamically convert entered quantities (e.g., "2 Bori" → 240 pieces) for stock updates. | Must |
| FR-PROD-05 | The system shall support product categorization with custom categories. | Must |
| FR-PROD-06 | The system shall generate barcodes and QR codes for products and packaging labels. | Should |
| FR-PROD-07 | The system shall support multiple pricing tiers per product (wholesale, retailer, custom). | Must |
| FR-PROD-08 | The system shall maintain a minimum stock threshold per product and trigger low-stock alerts. | Must |
| FR-PROD-09 | The system shall support wastage/damage adjustments that remove stock and book the loss in the financial ledger. | Must |
| FR-PROD-10 | The system shall support stock transfers between multiple godowns/locations. | Should |

### 4.4 Purchase & Landed Cost

| ID | Requirement | Priority |
|---|---|---|
| FR-PUR-01 | The system shall allow creation of purchase entries with supplier invoice details. | Must |
| FR-PUR-02 | The system shall provide a Landed Cost Allocator for direct expenses (Freight, Palledari, Hamali, Tulai). | Must |
| FR-PUR-03 | The system shall proportionally distribute extra costs across all items in a purchase batch. | Must |
| FR-PUR-04 | The system shall calculate landed cost per piece: (Invoice Cost + Total Extra Cost) / Total Pieces. | Must |
| FR-PUR-05 | The system shall use landed cost (not raw invoice cost) for profit margin calculations. | Must |
| FR-PUR-06 | The system shall update vendor ledger on purchase entry. | Must |

### 4.5 Sales Module

| ID | Requirement | Priority |
|---|---|---|
| FR-SALE-01 | The system shall allow sale creation with auto-linked DSR number. | Must |
| FR-SALE-02 | The system shall support both Cash (walk-in, no customer required) and Credit (registered customer required) sales. | Must |
| FR-SALE-03 | The system shall enforce dynamic credit limits: (Outstanding Balance + New Bill Amount) must not exceed the customer's credit limit. | Must |
| FR-SALE-04 | The system shall require Manager/Owner authorization to override a credit limit block. | Must |
| FR-SALE-05 | The system shall support item entry via barcode scan and keyboard search. | Must |
| FR-SALE-06 | The system shall apply tier-based automatic pricing based on customer type. | Must |
| FR-SALE-07 | The system shall support both item-level discounts and bill-level total discounts simultaneously. | Must |
| FR-SALE-08 | The system shall auto-deduct stock on invoice creation. | Must |
| FR-SALE-09 | The system shall update the customer ledger with a debit entry on credit sales. | Must |
| FR-SALE-10 | The system shall enable a complete sale flow using only Tab and Enter keys. | Must |
| FR-SALE-11 | The system shall support Save & Print with silent printing (desktop) or browser print (web). | Must |

### 4.6 Quick POS

| ID | Requirement | Priority |
|---|---|---|
| FR-POS-01 | The system shall provide a touch-friendly, barcode-driven Quick POS screen for counter sales. | Must |
| FR-POS-02 | The system shall require minimal fields for POS transactions to maximize speed. | Must |
| FR-POS-03 | The system shall default to cash payment in POS mode. | Must |
| FR-POS-04 | The system shall print thermal receipts (58mm/80mm) from POS. | Must |

### 4.7 Returns Management

| ID | Requirement | Priority |
|---|---|---|
| FR-RET-01 | The system shall allow return initiation by referencing the original invoice number. | Must |
| FR-RET-02 | The system shall display original invoice line items for return selection. | Must |
| FR-RET-03 | The system shall auto-calculate the refund amount based on returned quantities. | Must |
| FR-RET-04 | The system shall re-add returned stock to inventory automatically. | Must |
| FR-RET-05 | The system shall post a reverse (credit) entry to the customer ledger. | Must |
| FR-RET-06 | The system shall maintain a full audit trail for all returns. | Must |

### 4.8 Delivery Challan

| ID | Requirement | Priority |
|---|---|---|
| FR-CHAL-01 | The system shall allow challan creation linked to a DSR number. | Must |
| FR-CHAL-02 | The system shall capture logistics information (vehicle number, driver name, route). | Must |
| FR-CHAL-03 | The system shall track Required Qty vs. Supplied Qty with automatic shortage calculation. | Must |
| FR-CHAL-04 | The system shall manage a status lifecycle: Pending, Dispatched, Delivered, Partially Delivered, Returned. | Must |
| FR-CHAL-05 | The system shall timestamp each status change with the acting user's name. | Must |
| FR-CHAL-06 | The system shall display status as color-coded badges on the dashboard. | Must |
| FR-CHAL-07 | The system shall index challans by companyId + status + isDeleted for millisecond filtering. | Must |

### 4.9 DSR (Daily Sales Report)

| ID | Requirement | Priority |
|---|---|---|
| FR-DSR-01 | The system shall auto-generate a DSR number per salesman per day (format: DSR-YYYYMMDD-NAME-###). | Must |
| FR-DSR-02 | The system shall allow route/beat plan assignment to a DSR. | Must |
| FR-DSR-03 | The system shall link all sales, returns, and cash collections to the active DSR. | Must |
| FR-DSR-04 | The system shall provide a currency denomination breakdown module for cash verification. | Must |
| FR-DSR-05 | The system shall verify that total counted notes match total cash received. | Must |
| FR-DSR-06 | The system shall allow salesman expense entry (fuel, food, parking, labor). | Must |
| FR-DSR-07 | The system shall calculate Net Deposit: Total Collection - Total Expenses. | Must |
| FR-DSR-08 | The system shall generate a printable end-of-day salesman sheet. | Must |

### 4.10 Khata (Ledger) & Financial Management

| ID | Requirement | Priority |
|---|---|---|
| FR-LEDG-01 | The system shall auto-update the financial ledger on every transaction (sale, purchase, return, payment). | Must |
| FR-LEDG-02 | The system shall maintain customer ledgers (debit on credit sale, credit on payment). | Must |
| FR-LEDG-03 | The system shall maintain vendor ledgers (credit on purchase, debit on payment). | Must |
| FR-LEDG-04 | The system shall support payment methods: Cash, Bank Transfer, Cheque. | Must |
| FR-LEDG-05 | The system shall provide one-click WhatsApp ledger statement sharing (PDF via API). | Must |
| FR-LEDG-06 | The system shall implement Maker-Checker expense approval workflow. | Must |
| FR-LEDG-07 | The system shall set expense status to Pending on creation and only deduct on approval. | Must |
| FR-LEDG-08 | The system shall tag approved expenses with approvedBy and approvedAt. | Must |
| FR-LEDG-09 | The system shall support expense rejection with a rejection note. | Must |

### 4.11 Print Engine

| ID | Requirement | Priority |
|---|---|---|
| FR-PRINT-01 | The system shall support silent printing via Electron IPC (no dialog popup) on desktop. | Must |
| FR-PRINT-02 | The system shall provide a browser-based printing fallback for web deployment. | Must |
| FR-PRINT-03 | The system shall provide an Invoice Template Editor with drag-and-drop visual builder. | Should |
| FR-PRINT-04 | The system shall support template types: Thermal (58mm/80mm) and A4/Letter. | Must |
| FR-PRINT-05 | The system shall allow customization of company logo, terms & conditions, and digital signature. | Must |
| FR-PRINT-06 | The system shall generate server-side PDFs via Puppeteer for email/WhatsApp delivery. | Must |

### 4.12 Reports & Dashboard

| ID | Requirement | Priority |
|---|---|---|
| FR-RPT-01 | The system shall provide a real-time dashboard with key business metrics. | Must |
| FR-RPT-02 | The system shall trigger low-stock notifications when items fall below minimum threshold. | Must |
| FR-RPT-03 | The system shall provide product-wise sales reports. | Must |
| FR-RPT-04 | The system shall provide cash vs. credit sales analysis. | Must |
| FR-RPT-05 | The system shall provide customer outstanding balance reports. | Must |
| FR-RPT-06 | The system shall provide profit/loss reports based on landed cost. | Must |
| FR-RPT-07 | The system shall provide date-range filterable reports. | Must |

### 4.13 AI Assistant (Jarvis)

| ID | Requirement | Priority |
|---|---|---|
| FR-AI-01 | The system shall provide a Gemini-powered AI assistant (Jarvis) for natural language queries. | Should |
| FR-AI-02 | The system shall support text and voice commands for reporting queries. | Should |
| FR-AI-03 | The assistant shall answer queries like "Show today's total cash collection" and "Which items are running low on stock?". | Should |
| FR-AI-04 | The assistant shall be read-only and shall not perform data mutations. | Must |

### 4.14 Offline Sync Engine (Desktop Only)

| ID | Requirement | Priority |
|---|---|---|
| FR-SYNC-01 | The system shall persist all data locally to a Realm database when offline. | Must (Desktop) |
| FR-SYNC-02 | The system shall mark new records with `isSynced: false` locally. | Must (Desktop) |
| FR-SYNC-03 | The system shall automatically sync unsynced records to MongoDB Atlas when connectivity is restored. | Must (Desktop) |
| FR-SYNC-04 | The system shall implement conflict resolution with default Last Write Wins strategy. | Must (Desktop) |
| FR-SYNC-05 | The system shall support configurable conflict resolution (Field Merge, Manual). | Should (Desktop) |
| FR-SYNC-06 | The system shall maintain version metadata (v, lastModifiedAt, deviceId) on every document. | Must (Desktop) |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Target |
|---|---|---|
| NFR-PERF-01 | Sale invoice creation must complete in under 30 seconds via keyboard-only navigation. | < 30s |
| NFR-PERF-02 | Local database writes (desktop offline) must complete in milliseconds. | < 100ms |
| NFR-PERF-03 | API response time for standard CRUD operations must be under 500ms. | < 500ms |
| NFR-PERF-04 | Dashboard load time must be under 2 seconds. | < 2s |
| NFR-PERF-05 | Silent printing must produce a receipt in under 2 seconds. | < 2s |
| NFR-PERF-06 | Challan filtering by status must return results in milliseconds via indexed queries. | < 50ms |

### 5.2 Scalability

| ID | Requirement |
|---|---|
| NFR-SCAL-01 | The system shall support thousands of tenants via LRU-based connection pooling. |
| NFR-SCAL-02 | The system shall support thousands of transactions per tenant per day. |
| NFR-SCAL-03 | The database-per-tenant model shall ensure horizontal scalability without cross-tenant contention. |

### 5.3 Security

| ID | Requirement |
|---|---|
| NFR-SEC-01 | All credentials shall be managed via `.env` files — no hardcoded secrets. |
| NFR-SEC-02 | JWT access tokens shall be short-lived with refresh token rotation. |
| NFR-SEC-03 | Sensitive fields shall be encrypted at rest using FIELD_ENCRYPTION_KEY. |
| NFR-SEC-04 | The system shall prevent NoSQL injection via express-mongo-sanitize. |
| NFR-SEC-05 | The system shall implement CSRF protection tokens. |
| NFR-SEC-06 | The system shall apply rate limiting on auth and write endpoints. |
| NFR-SEC-07 | The system shall use Helmet for secure HTTP headers. |
| NFR-SEC-08 | Soft delete shall retain records for 90 days in the audit trail. |
| NFR-SEC-09 | Client-side storage shall be encrypted via VITE_STORAGE_ENCRYPTION_KEY. |
| NFR-SEC-10 | No native browser alert() or confirm() — all confirmations use custom modals. |

### 5.4 Reliability & Availability

| ID | Requirement |
|---|---|
| NFR-REL-01 | The web application shall maintain 99.5% uptime on Vercel deployment. |
| NFR-REL-02 | The desktop application shall remain fully functional without internet connectivity. |
| NFR-REL-03 | The sync engine shall retry failed syncs with exponential backoff. |
| NFR-REL-04 | Zero data loss shall be guaranteed — local writes persist before sync. |
| NFR-REL-05 | Redis shall be optional with graceful degradation when unavailable. |

### 5.5 Usability

| ID | Requirement |
|---|---|
| NFR-USE-01 | The UI shall be minimalist and function-oriented — no heavy animations or 3D dashboards. |
| NFR-USE-02 | Font sizes shall be large and readable for elderly operators. |
| NFR-USE-03 | The interface shall use high-contrast data grids and tables as the primary display. |
| NFR-USE-04 | Keyboard shortcuts shall be hardcoded: F2 (New Sale), F3 (Challan), Ctrl+F (Search). |
| NFR-USE-05 | The vocabulary shall be bilingual with local market terms (Khata, Udhaar, Bori, Peti). |
| NFR-USE-06 | The UI shall be responsive across desktop, tablet, and mobile via Tailwind CSS. |
| NFR-USE-07 | Icons shall be professional (Lucide React) — no amateur or generic AI-generated icons. |

### 5.6 Maintainability

| ID | Requirement |
|---|---|
| NFR-MAINT-01 | Backend files shall not exceed 120 lines. |
| NFR-MAINT-02 | Frontend components shall be split into small, reusable units. |
| NFR-MAINT-03 | Reusable global components shall be created for time-consuming features. |
| NFR-MAINT-04 | No comments shall be written in generated code (per rules.md). |
| NFR-MAINT-05 | The project shall follow a strict modular folder structure (client/ and server/). |
| NFR-MAINT-06 | All packages shall use the latest stable versions. |

### 5.7 Compatibility

| ID | Requirement |
|---|---|
| NFR-COMP-01 | The web application shall support modern browsers (Chrome, Firefox, Edge, Safari). |
| NFR-COMP-02 | The desktop application shall run on Windows 10 and later. |
| NFR-COMP-03 | The responsive design shall work on desktops (1920px+), tablets (768px+), and mobile (375px+). |

---

## 6. User Stories

### 6.1 Authentication

- **US-AUTH-01:** As a wholesale trader, I want to log in with my email and password so that I can access my business data securely.
- **US-AUTH-02:** As a super admin, I want to view all tenant health metrics so that I can monitor the SaaS platform.
- **US-AUTH-03:** As a manager, I want to create user accounts with appropriate roles so that my staff can access only what they need.

### 6.2 Stock & Inventory

- **US-INV-01:** As a data entry operator, I want to enter stock in Bori or Peti units and have the system automatically convert to pieces so that I don't have to do manual calculations.
- **US-INV-02:** As a trader, I want to see my stock displayed as "1 Bori, 2 Peti, 6 Pieces" so that I can instantly understand my inventory levels.
- **US-INV-03:** As a trader, I want to enter Palledari and Hamali charges during purchase so that the system calculates the true landed cost per piece.
- **US-INV-04:** As a manager, I want to receive low-stock alerts so that I can reorder before running out.
- **US-INV-05:** As a trader, I want to record wastage/damage so that spoiled goods are removed from stock and booked as a loss.

### 6.3 Sales

- **US-SALE-01:** As a salesman, I want to create a credit sale invoice in under 30 seconds using only the keyboard so that I can serve customers quickly.
- **US-SALE-02:** As a salesman, I want the system to automatically block sales that exceed a customer's credit limit so that I don't overextend credit.
- **US-SALE-03:** As a manager, I want to override a credit limit block with my authorization so that I can approve exceptional cases.
- **US-SALE-04:** As a salesman, I want to scan barcodes to add items so that entry is faster and more accurate.
- **US-SALE-05:** As a data entry operator, I want both item-level and bill-level discounts so that I can handle complex pricing scenarios.

### 6.4 Returns

- **US-RET-01:** As a data entry operator, I want to process a return by entering the original invoice number so that the system shows me what was sold.
- **US-RET-02:** As a trader, I want returned goods automatically added back to stock so that inventory is always accurate.
- **US-RET-03:** As a trader, I want the customer's ledger automatically adjusted on return so that their outstanding balance is correct.

### 6.5 Delivery Challan

- **US-CHAL-01:** As a godown keeper, I want to create a challan with vehicle and driver details so that the delivery is documented.
- **US-CHAL-02:** As a godown keeper, I want to enter supplied quantity less than required quantity so that shortages are tracked.
- **US-CHAL-03:** As a manager, I want to see color-coded challan statuses so that I can quickly identify pending deliveries.

### 6.6 DSR

- **US-DSR-01:** As a salesman, I want my daily activities linked to a single DSR number so that my daily report is automatically compiled.
- **US-DSR-02:** As a munshi, I want to enter note denominations so that the system verifies counted cash matches collected cash.
- **US-DSR-03:** As a salesman, I want to record my daily expenses so that they are deducted from my deposit.
- **US-DSR-04:** As a manager, I want a printable end-of-day salesman sheet so that I have a physical record.

### 6.7 Khata & Finance

- **US-LEDG-01:** As a trader, I want customer and vendor ledgers auto-updated on every transaction so that I always know who owes what.
- **US-LEDG-02:** As a trader, I want to share a customer's ledger via WhatsApp with one click so that I can speed up recovery.
- **US-LEDG-03:** As a data entry operator, I want to enter business expenses that require manager approval so that unauthorized spending is prevented.
- **US-LEDG-04:** As a manager, I want to approve or reject expenses so that I control cash outflow.

### 6.8 Print

- **US-PRINT-01:** As a data entry operator, I want silent printing so that receipts print instantly without dialog interruptions.
- **US-PRINT-02:** As a trader, I want to customize my invoice template with my logo and terms so that my bills look professional.

### 6.9 AI Assistant

- **US-AI-01:** As a trader, I want to ask Jarvis "Show today's cash collection" so that I get instant answers without navigating reports.
- **US-AI-02:** As a trader, I want to ask "Which items are low on stock?" so that I can reorder proactively.

---

## 7. Use Cases

### UC-01: Create Credit Sale Invoice

**Actor:** Salesman / Data Entry Operator
**Preconditions:** User is authenticated; customer exists with a credit limit; DSR is active.
**Main Flow:**
1. Operator presses F2 to open the New Sale screen.
2. System auto-links the active DSR number.
3. Operator selects Credit terms and searches for a customer.
4. System displays customer's outstanding balance and credit limit.
5. Operator scans barcodes or searches items to add to the invoice.
6. System applies tier-based pricing automatically.
7. Operator applies item-level or bill-level discounts if needed.
8. Operator presses Enter to save.
9. System checks credit limit: (Outstanding + Bill Amount) <= Credit Limit.
10. If within limit, system saves the invoice, deducts stock, and posts a debit to the customer ledger.
11. System triggers silent print of the invoice.
**Alternative Flow (Credit Limit Exceeded):**
- Step 9: System blocks the sale with "Credit Limit Exceeded" error.
- Operator requests manager override.
- Manager enters authorization credentials.
- System proceeds with the sale and logs the override in the audit trail.

### UC-02: Process Customer Return

**Actor:** Data Entry Operator
**Preconditions:** Original invoice exists in the system.
**Main Flow:**
1. Operator opens Create Return page.
2. Operator enters the original invoice number.
3. System displays original line items.
4. Operator enters return quantity per item.
5. System calculates refund amount.
6. Operator confirms the return.
7. System re-adds returned quantities to stock.
8. System posts a reverse (credit) entry to the customer ledger.
9. System logs the return in the audit trail.

### UC-03: Daily Salesman Settlement

**Actor:** Salesman + Munshi (Manager)
**Preconditions:** DSR has been active throughout the day with linked transactions.
**Main Flow:**
1. Salesman opens the DSR settlement form at end of day.
2. System displays total cash collected from all linked sales.
3. Salesman enters currency denomination breakdown (n5000, n1000, n500, etc.).
4. System verifies counted total matches collected total.
5. Salesman enters daily expenses (fuel, food, parking, labor).
6. System calculates Net Deposit: Total Collection - Total Expenses.
7. Munshi reviews and confirms the settlement.
8. System generates the printable end-of-day salesman sheet.

### UC-04: Purchase Entry with Landed Cost

**Actor:** Manager / Data Entry Operator
**Preconditions:** Supplier exists; product exists with unit hierarchy.
**Main Flow:**
1. Operator opens New Purchase Entry.
2. Operator selects the supplier.
3. Operator enters invoice line items (product, quantity in Peti/Bori, unit price).
4. Operator enters Direct Expenses: Freight, Palledari, Hamali, Tulai.
5. System calculates Total Extra Cost.
6. System distributes extra cost proportionally across all pieces.
7. System calculates Landed Cost per piece.
8. System updates stock levels and vendor ledger.
9. System stores landed cost for future profit calculations.

### UC-05: WhatsApp Ledger Sharing

**Actor:** Trader / Manager
**Preconditions:** Customer has a registered WhatsApp number; WhatsApp API is configured.
**Main Flow:**
1. Trader opens the customer's ledger page.
2. Trader selects a date range (e.g., current month).
3. Trader clicks "Share via WhatsApp".
4. System generates a PDF ledger statement server-side via Puppeteer.
5. System sends the PDF to the customer's WhatsApp number via API.
6. System logs the sharing event.

---

## 8. Data Requirements

### 8.1 Data Entities

The system manages the following core data entities (detailed schema in TRD.md):

- **Tenant/Company** — tenant registration, settings, subscription plan.
- **User** — authentication, role, companyId link.
- **Customer** — name, contact, credit limit, pricing tier, WhatsApp number.
- **Vendor/Supplier** — name, contact, ledger balance.
- **Product** — name, SKU, barcode, unit hierarchy, pricing tiers, stock thresholds.
- **Stock** — product, godown, quantity (in base units), batch info.
- **Purchase** — supplier, line items, expenses, landed cost, vendor ledger link.
- **Sale** — customer, line items, discounts, DSR link, payment terms, ledger link.
- **Return** — original sale reference, returned items, refund amount.
- **Challan** — DSR link, logistics info, line items (required vs. supplied), status.
- **DSR** — salesman, date, route, linked transactions, currency breakdown, expenses.
- **Transaction (Ledger Entry)** — party, type (debit/credit), amount, reference, timestamp.
- **Payment** — party, method (cash/bank/cheque), amount, reference.
- **Expense** — description, amount, status (pending/approved/rejected), approver.
- **PrintTemplate** — type, layout, logo, terms, signature.

### 8.2 Data Persistence

- **Cloud Database:** MongoDB Atlas (one database per tenant).
- **Local Database (Desktop):** Realm SDK for offline persistence.
- **Image Storage:** Cloudinary (URLs and metadata paths stored in MongoDB).
- **Generated PDFs:** Cloudinary (for email/WhatsApp delivery) or local temp (for direct print).

### 8.3 Data Retention

- Active records: retained indefinitely per tenant.
- Soft-deleted records: retained for 90 days in audit trail, then eligible for purge.
- Audit logs: retained for 1 year minimum.

---

## 9. External Interface Requirements

### 9.1 User Interfaces

- Web UI: React + Vite, responsive via Tailwind CSS, keyboard-first, bilingual.
- Desktop UI: Electron-wrapped web UI with native printing IPC.
- No theme switching. Single stable professional theme.

### 9.2 Hardware Interfaces

- Barcode scanners (USB HID — acts as keyboard input).
- Thermal printers (58mm/80mm) and A4 laser printers.
- Receipt printers via Electron native printing.

### 9.3 Software Interfaces

| External Service | Purpose | Integration Method |
|---|---|---|
| MongoDB Atlas | Cloud database | Mongoose ODM |
| Cloudinary | Image/file storage | Multer + Cloudinary SDK |
| WhatsApp Business API | Ledger sharing | HTTP API |
| Google Gemini API | Jarvis AI assistant | HTTP API |
| Firebase | Google login (optional) | Firebase Auth SDK |
| Redis | Caching (optional) | ioredis client |
| Puppeteer | Server-side PDF generation | Node.js library |

### 9.4 Communication Interfaces

- REST API (HTTPS) between frontend and backend.
- JWT bearer tokens for authentication.
- Electron IPC for desktop native operations (printing, file system).
- WebSocket (Socket.IO) — NOT supported on Vercel serverless; real-time features
  degrade gracefully. Available only on dedicated server or desktop.

---

## 10. Constraints & Assumptions

### 10.1 Constraints

1. **MERN Stack Only:** The project must be built on MongoDB, Express, React, Node.js.
2. **Latest Versions:** Every package must be the latest stable version.
3. **No Bootstrap:** Styling is Tailwind CSS + custom CSS only.
4. **No Theme Changes:** A single stable theme is maintained — no theme switching.
5. **File Size Limits:** Backend files <= 120 lines; frontend components must be split.
6. **No Comments:** No comments in generated code.
7. **No Native Alerts:** No browser alert()/confirm() — custom modals only.
8. **Env-Driven:** All credentials via .env files.
9. **Milestone-Based:** Development follows a milestone-based approach.
10. **Modular Structure:** Strict adherence to client/ and server/ folder structure.

### 10.2 Assumptions

1. Users have basic computer literacy and can use a keyboard.
2. Internet connectivity is intermittent in target markets (hence offline-first for desktop).
3. Each tenant manages their own user accounts within their database.
4. The SUPER_ADMIN does not need to access tenant business data, only platform metrics.
5. Barcode scanners behave as keyboard input devices (USB HID standard).
6. Thermal printers support standard ESC/POS or are accessible via OS print spooler.

---

## 11. Acceptance Criteria

| AC ID | Criterion | Verification Method |
|---|---|---|
| AC-01 | A credit sale invoice can be created in under 30 seconds using keyboard only. | Timed user test |
| AC-02 | Stock is stored in base units and displayed in hierarchical format. | Data inspection |
| AC-03 | Landed cost is calculated with proportional expense allocation. | Formula verification |
| AC-04 | Credit limit enforcement blocks over-limit sales without manager override. | Negative test |
| AC-05 | Offline desktop operations sync to cloud when connectivity restores. | Sync verification |
| AC-06 | Multi-tenant isolation prevents cross-tenant data access. | Security test |
| AC-07 | Silent printing produces a receipt in under 2 seconds. | Timed test |
| AC-08 | WhatsApp ledger sharing delivers a PDF in a single click. | Integration test |
| AC-09 | All 5 RBAC roles enforce their permission boundaries. | Role-based test suite |
| AC-10 | The application is responsive across desktop, tablet, and mobile. | Responsive audit |
| AC-11 | No backend file exceeds 120 lines. | Code review |
| AC-12 | No comments exist in generated code. | Code scan |
| AC-13 | No native alert()/confirm() calls exist. | Code scan |
| AC-14 | All packages are at latest stable versions. | Dependency audit |

---

## 12. Glossary

| Term | Meaning |
|---|---|
| Bori | Sack — largest packaging unit in wholesale (e.g., 1 Bori = 10 Peti = 120 Pieces) |
| Peti | Carton — mid-level packaging unit (e.g., 1 Peti = 12 Pieces) |
| Palledari | Labor charges for loading/unloading at the market |
| Hamali | Porterage / labor charges for carrying goods |
| Tulai | Weighing charges (weighbridge fees) |
| Khata | Ledger — financial account record for a customer or vendor |
| Udhaar | Credit — goods sold on deferred payment |
| Wapsi | Return — goods returned by a customer |
| DSR | Daily Sales Report — per-salesman daily activity tracker |
| Munshi | Traditional term for an accountant/manager in wholesale markets |
| Landed Cost | True per-unit cost including invoice price plus proportional expenses |
| LWW | Last Write Wins — default conflict resolution for sync |
| RBAC | Role-Based Access Control |
| Maker-Checker | Approval workflow where the creator (maker) cannot approve their own entry |
