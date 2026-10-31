# ExaThon India 2026 — Problem Statement

**Event:** ExaThon India 2026: The Exasol Open Build Challenge  
**Tracks:** Track 04: The Work Behind the Work · Track 02: Customers, Channels & Demand  
**Project:** LoopCraft  
**Participant:** Kavin S.  

---

## The Problem Statement

Following the official Exasol Problem Statement guideline:
> *"[Who] can't [do what] because [why today's approach fails]. If this worked, [what changes for them]."*  
> *(Rule: No technology names in the sentence).*

### Statement:

> **Support operations leads and knowledge engineers cannot diagnose why automated support conversations fail and proactively fix outdated guidance because negative customer feedback and conversational failure signals sit discarded across millions of unlinked support logs.**
>
> **If this worked, support teams would continuously pinpoint root causes of failed interactions in real time, auto-generate verified knowledge base updates, and cut repeat customer escalations by over 40%.**

---

## Who Has the Problem?

1. **IT and Customer Support Operations Leads:**
   They manage AI agents and frontline support desks. When an automated agent provides incorrect or misleading answers, end-users click thumbs-down or abandon the chat in frustration. These leads have no unified, high-speed way to surface *why* deflection failed across thousands of daily conversations.

2. **Knowledge Base Authors & Product Content Teams:**
   Documentation and support guides decay over time as products, tools, and company policies change (e.g., VPN migrations, portal updates, license changes). Authors only find out an article is broken weeks later when tickets suddenly spike.

3. **Frontline Support Engineers:**
   Engineers spend hours answering the exact same repetitive tickets caused by outdated self-service articles.

---

## Why Does It Matter?

- **The Feedback Black Hole:** More than 70% of negative feedback ratings (thumbs-down) in customer support are never investigated because transactional ticketing databases lack the analytical performance to index, cluster, and correlate unstructured feedback at scale.
- **Support Cost Escalation:** Each deflected customer inquiry costs fractions of a cent; each human escalation costs between $15 and $35. When an outdated KB article causes deflection to collapse (e.g., from 67% down to 23%), support costs explode.
- **Customer Frustration & Churn:** When users repeatedly receive obsolete answers from an automated assistant, trust in the self-service portal evaporates.

---

## How Exasol Personal Solves It

Exasol Personal provides the high-performance in-memory columnar database that transforms this transactional feedback black hole into an actionable, real-time closed loop:

1. **In-Memory Analytical Scans:** Aggregates tens of thousands of support interaction telemetry logs and thumbs-down signals in sub-millisecond execution times.
2. **Deflection Anomaly Detection:** Instantly flags KB articles with anomalous negative ratings or declining deflection rates.
3. **Automated Synthesis:** Correlates failed interactions with resolved support tickets to draft corrected articles.
4. **Instant Actionability:** Powers the LoopCraft supervisor dashboard with real-time analytics so knowledge teams can review, listen to voice summaries, and publish fixes with one click.
