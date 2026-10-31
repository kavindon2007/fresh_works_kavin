# LoopCraft — Closed-Loop AI Support Optimization Engine

> Built for **ExaThon India 2026: The Exasol Open Build Challenge**  
> **Tracks:** Track 04 — The Work Behind the Work · Track 02 — Customers, Channels & Demand  
> **Core Data Platform:** [Exasol Personal](https://www.exasol.com/products/exasol-personal/) (High-Performance In-Memory Columnar Database)  
> **License:** [MIT License](./LICENSE)  

---

## 🎯 Executive Summary & Problem Statement

### The Problem
Automated customer support assistants handle millions of conversations across modern enterprises. However, when an assistant fails—recommending a deprecated tool, misunderstanding intent, or providing outdated guidance—users click **thumbs-down** or abandon the session in frustration.

In almost every organization, this negative feedback signal is **silently discarded** into transactional ticketing tables. Support leads and knowledge engineers have no fast, unified analytical mechanism to reason across tens of thousands of conversations to pinpoint *why* the interaction failed or which knowledge articles are drifting out of date. Consequently, Knowledge Base (KB) articles decay silently, deflection rates collapse, and frontline human agents are overwhelmed by repeat escalations.

### Problem Statement (Exasol Template)
> **"Support operations leads and knowledge engineers cannot diagnose why automated support conversations fail and proactively fix outdated guidance because negative customer feedback and conversational failure signals sit discarded across millions of unlinked support logs.**
>
> **If this worked, support teams would continuously pinpoint root causes of failed interactions in real time, auto-generate verified knowledge base updates, and cut repeat customer escalations by over 40%."**

---

## ⚡ Why Exasol Personal is the Key Enabler

Support feedback telemetry is **high-velocity, semi-structured, and voluminous**. Traditional row-oriented transactional databases (OLTP) choke when performing multi-dimensional scans and text aggregations over millions of interaction records.

| Challenge | Traditional Relational / OLTP DB | Exasol Personal In-Memory Engine |
|---|---|---|
| **Query Latency** | Multi-second aggregations; locks tables | **< 5 ms sub-millisecond in-memory columnar execution** |
| **Telemetry Ingestion** | Batch ETL jobs run once a day | Real-time continuous streaming of conversational events |
| **Failure Clustering** | Complex SQL window functions timeout | Instant dynamic categorization (`STALE ARTICLE`, `NO COVERAGE`, `WRONG INTENT`) |
| **KB Health Auditing** | Manual spreadsheets and retrospective surveys | Real-time analytical views computing deflection decay and drift anomalies |

Exasol Personal's in-memory columnar engine enables LoopCraft to continuously monitor conversational telemetry, calculate real-time deflection recovery (e.g., jumping from **23.1% to 67.4%**), and provide immediate operational triage for knowledge engineers.

---

## 📦 Submission Deliverables & Links

All mandatory ExaThon 2026 deliverables are included in this public repository:

| Deliverable | Repository Asset / Link |
|---|---|
| **Problem Statement** | [docs/PROBLEM_STATEMENT.md](./docs/PROBLEM_STATEMENT.md) (Formal Exasol format) |
| **Public Code Repository** | [github.com/kavindon2007/fresh_works_kavin](https://github.com/kavindon2007/fresh_works_kavin) |
| **Pitch Deck (PowerPoint PPTX)** | [pitch-deck/LoopCraft_Exathon_2026_Pitch_Deck.pptx](./pitch-deck/LoopCraft_Exathon_2026_Pitch_Deck.pptx) |
| **Pitch Deck (PDF)** | [pitch-deck/LoopCraft_Exathon_2026_Pitch_Deck.pdf](./pitch-deck/LoopCraft_Exathon_2026_Pitch_Deck.pdf) |
| **Pitch Deck Slide Script & Notes** | [pitch-deck/PITCH_DECK.md](./pitch-deck/PITCH_DECK.md) |
| **3-Minute Demo Video Guide** | [docs/DEMO_VIDEO_SCRIPT.md](./docs/DEMO_VIDEO_SCRIPT.md) |
| **Live Interactive Web Demo** | 🔗 **[fresh-works-kavin.vercel.app](https://fresh-works-kavin.vercel.app)** |
| **Deployment & Run Guide** | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| **License (OSI-approved)** | [LICENSE](./LICENSE) (MIT License) |
| **Exasol SQL Schemas & Views** | [exasol/init_schema.sql](./exasol/init_schema.sql) & [exasol/sample_queries.sql](./exasol/sample_queries.sql) |
| **Docker Compose for Exasol** | [docker-compose.yml](./docker-compose.yml) |

---

## 🏛️ System Architecture: The 4-Agent Closed Loop

```
Customer / Employee thumbs-down rating
            ↓
  ┌────────────────────────────────────────────────────────┐
  │  1. Rating Watcher Agent                               │
  │  Intercepts negative rating, streams event to Exasol   │
  └───────────────────────────┬────────────────────────────┘
                              ↓
  ┌────────────────────────────────────────────────────────┐
  │  2. Failure Classifier Agent                            │
  │  Exasol in-memory analytics classify failure type:     │
  │  STALE ARTICLE (58%) · NO COVERAGE (26%) · INTENT (16%)│
  └───────────────────────────┬────────────────────────────┘
                              ↓
  ┌────────────────────────────────────────────────────────┐
  │  3. KB Author Agent                                    │
  │  Mines resolved human tickets in Exasol, auto-drafts   │
  │  the corrected knowledge base article                  │
  └───────────────────────────┬────────────────────────────┘
                              ↓
  ┌────────────────────────────────────────────────────────┐
  │  4. Correction Brief Agent                             │
  │  Packages root-cause brief + voice summary into        │
  │  admin triage queue for 1-click publishing             │
  └───────────────────────────┬────────────────────────────┘
                              ↓
     Admin Approves → KB Updated in Exasol → Deflection Jumps 23% → 67%
```

---

## 🔊 Multimodal Voice Briefing (ElevenLabs Integration)

IT administrators managing high ticket volumes often review correction briefs across multiple browser tabs while simultaneously handling active incidents. LoopCraft integrates text-to-speech audio briefs:

- **Hands-Free Ambient Triage:** Admins can click **"🔊 Listen to Brief"** to hear the diagnosed failure, root cause, and proposed KB fix spoken aloud.
- **Next.js Server Proxy:** Routes securely via `app/api/speak/route.ts` to ElevenLabs API without exposing client keys.
- **Graceful Client Fallback:** If an ElevenLabs API key is not configured, the app seamlessly falls back to the native browser Web Speech synthesis API, guaranteeing uninterrupted evaluation.

---

## 📊 Exasol In-Memory Columnar Benchmarks

A synthetic dataset generator ([scripts/simulate_workload.py](./scripts/simulate_workload.py)) simulates 50,000 conversational feedback events and benchmarks in-memory query latencies:

```bash
python3 scripts/simulate_workload.py
```

### Benchmark Results:
- **Dataset Size:** 50,000 conversational telemetry records (public/synthetic data only, no proprietary employer data).
- **Category Deflection Aggregation:** `21.92 ms` across 50,000 rows.
- **Root Cause Failure Clustering:** `6.64 ms` across 17,484 failed interactions.
- **Dashboard Telemetry Widget Latency:** `< 4.5 ms` average response time.

---

## 🛠️ Quickstart: Running Locally

### 1. Clone & Install
```bash
git clone https://github.com/kavindon2007/fresh_works_kavin.git
cd fresh_works_kavin
npm install
```

### 2. (Optional) Run Exasol Personal in Docker
```bash
docker compose up -d
```
*Connects on port 8563 with user `sys` and password `exasol`. Schema `LOOPCRAFT_ANALYTICS` is automatically initialized.*

### 3. Start the Next.js Web App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

Click **"▶ Start Demo"** at the top right of the dashboard to trigger the full 5-step automated walkthrough!

---

## 🗂️ Project Structure

```
fresh_works_kavin/
├── app/
│   ├── layout.tsx              ← Root layout & Exasol metadata
│   ├── page.tsx                ← Interactive studio application
│   ├── globals.css             ← Design tokens & styling
│   └── api/
│       ├── analytics/route.ts  ← Exasol in-memory telemetry endpoint
│       └── speak/route.ts      ← ElevenLabs voice brief proxy
├── components/
│   ├── dashboard/
│   │   ├── FeedbackLoopsDashboard.tsx ← Main triage dashboard & demo runner
│   │   └── KBHealthPanel.tsx          ← Exasol KB audit right drawer
│   └── layout/
│       ├── GlobalNav.tsx       ← Exasol navigation bar
│       ├── AgentMenu.tsx       ← Studio settings & query console menu
│       └── MainCanvas.tsx      ← Tab view router
├── exasol/
│   ├── init_schema.sql         ← Exasol Personal DDL & analytical views
│   └── sample_queries.sql      ← Benchmark queries & window functions
├── lib/
│   ├── exasol.ts               ← In-memory database connector & telemetry
│   └── utils.ts                ← Styling utilities
├── pitch-deck/
│   ├── LoopCraft_Exathon_2026_Pitch_Deck.pptx ← Presentation slides
│   ├── LoopCraft_Exathon_2026_Pitch_Deck.pdf  ← Presentation PDF
│   └── PITCH_DECK.md                          ← Speaker script & notes
├── docs/
│   ├── PROBLEM_STATEMENT.md    ← Official Exasol problem statement
│   └── DEMO_VIDEO_SCRIPT.md    ← 3-minute video guide & script
├── scripts/
│   ├── simulate_workload.py    ← 50k row benchmark simulator
│   └── generate_pitch_deck.py  ← PPTX & PDF generator script
├── docker-compose.yml          ← Official Exasol Personal container setup
├── DEPLOYMENT.md               ← Comprehensive run & cloud deployment guide
├── LICENSE                     ← MIT License
└── README.md                   ← Project documentation
```

---

## 🏆 ExaThon India 2026 Evaluation Alignment

- **Innovation & Problem Impact (25%):** Converts discarded negative support feedback into automatic knowledge base repairs, stopping repeat escalations at the root.
- **Effective use of Exasol Personal (25%):** Leverages Exasol's in-memory columnar engine for high-velocity telemetry ingestion, failure clustering, and deflection decay auditing.
- **Technical Excellence (20%):** Robust 4-agent closed loop pipeline, Next.js 14+ App Router, ElevenLabs voice integration, and automated Docker provisioning.
- **Solution Design & User Experience (15%):** Polished, enterprise-grade interface with side-by-side comparison, audio summaries, and 1-click approvals.
- **Documentation & Reproducibility (10%):** Complete run guides, problem statement, demo video script, benchmarks, and pitch deck.
- **Open-Source Quality (5%):** OSI-approved MIT License, clean git history, and 100% synthetic open datasets.

---

## 👤 Author & Team

- **Participant:** Kavin S.
- **Event:** ExaThon India 2026 — The Exasol Open Build Challenge
- **Contact:** [GitHub Profile](https://github.com/kavindon2007)
