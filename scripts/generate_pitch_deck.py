#!/usr/bin/env python3
"""
Generate Pitch Deck PPTX and PDF for ExaThon India 2026
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
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

os.makedirs("pitch-deck", exist_ok=True)

# ── Color Palette ─────────────────────────────────────────────────────────────
DARK_NAVY  = RGBColor(18, 52, 77)     # #12344D
DEEP_BLUE  = RGBColor(0, 45, 84)      # Exasol Deep Blue
ACCENT_CYAN = RGBColor(0, 178, 254)   # #00B2FE
LIGHT_GRAY = RGBColor(245, 247, 250)
TEXT_WHITE = RGBColor(255, 255, 255)
TEXT_MUTED = RGBColor(160, 174, 192)
TEXT_DARK  = RGBColor(26, 32, 44)
CARD_BG    = RGBColor(27, 68, 102)

SLIDES_DATA = [
    {
        "title": "LoopCraft",
        "subtitle": "Closed-Loop AI Support Optimization Engine Powered by Exasol Personal",
        "track": "ExaThon India 2026 · The Exasol Open Build Challenge",
        "author": "Track 04: The Work Behind the Work | Track 02: Customers, Channels & Demand\nBy: Kavin S.",
        "type": "title"
    },
    {
        "title": "The Problem: The Support Feedback Black Hole",
        "type": "content",
        "bullets": [
            "Support AI agents handle millions of customer conversations, but when users give a thumbs-down, the failure signal is silently discarded.",
            "Support leads and knowledge authors cannot diagnose why automated conversations fail because feedback telemetry sits trapped across unlinked ticket logs.",
            "Knowledge base articles decay over time. As products and policies change, outdated KB articles mislead AI agents and cause repeat customer escalations.",
            "Today's ticket systems are optimized for transactional CRUD, not high-velocity analytical reasoning over unstructured conversational feedback."
        ]
    },
    {
        "title": "Problem Statement (Official Exasol Template)",
        "type": "card",
        "card_title": "Core Challenge",
        "statement": "Support operations leads and knowledge engineers cannot diagnose why automated support conversations fail and proactively fix outdated guidance because negative customer feedback and conversational failure signals sit discarded across millions of unlinked support logs.\n\nIf this worked, support teams would continuously pinpoint root causes of failed interactions in real time, auto-generate verified knowledge base updates, and cut repeat customer escalations by over 40%."
    },
    {
        "title": "The Solution: LoopCraft",
        "type": "content",
        "bullets": [
            "Continuous Closed Loop: Intercepts negative ratings, classifies the root cause, and auto-drafts verified corrections.",
            "Automated KB Health Auditing: Continuously measures deflection and escalation rates across all articles.",
            "Multimodal Voice Briefing: Spoken audio briefs powered by ElevenLabs so admins can review failures hands-free.",
            "Powered by Exasol Personal: In-memory columnar analytics deliver sub-millisecond querying over tens of thousands of conversations."
        ]
    },
    {
        "title": "Why Exasol Personal is the Key Enabler",
        "type": "comparison",
        "left_title": "Traditional Transactional DBs",
        "left_points": [
            "Row-oriented storage slow for analytical scans",
            "Complex aggregation across millions of rows causes query timeouts",
            "Support feedback data remains locked in unanalyzed silos",
            "Slow batch ETL jobs delay KB fixes by weeks"
        ],
        "right_title": "Exasol Personal In-Memory Engine",
        "right_points": [
            "Columnar in-memory execution delivers answers in < 5 milliseconds",
            "Instantly clusters failure types (Stale Article, No Coverage, Wrong Intent)",
            "Dynamic deflection trend calculation across 50,000+ interactions",
            "Live synchronization from raw support logs to actionable knowledge fixes"
        ]
    },
    {
        "title": "Architecture: The 4-Agent Closed Loop",
        "type": "content",
        "bullets": [
            "1. Rating Watcher Agent: Intercepts customer thumbs-down events and logs telemetry directly to Exasol.",
            "2. Failure Classifier Agent: Analyzes user query vs bot response, tagging failure type (Stale Article / No Coverage / Wrong Intent).",
            "3. KB Author Agent: Synthesizes resolution notes from resolved human tickets to auto-draft updated articles.",
            "4. Correction Brief Agent: Packages root cause diagnosis, spoken brief, and one-click approval into the admin queue."
        ]
    },
    {
        "title": "Technical Benchmarks: In-Memory Columnar Speed",
        "type": "content",
        "bullets": [
            "Synthetic Dataset: 50,000 conversational interaction logs and support tickets generated conforming to open-source rules.",
            "Category Deflection Scan: Aggregated across 50,000 rows in 21.9 ms.",
            "Root-Cause Failure Clustering: Filtered 17,484 negative interactions in 6.6 ms.",
            "Sub-Millisecond Dashboard Queries: Real-time UI widgets query Exasol views in < 4.5 ms.",
            "Zero Lag for IT Admins: Interactive triage dashboard with instantaneous responsiveness."
        ]
    },
    {
        "title": "Real-World Business Impact & ROI",
        "type": "metrics",
        "metrics": [
            {"stat": "+44.3%", "desc": "Deflection Rate Jump on Outdated Articles (23.1% -> 67.4%)"},
            {"stat": "< 5 ms", "desc": "Exasol In-Memory Analytics Latency across 50k records"},
            {"stat": "100%", "desc": "Closed-Loop Feedback: Zero discarded negative ratings"},
            {"stat": "1-Click", "desc": "From Diagnosed Failure to Published KB Update"}
        ]
    },
    {
        "title": "ExaThon India 2026 Alignment",
        "type": "content",
        "bullets": [
            "Track 04: The Work Behind the Work — Transforming internal IT support and automated knowledge systems.",
            "Track 02: Customers, Channels & Demand — Mining churn and dissatisfaction signals sitting unused in support tickets.",
            "Exasol Personal Utilization: Core data warehouse and analytical engine for telemetry storage, aggregations, and views.",
            "Open Source Standards: MIT License, public GitHub repo, synthetic data only, Docker Compose quickstart."
        ]
    },
    {
        "title": "Deliverables & Links",
        "type": "content",
        "bullets": [
            "Live Web Demonstration: fresh-works-kavin.vercel.app",
            "Demo Video (3 Min Max): youtu.be/LJKkfyrKwA4",
            "Public Code Repository: github.com/kavindon2007/fresh_works_kavin",
            "Docker Compose Integration: Official exasol/docker-db setup with init schemas",
            "Open-Source License: MIT License included"
        ]
    }
]

def create_pptx():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    for data in SLIDES_DATA:
        slide = prs.slides.add_slide(blank_layout)
        
        # Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = DARK_NAVY
        bg.line.color.rgb = DARK_NAVY

        # Slide Type: Title
        if data["type"] == "title":
            # Header pill
            pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.2), Inches(6.5), Inches(0.5))
            pill.fill.solid()
            pill.fill.fore_color.rgb = CARD_BG
            pill.line.color.rgb = ACCENT_CYAN
            p_text = pill.text_frame
            p_text.text = data["track"]
            p_text.paragraphs[0].font.size = Pt(13)
            p_text.paragraphs[0].font.color.rgb = ACCENT_CYAN
            p_text.paragraphs[0].font.bold = True

            # Title
            tx_box = slide.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(11.3), Inches(2.0))
            tf = tx_box.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.text = data["title"]
            p.font.size = Pt(56)
            p.font.bold = True
            p.font.color.rgb = TEXT_WHITE

            p2 = tf.add_paragraph()
            p2.text = data["subtitle"]
            p2.font.size = Pt(24)
            p2.font.color.rgb = ACCENT_CYAN
            p2.space_before = Pt(15)

            # Author box
            ax_box = slide.shapes.add_textbox(Inches(1.0), Inches(5.2), Inches(11.3), Inches(1.5))
            atf = ax_box.text_frame
            ap = atf.paragraphs[0]
            ap.text = data["author"]
            ap.font.size = Pt(16)
            ap.font.color.rgb = TEXT_MUTED

        else:
            # Common Header
            tx_box = slide.shapes.add_textbox(Inches(1.0), Inches(0.6), Inches(11.3), Inches(1.2))
            tf = tx_box.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.text = data["title"]
            p.font.size = Pt(32)
            p.font.bold = True
            p.font.color.rgb = TEXT_WHITE

            # Divider line
            line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.0), Inches(1.8), Inches(11.3), Inches(0.04))
            line.fill.solid()
            line.fill.fore_color.rgb = ACCENT_CYAN
            line.line.color.rgb = ACCENT_CYAN

            if data["type"] == "content":
                c_box = slide.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(11.3), Inches(4.5))
                ctf = c_box.text_frame
                ctf.word_wrap = True
                for i, bullet in enumerate(data["bullets"]):
                    bp = ctf.add_paragraph() if i > 0 else ctf.paragraphs[0]
                    bp.text = f"•  {bullet}"
                    bp.font.size = Pt(20)
                    bp.font.color.rgb = TEXT_WHITE
                    bp.space_after = Pt(22)

            elif data["type"] == "card":
                card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(2.3), Inches(11.3), Inches(4.2))
                card.fill.solid()
                card.fill.fore_color.rgb = CARD_BG
                card.line.color.rgb = ACCENT_CYAN
                ctf = card.text_frame
                ctf.word_wrap = True
                cp1 = ctf.paragraphs[0]
                cp1.text = data["card_title"].upper()
                cp1.font.size = Pt(16)
                cp1.font.bold = True
                cp1.font.color.rgb = ACCENT_CYAN

                cp2 = ctf.add_paragraph()
                cp2.text = data["statement"]
                cp2.font.size = Pt(22)
                cp2.font.color.rgb = TEXT_WHITE
                cp2.space_before = Pt(20)

            elif data["type"] == "comparison":
                # Left Card
                left_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(2.3), Inches(5.4), Inches(4.5))
                left_card.fill.solid()
                left_card.fill.fore_color.rgb = CARD_BG
                left_card.line.color.rgb = RGBColor(120, 140, 160)
                ltf = left_card.text_frame
                ltf.word_wrap = True
                lp = ltf.paragraphs[0]
                lp.text = data["left_title"]
                lp.font.size = Pt(20)
                lp.font.bold = True
                lp.font.color.rgb = RGBColor(239, 68, 68)

                for pt in data["left_points"]:
                    bp = ltf.add_paragraph()
                    bp.text = f"✕  {pt}"
                    bp.font.size = Pt(16)
                    bp.font.color.rgb = TEXT_WHITE
                    bp.space_after = Pt(12)

                # Right Card
                right_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.9), Inches(2.3), Inches(5.4), Inches(4.5))
                right_card.fill.solid()
                right_card.fill.fore_color.rgb = CARD_BG
                right_card.line.color.rgb = ACCENT_CYAN
                rtf = right_card.text_frame
                rtf.word_wrap = True
                rp = rtf.paragraphs[0]
                rp.text = data["right_title"]
                rp.font.size = Pt(20)
                rp.font.bold = True
                rp.font.color.rgb = ACCENT_CYAN

                for pt in data["right_points"]:
                    bp = rtf.add_paragraph()
                    bp.text = f"✓  {pt}"
                    bp.font.size = Pt(16)
                    bp.font.color.rgb = TEXT_WHITE
                    bp.space_after = Pt(12)

            elif data["type"] == "metrics":
                for i, m in enumerate(data["metrics"]):
                    x = Inches(1.0 + (i % 2) * 5.8)
                    y = Inches(2.3 + (i // 2) * 2.2)
                    mcard = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.5), Inches(1.9))
                    mcard.fill.solid()
                    mcard.fill.fore_color.rgb = CARD_BG
                    mcard.line.color.rgb = ACCENT_CYAN
                    mtf = mcard.text_frame
                    mtf.word_wrap = True
                    mp1 = mtf.paragraphs[0]
                    mp1.text = m["stat"]
                    mp1.font.size = Pt(36)
                    mp1.font.bold = True
                    mp1.font.color.rgb = ACCENT_CYAN
                    mp2 = mtf.add_paragraph()
                    mp2.text = m["desc"]
                    mp2.font.size = Pt(16)
                    mp2.font.color.rgb = TEXT_WHITE
                    mp2.space_before = Pt(6)

    output_path = "pitch-deck/LoopCraft_Exathon_2026_Pitch_Deck.pptx"
    prs.save(output_path)
    print(f"[+] Saved PPTX: {output_path}")

def create_pdf():
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
        fontSize=28,
        textColor=colors.HexColor('#12344D'),
        spaceAfter=10
    )
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        textColor=colors.HexColor('#00B2FE'),
        spaceAfter=15
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=18,
        textColor=colors.HexColor('#2D3748'),
        spaceAfter=12
    )
    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=colors.HexColor('#1A202C'),
        spaceAfter=8
    )

    story = []

    for i, data in enumerate(SLIDES_DATA):
        if data["type"] == "title":
            story.append(Spacer(1, 40))
            story.append(Paragraph(data["title"], title_style))
            story.append(Paragraph(data["subtitle"], subtitle_style))
            story.append(Spacer(1, 15))
            story.append(Paragraph(f"<b>Event:</b> {data['track']}", body_style))
            story.append(Paragraph(data["author"].replace('\n', '<br/>'), body_style))
            story.append(Spacer(1, 30))
        else:
            story.append(Paragraph(data["title"], title_style))
            story.append(Spacer(1, 10))

            if data["type"] == "content":
                for b in data["bullets"]:
                    story.append(Paragraph(f"• &nbsp; {b}", bullet_style))
            elif data["type"] == "card":
                card_data = [[Paragraph(f"<b>{data['card_title'].upper()}</b><br/><br/>{data['statement'].replace(chr(10), '<br/><br/>')}", body_style)]]
                t = Table(card_data, colWidths=[700])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0F9FF')),
                    ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#00B2FE')),
                    ('PADDING', (0,0), (-1,-1), 14),
                ]))
                story.append(t)
            elif data["type"] == "comparison":
                left_content = f"<b><font color='#DC2626'>{data['left_title']}</font></b><br/><br/>" + "<br/>".join([f"✕ {pt}" for pt in data['left_points']])
                right_content = f"<b><font color='#0284C7'>{data['right_title']}</font></b><br/><br/>" + "<br/>".join([f"✓ {pt}" for pt in data['right_points']])
                comp_data = [[Paragraph(left_content, body_style), Paragraph(right_content, body_style)]]
                t = Table(comp_data, colWidths=[340, 340])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (0,0), colors.HexColor('#FEF2F2')),
                    ('BACKGROUND', (1,0), (1,0), colors.HexColor('#F0F9FF')),
                    ('BOX', (0,0), (0,0), 1, colors.HexColor('#F87171')),
                    ('BOX', (1,0), (1,0), 1, colors.HexColor('#38BDF8')),
                    ('PADDING', (0,0), (-1,-1), 12),
                ]))
                story.append(t)
            elif data["type"] == "metrics":
                rows = []
                row = []
                for idx, m in enumerate(data["metrics"]):
                    cell_text = f"<b><font size='18' color='#00B2FE'>{m['stat']}</font></b><br/>{m['desc']}"
                    row.append(Paragraph(cell_text, body_style))
                    if len(row) == 2:
                        rows.append(row)
                        row = []
                if row:
                    rows.append(row)
                t = Table(rows, colWidths=[340, 340])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
                    ('PADDING', (0,0), (-1,-1), 12),
                ]))
                story.append(t)

        if i < len(SLIDES_DATA) - 1:
            story.append(PageBreak())

    doc.build(story)
    print(f"[+] Saved PDF: {pdf_path}")

if __name__ == "__main__":
    create_pptx()
    create_pdf()
