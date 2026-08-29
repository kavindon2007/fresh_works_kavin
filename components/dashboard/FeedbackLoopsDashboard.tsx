"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  RefreshCw, ArrowDown, ArrowUp, ChevronRight, ThumbsDown,
  CheckCircle, Play, Volume2, VolumeX, Loader2, AlertTriangle,
  FileText, TrendingDown, TrendingUp, Zap, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import KBHealthPanel from "@/components/dashboard/KBHealthPanel";
import { useSpeech } from "@/hooks/useSpeech";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

interface FailureTicket {
  id: string; query: string;
  type: "STALE ARTICLE" | "NO COVERAGE" | "WRONG INTENT";
  article: string; time: string;
}

const TICKETS: FailureTicket[] = [
  { id: "T-4821", query: "How do I connect to VPN from home?",     type: "STALE ARTICLE", article: "Cisco AnyConnect Setup v2.1",   time: "3 hours ago" },
  { id: "T-4834", query: "Reset my Okta MFA device",               type: "NO COVERAGE",   article: "(No article found)",            time: "5 hours ago" },
  { id: "T-4802", query: "Request Adobe Creative Cloud license",    type: "STALE ARTICLE", article: "Software Request Process 2022", time: "8 hours ago" },
  { id: "T-4779", query: "Laptop not connecting to dock",           type: "WRONG INTENT",  article: "Wi-Fi Troubleshooting Guide",   time: "1 day ago"   },
  { id: "T-4751", query: "How do I access Salesforce sandbox?",     type: "NO COVERAGE",   article: "(No article found)",            time: "1 day ago"   },
];

// Inline-style configs — guaranteed to render regardless of Tailwind purging
const TYPE_STYLE: Record<FailureTicket["type"], {
  borderLeft: string; bg: string;
  pillBg: string; pillText: string; pillBorder: string;
}> = {
  "STALE ARTICLE": {
    borderLeft: "#FBBF24", bg: "rgba(255,251,235,0.5)",
    pillBg: "#FEF3C7", pillText: "#92400E", pillBorder: "#FCD34D",
  },
  "NO COVERAGE": {
    borderLeft: "#F87171", bg: "rgba(254,242,242,0.5)",
    pillBg: "#FEE2E2", pillText: "#991B1B", pillBorder: "#FCA5A5",
  },
  "WRONG INTENT": {
    borderLeft: "#C084FC", bg: "rgba(250,245,255,0.5)",
    pillBg: "#F3E8FF", pillText: "#6B21A8", pillBorder: "#D8B4FE",
  },
};

const DRAFT_TITLE = "Connecting to GlobalProtect VPN (Updated March 2025)";
const DIAGNOSIS   = "KB references deprecated Cisco AnyConnect. Migrated to Palo Alto GlobalProtect, March 2025.";

function buildBriefText(id: string, query: string) {
  return `Correction Brief for ticket ${id}. Employee query: ${query}. Root cause: ${DIAGNOSIS} Proposed fix: Update the knowledge base article titled "${DRAFT_TITLE}". Action required: Review the auto-drafted article and click Approve to publish.`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   DEMO
═══════════════════════════════════════════════════════════════════════════ */

const DEMO_STEPS = [
  "LoopCraft has detected 47 failed AI interactions this week.",
  "Agent diagnoses root cause — stale VPN article from 2023.",
  "LoopCraft auto-drafts a corrected KB article from resolved tickets.",
  "IT admin reviews and approves with one click.",
  "Freddy AI deflection on VPN queries jumps from 23% to 67%.",
] as const;

function DemoToast({ step, message }: { step: number; message: string }) {
  return (
    <div role="status" aria-live="polite" className="fixed bottom-6 right-6 z-[60] max-w-sm w-full" style={{
      background: "#1F2937", borderRadius: 10, padding: "12px 16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)", border: "1px solid #374151"
    }}>
      <div className="flex items-center gap-2 mb-1">
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#1D6AE5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{step}</span>
        </div>
        <span style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 500 }}>Step {step} of 5</span>
      </div>
      <p style={{ color: "#F9FAFB", fontSize: 13, lineHeight: 1.5, paddingLeft: 28 }}>{message}</p>
    </div>
  );
}

function SpeechErrorToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => { const t = setTimeout(onDismiss, 3000); return () => clearTimeout(t); }, [onDismiss]);
  return (
    <div role="alert" className="fixed bottom-6 right-6 z-[70] flex items-center gap-2 text-white text-sm font-medium max-w-xs"
      style={{ background: "#DC2626", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 16px rgba(220,38,38,0.4)" }}>
      <AlertTriangle size={14} /> {message}
    </div>
  );
}

function StepIndicator({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-2">
      {DEMO_STEPS.map((_, i) => {
        const n = i + 1; const isActive = n === active; const isDone = n < active;
        return (
          <React.Fragment key={n}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, flexShrink: 0, transition: "all 0.3s",
              background: isActive ? "#1D6AE5" : isDone ? "#10B981" : "#E5E7EB",
              color: (isActive || isDone) ? "#fff" : "#9CA3AF",
              boxShadow: isActive ? "0 0 0 4px rgba(29,106,229,0.2)" : "none",
            }}>
              {isDone ? <CheckCircle size={13} /> : n}
            </div>
            {i < DEMO_STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, borderRadius: 2, background: isDone ? "#10B981" : "#E5E7EB", transition: "background 0.5s" }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE HEADER
═══════════════════════════════════════════════════════════════════════════ */

function PageHeader({ onDemo, running }: { onDemo: () => void; running: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        <nav className="flex items-center gap-1 mb-2 flex-wrap">
          {["AI Agent Studio", "LoopCraft Supervisor Agent", "Feedback Loops"].map((c, i, a) => (
            <React.Fragment key={c}>
              <span style={{ fontSize: 12, color: i === a.length - 1 ? "#1D6AE5" : "#9CA3AF", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
              {i < a.length - 1 && <ChevronRight size={12} style={{ color: "#D1D5DB" }} />}
            </React.Fragment>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#1D6AE5,#1558C0)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(29,106,229,0.3)" }}>
            <Zap size={18} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>Feedback Loops</h1>
            <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Intercepts failed AI responses · diagnoses root causes · auto-drafts KB corrections</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 flex-wrap pt-1">
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 999, padding: "4px 10px" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} className="animate-pulse" />
          <span style={{ fontSize: 12, color: "#15803D", fontWeight: 500 }}>Live · 2 min ago</span>
        </div>
        <button type="button" onClick={onDemo} disabled={running}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: "1px solid #C7D2FE", background: "#EEF2FF", color: "#4338CA", fontSize: 13, fontWeight: 500, cursor: running ? "not-allowed" : "pointer", opacity: running ? 0.6 : 1 }}>
          <Play size={13} fill="#4338CA" /> {running ? "Running…" : "Start Demo"}
        </button>
        <button type="button" className="fs-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <RefreshCw size={14} /> Run Correction Scan
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARDS — all inline styles
═══════════════════════════════════════════════════════════════════════════ */

const STAT_CONFIGS = [
  {
    label: "Failed Deflections (7D)",
    value: "47",
    valueBg: "#FEF2F2", valueBorder: "#FECACA", valueColor: "#DC2626",
    icon: <TrendingDown size={44} color="#FCA5A5" />,
    trend: <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 999, padding: "2px 8px", fontSize: 11, color: "#16A34A", fontWeight: 600 }}><ArrowDown size={11} /> −12% vs last week</span>,
    clickable: false, pulse: "maybe",
  },
  {
    label: "KB Articles Flagged",
    value: "9",
    valueBg: "#FFFBEB", valueBorder: "#FDE68A", valueColor: "#D97706",
    icon: <FileText size={44} color="#FCD34D" />,
    sub: <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}><AlertTriangle size={13} color="#D97706" /><span style={{ fontSize: 11, color: "#B45309", fontWeight: 500 }}>awaiting review</span></div>,
    clickLabel: "View KB audit →",
    clickable: true,
  },
  {
    label: "Drafts Auto-Generated",
    value: "6",
    valueBg: "#EFF6FF", valueBorder: "#BFDBFE", valueColor: "#1D6AE5",
    icon: <Zap size={44} color="#93C5FD" />,
    sub: <span style={{ display: "inline-flex", background: "#DBEAFE", borderRadius: 999, padding: "2px 8px", fontSize: 11, color: "#1D4ED8", fontWeight: 600, marginTop: 6 }}>ready to approve</span>,
    clickable: false,
  },
  {
    label: "Deflection Rate",
    value: "61%",
    valueBg: "#F0FDF4", valueBorder: "#BBF7D0", valueColor: "#16A34A",
    icon: <Shield size={44} color="#86EFAC" />,
    trend: <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 999, padding: "2px 8px", fontSize: 11, color: "#16A34A", fontWeight: 600 }}><ArrowUp size={11} /> +18pp after last fix</span>,
    clickable: false,
  },
];

function StatsRow({ onKBClick, pulse }: { onKBClick: () => void; pulse: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
      {STAT_CONFIGS.map((cfg, idx) => (
        <div key={cfg.label}
          role={cfg.clickable ? "button" : undefined}
          tabIndex={cfg.clickable ? 0 : undefined}
          onClick={cfg.clickable ? onKBClick : undefined}
          onKeyDown={cfg.clickable ? (e) => e.key === "Enter" && onKBClick() : undefined}
          style={{
            background: cfg.valueBg, border: `1px solid ${cfg.valueBorder}`, borderRadius: 10, padding: 16,
            position: "relative", overflow: "hidden", cursor: cfg.clickable ? "pointer" : "default",
            transition: "all 0.15s", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            animation: pulse && idx === 0 ? "pulse 1s ease-in-out infinite" : "none",
          }}
          className={cfg.clickable ? "hover:shadow-md" : ""}
        >
          {/* Watermark icon */}
          <div style={{ position: "absolute", right: 8, top: 8, opacity: 0.18 }}>{cfg.icon}</div>

          <p style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{cfg.label}</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: cfg.valueColor, lineHeight: 1, marginBottom: 8 }}>{cfg.value}</p>
          {cfg.trend && cfg.trend}
          {cfg.sub && cfg.sub}
          {cfg.clickable && (
            <p style={{ fontSize: 12, color: "#1D6AE5", marginTop: 8, fontWeight: 600, display: "flex", alignItems: "center", gap: 2 }}>
              {cfg.clickLabel} <ChevronRight size={12} />
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAILURE QUEUE
═══════════════════════════════════════════════════════════════════════════ */

function FailureCard({ ticket, selected, approved, onClick }: {
  ticket: FailureTicket; selected: boolean; approved: boolean; onClick: () => void;
}) {
  const s = TYPE_STYLE[ticket.type];
  return (
    <button type="button" id={`ticket-${ticket.id}`} onClick={onClick} aria-pressed={selected}
      style={{
        width: "100%", textAlign: "left", padding: 12, borderRadius: 8,
        border: `1px solid ${selected ? "#BFDBFE" : "#E5E7EB"}`,
        borderLeft: `4px solid ${s.borderLeft}`,
        background: selected ? "#EFF6FF" : s.bg,
        cursor: "pointer", transition: "all 0.15s",
        boxShadow: selected ? "0 2px 8px rgba(29,106,229,0.1)" : "none",
        display: "block",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", background: "#F3F4F6", borderRadius: 4, padding: "2px 6px", fontFamily: "monospace" }}>
            #{ticket.id}
          </span>
          {approved && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: "#16A34A", background: "#F0FDF4", borderRadius: 999, padding: "1px 6px", fontWeight: 600, border: "1px solid #BBF7D0" }}>
              <CheckCircle size={10} /> Resolved
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>{ticket.time}</span>
      </div>

      <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8, lineHeight: 1.4 }}>{ticket.query}</p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", background: s.pillBg, color: s.pillText, border: `1px solid ${s.pillBorder}`, borderRadius: 999, padding: "2px 8px" }}>
          {ticket.type}
        </span>
        <span style={{ fontSize: 12, color: "#1D6AE5", fontWeight: 600 }}>View Fix →</span>
      </div>

      <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <span style={{ fontWeight: 500, color: "#6B7280" }}>KB:</span> {ticket.article}
      </p>
    </button>
  );
}

function FailureQueue({ selectedId, approvedIds, onSelect }: {
  selectedId: string; approvedIds: string[]; onSelect: (id: string) => void;
}) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #E5E7EB", background: "#FAFAFA", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={15} color="#EF4444" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Detected Failures</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 999, padding: "1px 8px" }}>
            {TICKETS.length - approvedIds.length} open
          </span>
        </div>
        <span style={{ fontSize: 11, color: "#9CA3AF", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 999, padding: "2px 8px" }}>Past 7 days</span>
      </div>

      {/* Color legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 16px", borderBottom: "1px solid #F3F4F6", background: "#fff", flexShrink: 0 }}>
        {[
          { label: "Stale Article", color: "#FBBF24" },
          { label: "No Coverage",   color: "#F87171" },
          { label: "Wrong Intent",  color: "#C084FC" },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />
            <span style={{ fontSize: 10, color: "#6B7280", fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      <ScrollArea className="flex-1">
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12 }}>
          {TICKETS.map((t) => (
            <FailureCard key={t.id} ticket={t} selected={selectedId === t.id}
              approved={approvedIds.includes(t.id)} onClick={() => onSelect(t.id)} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CORRECTION BRIEF
═══════════════════════════════════════════════════════════════════════════ */

function CorrectionBrief({ ticketId, isApproved, onApprove, pulseArticle, pulseApprove }: {
  ticketId: string; isApproved: boolean; onApprove: () => void;
  pulseArticle: boolean; pulseApprove: boolean;
}) {
  const ticket = TICKETS.find((t) => t.id === ticketId)!;
  const s = TYPE_STYLE[ticket.type];
  const isFeatured = ticketId === "T-4821";

  const { speak, stop, isLoading, isPlaying, error: speechError } = useSpeech();
  const [showSpeechErr, setShowSpeechErr] = useState(false);
  useEffect(() => { if (speechError) setShowSpeechErr(true); }, [speechError]);

  return (
    <>
      {showSpeechErr && speechError && (
        <SpeechErrorToast message={speechError} onDismiss={() => setShowSpeechErr(false)} />
      )}
      <div style={{
        background: "#fff", border: `1px solid ${isApproved ? "#6EE7B7" : pulseArticle ? "#1D6AE5" : "#E5E7EB"}`,
        borderRadius: 10, boxShadow: `0 1px 4px rgba(0,0,0,0.06)${isApproved ? ", 0 0 0 3px rgba(16,185,129,0.15)" : pulseArticle ? ", 0 0 0 3px rgba(29,106,229,0.15)" : ""}`,
        display: "flex", flexDirection: "column", overflow: "hidden", height: "100%", transition: "all 0.3s",
      }}>

        {/* Header */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", flexShrink: 0, background: "#FAFAFA" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#1D6AE5,#1558C0)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 6px rgba(29,106,229,0.3)" }}>
                <FileText size={14} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                  Correction Brief <span style={{ fontFamily: "monospace", fontSize: 11, color: "#9CA3AF", fontWeight: 400 }}>#{ticketId}</span>
                </p>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", background: s.pillBg, color: s.pillText, border: `1px solid ${s.pillBorder}`, borderRadius: 999, padding: "1px 7px", display: "inline-block", marginTop: 2 }}>
                  {ticket.type}
                </span>
              </div>
            </div>

            {/* Listen */}
            {isFeatured && (
              isLoading ? (
                <button disabled style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#fff", color: "#9CA3AF", fontSize: 11, cursor: "not-allowed", flexShrink: 0 }}>
                  <Loader2 size={12} className="animate-spin" /> Generating…
                </button>
              ) : isPlaying ? (
                <button type="button" onClick={stop} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: "1px solid #BFDBFE", background: "#DBEAFE", color: "#1D6AE5", fontSize: 11, fontWeight: 500, cursor: "pointer", flexShrink: 0 }}>
                  <VolumeX size={12} /> Stop
                </button>
              ) : (
                <button type="button" onClick={() => speak(buildBriefText(ticket.id, ticket.query))} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 11, fontWeight: 500, cursor: "pointer", flexShrink: 0 }}>
                  <Volume2 size={12} /> Listen
                </button>
              )
            )}
          </div>

          {isFeatured && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 6, padding: "8px 10px", marginTop: 10 }}>
              <AlertTriangle size={13} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
                <strong>Root cause:</strong> {DIAGNOSIS}
              </p>
            </div>
          )}
          <p style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic", marginTop: 8 }}>Diagnosed by LoopCraft Supervisor Agent · {ticket.time}</p>
        </div>

        {/* Body */}
        <ScrollArea className="flex-1">
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* ── Approved banner */}
            {isApproved && (
              <div style={{ borderRadius: 10, border: "1px solid #6EE7B7", background: "linear-gradient(135deg,#ECFDF5,#D1FAE5)", padding: 14, display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle size={15} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>Article published to Freshservice KB ✓</p>
                  <p style={{ fontSize: 12, color: "#047857", marginTop: 2 }}>Freddy AI will use the updated article in future responses.</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, background: "#fff", borderRadius: 8, border: "1px solid #A7F3D0", padding: "6px 12px" }}>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>Deflection rate:</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#9CA3AF", textDecoration: "line-through" }}>23%</span>
                    <span style={{ fontSize: 18, color: "#374151" }}>→</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>67%</span>
                    <span style={{ background: "#D1FAE5", color: "#065F46", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>+44pp</span>
                  </div>
                </div>
              </div>
            )}

            {isFeatured ? (
              <>
                {/* ── Chat */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
                    <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 999, padding: "2px 8px" }}>Employee Interaction</span>
                    <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
                  </div>

                  {/* Employee bubble */}
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, fontWeight: 700, color: "#4B5563" }}>MT</div>
                    <div style={{ background: "#F3F4F6", borderRadius: "12px 12px 12px 2px", padding: "8px 12px", maxWidth: 210 }}>
                      <p style={{ fontSize: 13, color: "#111827" }}>How do I connect to VPN from home?</p>
                    </div>
                  </div>

                  {/* Freddy bubble */}
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 10, flexDirection: "row-reverse" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#1D6AE5,#1558C0)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, fontWeight: 700, color: "#fff", boxShadow: "0 2px 6px rgba(29,106,229,0.3)" }}>AI</div>
                    <div style={{ background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", border: "1px solid #BFDBFE", borderRadius: "12px 12px 2px 12px", padding: "8px 12px", maxWidth: 210 }}>
                      <p style={{ fontSize: 13, color: "#1E3A5F" }}>Please follow the Cisco AnyConnect Setup Guide v2.1 to connect.</p>
                    </div>
                  </div>

                  {/* Thumbs down */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "8px 12px" }}>
                    <ThumbsDown size={13} color="#EF4444" />
                    <span style={{ fontSize: 12, color: "#991B1B" }}>Employee rated: <strong>Unhelpful</strong></span>
                  </div>
                </div>

                {/* ── Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#15803D", borderRadius: 999, padding: "2px 8px" }}>AI-Generated Fix</span>
                  <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
                </div>

                {/* ── Draft article */}
                <div>
                  <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Proposed KB Update</p>
                  <input readOnly value={DRAFT_TITLE}
                    style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 6, padding: "8px 12px", fontSize: 13, fontWeight: 600, color: "#111827", background: "#fff", outline: "none", cursor: "default", marginBottom: 10 }} />

                  <div style={{
                    borderRadius: 8, border: `1px solid ${pulseArticle ? "#1D6AE5" : "#A7F3D0"}`,
                    overflow: "hidden", transition: "all 0.5s",
                    boxShadow: pulseArticle ? "0 0 0 3px rgba(29,106,229,0.15)" : "none",
                  }}>
                    <div style={{ background: "linear-gradient(90deg,#059669,#10B981)", padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                      <CheckCircle size={12} color="#fff" />
                      <p style={{ fontSize: 11, color: "#fff", fontWeight: 500 }}>Auto-drafted from #T-4821 · Reviewed by AI · Pending admin approval</p>
                    </div>
                    <div style={{ background: "#fff", padding: 12, fontSize: 12, color: "#374151", lineHeight: 1.7, fontFamily: "monospace", borderTop: "1px solid #D1FAE5", whiteSpace: "pre-wrap" }}>
                      {`Meridian Technologies migrated from Cisco AnyConnect to Palo Alto GlobalProtect (March 2025).

Step 1: Download GlobalProtect at portal.meridiantech.com/vpn
Step 2: Install and launch the application.
Step 3: Enter gateway: vpn.meridiantech.com
Step 4: Authenticate with your Okta credentials.

⚠ Cisco AnyConnect is no longer supported. Contact IT if needed.`}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#EFF6FF", border: "2px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <RefreshCw size={20} color="#1D6AE5" className="animate-spin" style={{ animationDuration: "3s" }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Brief in progress</p>
                <p style={{ fontSize: 12, color: "#9CA3AF", maxWidth: 200 }}>LoopCraft is diagnosing #{ticketId} and drafting a KB correction.</p>
                <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D6AE5", display: "inline-block" }}
                      className="animate-bounce" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {!isApproved && isFeatured && (
          <div style={{ padding: "10px 16px", borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, background: "#FAFAFA" }}>
            <Button variant="primary" size="md" onClick={onApprove}
              className={cn("gap-1.5", pulseApprove && "animate-pulse ring-2 ring-fw-blue ring-offset-1")}>
              <CheckCircle size={14} /> Approve &amp; Publish
            </Button>
            <button type="button" style={{ height: 32, padding: "0 12px", fontSize: 13, fontWeight: 500, borderRadius: 6, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}>
              Edit Draft
            </button>
            <button type="button" style={{ height: 32, padding: "0 8px", fontSize: 13, color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
              Discard
            </button>
          </div>
        )}
        {isApproved && (
          <div style={{ padding: "10px 16px", borderTop: "1px solid #A7F3D0", background: "linear-gradient(90deg,#ECFDF5,#D1FAE5)", flexShrink: 0 }}>
            <p style={{ fontSize: 12, color: "#065F46", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle size={13} color="#10B981" /> Published to Freshservice KB · No further action required
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════════════════ */

export default function FeedbackLoopsDashboard() {
  const [selectedId,  setSelectedId]  = useState("T-4821");
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [showKBPanel, setShowKBPanel] = useState(false);
  const [demoStep,    setDemoStep]    = useState(0);
  const [demoToast,   setDemoToast]   = useState<{ step: number; msg: string } | null>(null);
  const [demoDone,    setDemoDone]    = useState(false);
  const [pulseStats,  setPulseStats]  = useState(false);
  const [pulseArticle,setPulseArticle]= useState(false);
  const [pulseApprove,setPulseApprove]= useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);
  const after = useCallback((fn: () => void, ms: number) => { timersRef.current.push(setTimeout(fn, ms)); }, []);

  function startDemo() {
    timersRef.current.forEach(clearTimeout); timersRef.current = [];
    setApprovedIds([]); setSelectedId("T-4821"); setDemoDone(false);
    setPulseStats(false); setPulseArticle(false); setPulseApprove(false);
    setDemoStep(1); setPulseStats(true); setDemoToast({ step: 1, msg: DEMO_STEPS[0] });
    after(() => { setPulseStats(false); setDemoStep(2); setDemoToast({ step: 2, msg: DEMO_STEPS[1] }); document.getElementById("ticket-T-4821")?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 2500);
    after(() => { setPulseArticle(true);  setDemoStep(3); setDemoToast({ step: 3, msg: DEMO_STEPS[2] }); }, 5000);
    after(() => { setPulseArticle(false); setPulseApprove(true); setDemoStep(4); setDemoToast({ step: 4, msg: DEMO_STEPS[3] }); }, 7500);
    after(() => { setPulseApprove(false); setApprovedIds(["T-4821"]); setDemoStep(5); setDemoToast({ step: 5, msg: DEMO_STEPS[4] }); }, 10000);
    after(() => { setDemoStep(0); setDemoToast(null); setDemoDone(true); }, 13000);
  }

  return (
    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20, minHeight: "100vh" }}>

      <PageHeader onDemo={startDemo} running={demoStep > 0} />

      {/* Demo banner */}
      {(demoStep > 0 || demoDone) && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {demoStep > 0 ? <StepIndicator active={demoStep} /> : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={14} color="#fff" />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#065F46" }}>
                Demo complete — Freddy AI will no longer route VPN queries to the deprecated Cisco guide.
              </p>
            </div>
          )}
        </div>
      )}

      <StatsRow onKBClick={() => setShowKBPanel(true)} pulse={pulseStats} />

      {/* Split panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, flex: 1, minHeight: 0 }}>
        <div style={{ height: "calc(100vh - 300px)", minHeight: 360 }}>
          <FailureQueue selectedId={selectedId} approvedIds={approvedIds} onSelect={setSelectedId} />
        </div>
        <div style={{ height: "calc(100vh - 300px)", minHeight: 360 }}>
          <CorrectionBrief
            ticketId={selectedId} isApproved={approvedIds.includes(selectedId)}
            onApprove={() => setApprovedIds((p) => p.includes(selectedId) ? p : [...p, selectedId])}
            pulseArticle={pulseArticle} pulseApprove={pulseApprove}
          />
        </div>
      </div>

      <KBHealthPanel open={showKBPanel} onClose={() => setShowKBPanel(false)} />
      {demoToast && <DemoToast key={demoToast.step} step={demoToast.step} message={demoToast.msg} />}
    </div>
  );
}
