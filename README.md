# CropGuard AI: Micro-Climatic Crop Disease Early Warning System

An end-to-end, production-grade agricultural health platform that diagnoses foliar crop diseases via raw image analysis, dynamically fuses hyper-local micro-climatic environmental vectors (temperature, relative humidity, leaf wetness duration, wind speed), and calculates calibrated intervention viability metrics to eliminate false chemical alarms.

Deployed on **Replit** with **Node.js/Express**, **PostgreSQL**, **React (Vite)**, **Tailwind CSS**, **Recharts**, and **Gemini 2.5 Flash** (`@google/genai` SDK).

---

## 🌟 Key Features

1. **Multimodal Visual Diagnostics:**
   - Ingests raw foliar imagery (camera capture or upload) of Solanaceae, Cereals, Viticulture, and Legumes.
   - Evaluates visual lesion patterns using Gemini 2.5 Flash with structured JSON schema output and diagnostic confidence scoring.

2. **Micro-Climatic Risk Fusion Engine:**
   - Evaluates non-linear sporulation pressure by fusing:
     - Ambient Temperature ($T$) against pathogen thermal performance curves.
     - Relative Humidity ($RH > 85\%$ threshold for exponential spore germination).
     - Continuous Leaf Wetness Duration ($LW > 6\text{h}$ critical trigger).
     - Convective Wind Speed for airborne spore dissemination.

3. **Calibrated Intervention Viability (Zero False Chemical Alarms):**
   - **Low Risk (< 40%):** Routine monitoring only. Chemical sprays are gated and suppressed when ambient conditions are dry ($RH < 68\%$ and $LW < 3.5\text{h}$), even if old foliar lesions are visible, treating them as dormant and preventing unnecessary pesticide runoff!
   - **Moderate Risk (40–70%):** Preventive biological fungicide application window (within 48 hours).
   - **High Risk (> 70%):** Immediate targeted systemic treatment; high sporulation alert with exact hourly spray windows.

4. **Predictive Epidemic Spread Modeling:**
   - Differential logistic disease transmission model projecting 7-, 14-, and 30-day epidemic trajectories comparing *Unmanaged Spread*, *Delayed Calendar Treatment*, and *Calibrated Early Warning Intervention*.

5. **Field Plot Management & Analytics:**
   - Full CRUD management of farm plots, geographic coordinates, and soil/crop profiles.
   - Historical analytics correlating seasonal humidity spikes with pathogen outbreaks.

---

## 🏗️ Architecture & Technology Stack

- **AI Engine:** Google GenAI SDK (`@google/genai`) using `gemini-2.5-flash` with structured JSON output and agronomic fallback heuristics.
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React icons, Recharts data visualization.
- **Backend:** Node.js, Express.js RESTful API, Multer multipart handling, Zod runtime validation.
- **Database:** PostgreSQL (`pg` connection pool) with automatic schema synchronization and resilient in-memory fallback.

---

## 📁 Repository Structure

```text
crop-guard-ai/
├── client/                     # React Frontend
│   ├── public/samples/         # Benchmark leaf specimen images
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── DiagnosticStudio.jsx
│   │   │   ├── RiskFusionChart.jsx
│   │   │   ├── EpidemicSimulationChart.jsx
│   │   │   ├── AdvisoryCard.jsx
│   │   │   ├── FieldTable.jsx
│   │   │   └── WeatherSensorBadge.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DiagnosticStudioPage.jsx
│   │   │   ├── AdvisoryDetailPage.jsx
│   │   │   ├── FieldsPage.jsx
│   │   │   └── AnalyticsPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                     # Express Backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── diagnosticsController.js
│   │   ├── fieldsController.js
│   │   ├── advisoriesController.js
│   │   └── analyticsController.js
│   ├── routes/
│   │   ├── diagnostics.js
│   │   ├── fields.js
│   │   ├── advisories.js
│   │   └── analytics.js
│   ├── services/
│   │   ├── geminiService.js
│   │   └── riskEngineService.js
│   ├── schemas/
│   │   └── validation.js
│   ├── db/
│   │   ├── schema.sql
│   │   └── seed.js
│   ├── db.js
│   └── index.js
├── .env.example
├── .replit
├── replit.nix
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your configuration variables:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/crop_db
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

> **Note:** If `DATABASE_URL` is omitted, the system automatically uses its resilient built-in storage engine with instant data persistence, allowing immediate local evaluation without requiring a running PostgreSQL server.
> If `GEMINI_API_KEY` is omitted, the built-in plant pathology heuristic engine automatically runs verified agronomic diagnoses across all crops.

### 2. Install Dependencies

```bash
npm install
cd client && npm install && cd ..
```

### 3. Run Development Server

```bash
npm run dev
```

- Backend server: `http://localhost:5000`
- Frontend client: `http://localhost:5173` (with reverse proxy to `:5000`)

### 4. Deploying on Replit

The repository contains `.replit` and `replit.nix` configurations ready for deployment on Replit.
1. Import repository to Replit.
2. In the Replit Secrets tab, add `GEMINI_API_KEY`.
3. Press **Run** — Replit executes `npm run dev` and provisions the port automatically.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/diagnostics` | Uploads foliar image, evaluates Gemini AI diagnosis, fuses micro-climate, returns advisory ID |
| `GET` | `/api/fields` | Retrieves all registered farm plots with latest pathology status and weather |
| `POST` | `/api/fields` | Registers a new farm plot with coordinates and crop profile |
| `DELETE` | `/api/fields/:id` | Deletes a farm plot |
| `GET` | `/api/advisories` | Retrieves historical advisory logs |
| `GET` | `/api/advisories/:id` | Returns complete advisory, diagnostic image, diurnal risk fusion curve, and epidemic simulation |
| `GET` | `/api/analytics/epidemic` | Returns historical correlation between humidity spikes and outbreaks |
| `GET` | `/api/health` | System health check and engine status |
