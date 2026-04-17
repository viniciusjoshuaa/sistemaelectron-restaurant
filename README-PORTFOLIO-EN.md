# Restaurant Management Prototype

> **English**  
> Desktop restaurant operations prototype focused on catalog management, production flow, orders, digital menu, reporting, pricing and WhatsApp integration.

## Overview

This project is a **functional desktop prototype** for restaurant operations, built with **Electron + Node.js + HTML/CSS/JavaScript**, using local JSON files for persistence.

The goal is to provide a realistic foundation for a restaurant system that can later evolve into a commercial-grade product. The prototype includes modules for:

- customer management
- product and dish management
- ingredient control and recipe composition
- daily menu
- local and online orders
- kitchen display flow
- operational reports
- dish pricing
- QR-code menu publishing
- thermal printer integration
- WhatsApp flow
- automatic backups
- visual table management
- dark mode

## Technical stack

### Application base
- **Electron** for the desktop shell
- **Node.js** for the main process and local persistence
- **HTML + CSS + vanilla JavaScript** for the UI
- **JSON files** for local data storage

### Main structure
- `main.js`: Electron main process, IPC handlers, backup, login, persistence, orders, menu, ingredients, dishes and printing
- `preload.js`: secure bridge between renderer and main process
- `renderer.js`: UI-related client-side helpers
- `server.js`: complementary layer for online/server resources
- `assets/style.css`: global visual layer
- `assets/theme.js`: light/dark theme control
- `pages/*.html`: operational modules
- `data/*.json`: local persistence layer
- `bot/whatsappManager.js`: local WhatsApp session handling

## Architecture summary

The application currently follows a prototype-friendly architecture:

1. **HTML pages** for each operational module
2. **IPC communication layer** between UI and Electron
3. **Local persistence layer** based on JSON files
4. **Local services** for printing, backups, online flow and integrations

This approach is useful for:
- rapid implementation
- local testing
- low infrastructure complexity
- portfolio demonstration
- gradual migration to a real database and API

## Available modules

### Core operation and registration
- customers
- products
- dishes
- ingredients
- expenses
- notes

### Sales and production flow
- orders
- daily orders
- kitchen
- daily menu
- web menu / QR code
- tables

### Management and support
- reports
- pricing calculator
- printer configuration
- online server
- WhatsApp
- automatic backup
- dark mode

## Technical capabilities already present in the codebase

The current codebase already includes:

- Electron main window creation and `index.html` bootstrap
- automatic backup routine on interval plus startup execution
- local authentication with default admin bootstrap
- JSON-based local CRUD for customers, products, ingredients, dishes and orders
- current menu read/write flow
- order status handling
- thermal receipt printing with `electron-thermal-printer`
- menu export to text file
- period-based reporting and top-selling item aggregation
- kitchen screen with filtering and status actions

## Installation

### Requirements
- Node.js 18+ recommended
- npm
- Windows is the most practical target for the current local desktop flow

### Steps
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the app:
   ```bash
   npm start
   ```
   or use the equivalent script defined in `package.json`.

> Note: some resources depend on local setup and extra libraries, such as thermal printing, QR generation and WhatsApp session support.

## Suggested usage flow

1. Register **ingredients**
2. Register **dishes** and recipes
3. Configure **expenses** and operational costs
4. Publish the **daily menu**
5. Receive orders through **Orders**, **Customer Menu**, **Web Menu** or **Tables**
6. Track production in **Kitchen**
7. Analyze performance in **Reports**
8. Fine-tune margins in the **Pricing Calculator**

## Data strategy

The current version uses JSON persistence. This keeps the project easy to run and understand, but it also creates clear limitations.

### Benefits
- easy to understand
- easy to move between machines
- excellent for prototyping
- no external database required

### Limitations
- write concurrency risk
- limited scalability
- limited auditability
- basic security
- hard to support real multi-user usage

## Recommended maintenance roadmap

### Short term
- standardize IPC handler names
- remove duplicated logic across pages
- review flows with local/global variable inconsistencies
- centralize theme, navigation and shared UI components
- document JSON data contracts

### Mid term
- migrate from JSON to SQLite or PostgreSQL
- introduce service and repository layers
- add schema-based data validation
- hash passwords and strengthen authentication
- add structured logging and audit trail
- automate critical-path tests

### Long term
- split frontend and backend concerns
- expose a REST or GraphQL API
- implement role-based access control
- add network/cloud synchronization
- support multi-unit / multi-store operations
- add observability and monitoring

## Scaling path

A practical path to turn this prototype into a more robust product would be:

1. **Persistence**: move to a relational database
2. **Backend**: isolate business rules into a dedicated API
3. **Authentication**: implement role-based access
4. **Integrations**: formalize WhatsApp, payments, delivery and fiscal modules
5. **Deployment**: prepare desktop and web delivery flows
6. **Operations**: add logging, versioned backups and recovery routines

## Future implementation ideas

### Technical
- SQLite for local single-store usage
- PostgreSQL for concurrent/multi-user environments
- Prisma or Knex as the data access layer
- Playwright/Vitest/Jest for automated testing
- CI/CD for release management
- Electron Builder for packaging
- centralized error tracking
- feature flags for experimental modules

### Functional for restaurant operations
- advanced recipe sheets per dish
- stock deduction from sales
- food cost and margin analytics
- dining room layout with reservations
- printer routing by production area
- cash closing routines
- partial bills / split orders
- payment integration
- first-party delivery flow
- marketplace integrations
- loyalty / CRM
- scheduled promotions
- waste and production tracking
- management dashboard with KPIs

## WhatsApp integration status

WhatsApp support should currently be considered **prototype-level**.

There are two realistic paths:

### 1) Local session through WhatsApp Web
Good for demos and local operation, but dependent on the machine environment, active session state and library compatibility.

### 2) Official WhatsApp Business Platform / Cloud API
More robust, but it requires:
- Meta Business account
- enabled phone number
- long-lived token
- public HTTPS webhook
- compliance with platform policies

## Known attention points

- The project still mixes responsibilities across pages, handlers and helper scripts.
- Some screens embed styles and business logic locally.
- The original pricing screen had local/global variable loading inconsistencies.
- JSON persistence is enough for a prototype, but not for heavy concurrent production usage.

## Keeping the project healthy

- version the `data/` folder only when needed for demo seeds
- never commit real sensitive operational data
- separate demo data from real operational data
- review dependencies regularly
- document every new page, IPC handler and JSON structure
- avoid spreading critical business logic across many pages

## Suggested repository structure

```text
project-root/
├─ assets/
├─ bot/
├─ data/
├─ pages/
├─ main.js
├─ preload.js
├─ renderer.js
├─ server.js
├─ package.json
├─ README.md
├─ README-PORTFOLIO-PTBR.md
├─ README-PORTFOLIO-EN.md
├─ MANUAL-USUARIO-PTBR.md
└─ MANUAL-USER-EN.md
```

## License and purpose

This project is presented as a **portfolio prototype** and evolution-ready study base. Before production usage, it should go through architectural review, security hardening, data standardization and formal external integration setup.
