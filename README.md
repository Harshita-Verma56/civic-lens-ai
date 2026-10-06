# 🏛️ CivicLens AI — AI-Powered Public Infrastructure Monitoring

> **"See it. Report it. Fix it."**  
> *AI-powered infrastructure monitoring for safer, better-maintained communities.*

[![CivicLens](https://img.shields.io/badge/CivicLens-AI_Vision-0284c7?style=for-the-badge)](https://github.com)
[![Status](https://img.shields.io/badge/Status-Hackathon_MVP_Ready-10b981?style=for-the-badge)](https://github.com)
[![Engine](https://img.shields.io/badge/AI_Engine-Gemini_1.5_Flash_+_Offline_Mock-8b5cf6?style=for-the-badge)](https://github.com)

---

## 🎯 The Problem

Public infrastructure defects such as **potholes, severely damaged roads, knocked-out streetlights, and overflowing storm drains** often go unreported for weeks or months until catastrophic vehicle damage, accidents, or localized flooding occur. 

Manual municipal reporting processes are friction-heavy: citizens struggle to describe technical issues, and municipal dispatchers lack objective severity triaging to prioritize emergency repairs over routine cosmetic maintenance.

---

## 💡 The Solution: CivicLens AI

**CivicLens AI** bridges citizens and municipal public works departments through automated computer vision intelligence:

1. **Citizen-First Reporting**: Citizens upload or capture a photo with optional location/description (with 1-click GPS detection and pre-configured test samples).
2. **AI Vision Classification**: Multimodal AI automatically categorizes the defect into:
   - 🕳️ **Pothole**
   - 🛣️ **Damaged Road**
   - 💡 **Broken Streetlight**
   - 🌊 **Overflowing Drain**
   - ⚠️ **Other Infrastructure Issue**
3. **Automated Severity Scoring**: AI evaluates hazard intensity into **Low**, **Medium**, **High**, or **Critical**, providing an engineering rationale and an immediate recommended municipal dispatch action.
4. **Operations Command Dashboard**: City authorities review live reports, filter by severity, type, or status, and update resolution lifecycle stages (**Pending** ➔ **Under Review** ➔ **In Progress** ➔ **Resolved**).

---

## ✨ Key Features

- **Real AI Vision & Seamless Mock Mode**:
  - **Live Mode**: Directly queries Google Gemini 1.5 Flash Vision API using backend authentication (zero client key exposure).
  - **Mock Mode**: Fully isolated, intelligent heuristic mock vision engine that runs 100% offline out-of-the-box for instant hackathon demonstrations.
  - **Runtime Switcher**: In-app UI modal to toggle modes or configure API keys instantly.
- **Instant 1-Click Demo Samples**: Pre-loaded with high-resolution test photos (pothole, blocked drain, broken streetlight, road subsidence, displaced manhole) for immediate evaluation without finding real photos.
- **Interactive Geolocation**: Browser GPS integration with automatic coordinate formatting.
- **Dynamic Dashboard & Analytics**:
  - 4 Real-time Metrics: Total Reports, Critical Issues, Pending Reports, Resolved Reports.
  - Multi-criteria filtering: Issue Type, Severity, Resolution Status, Keyword search.
  - Sorting: Newest, Oldest, Highest Severity, Confidence.
  - Dual Views: Responsive Card Grid and High-Density Table.
- **Authority Dispatch Controller**: Dedicated status management panel allowing dispatchers to update ticket states and maintain full audit accountability.
- **Embedded SQLite Persistence**: All reports and status changes persist across restarts in a lightweight, zero-configuration SQLite database (`database.sqlite`).

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    CivicLens AI Web UI                    │
│      React 19 + Vite 5 + Lucide Icons + Custom Tokens     │
│   (Citizen Reporting Flow & Public Works Admin Dashboard) │
└─────────────────────────────┬─────────────────────────────┘
                              │ REST API (/api/*)
                              ▼
┌───────────────────────────────────────────────────────────┐
│                   Node.js Express Server                  │
│                     (Port 5000 / 3000)                    │
└──────┬──────────────────────┬──────────────────────┬──────┘
       │                      │                      │
       ▼                      ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  AI Service  │      │ SQLite DB    │      │ Uploads /    │
│  Gemini Live │      │ (sql.js Wasm │      │ Static Files │
│      OR      │      │ persistence) │      │              │
│  Mock Engine │      │              │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
```

---

## 📂 Project Structure

```
civiclens-ai/
├── package.json               # Root scripts (start, dev, client, build, install-all)
├── README.md                  # Comprehensive documentation & demo guide
├── server/
│   ├── package.json           # Express, cors, multer, dotenv, sql.js
│   ├── .env.example           # Example server environment configuration
│   ├── .env                   # Active environment file
│   ├── uploads/               # Stored uploaded hazard photos
│   └── src/
│       ├── server.js          # Express app entrypoint & SPA static server
│       ├── database/
│       │   ├── db.js          # SQLite wrapper with automatic disk persistence
│       │   ├── seedData.js    # Pre-seeded municipal reports for instant demo
│       ├── services/
│       │   └── aiService.js   # Isolated AI vision service (Gemini + Mock)
│       └── routes/
│           ├── reports.js     # CRUD endpoints: GET, POST, GET :id, PATCH status
│           ├── analyze.js     # AI Vision analysis endpoint: POST /api/analyze
│           └── stats.js       # Dashboard aggregate metrics: GET /api/stats
└── client/
    ├── package.json           # React 19, Vite 5, Lucide-React
    ├── vite.config.js         # Dev server with proxy to backend port 5000
    ├── index.html             # App entry HTML with civic-tech branding
    └── src/
        ├── main.jsx           # React root
        ├── App.jsx            # Main app router & layout
        ├── index.css          # Civic-tech design tokens, badges, scan animation
        ├── sampleData/
        │   └── demoImages.js  # 5 curated 1-click test photos for judges
        ├── services/
        │   └── api.js         # Frontend REST API client
        └── components/
            ├── Navbar.jsx          # Header with AI Mode indicator & mobile nav
            ├── Hero.jsx            # "See it. Report it. Fix it." hero section
            ├── HowItWorks.jsx      # 4-step municipal workflow walkthrough
            ├── ReportForm.jsx      # Image upload, GPS, AI scan, and submit form
            ├── AiAnalysisResult.jsx# AI classification card & confidence meter
            ├── Dashboard.jsx       # Operations dashboard coordinator
            ├── StatsCards.jsx      # Top 4 statistics cards
            ├── FilterBar.jsx       # Search, type/severity/status filters, views
            ├── ReportCard.jsx      # Visual card view for reports
            ├── ReportTable.jsx     # High-density table view
            ├── ReportModal.jsx     # Detailed view with Authority status switcher
            └── AiModeModal.jsx     # Live vs Mock AI switcher modal
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 1. Clone & Enter Project Directory
```bash
cd civiclens-ai
```

### 2. Install Dependencies
```bash
# Install both backend and frontend dependencies
npm run install-all
```

*(Alternatively: `cd server && npm install`, then `cd ../client && npm install`)*

### 3. Build Frontend & Start Unified Server
```bash
# Build the React frontend
npm run build

# Start the full-stack application
npm start
```

🎉 Open your browser at: **`http://localhost:5000`**

The server serves both the **REST API** and the **complete React frontend** from a single port!

---

## 💻 Development Mode (Optional)

If you wish to run the backend and frontend in separate development processes with Hot Module Replacement (HMR):

**Terminal 1 (Backend API):**
```bash
npm run server
# Runs Express on port 5000
```

**Terminal 2 (Frontend with Vite HMR):**
```bash
npm run client
# Runs Vite dev server on http://localhost:3000 (with proxy to 5000)
```

---

## 🤖 Configuring Real AI Vision (Google Gemini)

CivicLens AI works out-of-the-box in **Mock AI Mode** with zero configuration required.

To connect real Google Gemini Vision AI:

1. Obtain a free API key from [Google AI Studio](https://aistudio.google.com/).
2. Add your key to `server/.env`:
   ```env
   GEMINI_API_KEY=AIzaSyYourActualKeyHere
   AI_MODE=live
   ```
3. Restart the server (`npm start`).
4. Alternatively, click the **AI Engine pill** in the top-right corner of the web UI to switch between **Mock** and **Live** mode at runtime or input a temporary key!

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint |
| `POST` | `/api/analyze` | Uploads photo and returns AI classification JSON |
| `GET` | `/api/reports` | Returns list of reports (supports `issueType`, `severity`, `status`, `search`, `sortBy`) |
| `POST` | `/api/reports` | Creates a new infrastructure report with image & AI diagnostics |
| `GET` | `/api/reports/:id` | Returns single report details by ID |
| `PATCH`| `/api/reports/:id/status` | Updates report status (`Pending`, `Under Review`, `In Progress`, `Resolved`) |
| `GET` | `/api/stats` | Aggregated dashboard metrics (total, critical, pending, resolved) |
| `GET` | `/api/ai/status` | Current AI engine mode and capability info |
| `POST` | `/api/ai/config` | Update AI engine mode (`mock` or `live`) at runtime |
| `POST` | `/api/reports/reset-seed` | Restores default seed reports for clean re-demo |

### Sample AI Analysis Response (`POST /api/analyze`):
```json
{
  "issueType": "Pothole",
  "severity": "Critical",
  "confidence": 0.95,
  "explanation": "Severe deep asphalt depression exceeding 10cm depth located in primary vehicular transit lane. High risk of vehicle blowout or wheel detachment.",
  "recommendedAction": "Dispatch emergency road maintenance crew for immediate cold-patch repair and lane cone demarcation within 4 hours.",
  "aiModel": "CivicLens Vision Engine (Mock Mode)"
}
```

---

## 🏆 Hackathon Demo Walkthrough (2-Minute Script)

1. **Landing Page**:
   - Open `http://localhost:5000`.
   - Point out the branding: *"See it. Report it. Fix it."*
   - Scroll down to review the **4-step workflow** (Citizen Capture ➔ AI Vision ➔ Severity Scoring ➔ Authority Dispatch).
2. **Citizen Reporting Flow**:
   - Click **"Report an Issue"**.
   - Click one of the **Instant Demo Samples** (e.g. *Severe Traffic Pothole* or *Blocked Stormwater Drain*) or upload your own file.
   - Click **"Detect GPS"** to verify automatic coordinate geolocation.
   - Click **"Analyze Image with AI Vision"**.
   - Notice the AI radar scanning animation and the generated diagnostics:
     - Issue type tag (`Pothole`)
     - Severity badge (`Critical`)
     - Confidence meter (`95%`)
     - AI Engineering Explanation
     - Recommended Municipal Action
   - Click **"Submit Official Infrastructure Report"**.
   - Verify the tracking ID confirmation screen.
3. **Operations Dashboard**:
   - Click **"View in Live Dashboard"**.
   - Note the top statistics cards: Total Reports, Critical Issues, Pending, and Resolved.
   - Filter by **Severity: Critical** or **Issue Type: Pothole**.
   - Toggle between **Cards Grid** and **Table** view.
   - Click **"View Details"** on any report to open the full inspection modal.
   - Change the status from **Pending** ➔ **In Progress** ➔ **Resolved**.
   - Close modal and watch the status pill and dashboard statistics update in real-time!
4. **AI Engine Configuration**:
   - Click the AI pill badge in the navigation bar to demonstrate the **Mock AI / Live Gemini AI** toggle.

---

## 🛡️ License

MIT License. Designed and built for Hackathon Demonstration.
