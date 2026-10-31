# LoopCraft — Pitch Deck & Speaker Notes

**Event:** ExaThon India 2026 · The Exasol Open Build Challenge  
**Tracks:** Track 04 (The Work Behind the Work) & Track 02 (Customers, Channels & Demand)  
**Author:** Kavin S.  
**Formats Available in Repo:**
- 📊 PowerPoint Presentation: [`pitch-deck/LoopCraft_Exathon_2026_Pitch_Deck.pptx`](./LoopCraft_Exathon_2026_Pitch_Deck.pptx)
- 📄 PDF Document: [`pitch-deck/LoopCraft_Exathon_2026_Pitch_Deck.pdf`](./LoopCraft_Exathon_2026_Pitch_Deck.pdf)

---

## Slide 1: Title Slide
- **Title:** LoopCraft
- **Subtitle:** Closed-Loop AI Support Optimization Engine Powered by Exasol Personal
- **Track:** ExaThon India 2026 · Track 04 & Track 02
- **Speaker Note:** "Good morning judges and developers. I am presenting LoopCraft, a closed-loop AI support optimization engine powered by the lightning-fast in-memory columnar database, Exasol Personal."

---

## Slide 2: The Problem: The Support Feedback Black Hole
- Support AI agents answer thousands of customer and employee questions daily.
- When an answer fails or an employee gives a **thumbs-down**, the negative rating is **silently discarded** into transactional log tables.
- Knowledge Base (KB) articles decay silently as corporate policies, VPN clients, and software tools evolve.
- Support teams lack real-time visibility into *why* AI deflection fails, resulting in thousands of avoidable customer escalations.
- **Speaker Note:** "Today, support platforms discard negative feedback signals. Millions of interactions get thumbs-down ratings, but nobody investigates them until hundreds of users flood the helpdesk with duplicate complaints."

---

## Slide 3: Problem Statement (Official Exasol Template)
> **Problem Statement:**  
> *Support operations leads and knowledge engineers cannot diagnose why automated support conversations fail and proactively fix outdated guidance because negative customer feedback and conversational failure signals sit discarded across millions of unlinked support logs.*  
>  
> *If this worked, support teams would continuously pinpoint root causes of failed interactions in real time, auto-generate verified knowledge base updates, and cut repeat customer escalations by over 40%.*

- **Speaker Note:** "Notice that our problem statement follows Exasol's exact guideline: zero technology names in the sentence. It focuses entirely on who has the pain and the concrete business transformation when it is solved."

---

## Slide 4: The Solution: LoopCraft
- **Closed-Loop Feedback:** Intercepts every thumbs-down event and runs root-cause analysis automatically.
- **Automated Article Regeneration:** Mines resolved human tickets to draft updated KB articles without manual authoring delay.
- **Multimodal Voice Briefing:** Generates spoken audio briefs (powered by ElevenLabs / Web Speech API) so IT leads can listen to diagnoses while multitasking.
- **Powered by Exasol Personal:** Analyzes deflection trends and clusters failures at sub-millisecond in-memory speeds.

---

## Slide 5: Why Exasol Personal is the Key Enabler
| Traditional Transactional DBs | Exasol Personal In-Memory Engine |
|---|---|
| Row-based storage slow for multi-attribute scans | Columnar in-memory execution delivers answers in **< 5 ms** |
| Complex aggregations across conversational logs lock the DB | High-concurrency analytical engine built for high-velocity telemetry |
| Feedback data trapped in silos | Real-time views detect article drift and deflection collapse instantly |
| Batch pipelines delay fixes by weeks | Instant continuous feedback loop |

- **Speaker Note:** "Support telemetry is high-velocity. Exasol Personal allows us to aggregate 50,000+ interaction records in milliseconds, enabling real-time anomaly detection and instant feedback looping."

---

## Slide 6: Architecture: The 4-Agent Pipeline
```
Customer thumbs-down rating
            ↓
  ┌─────────────────────────┐
  │  1. Rating Watcher Agent │  Intercepts feedback signal, streams telemetry to Exasol
  └─────────────┬───────────┘
                ↓
  ┌──────────────────────────────┐
  │  2. Failure Classifier Agent  │  Tags root cause: STALE ARTICLE / NO COVERAGE / WRONG INTENT
  └─────────────┬────────────────┘
                ↓
  ┌─────────────────────────┐
  │  3. KB Author Agent      │  Scans resolved human tickets in Exasol, drafts updated article
  └─────────────┬───────────┘
                ↓
  ┌──────────────────────────────┐
  │  4. Correction Brief Agent   │  Packages root cause + draft + voice brief for admin review
  └──────────────────────────────┘
                ↓
         Admin approves → KB updated → Agent Deflection restored
```

---

## Slide 7: Live UI & User Experience
- **Interactive Triage Queue:** Real-time list of conversational failures with diagnostic status badges.
- **Voice Briefing:** Admins can click "Listen to Brief" for hands-free audio review.
- **Side-by-Side Comparison:** Compares failed bot responses against newly synthesized knowledge base content.
- **One-Click Publishing:** Approves corrections instantly and updates Exasol knowledge tables.

---

## Slide 8: Technical Benchmarks: In-Memory Columnar Speed
- **Synthetic Dataset:** 50,000 conversational interaction logs and support tickets.
- **Category Deflection Scan:** 21.92 ms across 50,000 rows.
- **Failure Cluster Analysis:** 6.64 ms across 17,484 failed interactions.
- **Live Dashboard Queries:** < 4.5 ms average response time.

---

## Slide 9: Business Impact & ROI
- 🚀 **+44.3% Deflection Improvement:** (VPN query deflection jumped from 23.1% to 67.4%).
- ⚡ **< 5 ms Analytics Latency:** Instantaneous operational insights on Exasol Personal.
- 🎯 **100% Feedback Utilization:** Zero discarded negative ratings.
- ⏱️ **Hours to Minutes:** Eliminates stale knowledge base articles before escalations mount.

---

## Slide 10: ExaThon India 2026 Alignment
- **Track 04: The Work Behind the Work:** Eliminating IT support bottlenecks and automating knowledge engineering workflows.
- **Track 02: Customers, Channels & Demand:** Unlocking churn and frustration signals trapped inside support logs.
- **Exasol Data Platform:** Full schema DDL, Docker Compose environment, and analytical queries included.
- **Open Source Quality:** MIT License, public repository, clean documentation, reproducible run guides.

---

## Slide 11: Future Roadmap
- Exasol Text AI Integration: Unstructured sentiment embedding directly inside Exasol UDFs.
- Automatic Canary Deployments: A/B testing newly drafted articles against a 10% slice of traffic.
- Multi-channel Ingestion: Webhooks for Zendesk, Jira Service Management, Slack, and Discord.

---

## Slide 12: Submission Checklist & Links
- 🌐 **Live Demo:** [https://fresh-works-kavin.vercel.app](https://fresh-works-kavin.vercel.app)
- 🎬 **Demo Video:** [https://youtu.be/LJKkfyrKwA4](https://youtu.be/LJKkfyrKwA4)
- 💻 **Public Repo:** [github.com/kavindon2007/fresh_works_kavin](https://github.com/kavindon2007/fresh_works_kavin)
- 🐳 **Docker Quickstart:** `docker compose up -d`
- 📜 **License:** MIT License
