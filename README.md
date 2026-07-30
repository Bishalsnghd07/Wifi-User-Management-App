````markdown
# 📡 WiFi Control Engine & Identity Portal

A modern, high-performance Enterprise Bandwidth & Hardware Access Control Dashboard built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.

---

## 🌟 Key Features

- **📊 Live Telemetry Dashboard**: Real-time stats on rolling 7-day data consumption, active connected hardware, and dynamic graph visualizations powered by **Recharts**.
- **💻 MAC Whitelisting & Hardware Control**: Full CRUD capability for whitelisting device MAC addresses, toggling live status (`ONLINE` / `OFFLINE`), and auto-stamping registration dates with 12-hour formatted timestamps (`DD MMM YYYY, hh:mm A`).
- **🌓 Global Theme System**: Seamless Light/Dark mode state management using React Context API (`ThemeContext`) persisted across page transitions and reloads.
- **🛡️ Identity & KYC Integration**: Built-in verification status indicator and compliance workflow tracking for enterprise users.
- **🔐 Modern Session Security**: Smooth, accessible, and animated logout modal with zero layout shift and custom Tailwind transitions.

---

## 🚀 Quick Start Instructions

Follow these steps to run the development environment locally.

### Prerequisites

- **Node.js**: `v18.x` or higher
- **npm** / **yarn** / **pnpm**
- **Database**: PostgreSQL / MySQL / SQLite (configured via Prisma)

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/your-username/wifi-control-engine.git](https://github.com/your-username/wifi-control-engine.git)
   cd wifi-control-engine
   ```
````

2. **Install Dependencies**

```bash
npm install

```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/wifi_db?schema=public"
NEXTAUTH_SECRET="your-production-secret-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

```

4. **Initialize Database & Migrations**

```bash
npx prisma db push
# Optional: Seed initial database mock records
npx prisma db seed

```

5. **Start Development Server**

```bash
npm run dev

```

Navigate to `http://localhost:3000` to view the application.

---

## 🛠️ Tech Stack & Architectural Decisions

| Layer                | Technology                   | Rationale                                                                                                   |
| -------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Framework**        | **Next.js 14+ (App Router)** | Hybrid rendering (SSR/SSG), Server Actions, and file-system based client/server routing.                    |
| **Language**         | **TypeScript**               | Strict type safety for API request payloads, hardware schemas, and component interfaces.                    |
| **Styling**          | **Tailwind CSS**             | Zero runtime CSS bundle overhead, rapid UI development, and native utility classes for theme state syncing. |
| **Icons & Visuals**  | **Lucide React & Recharts**  | Tree-shakeable vector icon set and responsive canvas chart engine for telemetry rendering.                  |
| **State Management** | **React Context API**        | Lightweight global provider pattern for app-wide settings (Theme, Modal triggers) without Redux overhead.   |
| **Database & ORM**   | **Prisma ORM**               | Type-safe query generator with declarative schema migrations and auto-generated client bindings.            |

---

## 🔌 API Endpoints Documentation

### 1. Telemetry & Analytics

- **`GET /api/dashboard`**
- **Summary**: Returns user details, aggregate data usage metrics, active device count, and 7-day usage chart data.
- **Response `200 OK**`:

```json
{
  "success": true,
  "user": { "name": "Bishal Singh Deo", "kycStatus": "VERIFIED" },
  "stats": {
    "totalDataGB": "142.8",
    "activeDevicesCount": 3,
    "totalDevicesCount": 5
  },
  "chartData": [{ "date": "Mon", "dataGB": 18.4 }]
}
```

### 2. Device & Hardware Access Control

- **`GET /api/devices`**
- **Summary**: Fetches all registered devices for the current session user.

- **`POST /api/devices`**
- **Summary**: Registers and whitelists a new device MAC address.
- **Payload**:

```json
{
  "userId": "usr_99",
  "deviceName": "Work MacBook Pro",
  "deviceType": "Laptop",
  "macAddress": "32:F4:11:89:AB:CD"
}
```

- **`PATCH /api/devices`**
- **Summary**: Toggles connection access (`ONLINE` / `OFFLINE` / `BLOCKED`).
- **Payload**: `{ "deviceId": "dev_123", "status": "OFFLINE" }`

---

## 🏗️ System Architecture & Microservices Scalability

While structured as a clean, modular **Next.js Monolith**, this architecture is built to easily decompose into specialized enterprise microservices as bandwidth demand scales:

```
                          ┌───────────────────────────┐
                          │   API Gateway / NGINX     │
                          └─────────────┬─────────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         ▼                              ▼                              ▼
┌──────────────────┐          ┌────────────────────┐        ┌─────────────────────┐
│ Auth & KYC       │          │ Access Control     │        │ Telemetry Engine    │
│ Service (Node/Go)│          │ Service (Go/Rust)  │        │ (Time-Series DB)    │
└──────────────────┘          └─────────┬──────────┘        └──────────┬──────────┘
                                        │                              │
                              ┌─────────┴──────────┐        ┌──────────┴──────────┐
                              │ Network Hardware   │        │ Apache Kafka /      │
                              │ (RADIUS / MQTT)    │        │ Redis Event Stream  │
                              └────────────────────┘        └─────────────────────┘

```

1. **Hardware Access Control (RADIUS/MQTT Broker Integration)**:

- **Current State**: Direct HTTP REST updates to Prisma DB.
- **Scale Path**: MAC toggle events publish to a high-throughput **Kafka/RabbitMQ** queue. A Go-based worker service directly executes network isolation commands across Wi-Fi Access Points via RADIUS/MQTT protocols with sub-millisecond latency.

2. **Telemetry Ingestion Engine**:

- **Current State**: Aggregate metrics computed on-the-fly.
- **Scale Path**: Packet usage stats stream to a dedicated time-series store (**TimescaleDB** / **InfluxDB**), avoiding lock contention on primary relational user tables.

---

## 📂 Directory Structure

```text
├── src/
│   ├── app/
│   │   ├── api/             # App Router API endpoints (dashboard, devices, kyc)
│   │   ├── dashboard/       # Dashboard main view page
│   │   ├── kyc/             # Identity verification workflow
│   │   ├── layout.tsx       # Root layout wrapping ThemeProvider
│   │   └── page.tsx         # Login / Root landing route
│   ├── components/
│   │   ├── LogoutModal.tsx  # Animated confirmation modal
│   │   ├── ThemeToggle.tsx  # Dynamic Light/Dark toggle button
│   │   └── ...              # Reusable UI widgets
│   └── context/
│       └── ThemeContext.tsx # Global theme provider & localStorage observer
├── prisma/
│   └── schema.prisma        # Database models & relationships
├── public/                  # Static assets & icons
├── README.md                # Documentation
└── tailwind.config.ts       # Utility configurations & animations

```

---

## 🧪 Quality Assurance & Build Verification

Before submitting or deploying, verify project health:

```bash
# Type check and linting
npm run lint

# Production build verification
npm run build

```

```

```
