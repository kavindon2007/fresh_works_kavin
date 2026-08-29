"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  RefreshCw,
  ArrowDown,
  ArrowUp,
  ChevronRight,
  ThumbsDown,
  CheckCircle,
  Play,
  Volume2,
  VolumeX,
  Loader2,
  AlertTriangle,
  FileText,
  TrendingDown,
  TrendingUp,
  Zap,
  Shield,
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
  id: string;
  query: string;
  type: "STALE ARTICLE" | "NO COVERAGE" | "WRONG INTENT";
  article: string;
  time: string;
}

const TICKETS: FailureTicket[] = [
  { id: "T-4821", query: "How do I connect to VPN from home?",     type: "STALE ARTICLE", article: "Cisco AnyConnect Setup v2.1",   time: "3 hours ago" },
  { id: "T-4834", query: "Reset my Okta MFA device",               type: "NO COVERAGE",   article: "(No article found)",            time: "5 hours ago" },
  { id: "T-4802", query: "Request Adobe Creative Cloud license",    type: "STALE ARTICLE", article: "Software Request Process 2022", time: "8 hours ago" },
  { id: "T-4779", query: "Laptop not connecting to dock",           type: "WRONG INTENT",  article: "Wi-Fi Troubleshooting Guide",   time: "1 day ago"   },
  { id: "T-4751", query: "How do I access Salesforce sandbox?",     type: "NO COVERAGE",   article: "(No article found)",            time: "1 day ago"   },
];

const TYPE_CONFIG: Record<FailureTicket["type"], {
  pill: string;
  border: string;
  bg: string;
}> = {
  "STALE ARTICLE": {
    pill:   "bg-amber-100 text-amber-800 border-amber-300",
    border: "border-l-amber-400",
    bg:     "bg-amber-50/40",
  },
  "NO COVERAGE": {
    pill:   "bg-red-100 text-red-800 border-red-300",
    border: "border-l-red-400",
    bg:     "bg-red-50/40",
  },
  "WRONG INTENT": {
    pill:   "bg-purple-100 text-purple-800 border-purple-300",
    border: "border-l-purple-400",
    bg:     "bg-purple-50/40",
  },
};

const DRAFT_TITLE = "Connecting to GlobalProtect VPN (Updated March 2025)";
const DIAGNOSIS   = "KB article references deprecated Cisco AnyConnect. Company migrated to Palo Alto GlobalProtect in March 2025.";

function buildBriefText(id: string, query: string) {
  return (
    `Correction Brief for ticket ${id}. ` +
    `Employee query: ${query}. ` +
    `Root cause: ${DIAGNOSIS} ` +
    `Proposed fix: Update the knowledge base article titled "${DRAFT_TITLE}". ` +
    `Action required: Review the auto-drafted article and click Approve to publish.`
  );
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
    <div role="status" aria-live="polite"
      className="fixed bottom-6 right-6 z-[60] bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl max-w-sm w-full border border-gray-700">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-full bg-fw-blue flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-white">{step}</span>
        </div>
        <p className="text-[11px] text-gray-400 font-medium">Step {step} of 5</p>
      </div>
      <p className="text-sm leading-snug pl-7">{message}</p>
    </div>
  );
}

function SpeechErrorToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => { const t = setTimeout(onDismiss, 3000); return () => clearTimeout(t); }, [onDismiss]);
  return (
    <div role="alert" className="fixed bottom-6 right-6 z-[70] bg-red-600 text-white px-4 py-3 rounded-lg shadow-xl text-sm font-medium max-w-xs flex items-center gap-2">
      <AlertTriangle size={14} />
      {message}
    </div>
  );
}

function StepIndicator({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-2">
      {DEMO_STEPS.map((_, i) => {
        const n = i + 1;
        const isActive = n === active;
        const isDone   = n < active;
        return (
          <React.Fragment key={n}>
            <div className={cn(
              "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 transition-all duration-300",
              isActive && "bg-fw-blue text-white shadow-[0_0_0_3px_rgba(29,106,229,0.2)]",
              isDone   && "bg-emerald-500 text-white",
              !isActive && !isDone && "bg-gray-200 text-gray-400"
            )}>
              {isDone ? <CheckCircle size={12} /> : n}
            </div>
            {i < DEMO_STEPS.length - 1 && (
              <div className={cn("flex-1 h-0.5 rounded transition-all duration-500", isDone ? "bg-emerald-400" : "bg-gray-200")} />
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
              <span className={cn("text-xs", i === a.length - 1 ? "text-fw-blue font-medium" : "text-gray-400 hover:text-gray-600 cursor-pointer")}>
                {c}
              </span>
              {i < a.length - 1 && <ChevronRight size={12} className="text-gray-300 shrink-0" />}
            </React.Fragment>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fw-blue to-blue-700 flex items-center justify-center shadow-sm shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Feedback Loops</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Intercepts failed AI responses · diagnoses root causes · auto-drafts KB corrections
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 pt-1 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-xs text-emerald-700 font-medium">Live · 2 min ago</span>
        </div>

        <button
          type="button"
          onClick={onDemo}
          disabled={running}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={13} fill="currentColor" />
          {running ? "Running…" : "Start Demo"}
        </button>

        <button type="button" className="fs-btn-primary flex items-center gap-1.5">
          <RefreshCw size={14} />
          Run Correction Scan
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATS ROW — colored cards
═══════════════════════════════════════════════════════════════════════════ */

interface StatCardProps {
  label: string;
  value: string;
  valueColor: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
  trend?: React.ReactNode;
  sub?: React.ReactNode;
  onClick?: () => void;
  pulse?: boolean;
}

function StatCard({ label, value, valueColor, bg, border, icon, trend, sub, onClick, pulse }: StatCardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(
        "relative rounded-lg border p-4 transition-all duration-150 overflow-hidden",
        bg, border,
        onClick && "cursor-pointer hover:shadow-md hover:scale-[1.01]",
        pulse && "animate-pulse"
      )}
    >
      {/* Icon top-right */}
      <div className="absolute top-3 right-3 opacity-20">
        {icon}
      </div>

      <p className="text-[11px] text-gray-500 uppercase tracking-wide font-semibold mb-1.5">{label}</p>
      <p className={cn("text-3xl font-extrabold leading-none mb-2", valueColor)}>{value}</p>
      {trend && <div className="flex items-center gap-1">{trend}</div>}
      {sub}
      {onClick && (
        <p className="text-xs text-fw-blue mt-2 font-semibold flex items-center gap-0.5">
          View details <ChevronRight size={11} />
        </p>
      )}
    </div>
  );
}

function StatsRow({ onKBClick, pulse }: { onKBClick: () => void; pulse: boolean }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>

      <StatCard
        label="Failed Deflections (7d)"
        value="47"
        valueColor="text-red-600"
        bg="bg-red-50"
        border="border-red-200"
        icon={<TrendingDown size={40} className="text-red-400" />}
        pulse={pulse}
        trend={
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">
            <ArrowDown size={11} />−12% vs last week
          </span>
        }
      />

      <StatCard
        label="KB Articles Flagged"
        value="9"
        valueColor="text-amber-600"
        bg="bg-amber-50"
        border="border-amber-200"
        icon={<FileText size={40} className="text-amber-400" />}
        onClick={onKBClick}
        sub={
          <div className="flex items-center gap-1.5 mt-1.5">
            <AlertTriangle size={12} className="text-amber-500 shrink-0" />
            <span className="text-xs text-amber-700 font-medium">awaiting review</span>
          </div>
        }
      />

      <StatCard
        label="Drafts Auto-Generated"
        value="6"
        valueColor="text-fw-blue"
        bg="bg-blue-50"
        border="border-blue-200"
        icon={<Zap size={40} className="text-blue-400" />}
        sub={
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-fw-blue bg-blue-100 rounded-full px-2 py-0.5 mt-1.5">
            ready to approve
          </span>
        }
      />

      <StatCard
        label="Deflection Rate"
        value="61%"
        valueColor="text-emerald-600"
        bg="bg-emerald-50"
        border="border-emerald-200"
        icon={<Shield size={40} className="text-emerald-400" />}
        trend={
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-100 rounded-full px-2 py-0.5">
            <ArrowUp size={11} />+18pp after last fix
          </span>
        }
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAILURE QUEUE — left-border color coded
═══════════════════════════════════════════════════════════════════════════ */

function FailureCard({ ticket, selected, approved, onClick }: {
  ticket: FailureTicket; selected: boolean; approved: boolean; onClick: () => void;
}) {
  const cfg = TYPE_CONFIG[ticket.type];
  return (
    <button
      type="button"
      id={`ticket-${ticket.id}`}
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "w-full text-left p-3 rounded-lg border-l-4 border border-fw-border transition-all duration-150 cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-fw-blue",
        cfg.border,
        selected
          ? "bg-blue-50 border-blue-200 shadow-sm"
          : cn("bg-white hover:bg-gray-50 hover:shadow-sm", !selected && cfg.bg)
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 font-mono">
            #{ticket.id}
          </span>
          {approved && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 rounded-full px-2 py-0.5">
              <CheckCircle size={10} /> Resolved
            </span>
          )}
        </div>
        <span className="text-[11px] text-gray-400 shrink-0">{ticket.time}</span>
      </div>

      <p className="text-sm font-semibold text-gray-800 mb-2 leading-snug">{ticket.query}</p>

      <div className="flex items-center justify-between gap-2">
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border",
          cfg.pill
        )}>
          {ticket.type}
        </span>
        <span className="text-xs text-fw-blue hover:underline cursor-pointer shrink-0 font-medium">
          View Fix →
        </span>
      </div>

      <p className="text-[11px] text-gray-400 mt-1.5 truncate">
        <span className="font-medium text-gray-500">KB:</span> {ticket.article}
      </p>
    </button>
  );
}

function FailureQueue({ selectedId, approvedIds, onSelect }: {
  selectedId: string; approvedIds: string[]; onSelect: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg border border-fw-border shadow-sm flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-fw-border shrink-0 bg-gray-50">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-red-500" />
          <span className="text-sm font-bold text-gray-800">Detected Failures</span>
          <span className="rounded-full bg-red-100 text-red-700 text-[11px] font-bold px-2 py-0.5 border border-red-200">
            {TICKETS.length - approvedIds.length} open
          </span>
        </div>
        <span className="text-[11px] text-gray-400 bg-white rounded-full px-2 py-0.5 border border-gray-200">Past 7 days</span>
      </div>

      {/* Color legend */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-fw-border bg-white shrink-0">
        {[
          { label: "Stale Article", color: "bg-amber-400" },
          { label: "No Coverage",   color: "bg-red-400"   },
          { label: "Wrong Intent",  color: "bg-purple-400" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={cn("w-2 h-2 rounded-full shrink-0", color)} />
            <span className="text-[10px] text-gray-500 font-medium">{label}</span>
          </div>
        ))}
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-3">
          {TICKETS.map((t) => (
            <FailureCard
              key={t.id}
              ticket={t}
              selected={selectedId === t.id}
              approved={approvedIds.includes(t.id)}
              onClick={() => onSelect(t.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CORRECTION BRIEF — with avatars + styled chat
═══════════════════════════════════════════════════════════════════════════ */

function CorrectionBrief({ ticketId, isApproved, onApprove, pulseArticle, pulseApprove }: {
  ticketId: string; isApproved: boolean; onApprove: () => void;
  pulseArticle: boolean; pulseApprove: boolean;
}) {
  const ticket     = TICKETS.find((t) => t.id === ticketId)!;
  const isFeatured = ticketId === "T-4821";
  const cfg        = TYPE_CONFIG[ticket.type];

  const { speak, stop, isLoading, isPlaying, error: speechError } = useSpeech();
  const [showSpeechErr, setShowSpeechErr] = useState(false);
  useEffect(() => { if (speechError) setShowSpeechErr(true); }, [speechError]);

  return (
    <>
      {showSpeechErr && speechError && (
        <SpeechErrorToast message={speechError} onDismiss={() => setShowSpeechErr(false)} />
      )}

      <div className={cn(
        "bg-white rounded-lg border border-fw-border shadow-sm flex flex-col overflow-hidden h-full transition-all duration-300",
        isApproved   && "ring-2 ring-emerald-400 ring-offset-1",
        pulseArticle && "ring-2 ring-fw-blue ring-offset-1"
      )}>

        {/* Header */}
        <div className="px-4 py-3 border-b border-fw-border shrink-0 bg-gray-50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fw-blue to-blue-700 flex items-center justify-center shadow-sm shrink-0">
                <FileText size={13} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Correction Brief
                  <span className="ml-2 text-xs font-mono text-gray-500 font-normal">#{ticketId}</span>
                </p>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border mt-0.5",
                  cfg.pill
                )}>
                  {ticket.type}
                </span>
              </div>
            </div>

            {/* Listen button */}
            {isFeatured && (
              isLoading ? (
                <button disabled className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 bg-white text-[11px] text-gray-400 opacity-60 cursor-not-allowed shrink-0">
                  <Loader2 size={12} className="animate-spin" /> Generating…
                </button>
              ) : isPlaying ? (
                <button type="button" onClick={stop} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-blue-300 bg-blue-100 text-[11px] text-fw-blue font-medium hover:bg-blue-200 transition-colors cursor-pointer shrink-0">
                  <VolumeX size={12} /> Stop
                </button>
              ) : (
                <button type="button" onClick={() => speak(buildBriefText(ticket.id, ticket.query))} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 bg-white text-[11px] text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer shrink-0">
                  <Volume2 size={12} /> Listen
                </button>
              )
            )}
          </div>

          {isFeatured && (
            <div className="mt-2 flex items-start gap-1.5 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-snug">
                <span className="font-semibold">Root cause:</span> KB references deprecated Cisco AnyConnect. Migrated to GlobalProtect, March 2025.
              </p>
            </div>
          )}
          <p className="text-[11px] text-gray-400 italic mt-1.5">Diagnosed by LoopCraft Supervisor Agent · {ticket.time}</p>
        </div>

        {/* Body */}
        <ScrollArea className="flex-1">
          <div className="p-4 flex flex-col gap-4">

            {/* ── Success banner */}
            {isApproved && (
              <div className="rounded-lg border border-emerald-300 bg-gradient-to-r from-emerald-50 to-green-50 p-3 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-800">Article published to Freshservice KB ✓</p>
                  <p className="text-xs text-emerald-700 mt-0.5">Freddy AI will use the updated article in future responses.</p>
                  <div className="flex items-center gap-2 mt-2 p-2 bg-white rounded-md border border-emerald-200">
                    <span className="text-xs text-gray-500">Deflection rate:</span>
                    <span className="text-sm font-bold text-gray-400 line-through">23%</span>
                    <span className="text-lg">→</span>
                    <span className="text-sm font-extrabold text-emerald-600">67%</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 rounded-full px-2 py-0.5">+44pp</span>
                  </div>
                </div>
              </div>
            )}

            {isFeatured ? (
              <>
                {/* ── Conversation */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                    <span className="flex-1 h-px bg-gray-100" />
                    Employee Interaction
                    <span className="flex-1 h-px bg-gray-100" />
                  </p>

                  {/* Employee message */}
                  <div className="flex items-end gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-[10px] font-bold text-gray-600">
                      MT
                    </div>
                    <div className="bg-gray-100 rounded-lg rounded-bl-sm p-3 max-w-[220px]">
                      <p className="text-xs text-gray-800">How do I connect to VPN from home?</p>
                    </div>
                  </div>

                  {/* Freddy message */}
                  <div className="flex items-end gap-2 mb-3 flex-row-reverse">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fw-blue to-blue-700 flex items-center justify-center shrink-0 text-[10px] font-bold text-white shadow-sm">
                      AI
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg rounded-br-sm p-3 max-w-[220px]">
                      <p className="text-xs text-gray-800">Please follow the Cisco AnyConnect Setup Guide v2.1 to connect.</p>
                    </div>
                  </div>

                  {/* Thumbs down */}
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    <ThumbsDown size={13} className="text-red-500 shrink-0" />
                    <span className="text-xs text-red-700 font-medium">Employee rated this response: <span className="font-bold">Unhelpful</span></span>
                  </div>
                </div>

                {/* ── Divider */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">AI-Generated Fix</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* ── Draft article */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Proposed KB Update</p>

                  <input
                    readOnly
                    value={DRAFT_TITLE}
                    className="w-full border border-fw-border rounded-md px-3 py-2 text-sm font-semibold text-gray-800 bg-white mb-3 focus:outline-none cursor-default"
                  />

                  <div className={cn(
                    "rounded-lg border overflow-hidden transition-all duration-500",
                    pulseArticle
                      ? "border-fw-blue shadow-[0_0_0_3px_rgba(29,106,229,0.15)]"
                      : "border-emerald-300"
                  )}>
                    {/* Provenance bar */}
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-3 py-2 flex items-center gap-2">
                      <CheckCircle size={12} className="text-white shrink-0" />
                      <p className="text-[11px] text-white font-medium">
                        Auto-drafted from #T-4821 · Reviewed by AI · Pending admin approval
                      </p>
                    </div>
                    {/* Body */}
                    <div className="bg-white p-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line border-t border-emerald-100 font-mono text-xs">
                      {`Meridian Technologies migrated from Cisco AnyConnect to Palo Alto GlobalProtect as of March 2025.

Step 1: Download GlobalProtect from portal.meridiantech.com/vpn
Step 2: Install and launch the application.
Step 3: Enter gateway: vpn.meridiantech.com
Step 4: Authenticate with your Okta credentials.

⚠ Cisco AnyConnect is no longer supported. Contact IT if needed.`}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center mb-3">
                  <RefreshCw size={20} className="text-fw-blue animate-spin" style={{ animationDuration: "3s" }} />
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Brief in progress</p>
                <p className="text-xs text-gray-400 max-w-[200px]">
                  LoopCraft is diagnosing #{ticketId} and drafting a KB correction.
                </p>
                <div className="mt-3 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-fw-blue animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action row */}
        {!isApproved && isFeatured && (
          <div className="px-4 py-3 border-t border-fw-border flex items-center gap-2 shrink-0 bg-gray-50">
            <Button
              variant="primary"
              size="md"
              onClick={onApprove}
              className={cn("gap-1.5 shadow-sm", pulseApprove && "animate-pulse ring-2 ring-fw-blue ring-offset-1")}
            >
              <CheckCircle size={14} /> Approve &amp; Publish
            </Button>
            <button type="button" className="inline-flex items-center h-8 px-3 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
              Edit Draft
            </button>
            <button type="button" className="inline-flex items-center h-8 px-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer">
              Discard
            </button>
          </div>
        )}

        {isApproved && (
          <div className="px-4 py-3 border-t border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 shrink-0">
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle size={12} /> Published to Freshservice KB · No further action required
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

export default function FeedbackLoopsDashboard() {
  const [selectedId,   setSelectedId]   = useState("T-4821");
  const [approvedIds,  setApprovedIds]  = useState<string[]>([]);
  const [showKBPanel,  setShowKBPanel]  = useState(false);

  const [demoStep,     setDemoStep]     = useState(0);
  const [demoToast,    setDemoToast]    = useState<{ step: number; msg: string } | null>(null);
  const [demoComplete, setDemoComplete] = useState(false);
  const [pulseStats,   setPulseStats]   = useState(false);
  const [pulseArticle, setPulseArticle] = useState(false);
  const [pulseApprove, setPulseApprove] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const after = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  }, []);

  function handleApprove() {
    setApprovedIds((p) => p.includes(selectedId) ? p : [...p, selectedId]);
  }

  function startDemo() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setApprovedIds([]); setSelectedId("T-4821"); setDemoComplete(false);
    setPulseStats(false); setPulseArticle(false); setPulseApprove(false);

    setDemoStep(1); setPulseStats(true);
    setDemoToast({ step: 1, msg: DEMO_STEPS[0] });

    after(() => {
      setPulseStats(false); setSelectedId("T-4821");
      setDemoStep(2); setDemoToast({ step: 2, msg: DEMO_STEPS[1] });
      document.getElementById("ticket-T-4821")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 2500);
    after(() => { setPulseArticle(true); setDemoStep(3); setDemoToast({ step: 3, msg: DEMO_STEPS[2] }); }, 5000);
    after(() => { setPulseArticle(false); setPulseApprove(true); setDemoStep(4); setDemoToast({ step: 4, msg: DEMO_STEPS[3] }); }, 7500);
    after(() => { setPulseApprove(false); setApprovedIds(["T-4821"]); setDemoStep(5); setDemoToast({ step: 5, msg: DEMO_STEPS[4] }); }, 10000);
    after(() => { setDemoStep(0); setDemoToast(null); setDemoComplete(true); }, 13000);
  }

  return (
    <div className="px-6 py-5 flex flex-col gap-5 min-h-screen">

      {/* Header */}
      <PageHeader onDemo={startDemo} running={demoStep > 0} />

      {/* Demo banner */}
      {(demoStep > 0 || demoComplete) && (
        <div className="bg-white rounded-lg border border-fw-border shadow-sm px-4 py-3">
          {demoStep > 0 ? (
            <StepIndicator active={demoStep} />
          ) : (
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle size={14} className="text-white" />
              </div>
              <p className="text-sm text-emerald-800 font-semibold leading-snug">
                Demo complete — Freddy AI will no longer route VPN queries to the deprecated Cisco guide.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <StatsRow onKBClick={() => setShowKBPanel(true)} pulse={pulseStats} />

      {/* Split panels */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr", minHeight: 0 }}>
        <div style={{ height: "calc(100vh - 290px)", minHeight: 380 }}>
          <FailureQueue selectedId={selectedId} approvedIds={approvedIds} onSelect={setSelectedId} />
        </div>
        <div style={{ height: "calc(100vh - 290px)", minHeight: 380 }}>
          <CorrectionBrief
            ticketId={selectedId}
            isApproved={approvedIds.includes(selectedId)}
            onApprove={handleApprove}
            pulseArticle={pulseArticle}
            pulseApprove={pulseApprove}
          />
        </div>
      </div>

      {/* KB Drawer */}
      <KBHealthPanel open={showKBPanel} onClose={() => setShowKBPanel(false)} />

      {/* Demo toast */}
      {demoToast && <DemoToast key={demoToast.step} step={demoToast.step} message={demoToast.msg} />}
    </div>
  );
}
