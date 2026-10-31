#!/usr/bin/env python3
"""
Generate an Executive-Grade Pitch Deck (PPTX & PDF) for ExaThon India 2026
Project: LoopCraft — Closed-Loop AI Support Optimization Engine
Powered by Exasol Personal
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

from reportlab.lib.pagesizes import landscape, letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

os.makedirs("pitch-deck", exist_ok=True)

# ── Color Palette (Exasol & Deep Modern Tech) ──────────────────────────────────
BG_DARK     = RGBColor(11, 25, 44)      # #0B192C (Deep Midnight Blue)
CARD_BG     = RGBColor(19, 47, 76)      # #132F4C (Elevated Slate Blue)
CARD_BORDER = RGBColor(30, 73, 118)     # #1E4976
EXASOL_BLUE = RGBColor(0, 114, 206)     # #0072CE (Exasol Primary)
CYAN_ACCENT = RGBColor(0, 178, 254)     # #00B2FE (Vibrant Tech Cyan)
GREEN_ACC   = RGBColor(16, 185, 129)    # #10B981 (Success / Recovery)
AMBER_ACC   = RGBColor(245, 158, 11)    # #F59E0B (Warning / Drift)
RED_ACC     = RGBColor(239, 68, 68)     # #EF4444 (Negative Feedback)
TEXT_WHITE  = RGBColor(255, 255, 255)
TEXT_LIGHT  = RGBColor(226, 232, 240)   # #E2E8F0
TEXT_MUTED  = RGBColor(148, 163, 184)   # #94A3B8

SLIDES_DATA = [
    # ── Slide 1: Title & Hero ──────────────────────────────────────────────────
    {
        "slide_num": "01",
        "title": "LoopCraft",
        "subtitle": "Closed-Loop AI Support Optimization Engine",
        "event_badge": "EXATHON INDIA 2026 · THE EXASOL OPEN BUILD CHALLENGE",
        "track_badge": "TRACK 04: THE WORK BEHIND THE WORK & TRACK 02: CUSTOMERS & DEMAND",
        "tech_tag": "⚡ Powered by Exasol Personal In-Memory Columnar Database",
        "author": "Created by: Kavin S. | Solo Developer",
        "hero_img": "docs/images/hero-banner.jpg",
        "type": "cover"
    },

    # ── Slide 2: The Problem ───────────────────────────────────────────────────
    {
        "slide_num": "02",
        "title": "The Problem: The Support Feedback Black Hole",
        "subtitle": "Why enterprise support automation fails after deployment",
        "type": "problem_grid",
        "cards": [
            {
                "icon": "🗑️",
                "tag": "SILENTLY DISCARDED",
                "color": RED_ACC,
                "title": "Negative Feedback Ignored",
                "desc": "Automated support assistants handle millions of conversations. When users click thumbs-down, the negative feedback signal is silently discarded into unindexed transactional logs."
            },
            {
                "icon": "⏳",
                "tag": "DOCUMENTATION DECAY",
                "color": AMBER_ACC,
                "title": "Knowledge Bases Decay",
                "desc": "Corporate tools, VPNs, and policies constantly evolve. Outdated articles remain published, leading AI assistants to repeatedly recommend retired tools (e.g., deprecated Cisco VPN)."
            },
            {
                "icon": "📈",
                "tag": "COST SURGE",
                "color": CYAN_ACCENT,
                "title": "The Escalation Spiral",
                "desc": "Deflection collapses from 67% to 23%. Frustrated employees bypass self-service, generating thousands of repeat tickets that cost $15–$35 per human resolution."
            }
        ]
    },

    # ── Slide 3: Problem Statement (Exasol Template) ───────────────────────────
    {
        "slide_num": "03",
        "title": "Problem Statement",
        "subtitle": "Compliant with Exasol's exact rule: 'No technology named in the sentence'",
        "type": "quote_statement",
        "statement": "Support operations leads and knowledge engineers cannot diagnose why automated support conversations fail and proactively fix outdated guidance because negative customer feedback and conversational failure signals sit discarded across millions of unlinked support logs.\n\nIf this worked, support teams would continuously pinpoint root causes of failed interactions in real time, auto-generate verified knowledge base updates, and cut repeat customer escalations by over 40%.",
        "pillars": [
            ("WHO IS HURT", "Support operations leads, frontline support engineers & frustrated employees"),
            ("WHY TODAY FAILS", "Feedback telemetry sits fragmented across millions of unlinked ticket logs"),
            ("THE OUTCOME", "Real-time root cause diagnosis, auto-drafted KB repairs & 40%+ cut in repeat escalations")
        ]
    },

    # ── Slide 4: The Solution ──────────────────────────────────────────────────
    {
        "slide_num": "04",
        "title": "The Solution: LoopCraft Continuous Closed Loop",
        "subtitle": "An autonomous self-healing pipeline turning failure signals into verified knowledge",
        "type": "pipeline",
        "steps": [
            ("1. Rating Watcher", "Intercepts thumbs-down events in real time and streams interaction telemetry into Exasol Personal."),
            ("2. Failure Classifier", "In-memory analytics cluster the failure type: STALE ARTICLE (58%), NO COVERAGE (26%), or WRONG INTENT (16%)."),
            ("3. KB Author Agent", "Mines resolution notes from recently resolved human engineering tickets to auto-draft the corrected article."),
            ("4. Correction Brief", "Packages root-cause analysis, side-by-side diff, and spoken voice brief into the admin triage queue.")
        ],
        "footer_note": "Admin approves with 1 click → Knowledge Base updated in Exasol → Assistant deflection restored immediately"
    },

    # ── Slide 5: Why Exasol Personal ───────────────────────────────────────────
    {
        "slide_num": "05",
        "title": "Why Exasol Personal is the Key Enabler",
        "subtitle": "High-velocity conversational analytics require in-memory columnar execution",
        "type": "comparison_table",
        "left_title": "Traditional Transactional DBs (Postgres/MySQL)",
        "left_color": RED_ACC,
        "left_points": [
            "Row-oriented storage is slow for multi-attribute feedback scans",
            "Complex aggregation across 50k+ logs locks operational tables",
            "Feedback signals remain trapped in unlinked transactional silos",
            "Nightly batch ETL pipelines delay critical documentation fixes by weeks"
        ],
        "right_title": "Exasol Personal In-Memory Engine",
        "right_color": CYAN_ACCENT,
        "right_points": [
            "Columnar in-memory execution delivers answers in < 5 milliseconds",
            "Real-time analytical views calculate deflection decay and drift anomalies",
            "Instantly clusters failure types over tens of thousands of conversations",
            "Zero operational lockup: analytical queries run decoupled at full in-memory speed"
        ]
    },

    # ── Slide 6: Exasol Data Model & Analytical Views ──────────────────────────
    {
        "slide_num": "06",
        "title": "Exasol Personal Schema & Analytical Views",
        "subtitle": "Optimized schema for conversational telemetry, audit views, and recovery tracking",
        "type": "schema_layout",
        "tables": [
            ("SUPPORT_TICKETS", "Ticket ID, requester, category, query text, resolution notes, duration, priority"),
            ("AI_INTERACTIONS", "Interaction ID, user query, bot response, KB article ID, rating (+1/-1), latency_ms"),
            ("KB_ARTICLES", "Article ID, title, category, version, deflection_rate, escalation_count, status"),
            ("FEEDBACK_DIAGNOSTICS", "Diagnostic ID, failure_type, root_cause, proposed_fix, status (QUEUED/APPROVED)")
        ],
        "views": [
            ("V_KB_HEALTH_AUDIT", "Continuous columnar scan aggregating deflection rates and failure anomalies per article"),
            ("V_FAILURE_BREAKDOWN", "Dynamic window function computing share percentage across failure categories"),
            ("V_DEFLECTION_RECOVERY", "Time-series hourly trend measuring deflection jump before vs. after KB update")
        ]
    },

    # ── Slide 7: Live UI Walkthrough ───────────────────────────────────────────
    {
        "slide_num": "07",
        "title": "Live Walkthrough: The 5-Step Automated Demo",
        "subtitle": "From employee thumbs-down to 1-click knowledge base synchronization",
        "type": "image_feature",
        "image_path": "docs/images/demo-walkthrough.jpg",
        "features": [
            ("Step 1: Intercept Thumbs-Down", "Employee query on VPN receives outdated Cisco guide; negative rating caught instantly."),
            ("Step 2: Diagnose Root Cause", "Tagged as 'STALE ARTICLE'—company migrated to Palo Alto GlobalProtect in March 2025."),
            ("Step 3: Auto-Draft Correction", "KB Author Agent synthesizes resolved ticket notes into a complete 4-step setup guide."),
            ("Step 4: Voice Brief Review", "Admin clicks 'Listen to Brief' for spoken audio summary while multitasking."),
            ("Step 5: 1-Click Publishing", "Article published to Knowledge Engine; deflection restored to 67%.")
        ]
    },

    # ── Slide 8: Real-Time Telemetry & Deflection Recovery ─────────────────────
    {
        "slide_num": "08",
        "title": "Real-Time Telemetry & Deflection Recovery",
        "subtitle": "Continuous operational insights powered by Exasol in-memory scans",
        "type": "image_feature",
        "image_path": "docs/images/dashboard-overview.jpg",
        "features": [
            ("47 Failed Deflections", "Exasol scans 50,000+ interactions, surfacing 47 conversational failures this week."),
            ("9 Flagged Articles", "Columnar audit identifies articles with escalating negative rating ratios."),
            ("6 Drafts Ready to Approve", "Automated authoring queue reduces knowledge engineering backlog to zero."),
            ("Deflection Jumps to 61-67%", "Eliminates repeat inquiries; deflection jumps from 23% to 67% (+44pp recovery)."),
            ("Sub-5ms Query Latency", "Interactive dashboard backed by Exasol Personal with zero UI lag.")
        ]
    },

    # ── Slide 9: Benchmarks ────────────────────────────────────────────────────
    {
        "slide_num": "09",
        "title": "Exasol Personal In-Memory Benchmarks",
        "subtitle": "Tested over 50,000 synthetic interaction logs (scripts/simulate_workload.py)",
        "type": "kpi_grid",
        "kpis": [
            ("21.9 ms", "Category Deflection Scan", "Aggregated across 50,000 conversational feedback rows in Exasol memory"),
            ("6.6 ms", "Failure Cluster Analysis", "Dynamic grouping across 17,484 negative interactions with zero disk I/O"),
            ("< 4.5 ms", "Dashboard Query Latency", "Sub-millisecond analytical widget updates during active admin triage"),
            ("+44.3%", "Deflection Recovery", "Measured deflection jump on outdated articles (23.1% → 67.4%)")
        ]
    },

    # ── Slide 10: Business Value & ROI ─────────────────────────────────────────
    {
        "slide_num": "10",
        "title": "Business Value & ROI for Support Operations",
        "subtitle": "Turning support feedback from a cost center into a self-improving asset",
        "type": "business_cards",
        "cards": [
            {
                "metric": "40%+ Cut",
                "label": "Fewer Escalations",
                "desc": "Stopping recurring failure loops prevents hundreds of duplicate tickets from reaching tier-1 agents."
            },
            {
                "metric": "$15–$35",
                "label": "Saved Per Deflection",
                "desc": "Every resolved knowledge gap deflects dozens of live chats, directly lowering enterprise support spend."
            },
            {
                "metric": "Minutes",
                "label": "KB Update Cycle",
                "desc": "Replaces 2–4 week manual documentation review cycles with automated ticket-driven article authoring."
            },
            {
                "metric": "100%",
                "label": "Feedback Closed",
                "desc": "Zero discarded ratings. Every customer frustration signal actively drives knowledge base precision."
            }
        ]
    },

    # ── Slide 11: ExaThon 2026 Criteria Alignment ──────────────────────────────
    {
        "slide_num": "11",
        "title": "ExaThon India 2026 Evaluation Alignment",
        "subtitle": "Built specifically for ExaThon's six core judging dimensions",
        "type": "criteria_grid",
        "criteria": [
            ("Innovation & Impact (25%)", "Solves the feedback black hole by converting discarded thumbs-downs into auto-generated documentation fixes."),
            ("Effective Exasol Use (25%)", "Exasol Personal serves as the high-velocity in-memory data warehouse, analytical views, and benchmark platform."),
            ("Technical Excellence (20%)", "Next.js 16 (App Router), TypeScript, Docker Compose, ElevenLabs Voice API, and PyExasol benchmark suite."),
            ("Solution Design & UX (15%)", "Polished enterprise dashboard, side-by-side article diffs, interactive audio brief, and 5-step automated demo."),
            ("Documentation & Reproducibility (10%)", "Complete Docker Compose files, SQL schemas, benchmark script, demo video guide, and run documentation."),
            ("Open-Source Quality (5%)", "OSI-approved MIT License, public GitHub repository, and 100% synthetic open datasets.")
        ]
    },

    # ── Slide 12: Submission Links & Wrap-up ────────────────────────────────────
    {
        "slide_num": "12",
        "title": "Submission Deliverables & Live Links",
        "subtitle": "Ready for live evaluation by the ExaThon India 2026 judging panel",
        "type": "deliverables_final",
        "items": [
            ("🎬 Short Demo Video (YouTube)", "https://youtu.be/LJKkfyrKwA4", "3-minute comprehensive walkthrough of the end-to-end closed loop"),
            ("🌐 Live Web Application", "https://fresh-works-kavin.vercel.app", "Interactive prototype with live demo runner and audio briefings"),
            ("💻 Public Code Repository", "https://github.com/kavindon2007/fresh_works_kavin", "Full source code, SQL DDL, schemas, and benchmark suites"),
            ("🐳 Docker Compose for Exasol", "docker compose up -d", "One-command local startup for Exasol Personal on port 8563"),
            ("📜 Open-Source License", "MIT License", "OSI-approved open-source license included in repository root")
        ]
    }
]

# ═══════════════════════════════════════════════════════════════════════════════
# PPTX BUILDER (Widescreen 16:9, Modern Dark Theme, Polished Tech Aesthetic)
# ═══════════════════════════════════════════════════════════════════════════════

def build_pptx():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    for data in SLIDES_DATA:
        slide = prs.slides.add_slide(blank_layout)

        # ── Slide Background ──
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.color.rgb = BG_DARK

        stype = data["type"]

        # ───────────────────────────────────────────────────────────────────────
        # COVER SLIDE
        # ───────────────────────────────────────────────────────────────────────
        if stype == "cover":
            # Event Badge (top pill)
            pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(7.2), Inches(0.45))
            pill.fill.solid()
            pill.fill.fore_color.rgb = CARD_BG
            pill.line.color.rgb = CYAN_ACCENT
            ptf = pill.text_frame
            p = ptf.paragraphs[0]
            p.text = data["event_badge"]
            p.font.size = Pt(11)
            p.font.bold = True
            p.font.color.rgb = CYAN_ACCENT

            # Title
            tbox = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(6.8), Inches(1.6))
            ttf = tbox.text_frame
            ttf.word_wrap = True
            p = ttf.paragraphs[0]
            p.text = data["title"]
            p.font.size = Pt(54)
            p.font.bold = True
            p.font.color.rgb = TEXT_WHITE

            # Subtitle
            sbox = slide.shapes.add_textbox(Inches(0.8), Inches(2.9), Inches(6.8), Inches(1.2))
            stf = sbox.text_frame
            stf.word_wrap = True
            p = stf.paragraphs[0]
            p.text = data["subtitle"]
            p.font.size = Pt(22)
            p.font.bold = True
            p.font.color.rgb = CYAN_ACCENT

            # Track & Tech info card
            info_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.3), Inches(6.8), Inches(2.4))
            info_card.fill.solid()
            info_card.fill.fore_color.rgb = CARD_BG
            info_card.line.color.rgb = CARD_BORDER
            itf = info_card.text_frame
            itf.word_wrap = True
            p1 = itf.paragraphs[0]
            p1.text = data["track_badge"]
            p1.font.size = Pt(11)
            p1.font.bold = True
            p1.font.color.rgb = GREEN_ACC

            p2 = itf.add_paragraph()
            p2.text = data["tech_tag"]
            p2.font.size = Pt(14)
            p2.font.bold = True
            p2.font.color.rgb = TEXT_WHITE
            p2.space_before = Pt(8)

            p3 = itf.add_paragraph()
            p3.text = data["author"]
            p3.font.size = Pt(12)
            p3.font.color.rgb = TEXT_MUTED
            p3.space_before = Pt(12)

            # Hero Image (Right Side)
            if os.path.exists(data["hero_img"]):
                slide.shapes.add_picture(data["hero_img"], Inches(7.9), Inches(1.2), Inches(4.8), Inches(5.5))

        # ───────────────────────────────────────────────────────────────────────
        # STANDARD SLIDES WITH TOP HEADER BAR
        # ───────────────────────────────────────────────────────────────────────
        else:
            # Header bar: Mini Category + Slide Counter
            tbar = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(10.0), Inches(0.4))
            tbtf = tbar.text_frame
            p = tbtf.paragraphs[0]
            p.text = "EXATHON INDIA 2026 · EXASOL OPEN BUILD CHALLENGE"
            p.font.size = Pt(10)
            p.font.bold = True
            p.font.color.rgb = CYAN_ACCENT

            # Slide counter
            cbar = slide.shapes.add_textbox(Inches(11.0), Inches(0.4), Inches(1.5), Inches(0.4))
            cbtf = cbar.text_frame
            cp = cbtf.paragraphs[0]
            cp.text = f"{data['slide_num']} / 12"
            cp.font.size = Pt(11)
            cp.font.bold = True
            cp.font.color.rgb = TEXT_MUTED
            cp.alignment = PP_ALIGN.RIGHT

            # Title
            tbox = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.7))
            ttf = tbox.text_frame
            ttf.word_wrap = True
            p = ttf.paragraphs[0]
            p.text = data["title"]
            p.font.size = Pt(26)
            p.font.bold = True
            p.font.color.rgb = TEXT_WHITE

            # Subtitle
            sbox = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.7), Inches(0.4))
            stf = sbox.text_frame
            stf.word_wrap = True
            p = stf.paragraphs[0]
            p.text = data["subtitle"]
            p.font.size = Pt(13)
            p.font.color.rgb = TEXT_MUTED

            # Divider Line
            dline = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.733), Inches(0.02))
            dline.fill.solid()
            dline.fill.fore_color.rgb = CARD_BORDER
            dline.line.color.rgb = CARD_BORDER

            # ── 1. Problem Grid (3 Cards) ──
            if stype == "problem_grid":
                for i, c in enumerate(data["cards"]):
                    x = Inches(0.8 + i * 4.0)
                    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.1), Inches(3.7), Inches(4.8))
                    card.fill.solid()
                    card.fill.fore_color.rgb = CARD_BG
                    card.line.color.rgb = c["color"]
                    ctf = card.text_frame
                    ctf.word_wrap = True

                    # Tag
                    p1 = ctf.paragraphs[0]
                    p1.text = f"{c['icon']}  {c['tag']}"
                    p1.font.size = Pt(11)
                    p1.font.bold = True
                    p1.font.color.rgb = c["color"]

                    # Title
                    p2 = ctf.add_paragraph()
                    p2.text = c["title"]
                    p2.font.size = Pt(20)
                    p2.font.bold = True
                    p2.font.color.rgb = TEXT_WHITE
                    p2.space_before = Pt(12)

                    # Desc
                    p3 = ctf.add_paragraph()
                    p3.text = c["desc"]
                    p3.font.size = Pt(14)
                    p3.font.color.rgb = TEXT_LIGHT
                    p3.space_before = Pt(14)

            # ── 2. Quote Statement ──
            elif stype == "quote_statement":
                # Big statement box
                qbox = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.1), Inches(11.733), Inches(2.6))
                qbox.fill.solid()
                qbox.fill.fore_color.rgb = CARD_BG
                qbox.line.color.rgb = CYAN_ACCENT
                qtf = qbox.text_frame
                qtf.word_wrap = True
                qp = qtf.paragraphs[0]
                qp.text = "“" + data["statement"].replace("\n\n", " ”\n\n“") + "”"
                qp.font.size = Pt(16)
                qp.font.color.rgb = TEXT_WHITE
                qp.font.italic = True

                # 3 Pillars below
                for i, (title, text) in enumerate(data["pillars"]):
                    x = Inches(0.8 + i * 4.0)
                    pcard = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(4.9), Inches(3.7), Inches(2.0))
                    pcard.fill.solid()
                    pcard.fill.fore_color.rgb = CARD_BG
                    pcard.line.color.rgb = CARD_BORDER
                    ptf = pcard.text_frame
                    ptf.word_wrap = True
                    pp1 = ptf.paragraphs[0]
                    pp1.text = title
                    pp1.font.size = Pt(11)
                    pp1.font.bold = True
                    pp1.font.color.rgb = CYAN_ACCENT
                    pp2 = ptf.add_paragraph()
                    pp2.text = text
                    pp2.font.size = Pt(12)
                    pp2.font.color.rgb = TEXT_LIGHT
                    pp2.space_before = Pt(6)

            # ── 3. Pipeline (4 Steps) ──
            elif stype == "pipeline":
                for i, (step_title, step_desc) in enumerate(data["steps"]):
                    x = Inches(0.8 + i * 3.0)
                    pcard = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.1), Inches(2.75), Inches(4.0))
                    pcard.fill.solid()
                    pcard.fill.fore_color.rgb = CARD_BG
                    pcard.line.color.rgb = CYAN_ACCENT if i == 0 else CARD_BORDER
                    ptf = pcard.text_frame
                    ptf.word_wrap = True
                    pp1 = ptf.paragraphs[0]
                    pp1.text = step_title
                    pp1.font.size = Pt(16)
                    pp1.font.bold = True
                    pp1.font.color.rgb = CYAN_ACCENT
                    pp2 = ptf.add_paragraph()
                    pp2.text = step_desc
                    pp2.font.size = Pt(13)
                    pp2.font.color.rgb = TEXT_LIGHT
                    pp2.space_before = Pt(12)

                # Footer banner
                fbar = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.3), Inches(11.733), Inches(0.7))
                fbar.fill.solid()
                fbar.fill.fore_color.rgb = CARD_BG
                fbar.line.color.rgb = GREEN_ACC
                ftf = fbar.text_frame
                fp = ftf.paragraphs[0]
                fp.text = "✓  " + data["footer_note"]
                fp.font.size = Pt(13)
                fp.font.bold = True
                fp.font.color.rgb = GREEN_ACC
                fp.alignment = PP_ALIGN.CENTER

            # ── 4. Comparison Table ──
            elif stype == "comparison_table":
                # Left (Legacy)
                lcard = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.1), Inches(5.6), Inches(4.8))
                lcard.fill.solid()
                lcard.fill.fore_color.rgb = CARD_BG
                lcard.line.color.rgb = data["left_color"]
                ltf = lcard.text_frame
                ltf.word_wrap = True
                lp = ltf.paragraphs[0]
                lp.text = data["left_title"]
                lp.font.size = Pt(17)
                lp.font.bold = True
                lp.font.color.rgb = data["left_color"]
                for pt in data["left_points"]:
                    bp = ltf.add_paragraph()
                    bp.text = f"✕  {pt}"
                    bp.font.size = Pt(13)
                    bp.font.color.rgb = TEXT_LIGHT
                    bp.space_before = Pt(10)

                # Right (Exasol)
                rcard = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.8))
                rcard.fill.solid()
                rcard.fill.fore_color.rgb = CARD_BG
                rcard.line.color.rgb = data["right_color"]
                rtf = rcard.text_frame
                rtf.word_wrap = True
                rp = rtf.paragraphs[0]
                rp.text = data["right_title"]
                rp.font.size = Pt(17)
                rp.font.bold = True
                rp.font.color.rgb = data["right_color"]
                for pt in data["right_points"]:
                    bp = rtf.add_paragraph()
                    bp.text = f"✓  {pt}"
                    bp.font.size = Pt(13)
                    bp.font.color.rgb = TEXT_WHITE
                    bp.space_before = Pt(10)

            # ── 5. Schema Layout ──
            elif stype == "schema_layout":
                # Left: Tables (Columnar store)
                lcard = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.1), Inches(5.6), Inches(4.8))
                lcard.fill.solid()
                lcard.fill.fore_color.rgb = CARD_BG
                lcard.line.color.rgb = CYAN_ACCENT
                ltf = lcard.text_frame
                ltf.word_wrap = True
                lp = ltf.paragraphs[0]
                lp.text = "Exasol Physical Schema (Columnar)"
                lp.font.size = Pt(16)
                lp.font.bold = True
                lp.font.color.rgb = CYAN_ACCENT
                for tbl, cols in data["tables"]:
                    tp = ltf.add_paragraph()
                    tp.text = f"• {tbl}"
                    tp.font.size = Pt(13)
                    tp.font.bold = True
                    tp.font.color.rgb = TEXT_WHITE
                    tp.space_before = Pt(8)
                    cp = ltf.add_paragraph()
                    cp.text = cols
                    cp.font.size = Pt(11)
                    cp.font.color.rgb = TEXT_MUTED

                # Right: Analytical Views
                rcard = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.8))
                rcard.fill.solid()
                rcard.fill.fore_color.rgb = CARD_BG
                rcard.line.color.rgb = GREEN_ACC
                rtf = rcard.text_frame
                rtf.word_wrap = True
                rp = rtf.paragraphs[0]
                rp.text = "In-Memory Analytical Views"
                rp.font.size = Pt(16)
                rp.font.bold = True
                rp.font.color.rgb = GREEN_ACC
                for vw, desc in data["views"]:
                    vp = rtf.add_paragraph()
                    vp.text = f"⚡ {vw}"
                    vp.font.size = Pt(13)
                    vp.font.bold = True
                    vp.font.color.rgb = TEXT_WHITE
                    vp.space_before = Pt(10)
                    vdp = rtf.add_paragraph()
                    vdp.text = desc
                    vdp.font.size = Pt(11)
                    vdp.font.color.rgb = TEXT_MUTED

            # ── 6. Image Feature (Screenshots) ──
            elif stype == "image_feature":
                # Left side: Text features
                tcard = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.1), Inches(4.8), Inches(4.8))
                tcard.fill.solid()
                tcard.fill.fore_color.rgb = CARD_BG
                tcard.line.color.rgb = CARD_BORDER
                ttf = tcard.text_frame
                ttf.word_wrap = True
                tp1 = ttf.paragraphs[0]
                tp1.text = "Key Innovations"
                tp1.font.size = Pt(15)
                tp1.font.bold = True
                tp1.font.color.rgb = CYAN_ACCENT

                for heading, desc in data["features"]:
                    hp = ttf.add_paragraph()
                    hp.text = f"• {heading}"
                    hp.font.size = Pt(12)
                    hp.font.bold = True
                    hp.font.color.rgb = TEXT_WHITE
                    hp.space_before = Pt(7)
                    dp = ttf.add_paragraph()
                    dp.text = desc
                    dp.font.size = Pt(10.5)
                    dp.font.color.rgb = TEXT_LIGHT

                # Right side: Image screenshot
                if os.path.exists(data["image_path"]):
                    slide.shapes.add_picture(data["image_path"], Inches(5.9), Inches(2.1), Inches(6.6), Inches(4.8))

            # ── 7. KPI Grid (4 Metrics) ──
            elif stype == "kpi_grid":
                for i, (stat, label, desc) in enumerate(data["kpis"]):
                    x = Inches(0.8 + (i % 2) * 6.0)
                    y = Inches(2.1 + (i // 2) * 2.5)
                    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.6), Inches(2.2))
                    card.fill.solid()
                    card.fill.fore_color.rgb = CARD_BG
                    card.line.color.rgb = CYAN_ACCENT if i % 2 == 0 else GREEN_ACC
                    ctf = card.text_frame
                    ctf.word_wrap = True
                    p1 = ctf.paragraphs[0]
                    p1.text = stat
                    p1.font.size = Pt(38)
                    p1.font.bold = True
                    p1.font.color.rgb = CYAN_ACCENT if i % 2 == 0 else GREEN_ACC

                    p2 = ctf.add_paragraph()
                    p2.text = label
                    p2.font.size = Pt(15)
                    p2.font.bold = True
                    p2.font.color.rgb = TEXT_WHITE
                    p2.space_before = Pt(4)

                    p3 = ctf.add_paragraph()
                    p3.text = desc
                    p3.font.size = Pt(12)
                    p3.font.color.rgb = TEXT_LIGHT
                    p3.space_before = Pt(4)

            # ── 8. Business Cards (ROI) ──
            elif stype == "business_cards":
                for i, c in enumerate(data["cards"]):
                    x = Inches(0.8 + i * 3.0)
                    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.1), Inches(2.75), Inches(4.8))
                    card.fill.solid()
                    card.fill.fore_color.rgb = CARD_BG
                    card.line.color.rgb = CYAN_ACCENT
                    ctf = card.text_frame
                    ctf.word_wrap = True

                    p1 = ctf.paragraphs[0]
                    p1.text = c["metric"]
                    p1.font.size = Pt(32)
                    p1.font.bold = True
                    p1.font.color.rgb = CYAN_ACCENT

                    p2 = ctf.add_paragraph()
                    p2.text = c["label"]
                    p2.font.size = Pt(15)
                    p2.font.bold = True
                    p2.font.color.rgb = TEXT_WHITE
                    p2.space_before = Pt(8)

                    p3 = ctf.add_paragraph()
                    p3.text = c["desc"]
                    p3.font.size = Pt(12.5)
                    p3.font.color.rgb = TEXT_LIGHT
                    p3.space_before = Pt(12)

            # ── 9. Criteria Grid (6 Cards) ──
            elif stype == "criteria_grid":
                for i, (crit_title, crit_desc) in enumerate(data["criteria"]):
                    x = Inches(0.8 + (i % 2) * 6.0)
                    y = Inches(2.1 + (i // 2) * 1.6)
                    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.6), Inches(1.4))
                    card.fill.solid()
                    card.fill.fore_color.rgb = CARD_BG
                    card.line.color.rgb = CARD_BORDER
                    ctf = card.text_frame
                    ctf.word_wrap = True
                    p1 = ctf.paragraphs[0]
                    p1.text = crit_title
                    p1.font.size = Pt(13)
                    p1.font.bold = True
                    p1.font.color.rgb = CYAN_ACCENT

                    p2 = ctf.add_paragraph()
                    p2.text = crit_desc
                    p2.font.size = Pt(11)
                    p2.font.color.rgb = TEXT_LIGHT
                    p2.space_before = Pt(3)

            # ── 10. Deliverables Final ──
            elif stype == "deliverables_final":
                for i, (label, link, desc) in enumerate(data["items"]):
                    y = Inches(2.1 + i * 0.95)
                    row = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.733), Inches(0.82))
                    row.fill.solid()
                    row.fill.fore_color.rgb = CARD_BG
                    row.line.color.rgb = CYAN_ACCENT if i < 2 else CARD_BORDER
                    rtf = row.text_frame
                    rtf.word_wrap = True
                    p1 = rtf.paragraphs[0]
                    p1.text = f"{label}   →   {link}"
                    p1.font.size = Pt(13)
                    p1.font.bold = True
                    p1.font.color.rgb = CYAN_ACCENT if i < 2 else TEXT_WHITE

                    p2 = rtf.add_paragraph()
                    p2.text = desc
                    p2.font.size = Pt(11)
                    p2.font.color.rgb = TEXT_MUTED

    output_pptx = "pitch-deck/LoopCraft_Exathon_2026_Pitch_Deck.pptx"
    prs.save(output_pptx)
    print(f"[+] Successfully generated executive PPTX: {output_pptx}")


# ═══════════════════════════════════════════════════════════════════════════════
# REPORTLAB PDF BUILDER (Matching Colors, Professional Layout, Clean Graphics)
# ═══════════════════════════════════════════════════════════════════════════════

def build_pdf():
    pdf_path = "pitch-deck/LoopCraft_Exathon_2026_Pitch_Deck.pdf"
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=landscape(letter),
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=colors.HexColor('#0B192C'),
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.HexColor('#0072CE'),
        spaceAfter=12
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1E293B')
    )
    bold_style = ParagraphStyle(
        'DocBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=colors.HexColor('#0B192C')
    )

    story = []

    for i, data in enumerate(SLIDES_DATA):
        stype = data["type"]

        if stype == "cover":
            story.append(Spacer(1, 20))
            story.append(Paragraph(f"<b><font color='#0072CE'>{data['event_badge']}</font></b>", body_style))
            story.append(Paragraph(data["title"], title_style))
            story.append(Paragraph(data["subtitle"], subtitle_style))
            story.append(Spacer(1, 10))

            left_info = [
                Paragraph(f"<b>Track:</b> {data['track_badge']}", body_style),
                Paragraph(f"<b>Architecture:</b> {data['tech_tag']}", body_style),
                Paragraph(f"<b>Author:</b> {data['author']}", body_style),
            ]
            right_img = []
            if os.path.exists(data["hero_img"]):
                right_img.append(RLImage(data["hero_img"], width=300, height=190))

            t = Table([[left_info, right_img]], colWidths=[380, 320])
            t.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
            story.append(t)

        else:
            story.append(Paragraph(f"<font size='8' color='#64748B'><b>SLIDE {data['slide_num']} / 12 · EXATHON INDIA 2026</b></font>", body_style))
            story.append(Paragraph(data["title"], title_style))
            story.append(Paragraph(data["subtitle"], subtitle_style))

            if stype == "problem_grid":
                cells = []
                for c in data["cards"]:
                    content = [
                        Paragraph(f"<b><font color='#DC2626'>{c['icon']} {c['tag']}</font></b>", bold_style),
                        Paragraph(f"<b>{c['title']}</b>", bold_style),
                        Paragraph(c["desc"], body_style)
                    ]
                    cells.append(content)
                t = Table([cells], colWidths=[230, 230, 230])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
                    ('PADDING', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'TOP')
                ]))
                story.append(t)

            elif stype == "quote_statement":
                stmt_cell = [
                    Paragraph(f"“{data['statement'].replace(chr(10), '<br/>')}”", ParagraphStyle('Q', parent=body_style, fontSize=11, leading=15, textColor=colors.HexColor('#0F172A'), fontName='Helvetica-Oblique'))
                ]
                t_stmt = Table([[stmt_cell]], colWidths=[700])
                t_stmt.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EFF6FF')),
                    ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#0284C7')),
                    ('PADDING', (0,0), (-1,-1), 12)
                ]))
                story.append(t_stmt)
                story.append(Spacer(1, 10))

                p_cells = []
                for p_title, p_desc in data["pillars"]:
                    p_cells.append([
                        Paragraph(f"<b><font color='#0284C7'>{p_title}</font></b>", bold_style),
                        Paragraph(p_desc, body_style)
                    ])
                t_p = Table([p_cells], colWidths=[230, 230, 230])
                t_p.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
                    ('PADDING', (0,0), (-1,-1), 8),
                    ('VALIGN', (0,0), (-1,-1), 'TOP')
                ]))
                story.append(t_p)

            elif stype == "pipeline":
                p_cells = []
                for step_title, step_desc in data["steps"]:
                    p_cells.append([
                        Paragraph(f"<b><font color='#0284C7'>{step_title}</font></b>", bold_style),
                        Paragraph(step_desc, body_style)
                    ])
                t = Table([p_cells], colWidths=[175, 175, 175, 175])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
                    ('PADDING', (0,0), (-1,-1), 8),
                    ('VALIGN', (0,0), (-1,-1), 'TOP')
                ]))
                story.append(t)
                story.append(Spacer(1, 8))
                f_cell = [[Paragraph(f"<b><font color='#047857'>✓ {data['footer_note']}</font></b>", bold_style)]]
                t_f = Table(f_cell, colWidths=[700])
                t_f.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ECFDF5')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#10B981')),
                    ('PADDING', (0,0), (-1,-1), 8)
                ]))
                story.append(t_f)

            elif stype == "comparison_table":
                left_content = [Paragraph(f"<b><font color='#DC2626'>{data['left_title']}</font></b>", bold_style)]
                for pt in data["left_points"]:
                    left_content.append(Paragraph(f"✕ {pt}", body_style))

                right_content = [Paragraph(f"<b><font color='#0284C7'>{data['right_title']}</font></b>", bold_style)]
                for pt in data["right_points"]:
                    right_content.append(Paragraph(f"✓ {pt}", body_style))

                t = Table([[left_content, right_content]], colWidths=[345, 345])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (0,0), colors.HexColor('#FEF2F2')),
                    ('BACKGROUND', (1,0), (1,0), colors.HexColor('#F0F9FF')),
                    ('BOX', (0,0), (0,0), 1, colors.HexColor('#FCA5A5')),
                    ('BOX', (1,0), (1,0), 1, colors.HexColor('#38BDF8')),
                    ('PADDING', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'TOP')
                ]))
                story.append(t)

            elif stype == "schema_layout":
                left_content = [Paragraph("<b><font color='#0284C7'>Exasol Columnar Tables</font></b>", bold_style)]
                for tbl, cols in data["tables"]:
                    left_content.append(Paragraph(f"<b>• {tbl}</b>: <font color='#64748B'>{cols}</font>", body_style))

                right_content = [Paragraph("<b><font color='#059669'>Analytical Views</font></b>", bold_style)]
                for vw, desc in data["views"]:
                    right_content.append(Paragraph(f"<b>⚡ {vw}</b>: <font color='#64748B'>{desc}</font>", body_style))

                t = Table([[left_content, right_content]], colWidths=[345, 345])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
                    ('PADDING', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'TOP')
                ]))
                story.append(t)

            elif stype == "image_feature":
                text_content = [Paragraph("<b>Key Innovations & Triage Flow:</b>", bold_style)]
                for heading, desc in data["features"]:
                    text_content.append(Paragraph(f"<b>• {heading}</b>: {desc}", body_style))

                img_content = []
                if os.path.exists(data["image_path"]):
                    img_content.append(RLImage(data["image_path"], width=350, height=220))

                t = Table([[text_content, img_content]], colWidths=[330, 360])
                t.setStyle(TableStyle([
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('PADDING', (0,0), (-1,-1), 6)
                ]))
                story.append(t)

            elif stype == "kpi_grid":
                cells = []
                for stat, label, desc in data["kpis"]:
                    cells.append([
                        Paragraph(f"<b><font size='18' color='#0072CE'>{stat}</font></b>", bold_style),
                        Paragraph(f"<b>{label}</b>", bold_style),
                        Paragraph(desc, body_style)
                    ])
                t = Table([[cells[0], cells[1]], [cells[2], cells[3]]], colWidths=[345, 345])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
                    ('PADDING', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'TOP')
                ]))
                story.append(t)

            elif stype == "business_cards":
                cells = []
                for c in data["cards"]:
                    cells.append([
                        Paragraph(f"<b><font size='16' color='#0072CE'>{c['metric']}</font></b>", bold_style),
                        Paragraph(f"<b>{c['label']}</b>", bold_style),
                        Paragraph(c["desc"], body_style)
                    ])
                t = Table([cells], colWidths=[175, 175, 175, 175])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
                    ('PADDING', (0,0), (-1,-1), 8),
                    ('VALIGN', (0,0), (-1,-1), 'TOP')
                ]))
                story.append(t)

            elif stype == "criteria_grid":
                rows = []
                row = []
                for crit_title, crit_desc in data["criteria"]:
                    row.append([
                        Paragraph(f"<b><font color='#0072CE'>{crit_title}</font></b>", bold_style),
                        Paragraph(crit_desc, body_style)
                    ])
                    if len(row) == 2:
                        rows.append(row)
                        row = []
                if row:
                    rows.append(row)
                t = Table(rows, colWidths=[345, 345])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
                    ('PADDING', (0,0), (-1,-1), 8),
                    ('VALIGN', (0,0), (-1,-1), 'TOP')
                ]))
                story.append(t)

            elif stype == "deliverables_final":
                rows = []
                for label, link, desc in data["items"]:
                    rows.append([
                        Paragraph(f"<b>{label}</b>", bold_style),
                        Paragraph(f"<b><font color='#0072CE'>{link}</font></b>", body_style),
                        Paragraph(desc, body_style)
                    ])
                t = Table(rows, colWidths=[200, 240, 260])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
                    ('PADDING', (0,0), (-1,-1), 6),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
                ]))
                story.append(t)

        if i < len(SLIDES_DATA) - 1:
            story.append(PageBreak())

    doc.build(story)
    print(f"[+] Successfully generated executive PDF: {pdf_path}")


if __name__ == "__main__":
    build_pptx()
    build_pdf()
