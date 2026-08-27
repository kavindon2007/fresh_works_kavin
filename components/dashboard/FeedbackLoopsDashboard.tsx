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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import KBHealthPanel from "@/components/dashboard/KBHealthPanel";
import { useSpeech } from "@/hooks/useSpeech";

/* ═══════════════════════════════════════════════════════════════════════════
   SPEECH ERROR TOAST
═══════════════════════════════════════════════════════════════════════════ */

function SpeechErrorToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDismiss, 3000);
    return () => clearTimeout(id);
  }, [onDismiss]);

  return (
    <div
      role="alert"
      className={cn(
        "fixed bottom-6 right-6 z-[70]",
        "bg-red-600 text-white px-4 py-3 rounded shadow-xl",
        "text-sm font-medium max-w-xs animate-fade-in"
      )}
    >
      {message}
    </div>
  );
}

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
  { id: "T-4821", query: "How do I connect to VPN from home?",      type: "STALE ARTICLE", article: "Cisco AnyConnect Setup v2.1",   time: "3 hours ago" },
  { id: "T-4834", query: "Reset my Okta MFA device",                type: "NO COVERAGE",   article: "(No article found)",            time: "5 hours ago" },
  { id: "T-4802", query: "Request Adobe Creative Cloud license",     type: "STALE ARTICLE", article: "Software Request Process 2022", time: "8 hours ago" },
  { id: "T-4779", query: "Laptop not connecting to dock",            type: "WRONG INTENT",  article: "Wi-Fi Troubleshooting Guide",   time: "1 day ago"   },
  { id: "T-4751", query: "How do I access Salesforce sandbox?",      type: "NO COVERAGE",   article: "(No article found)",            time: "1 day ago"   },
];

const FAILURE_TYPE_STYLES: Record<FailureTicket["type"], string> = {
  "STALE ARTICLE": "bg-amber-50 text-amber-700 border-amber-200",
  "NO COVERAGE":   "bg-red-50   text-red-700   border-red-200",
  "WRONG INTENT":  "bg-purple-50 text-purple-700 border-purple-200",
};

/* ═══════════════════════════════════════════════════════════════════════════
   DEMO STEPS
═══════════════════════════════════════════════════════════════════════════ */

const DEMO_STEPS = [
  "LoopCraft has detected 47 failed AI interactions this week.",
  "Agent diagnoses root cause — stale VPN article from 2023.",
  "LoopCraft auto-drafts a corrected KB article from resolved tickets.",
  "IT admin reviews and approves with one click.",
  "Freddy AI deflection on VPN queries jumps from 23% to 67%.",
] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════════════════ */

interface ToastProps {
  step: number;
  message: string;
}

function DemoToast({ step, message }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 right-6 z-[60]",
        "bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl",
        "max-w-sm w-full",
        "animate-fade-in"
      )}
    >
      <p className="text-xs text-gray-400 mb-1 font-medium">Step {step} of 5</p>
      <p className="text-sm leading-snug">{message}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP INDICATOR
═══════════════════════════════════════════════════════════════════════════ */

function StepIndicator({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex items-center gap-2 px-1 py-3">
      {DEMO_STEPS.map((_, i) => {
        const step = i + 1;
        const isActive = step === activeStep;
        const isDone = step < activeStep;
        return (
          <React.Fragment key={step}>
            <div
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-all duration-300",
                isActive && "bg-fw-blue text-white ring-2 ring-blue-200",
                isDone  && "bg-fw-success text-white",
                !isActive && !isDone && "bg-gray-200 text-gray-500"
              )}
            >
              {isDone ? <CheckCircle size={12} /> : step}
            </div>
            {i < DEMO_STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px transition-all duration-500",
                  isDone ? "bg-fw-success" : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION A — PAGE HEADER
═══════════════════════════════════════════════════════════════════════════ */

interface PageHeaderProps {
  onStartDemo: () => void;
  demoRunning: boolean;
}

function PageHeader({ onStartDemo, demoRunning }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      {/* Left: breadcrumb + title */}
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 mb-2">
          {["AI Agent Studio", "LoopCraft Supervisor Agent", "Feedback Loops"].map(
            (crumb, i, arr) => (
              <React.Fragment key={crumb}>
                <span
                  className={cn(
                    "text-xs",
                    i === arr.length - 1
                      ? "text-gray-600 font-medium"
                      : "text-gray-400"
                  )}
                >
                  {crumb}
                </span>
                {i < arr.length - 1 && (
                  <ChevronRight size={12} className="text-gray-300 shrink-0" />
                )}
              </React.Fragment>
            )
          )}
        </nav>

        <h1 className="text-xl font-semibold text-gray-900 leading-tight">
          Feedback Loops
        </h1>
        <p className="text-sm text-gray-500 mt-1 max-w-xl">
          Intercepts failed AI responses, diagnoses root causes, and
          auto-drafts KB corrections for admin approval.
        </p>
      </div>

      {/* Right: sync + buttons */}
      <div className="flex items-center gap-2.5 shrink-0 pt-1">
        <span className="text-xs text-gray-400">Last synced: 2 minutes ago</span>

        {/* Demo button */}
        <button
          type="button"
          onClick={onStartDemo}
          disabled={demoRunning}
          aria-label="Start demo walkthrough"
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium",
            "border border-blue-200 text-fw-blue bg-blue-50",
            "hover:bg-blue-100 transition-colors duration-150 cursor-pointer",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Play size={13} />
          {demoRunning ? "Demo running…" : "Start Demo"}
        </button>

        {/* Scan button */}
        <button
          type="button"
          className="fs-btn-primary flex items-center gap-1.5"
        >
          <RefreshCw size={14} />
          Run Correction Scan
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION B — STATS ROW
═══════════════════════════════════════════════════════════════════════════ */

interface StatCardProps {
  label: string;
  value: string;
  trend?: React.ReactNode;
  sub?: React.ReactNode;
  onClick?: () => void;
  pulse?: boolean;
}

function StatCard({ label, value, trend, sub, onClick, pulse }: StatCardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(
        "fs-card p-4 transition-all duration-150",
        onClick && "cursor-pointer hover:border-gray-300 hover:shadow focus-visible:outline-2 focus-visible:outline-fw-blue focus-visible:outline-offset-2",
        pulse && "animate-pulse"
      )}
    >
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900 leading-none mb-2">
        {value}
      </p>
      {trend && <div className="flex items-center gap-1">{trend}</div>}
      {sub}
      {onClick && (
        <p className="text-xs text-fw-blue mt-2 font-medium">View details →</p>
      )}
    </div>
  );
}

interface StatsRowProps {
  onKBClick: () => void;
  pulseStats: boolean;
}

function StatsRow({ onKBClick, pulseStats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        label="Failed Deflections (7d)"
        value="47"
        pulse={pulseStats}
        trend={
          <>
            <ArrowDown size={12} className="text-fw-success shrink-0" />
            <span className="text-xs text-fw-success font-medium">−12% vs last week</span>
          </>
        }
      />
      <StatCard
        label="KB Articles Flagged"
        value="9"
        onClick={onKBClick}
        sub={
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#D97706" }} />
            <span className="text-xs text-gray-500">awaiting review</span>
          </div>
        }
      />
      <StatCard
        label="Drafts Auto-Generated"
        value="6"
        sub={<span className="text-xs text-fw-blue font-medium">ready to approve</span>}
      />
      <StatCard
        label="Deflection Rate"
        value="61%"
        trend={
          <>
            <ArrowUp size={12} className="text-fw-success shrink-0" />
            <span className="text-xs text-fw-success font-medium">+18pp after last fix</span>
          </>
        }
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LEFT PANEL — FAILURE QUEUE
═══════════════════════════════════════════════════════════════════════════ */

interface FailureCardProps {
  ticket: FailureTicket;
  isSelected: boolean;
  isApproved: boolean;
  onClick: () => void;
}

function FailureCard({ ticket, isSelected, isApproved, onClick }: FailureCardProps) {
  return (
    <button
      type="button"
      id={`ticket-${ticket.id}`}
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        "w-full text-left p-3 rounded border transition-all duration-150",
        "cursor-pointer focus-visible:outline-2 focus-visible:outline-fw-blue",
        isSelected
          ? "bg-blue-50 border-blue-200"
          : "bg-white border-fw-border hover:bg-gray-50 hover:border-gray-300"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">#{ticket.id}</span>
          {isApproved && (
            <span className="flex items-center gap-1 text-xs text-fw-success font-medium">
              <CheckCircle size={11} />
              Resolved
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400 shrink-0">{ticket.time}</span>
      </div>

      <p className="text-sm font-medium text-gray-800 mb-2 leading-snug">
        {ticket.query}
      </p>

      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide border",
            FAILURE_TYPE_STYLES[ticket.type]
          )}
        >
          {ticket.type}
        </span>
        <span className="text-xs text-fw-blue hover:underline cursor-pointer shrink-0">
          View Fix →
        </span>
      </div>

      <p className="text-xs text-gray-400 mt-1.5 truncate">KB: {ticket.article}</p>
    </button>
  );
}

interface FailureQueueProps {
  selectedId: string;
  approvedIds: string[];
  onSelect: (id: string) => void;
}

function FailureQueue({ selectedId, approvedIds, onSelect }: FailureQueueProps) {
  return (
    <div className="fs-card flex flex-col overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-fw-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Detected Failures</span>
          <span className="rounded-full bg-red-50 text-red-600 text-xs font-semibold px-2 py-px">
            {TICKETS.length - approvedIds.length}
          </span>
        </div>
        <span className="text-xs text-gray-400">Past 7 days</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-3">
          {TICKETS.map((ticket) => (
            <FailureCard
              key={ticket.id}
              ticket={ticket}
              isSelected={selectedId === ticket.id}
              isApproved={approvedIds.includes(ticket.id)}
              onClick={() => onSelect(ticket.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RIGHT PANEL — CORRECTION BRIEF
═══════════════════════════════════════════════════════════════════════════ */

/* Brief text for T-4821 */
const DRAFT_TITLE = "Connecting to GlobalProtect VPN (Updated March 2025)";
const DIAGNOSIS   = "KB article references deprecated Cisco AnyConnect. Company migrated to Palo Alto GlobalProtect in March 2025.";

function buildBriefText(ticketId: string, query: string): string {
  return (
    `Correction Brief for ticket ${ticketId}. ` +
    `Employee query: ${query}. ` +
    `Root cause: ${DIAGNOSIS} ` +
    `Proposed fix: Update the knowledge base article titled "${DRAFT_TITLE}". ` +
    `The corrected article covers the migration from Cisco AnyConnect ` +
    `to Palo Alto GlobalProtect, completed in March 2025. ` +
    `Action required: Review the auto-drafted article and click Approve to publish.`
  ).trim();
}

interface CorrectionBriefProps {
  ticketId: string;
  isApproved: boolean;
  onApprove: () => void;
  pulseArticle: boolean;
  pulseApprove: boolean;
}

function CorrectionBrief({ ticketId, isApproved, onApprove, pulseArticle, pulseApprove }: CorrectionBriefProps) {
  const ticket     = TICKETS.find((t) => t.id === ticketId)!;
  const isFeatured = ticketId === "T-4821";

  const { speak, stop, isLoading, isPlaying, error: speechError } = useSpeech();
  const [showSpeechError, setShowSpeechError] = React.useState(false);

  /* Show toast whenever speechError changes to a non-null value */
  React.useEffect(() => {
    if (speechError) setShowSpeechError(true);
  }, [speechError]);

  return (
    <>
    {showSpeechError && speechError && (
      <SpeechErrorToast
        message={speechError}
        onDismiss={() => setShowSpeechError(false)}
      />
    )}
    <div
      className={cn(
        "fs-card flex flex-col overflow-hidden h-full transition-all duration-300",
        isApproved  ? "ring-2 ring-fw-success ring-offset-1" : "",
        pulseArticle ? "ring-2 ring-fw-blue ring-offset-1" : ""
      )}
    >
      {/* Panel header */}
      <div className="px-4 py-3 border-b border-fw-border shrink-0">
        {/* Title row with Listen button */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-gray-900">
            Correction Brief — #{ticketId}
          </p>

          {/* Listen button — featured ticket only */}
          {isFeatured && (
            isLoading ? (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-gray-200 bg-white text-xs text-gray-400 opacity-60 cursor-not-allowed shrink-0"
              >
                <Loader2 size={14} className="animate-spin" />
                Generating…
              </button>
            ) : isPlaying ? (
              <button
                type="button"
                onClick={stop}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-blue-200 bg-blue-50 text-xs text-fw-blue hover:bg-blue-100 transition-colors duration-100 cursor-pointer shrink-0"
              >
                <VolumeX size={14} />
                Stop
              </button>
            ) : (
              <button
                type="button"
                onClick={() => speak(buildBriefText(ticket.id, ticket.query))}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 transition-colors duration-100 cursor-pointer shrink-0"
              >
                <Volume2 size={14} />
                Listen to Brief
              </button>
            )
          )}
        </div>

        {isFeatured ? (
          <p className="text-xs text-gray-500 mt-0.5 max-w-md leading-snug">
            Root cause: KB article references deprecated Cisco AnyConnect.
            Company migrated to Palo Alto GlobalProtect in March 2025.
          </p>
        ) : (
          <p className="text-xs text-gray-400 mt-0.5">
            Failure type: <span className="font-medium text-gray-600">{ticket.type}</span>
            {" · "}{ticket.article}
          </p>
        )}
        <p className="text-xs text-gray-400 italic mt-1.5">
          Diagnosed by LoopCraft Supervisor Agent · {ticket.time}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col gap-4">
          {/* Success banner */}
          {isApproved && (
            <div className="rounded border border-green-200 bg-green-50 p-3 flex items-start gap-2.5 animate-fade-in">
              <CheckCircle size={16} className="text-fw-success shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Article published to Freshservice KB.
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  Freddy AI will use the updated article in future responses.
                </p>
                <p className="text-xs font-semibold text-green-800 mt-1.5">
                  Deflection rate for &apos;VPN Setup&apos; queries:{" "}
                  <span className="line-through font-normal text-green-600">23%</span>
                  {" → "}
                  <span>67%</span>
                </p>
              </div>
            </div>
          )}

          {isFeatured ? (
            <>
              {/* Conversation replay */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Employee Interaction
                </p>
                <div className="flex justify-start mb-2">
                  <div className="bg-gray-100 rounded p-3 text-sm text-gray-800 max-w-xs">
                    How do I connect to VPN from home?
                  </div>
                </div>
                <div className="flex justify-end mb-2">
                  <div className="bg-blue-50 border border-blue-100 rounded p-3 text-sm text-gray-800 max-w-xs">
                    Please follow the Cisco AnyConnect Setup Guide v2.1 to connect.
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs text-gray-400">Employee rated this response:</span>
                  <ThumbsDown size={13} className="text-red-500 shrink-0" />
                  <span className="text-xs text-red-500 font-medium">Unhelpful</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200" />

              {/* Auto-drafted article */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Proposed KB Article Update
                </p>
                <input
                  readOnly
                  value="Connecting to GlobalProtect VPN (Updated March 2025)"
                  className="w-full border border-fw-border rounded px-2.5 py-2 text-sm font-medium text-gray-800 bg-white mb-3 cursor-default focus:outline-none"
                />
                <div
                  className={cn(
                    "rounded border overflow-hidden transition-all duration-500",
                    pulseArticle ? "border-fw-blue shadow-[0_0_0_3px_rgba(29,106,229,0.15)]" : "border-green-300"
                  )}
                >
                  <div className="bg-green-50 border-b border-green-200 px-3 py-1.5">
                    <p className="text-xs text-green-700">
                      ✓ Auto-drafted from ticket #T-4821 · Reviewed by AI · Pending admin approval
                    </p>
                  </div>
                  <div className="bg-white p-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {`Meridian Technologies has migrated from Cisco AnyConnect to Palo Alto GlobalProtect as of March 2025.

Step 1: Download GlobalProtect from the company portal at portal.meridiantech.com/vpn
Step 2: Install and launch the application.
Step 3: Enter gateway address: vpn.meridiantech.com
Step 4: Authenticate with your Okta credentials.

Note: The old Cisco AnyConnect client is no longer supported. Contact IT helpdesk if you need assistance.`}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <RefreshCw size={18} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Correction brief in progress</p>
              <p className="text-xs text-gray-400 max-w-xs">
                LoopCraft Supervisor Agent is diagnosing ticket #{ticketId} and drafting a KB
                correction. This typically takes 2–5 minutes.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-fw-blue animate-pulse-dot" />
                Analyzing conversation logs…
              </span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Action row */}
      {!isApproved && isFeatured && (
        <div className="px-4 py-3 border-t border-fw-border flex items-center gap-2 shrink-0 bg-white">
          <Button
            variant="primary"
            size="md"
            onClick={onApprove}
            className={cn("gap-1.5", pulseApprove && "animate-pulse ring-2 ring-fw-blue ring-offset-1")}
          >
            <CheckCircle size={14} />
            Approve &amp; Publish
          </Button>
          <button
            type="button"
            className="inline-flex items-center justify-center h-8 px-3 text-sm font-medium rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-100 cursor-pointer"
          >
            Edit Draft
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center h-8 px-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors duration-100 cursor-pointer"
          >
            Discard
          </button>
        </div>
      )}

      {isApproved && (
        <div className="px-4 py-3 border-t border-green-200 bg-green-50 shrink-0">
          <p className="text-xs text-green-700 font-medium flex items-center gap-1.5">
            <CheckCircle size={12} />
            Published to Freshservice KB · No further action required
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
  const [selectedId,   setSelectedId]   = useState<string>("T-4821");
  const [approvedIds,  setApprovedIds]  = useState<string[]>([]);
  const [showKBPanel,  setShowKBPanel]  = useState(false);

  /* ── Demo state ─────────────────────────────────────────────────────── */
  const [demoStep,     setDemoStep]     = useState<number>(0);   // 0 = not running
  const [demoToast,    setDemoToast]    = useState<{ step: number; msg: string } | null>(null);
  const [demoComplete, setDemoComplete] = useState(false);
  const [pulseStats,   setPulseStats]   = useState(false);
  const [pulseArticle, setPulseArticle] = useState(false);
  const [pulseApprove, setPulseApprove] = useState(false);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  function handleApprove() {
    setApprovedIds((prev) =>
      prev.includes(selectedId) ? prev : [...prev, selectedId]
    );
  }

  function startDemo() {
    /* Reset everything */
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setApprovedIds([]);
    setSelectedId("T-4821");
    setDemoComplete(false);
    setPulseStats(false);
    setPulseArticle(false);
    setPulseApprove(false);

    /* Step 1 — 0 ms */
    setDemoStep(1);
    setPulseStats(true);
    setDemoToast({ step: 1, msg: DEMO_STEPS[0] });

    /* Step 2 — 2.5 s */
    schedule(() => {
      setPulseStats(false);
      setSelectedId("T-4821");
      setDemoStep(2);
      setDemoToast({ step: 2, msg: DEMO_STEPS[1] });
      document.getElementById("ticket-T-4821")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 2500);

    /* Step 3 — 5 s */
    schedule(() => {
      setPulseArticle(true);
      setDemoStep(3);
      setDemoToast({ step: 3, msg: DEMO_STEPS[2] });
    }, 5000);

    /* Step 4 — 7.5 s */
    schedule(() => {
      setPulseArticle(false);
      setPulseApprove(true);
      setDemoStep(4);
      setDemoToast({ step: 4, msg: DEMO_STEPS[3] });
    }, 7500);

    /* Step 5 — 10 s */
    schedule(() => {
      setPulseApprove(false);
      setApprovedIds(["T-4821"]);
      setDemoStep(5);
      setDemoToast({ step: 5, msg: DEMO_STEPS[4] });
    }, 10000);

    /* Complete — 13 s */
    schedule(() => {
      setDemoStep(0);
      setDemoToast(null);
      setDemoComplete(true);
    }, 13000);
  }

  const demoRunning = demoStep > 0;

  return (
    <div className="px-8 py-6 flex flex-col gap-5 min-h-screen">

      {/* A — Page header */}
      <PageHeader onStartDemo={startDemo} demoRunning={demoRunning} />

      {/* Demo step indicator */}
      {(demoRunning || demoComplete) && (
        <div className="fs-card px-4 animate-fade-in">
          {demoRunning && <StepIndicator activeStep={demoStep} />}

          {demoComplete && (
            <div className="py-3 flex items-start gap-2.5">
              <CheckCircle size={16} className="text-fw-success shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 font-medium leading-snug">
                Demo complete. LoopCraft closed the loop — Freddy AI will no longer
                route VPN queries to the deprecated Cisco guide.
              </p>
            </div>
          )}
        </div>
      )}

      {/* B — Stats row */}
      <StatsRow
        onKBClick={() => setShowKBPanel(true)}
        pulseStats={pulseStats}
      />

      {/* C — Main split panel */}
      <div
        className="grid gap-6 flex-1"
        style={{ gridTemplateColumns: "1fr 1fr", minHeight: 0 }}
      >
        <div className="flex flex-col" style={{ maxHeight: "calc(100vh - 310px)" }}>
          <FailureQueue
            selectedId={selectedId}
            approvedIds={approvedIds}
            onSelect={setSelectedId}
          />
        </div>

        <div className="flex flex-col" style={{ maxHeight: "calc(100vh - 310px)" }}>
          <CorrectionBrief
            ticketId={selectedId}
            isApproved={approvedIds.includes(selectedId)}
            onApprove={handleApprove}
            pulseArticle={pulseArticle}
            pulseApprove={pulseApprove}
          />
        </div>
      </div>

      {/* KB Health drawer */}
      <KBHealthPanel open={showKBPanel} onClose={() => setShowKBPanel(false)} />

      {/* Demo toast */}
      {demoToast && (
        <DemoToast key={demoToast.step} step={demoToast.step} message={demoToast.msg} />
      )}
    </div>
  );
}
