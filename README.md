# LoopCraft — Freddy AI Closed-Loop Feedback Agent

> Built for **The Great Agent Hackathon** (Freshworks TGPF 2026) — Track 1: Customer & Employee Experience

---

## What it solves

| Problem | LoopCraft Solution |
|---|---|
| **Problem 1** — Freddy AI silently discards thumbs-down feedback | LoopCraft intercepts every negative rating, classifies the failure, and queues it for admin review |
| **Problem 4** — KB articles go stale, capping Freddy's deflection rate | LoopCraft audits article health, measures escalation rates, and auto-drafts corrected articles |

---

## Live Demo

🔗 **[loopcraft.vercel.app](https://loopcraft.vercel.app)** ← deployed on Vercel

Click **"▶ Start Demo"** on the Feedback Loops page to see the full 5-step automated walkthrough.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + Freshworks design tokens |
| Components | shadcn/ui (Button, Badge, Tooltip, ScrollArea, Separator) |
| Language | TypeScript |
| Hosting | Vercel |
| Icons | lucide-react |

---

## Run Locally

```bash
git clone https://github.com/kavindon2007/fresh_works_kavin
cd fresh_works_kavin
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  layout.tsx              ← root layout
  page.tsx                ← main page with tab state
  globals.css             ← Freshworks design tokens + utilities

components/
  layout/
    GlobalNav.tsx         ← 56px dark navy icon sidebar
    AgentMenu.tsx         ← 240px white agent settings nav
    MainCanvas.tsx        ← flex-1 content router
    PlaceholderView.tsx   ← empty state for non-demo tabs

  dashboard/
    FeedbackLoopsDashboard.tsx  ← HERO SCREEN
    KBHealthPanel.tsx           ← KB audit right drawer

  ui/                     ← shadcn-style components
    button.tsx
    badge.tsx
    tooltip.tsx
    separator.tsx
    scroll-area.tsx

lib/
  utils.ts                ← cn() helper
```

---

## Architecture: The 4-Agent Pipeline

```
Employee thumbs down Freddy's response
            ↓
  ┌─────────────────────────┐
  │  1. Rating Watcher Agent │  Intercepts thumbs-down via Freshworks webhook
  └─────────────┬───────────┘
                ↓
  ┌──────────────────────────────┐
  │  2. Failure Classifier Agent  │  Tags: STALE ARTICLE / NO COVERAGE / WRONG INTENT
  └─────────────┬────────────────┘
                ↓
  ┌─────────────────────────┐
  │  3. KB Author Agent      │  Searches resolved tickets, drafts corrected article
  └─────────────┬───────────┘
                ↓
  ┌──────────────────────────────┐
  │  4. Correction Brief Agent   │  Packages root cause + draft → Admin review queue
  └──────────────────────────────┘
                ↓
        Admin approves → KB updated → Freddy re-trained
```

> **Stage 1 (this submission):** Full UI prototype with hardcoded demo data, deployed on Vercel.  
> **Stage 2 (production):** Outbound MCP connection from Freshworks routes live thumbs-down events to the pipeline.

---

## Freshworks Integration Points

- **Freddy AI Agent** — lives in Freshservice Agent Studio, answers IT employee queries
- **Outbound MCP** — sends thumbs-down signal from Freshworks → LoopCraft pipeline (Stage 2)
- **KB API** — LoopCraft publishes approved articles back to Freshservice knowledge base
- **Ticket API** — LoopCraft reads resolved ticket resolution notes to draft corrections

---

## ElevenLabs Voice Integration *(Build Sponsor)*

> LoopCraft integrates the ElevenLabs text-to-speech API to deliver Correction Briefs
> as spoken audio directly inside the Freshservice Agent Studio interface.

### Use Case

IT admins managing high ticket volumes often review correction briefs across multiple
browser tabs while simultaneously handling live incidents. Voice playback lets them
**listen to the AI-generated brief and reason about it without switching visual focus**,
reducing the cognitive load of the approval workflow.

### Implementation

A Next.js server-side API route (`app/api/speak/route.ts`) securely proxies requests
to the ElevenLabs `v1/text-to-speech` endpoint using the **Rachel voice model**
(`stability: 0.6`, `similarity_boost: 0.8` for a calm, professional delivery).

Audio streams directly to the browser via the Web Audio API with no intermediary
file storage. The feature **degrades gracefully** — if voice is unavailable, the
core approval workflow is completely unaffected.

### Impact

Every time an admin clicks **"Listen to Brief"**, the system reads the diagnosed
failure, root cause, and proposed KB fix as a structured spoken summary — turning a
screen-bound review into an ambient, multitask-friendly workflow.

```
"Correction Brief for ticket T-4821.
 Employee query: How do I connect to VPN from home?
 Root cause: KB article references deprecated Cisco AnyConnect.
 Company migrated to Palo Alto GlobalProtect in March 2025.
 Proposed fix: Update the knowledge base article titled
 'Connecting to GlobalProtect VPN (Updated March 2025)'.
 Action required: Review the auto-drafted article and click Approve to publish."
```

### Flow

```
User clicks "Listen to Brief"
        ↓
POST /api/speak  { text: "<structured brief>" }          ← client
        ↓
Next.js server route validates + proxies to ElevenLabs   ← server (key never exposed)
        ↓
ElevenLabs API → Rachel voice · eleven_monolingual_v1
        ↓
audio/mpeg streamed back → HTMLAudioElement plays in browser
        ↓
Button: [Listen to Brief] → [● Generating…] → [■ Stop] → resets on end
```

### Setup

1. Get your API key at [elevenlabs.io](https://elevenlabs.io) → Profile → API Key
2. Copy `.env.local.example` to `.env.local`
3. Set `ELEVENLABS_API_KEY=your_key_here`
4. Restart the dev server — the **"🔊 Listen to Brief"** button appears on the Correction Brief panel

---

## Hackathon Submission

- **Track:** 1 — Customer & Employee Experience
- **Event:** The Great Agent Hackathon · Freshworks TGPF 2026
- **Team:** Kavin S.
