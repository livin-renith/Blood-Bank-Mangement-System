# LifeFlow — PulsePoint Blood Bank Management System

> **Enterprise-Grade Full-Stack Clinical Blood Vault & Requisition System**  
> Powered by **Node.js, Express, MongoDB (Mongoose)** and **Semantic HTML5 / Vanilla JS / CSS**

---

## 📋 Table of Contents
1. [Overview & Features](#-overview--features)
2. [Architecture: Server & Frontend](#-architecture-server--frontend)
3. [Prerequisites](#-prerequisites)
4. [Running Server & Frontend in Terminal](#-running-server--frontend-in-terminal)
   - [Method 1: Single Terminal (Recommended — Unified Full-Stack)](#method-1-single-terminal-recommended--unified-full-stack)
   - [Method 2: Dual Terminals (Separate Server & Dedicated Frontend Server)](#method-2-dual-terminals-separate-server--dedicated-frontend-server)
   - [Method 3: Quick One-Liner Terminal Commands](#method-3-quick-one-liner-terminal-commands)
5. [Expected Terminal Outputs](#-expected-terminal-outputs)
6. [Demo Access Credentials](#-demo-access-credentials)
7. [Screen & Navigation Sitemap](#-screen--navigation-sitemap)
8. [API Endpoints Reference](#-api-endpoints-reference)
9. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🩸 Overview & Features

**LifeFlow** is an enterprise-grade Blood Bank Management System designed for hospital networks, trauma centers, and centralized blood vaults:

- **Donor Registry & Dossiers** — Comprehensive tracking of volunteer donors, eligibility screening (*Eligible / Deferred / Temporary Hold*), vitals, and donation history.
- **Clinical Blood Requisitions & Allocation** — Real-time hospital request queue with emergency triage (*Emergency / Urgent / Routine*), unit cross-matching, and fulfillment locking.
- **Blood Vault & Inventory Management** — Real-time tracking of units across all ABO/Rh blood groups, shelf-life monitoring, critical 72-hour expiry alerts, and testing quarantine.
- **Phlebotomy & Donation Processing** — Vital signs checks (BP, Hemoglobin, Temperature), volume management (350 mL / 450 mL / 500 mL), and automated inventory stock creation.
- **Partner Hospitals Directory** — Facility database with profile drawers, contact management, and direct requisition tracking.
- **Analytical Intelligence & Reports** — Monthly collection vs. demand bar charts, blood group distribution, audit benchmarks, and one-click CSV export.
- **Secure Authentication & Roles** — JWT-based authentication with pre-configured Administrator and Lab Staff accounts.

---

## 🏛️ Architecture: Server & Frontend

The application is structured for fast, friction-free local execution:
- **Backend Server (`server.js`)**: Express.js server running on port `5000` (or `PORT` from `.env`). It handles REST API endpoints (`/api/*`) and connects to MongoDB.
- **Frontend Client (`/public`)**: Pure HTML5, CSS, and Vanilla JavaScript.
- **Integrated Serving**: The Express server is pre-configured with `express.static('public')` and friendly HTML routes. When you start the backend server, **the frontend is automatically hosted and ready at `http://localhost:5000`**.

---

## 📦 Prerequisites

Before running the terminal commands, make sure you have:
1. **Node.js** (v18.0.0 or higher) — [Download Node.js](https://nodejs.org/)
   ```bash
   node --version
   npm --version
   ```
2. **MongoDB** (v6.0 or higher) — Local MongoDB Community Server installed or a MongoDB Atlas cloud URI.
   - *Note: LifeFlow includes an auto-spawning MongoDB daemon fallback in `config/db.js` that can automatically launch local `mongod` if installed on your system.*

---

## 💻 Running Server & Frontend in Terminal

Choose the method that best matches your workflow:

### Method 1: Single Terminal (Recommended — Unified Full-Stack)

In this mode, the Node/Express server runs both the backend REST API and serves all frontend web pages from `http://localhost:5000`.

#### Step 1: Open your terminal and navigate to the project root
```bash
cd "e:\Blood Bank Management System"
```

#### Step 2: Install project dependencies
```bash
npm install
```

#### Step 3: Ensure MongoDB is running
- **Windows (Service):**
  ```powershell
  net start MongoDB
  ```
- **Windows (Manual daemon):**
  ```powershell
  mongod --dbpath=".\data\db"
  ```
- **macOS / Linux:**
  ```bash
  sudo systemctl start mongod
  # or using brew
  brew services start mongodb-community
  ```

#### Step 4: Seed the database with sample clinical data *(Run once)*
```bash
npm run seed
```

#### Step 5: Start the Full-Stack Server
```bash
npm start
```
*(Or use `npm run dev` to start with development logging)*

#### Step 6: Launch the Frontend in your browser
Once you see `Server running on http://localhost:5000`, open your web browser:
- **URL**: [http://localhost:5000](http://localhost:5000)
- **Login Portal**: [http://localhost:5000/login](http://localhost:5000/login)

You can also launch your default browser straight from the terminal:
- **Windows PowerShell:**
  ```powershell
  Start-Process "http://localhost:5000"
  ```
- **Windows Command Prompt (CMD):**
  ```cmd
  start http://localhost:5000
  ```
- **macOS:**
  ```bash
  open http://localhost:5000
  ```
- **Linux:**
  ```bash
  xdg-open http://localhost:5000
  ```

---

### Method 2: Dual Terminals (Separate Server & Dedicated Frontend Server)

If you prefer keeping your backend API logs in one terminal and running a live-reloading static server for frontend development in a second terminal:

#### 🖥️ Terminal 1: Backend Server

1. Navigate to the project root:
   ```bash
   cd "e:\Blood Bank Management System"
   ```
2. Start the Express API server (or use `npx nodemon server.js` for auto-reloading upon file changes):
   ```bash
   node server.js
   ```
   > Backend API is active at: `http://localhost:5000/api`

---

#### 🌐 Terminal 2: Frontend Client

Open a **new, separate terminal window** and run one of the following frontend static servers:

- **Option A: Using `npx serve` (Node.js)**
  ```bash
  cd "e:\Blood Bank Management System"
  npx serve public -p 3000
  ```
  *Access Frontend at: `http://localhost:3000`*

- **Option B: Using `npx live-server` (Auto-reload on HTML/CSS/JS edits)**
  ```bash
  cd "e:\Blood Bank Management System\public"
  npx live-server --port=3000
  ```

- **Option C: Using Python 3 built-in HTTP server**
  ```bash
  cd "e:\Blood Bank Management System"
  python -m http.server 3000 --directory public
  ```

- **Option D: Using VS Code / IDE Live Server Extension**
  - Right-click `public/index.html` or `public/login.html` and click **"Open with Live Server"**.

---

### Method 3: Quick One-Liner Terminal Commands

Run everything in a single copy-paste command according to your shell:

#### ⚡ Windows PowerShell:
```powershell
npm install; npm run seed; Start-Process "http://localhost:5000"; npm start
```

#### ⚡ Windows CMD (Command Prompt):
```cmd
npm install && npm run seed && start http://localhost:5000 && npm start
```

#### ⚡ macOS / Linux Bash:
```bash
npm install && npm run seed && open http://localhost:5000 && npm start
```

---

## 🖥️ Expected Terminal Outputs

### 1. When running `npm run seed`:
```text
> lifeflow-blood-bank@1.0.0 seed
> node seed/seedData.js

Connecting to MongoDB at: mongodb://127.0.0.1:27017/lifeflow_bloodbank
MongoDB connected successfully!
Clearing existing collections...
Seeding Users...
Seeding Donors...
Seeding Blood Inventory...
Seeding Blood Requests...
Seeding Partner Hospitals...
Seeding Donation Sessions...
Seeding Audit Logs...
====================================================
  LifeFlow Clinical Database Seed Completed!
  Admin Account: admin.bloodbank@lifeflow.med
  Staff Account: staff@lifeflow.med
  Password:      SecureLifeFlow2025!
====================================================
```

### 2. When running `npm start`:
```text
> lifeflow-blood-bank@1.0.0 start
> node server.js

Connecting to MongoDB at: mongodb://127.0.0.1:27017/lifeflow_bloodbank
MongoDB connected successfully!
====================================================
  LifeFlow Blood Bank Management System
  Server running on http://localhost:5000
  Database: MongoDB (lifeflow_bloodbank)
====================================================
```

---

## 🔑 Demo Access Credentials

Use these pre-seeded credentials to sign in at [http://localhost:5000/login](http://localhost:5000/login):

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin.bloodbank@lifeflow.med` | `SecureLifeFlow2025!` | Full system access, staff registration, cross-match approvals |
| **Lab Staff** | `staff@lifeflow.med` | `SecureLifeFlow2025!` | Donor intake, phlebotomy logging, inventory updates |

> 💡 **Quick Login Tip:** On the `/login` page, you can click the **"Auto-fill Administrator Credentials"** button to instantly populate the form and log in with one click.

---

## 🗺️ Screen & Navigation Sitemap

All pages are accessible directly in the browser when the server is running:

| Screen | Browser URL | Description |
| :--- | :--- | :--- |
| **Dashboard** | `http://localhost:5000/` or `/dashboard` | Operational KPIs, inventory breakdown, active requests, real-time alerts |
| **Donor Management** | `http://localhost:5000/donors` | Donor registry, eligibility screening, contact details, dossier drawer |
| **Blood Inventory** | `http://localhost:5000/inventory` | Blood vault units, ABO/Rh filter, expiry countdown, CSV export |
| **Blood Requests** | `http://localhost:5000/requests` | Hospital requisitions queue, urgency triage, cross-match & allocation |
| **Donations** | `http://localhost:5000/donations` | Phlebotomy sessions, vitals check (BP, Hemoglobin), unit creation |
| **Hospitals** | `http://localhost:5000/hospitals` | Registered healthcare facilities, active requests, compliance rating |
| **Reports** | `http://localhost:5000/reports` | Analytical graphs, monthly collection vs demand, export audit CSV |
| **Login** | `http://localhost:5000/login` | Secure HIPAA/HL7-compliant medical portal login |
| **Register** | `http://localhost:5000/register` | Staff account creation with medical role & facility association |
| **Password Reset** | `http://localhost:5000/password-reset` | Credential recovery with security verification |

---

## 📡 API Endpoints Reference

### 🔐 Authentication
- `POST /api/auth/login` — Authenticate user and receive JWT token
- `POST /api/auth/register` — Register a clinical staff account
- `POST /api/auth/reset-password` — Reset account credentials
- `GET  /api/auth/me` — Retrieve current authenticated user profile

### 📊 Dashboard & Reports
- `GET  /api/dashboard/overview` — High-level clinical KPIs, inventory counts, recent requests
- `GET  /api/reports/analytics` — Detailed analytics, collection vs demand metrics
- `GET  /api/reports/export-csv` — Direct CSV download of inventory audits

### 🩸 Donor Management
- `GET    /api/donors` — Query donors with search, blood group, and status filters
- `GET    /api/donors/stats` — Metrics: total registered, eligible, deferred
- `GET    /api/donors/:id` — Retrieve full dossier for a specific donor
- `POST   /api/donors` — Register a new blood donor
- `PUT    /api/donors/:id` — Update donor profile and eligibility
- `DELETE /api/donors/:id` — Remove donor record

### 🧪 Blood Vault & Inventory
- `GET    /api/inventory` — Active inventory with component and group filters
- `GET    /api/inventory/summary` — Stock count per blood group and expiry warnings
- `POST   /api/inventory` — Add tested blood unit into the vault
- `PUT    /api/inventory/:id` — Update unit status or storage shelf
- `DELETE /api/inventory/:id` — Discard unit from active stock

### 🚑 Hospital Requests
- `GET    /api/requests` — Hospital blood requisitions queue
- `GET    /api/requests/stats` — Urgent count, pending units, fulfilled count
- `POST   /api/requests` — Dispatch emergency or routine blood request
- `PATCH  /api/requests/:id/status` — Update requisition status (`Approved`, `Fulfilled`, `Rejected`)

### 💉 Phlebotomy & Donations
- `GET    /api/donations` — Historical phlebotomy logs
- `GET    /api/donations/stats` — Volume collected, testing pass rates
- `POST   /api/donations` — Record new donation with vitals (auto-updates stock & donor log)

### 🏥 Partner Hospitals
- `GET    /api/hospitals` — Healthcare facility directory
- `GET    /api/hospitals/stats` — Facility count, total blood requisitions
- `GET    /api/hospitals/:id` — Facility profile & order history
- `POST   /api/hospitals` — Register new hospital partner

---

## ❓ Troubleshooting & FAQ

### 1. `Error: listen EADDRINUSE: address already in use :::5000`
Another process is already using port 5000.
- **Solution A:** Kill the process running on port 5000:
  - **PowerShell:**
    ```powershell
    Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
    ```
  - **CMD:**
    ```cmd
    for /f "tokens=5" %a in ('netstat -aon ^| find ":5000"') do taskkill /f /pid %a
    ```
- **Solution B:** Change the port in `.env`:
  ```env
  PORT=5001
  ```
  Then access the app at `http://localhost:5001`.

### 2. MongoDB connection fails / `MongoServerError: connect ECONNREFUSED`
- Make sure MongoDB service is started:
  ```powershell
  net start MongoDB
  ```
- Or verify that your `MONGODB_URI` in `.env` is correct. If you are using MongoDB Atlas, update `.env` with your connection string:
  ```env
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/lifeflow_bloodbank
  ```

### 3. PowerShell: `File ... cannot be loaded because running scripts is disabled`
If execution policy blocks running `npm` or local scripts:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 4. How to run with auto-reload (Hot Reload)?
Install and run `nodemon`:
```bash
npx nodemon server.js
```
The server will now automatically restart whenever you modify backend files.

---

## 🛡️ License & Acknowledgments
LifeFlow Blood Bank Management System — Developed for modern medical informatics and clinical blood bank workflows.
