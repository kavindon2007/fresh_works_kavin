# LoopCraft — 3-Minute Demo Video Guide & Script

**Event:** ExaThon India 2026 (Exasol Open Build Challenge)  
**Submission Requirement:** Short demo video, three minutes maximum (180 seconds)  
**Live Application URL:** [fresh-works-kavin.vercel.app](https://fresh-works-kavin.vercel.app)  

---

## Video Outline & Timing Breakdown

| Time Window | Section | On-Screen Action | Key Talking Point |
|---|---|---|---|
| **0:00 – 0:30** (30s) | Problem & Hook | Landing view of LoopCraft Dashboard | "Every day, thousands of automated support conversations fail with thumbs-down feedback—and those signals get thrown away into a data black hole." |
| **0:30 – 1:00** (30s) | The Architecture & Exasol | Show Exasol Telemetry Pill & Architecture Diagram | "Powered by Exasol Personal's in-memory columnar engine, LoopCraft captures these signals in real time, querying across 50,000+ interactions in under 5 milliseconds." |
| **1:00 – 2:00** (60s) | Interactive Demo Walkthrough | Click **"▶ Start Demo"** button on the UI | Walk through the 5-step automated closed loop: (1) Thumbs-down caught -> (2) Root cause classified -> (3) Corrected article drafted -> (4) Voice brief -> (5) 1-click publishing. |
| **2:00 – 2:30** (30s) | Multimodal Voice & KB Health | Click **"🔊 Listen to Brief"**, open KB Health drawer | "Admins can listen to an AI-generated spoken brief hands-free. In the KB Health panel, Exasol continuously audits article deflection decay." |
| **2:30 – 3:00** (30s) | Impact, ExaThon Fit & Wrap-up | Show Deflection Recovery metric (+44.3%) and GitHub repo | "With LoopCraft and Exasol Personal, support teams restore deflection rates from 23% to 67% in minutes. Open source, reproducible, and ready to deploy." |

---

## Detailed Minute-by-Minute Script

### [0:00 – 0:30] Introduction & Problem Hook
- **Visual:** Open browser on the LoopCraft Feedback Loops dashboard.
- **Narration:**
  > *"Hello ExaThon judges. In customer support and IT operations, AI deflection agents handle millions of employee queries. But what happens when an AI gives the wrong answer and the user clicks thumbs down? In almost every enterprise, that negative feedback is silently discarded into transactional ticket silos.*
  >
  > *Knowledge articles go stale, support costs soar, and teams have no way to perform real-time analytical reasoning over high-velocity conversation streams."*

### [0:30 – 1:00] The Solution & Exasol In-Memory Engine
- **Visual:** Point to the top telemetry banner: `Exasol Personal In-Memory: Active | 4.2ms query latency | 50,000+ interactions scanned`.
- **Narration:**
  > *"Enter LoopCraft: a closed-loop AI support optimization engine built on Exasol Personal. By leveraging Exasol's in-memory columnar speed, LoopCraft scans through 50,000 conversational logs in under 5 milliseconds, clustering failure patterns and continuously auditing knowledge base health."*

### [1:00 – 2:00] Core Demo: The 5-Step Closed Loop
- **Visual:** Click the blue **"▶ Start Demo"** button at the top right of the dashboard.
- **Narration:**
  > *"Let's see it in action. I'll click 'Start Demo' to run our end-to-end loop.*
  >
  > *1. **Step 1:** An employee gives a thumbs down because the AI recommended Cisco AnyConnect VPN—which the company deprecated last month.*
  >
  > *2. **Step 2:** Our Failure Classifier Agent immediately analyzes the interaction telemetry and tags it as a 'STALE ARTICLE' failure.*
  >
  > *3. **Step 3:** Instead of waiting for a human writer, our KB Author Agent mines recently resolved support tickets where human engineers explained the new Palo Alto GlobalProtect setup, and automatically drafts an updated article.*
  >
  > *4. **Step 4:** The Correction Brief Agent packages the root cause, diagnosis, and side-by-side comparison into the admin triage queue."*

### [2:00 – 2:30] Multimodal Voice Briefing & KB Health
- **Visual:** Click **"🔊 Listen to Brief"**. Let the voice audio play for 5 seconds. Then click **"KB Health Audit"** on the right side.
- **Narration:**
  > *"Notice the 'Listen to Brief' button. Admins handling high-volume incidents can listen to a spoken summary without switching visual focus.*
  >
  > *Now look at the KB Health drawer on the right: Exasol runs continuous columnar aggregations across all articles, identifying that Article KB-104 had a critical deflection drop down to 23%. With one click, the admin approves the update."*

### [2:30 – 3:00] Outcome, Exasol Benchmark & Conclusion
- **Visual:** Show the green success toast: `Published to Knowledge Base ✓ Deflection jumped to 67.4%`. Switch briefly to GitHub repo / terminal showing `docker-compose up -d`.
- **Narration:**
  > *"Instantly, the article is published! Agent deflection on VPN queries jumps from 23% to 67.4%, saving hundreds of escalation hours.
  >
  > LoopCraft provides complete Docker Compose files for Exasol Personal, full SQL schemas, benchmark scripts, a complete pitch deck, and is licensed under MIT. Thank you for your consideration for ExaThon India 2026!"*

---

## Recording Tips for Submitting
1. **Resolution:** 1080p (1920x1080) at full screen browser zoom (100% or 110%).
2. **Audio:** Ensure clear microphone input without background noise.
3. **Platform:** Upload video to YouTube (Unlisted), Loom, or Google Drive (Ensure link sharing is set to "Anyone with the link can view").
4. **Length:** Exactly under 3:00 (e.g. 2 minutes 45 seconds).
