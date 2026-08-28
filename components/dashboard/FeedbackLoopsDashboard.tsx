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

const TYPE_STYLE: Record<FailureTicket["type"], string> = {
  "STALE ARTICLE": "bg-amber-50 text-amber-700 border-amber-200",
  "NO COVERAGE":   "bg-red-50   text-red-700   border-red-200",
  "WRONG INTENT":  "bg-purple-50 text-purple-700 border-purple-200",
};

const DRAFT_TITLE  = "Connecting to GlobalProtect VPN (Updated March 2025)";
const DIAGNOSIS    = "KB article references deprecated Cisco AnyConnect. Company migrated to Palo Alto GlobalProtect in March 2025.";

function buildBriefText(id: string, query: string) {
  return (
    `Correction Brief for ticket ${id}. ` +
    `Employee query: ${query}. ` +
    `Root cause: ${DIAGNOSIS} ` +
    `Proposed fix: Update the knowledge base article titled "${DRAFT_TITLE}". ` +
    `The corrected article covers the migration from Cisco AnyConnect to Palo Alto GlobalProtect, completed in March 2025. ` +
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

/* ── Toast ─────────────────────────────────────────────────────────────── */

function DemoToast({ step, message }: { step: number; message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[60] bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl max-w-sm w-full"
    >
      <p className="text-[11px] text-gray-400 mb-1 font-medium">Step {step} of 5</p>
      <p className="text-sm leading-snug">{message}</p>
    </div>
  );
}

function SpeechErrorToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div role="alert" className="fixed bottom-6 right-6 z-[70] bg-red-600 text-white px-4 py-3 rounded shadow-xl text-sm font-medium max-w-xs">
      {message}
    </div>
  );
}

/* ── Step indicator ─────────────────────────────────────────────────────── */

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
              "flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold shrink-0 transition-all",
              isActive && "bg-fw-blue text-white ring-2 ring-blue-200",
              isDone   && "bg-fw-success text-white",
              !isActive && !isDone && "bg-gray-200 text-gray-500"
            )}>
              {isDone ? <CheckCircle size={12} /> : n}
            </div>
            {i < DEMO_STEPS.length - 1 && (
              <div className={cn("flex-1 h-px transition-all", isDone ? "bg-fw-success" : "bg-gray-200")} />
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
      {/* Left */}
      <div className="min-w-0">
        <nav className="flex items-center gap-1 mb-1.5 flex-wrap">
          {["AI Agent Studio", "LoopCraft Supervisor Agent", "Feedback Loops"].map((c, i, a) => (
            <React.Fragment key={c}>
              <span className={cn("text-xs", i === a.length - 1 ? "text-gray-600 font-medium" : "text-gray-400")}>
                {c}
              </span>
              {i < a.length - 1 && <ChevronRight size={12} className="text-gray-300 shrink-0" />}
            </React.Fragment>
          ))}
        </nav>
        <h1 className="text-xl font-semibold text-gray-900">Feedback Loops</h1>
        <p className="text-sm text-gray-500 mt-0.5 max-w-lg">
          Intercepts failed AI responses, diagnoses root causes, and auto-drafts KB corrections for admin approval.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0 pt-1 flex-wrap">
        <span className="text-xs text-gray-400 whitespace-nowrap">Last synced: 2 min ago</span>
        <button
          type="button"
          onClick={onDemo}
          disabled={running}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-blue-200 text-fw-blue bg-blue-50 hover:bg-blue-100 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <Play size={13} />
          {running ? "Running…" : "Start Demo"}
        </button>
        <button
          type="button"
          className="fs-btn-primary flex items-center gap-1.5 whitespace-nowrap"
        >
          <RefreshCw size={14} />
          Run Scan
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATS ROW
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
        onClick && "cursor-pointer hover:border-gray-300 hover:shadow",
        pulse && "animate-pulse"
      )}
    >
      <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium mb-1.5">{label}</p>
      <p className="text-2xl font-bold text-gray-900 leading-none mb-2">{value}</p>
      {trend && <div className="flex items-center gap-1">{trend}</div>}
      {sub}
      {onClick && <p className="text-xs text-fw-blue mt-2 font-medium">View details →</p>}
    </div>
  );
}

function StatsRow({ onKBClick, pulse }: { onKBClick: () => void; pulse: boolean }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
      <StatCard
        label="Failed Deflections (7d)"
        value="47"
        pulse={pulse}
        trend={<><ArrowDown size={12} className="text-fw-success" /><span className="text-xs text-fw-success font-medium">−12% vs last week</span></>}
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
        trend={<><ArrowUp size={12} className="text-fw-success" /><span className="text-xs text-fw-success font-medium">+18pp after last fix</span></>}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAILURE QUEUE (LEFT PANEL)
═══════════════════════════════════════════════════════════════════════════ */

function FailureCard({ ticket, selected, approved, onClick }: {
  ticket: FailureTicket;
  selected: boolean;
  approved: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      id={`ticket-${ticket.id}`}
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "w-full text-left p-3 rounded border transition-all duration-150 cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-fw-blue",
        selected ? "bg-blue-50 border-blue-200" : "bg-white border-fw-border hover:bg-gray-50 hover:border-gray-300"
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 font-mono">#{ticket.id}</span>
          {approved && (
            <span className="flex items-center gap-1 text-[11px] text-fw-success font-medium">
              <CheckCircle size={11} /> Resolved
            </span>
          )}
        </div>
        <span className="text-[11px] text-gray-400 shrink-0">{ticket.time}</span>
      </div>
      <p className="text-sm font-medium text-gray-800 mb-2 leading-snug">{ticket.query}</p>
      <div className="flex items-center justify-between gap-2">
        <span className={cn("inline-flex rounded px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide border", TYPE_STYLE[ticket.type])}>
          {ticket.type}
        </span>
        <span className="text-xs text-fw-blue cursor-pointer hover:underline shrink-0">View Fix →</span>
      </div>
      <p className="text-[11px] text-gray-400 mt-1.5 truncate">KB: {ticket.article}</p>
    </button>
  );
}

function FailureQueue({ selectedId, approvedIds, onSelect }: {
  selectedId: string;
  approvedIds: string[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="fs-card flex flex-col overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-fw-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Detected Failures</span>
          <span className="rounded-full bg-red-50 text-red-600 text-[11px] font-semibold px-2 py-px">
            {TICKETS.length - approvedIds.length}
          </span>
        </div>
        <span className="text-[11px] text-gray-400">Past 7 days</span>
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
   CORRECTION BRIEF (RIGHT PANEL)
═══════════════════════════════════════════════════════════════════════════ */

function CorrectionBrief({ ticketId, isApproved, onApprove, pulseArticle, pulseApprove }: {
  ticketId: string;
  isApproved: boolean;
  onApprove: () => void;
  pulseArticle: boolean;
  pulseApprove: boolean;
}) {
  const ticket     = TICKETS.find((t) => t.id === ticketId)!;
  const isFeatured = ticketId === "T-4821";

  const { speak, stop, isLoading, isPlaying, error: speechError } = useSpeech();
  const [showSpeechErr, setShowSpeechErr] = useState(false);

  useEffect(() => { if (speechError) setShowSpeechErr(true); }, [speechError]);

  return (
    <>
      {showSpeechErr && speechError && (
        <SpeechErrorToast message={speechError} onDismiss={() => setShowSpeechErr(false)} />
      )}
      <div className={cn(
        "fs-card flex flex-col overflow-hidden h-full transition-all duration-300",
        isApproved   && "ring-2 ring-fw-success ring-offset-1",
        pulseArticle && "ring-2 ring-fw-blue ring-offset-1"
      )}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-fw-border shrink-0">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-gray-900">
              Correction Brief — #{ticketId}
            </p>

            {/* Listen button — featured only */}
            {isFeatured && (
              isLoading ? (
                <button disabled className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-gray-200 bg-white text-[11px] text-gray-400 opacity-60 cursor-not-allowed shrink-0">
                  <Loader2 size={13} className="animate-spin" /> Generating…
                </button>
              ) : isPlaying ? (
                <button type="button" onClick={stop} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-blue-200 bg-blue-50 text-[11px] text-fw-blue hover:bg-blue-100 transition-colors cursor-pointer shrink-0">
                  <VolumeX size={13} /> Stop
                </button>
              ) : (
                <button type="button" onClick={() => speak(buildBriefText(ticket.id, ticket.query))} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-gray-200 bg-white text-[11px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer shrink-0">
                  <Volume2 size={13} /> Listen
                </button>
              )
            )}
          </div>

          {isFeatured ? (
            <p className="text-xs text-gray-500 mt-1 leading-snug">
              Root cause: KB references deprecated Cisco AnyConnect. Migrated to GlobalProtect, March 2025.
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-1">
              Failure: <span className="font-medium text-gray-600">{ticket.type}</span> · {ticket.article}
            </p>
          )}
          <p className="text-[11px] text-gray-400 italic mt-1">
            Diagnosed by LoopCraft · {ticket.time}
          </p>
        </div>

        {/* Body */}
        <ScrollArea className="flex-1">
          <div className="p-4 flex flex-col gap-4">

            {/* Success banner */}
            {isApproved && (
              <div className="rounded border border-green-200 bg-green-50 p-3 flex items-start gap-2.5">
                <CheckCircle size={15} className="text-fw-success shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Article published to Freshservice KB.</p>
                  <p className="text-xs text-green-700 mt-0.5">Freddy AI will use the updated article in future responses.</p>
                  <p className="text-xs font-semibold text-green-800 mt-1.5">
                    Deflection rate for &apos;VPN Setup&apos;:{" "}
                    <span className="line-through font-normal text-green-600">23%</span> → 67%
                  </p>
                </div>
              </div>
            )}

            {isFeatured ? (
              <>
                {/* Conversation */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Employee Interaction
                  </p>
                  <div className="flex justify-start mb-2">
                    <div className="bg-gray-100 rounded p-2.5 text-sm text-gray-800 max-w-[240px]">
                      How do I connect to VPN from home?
                    </div>
                  </div>
                  <div className="flex justify-end mb-2">
                    <div className="bg-blue-50 border border-blue-100 rounded p-2.5 text-sm text-gray-800 max-w-[240px]">
                      Please follow the Cisco AnyConnect Setup Guide v2.1 to connect.
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">Rated:</span>
                    <ThumbsDown size={12} className="text-red-500 shrink-0" />
                    <span className="text-xs text-red-500 font-medium">Unhelpful</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200" />

                {/* Draft article */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Proposed KB Update
                  </p>
                  <input
                    readOnly
                    value={DRAFT_TITLE}
                    className="w-full border border-fw-border rounded px-2.5 py-2 text-sm font-medium text-gray-800 bg-white mb-3 focus:outline-none cursor-default"
                  />
                  <div className={cn(
                    "rounded border overflow-hidden transition-all duration-500",
                    pulseArticle ? "border-fw-blue shadow-[0_0_0_3px_rgba(29,106,229,0.15)]" : "border-green-300"
                  )}>
                    <div className="bg-green-50 border-b border-green-200 px-3 py-1.5">
                      <p className="text-[11px] text-green-700">
                        ✓ Auto-drafted from ticket #T-4821 · Reviewed by AI · Pending approval
                      </p>
                    </div>
                    <div className="bg-white p-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {`Meridian Technologies has migrated from Cisco AnyConnect to Palo Alto GlobalProtect as of March 2025.

Step 1: Download GlobalProtect from portal.meridiantech.com/vpn
Step 2: Install and launch the application.
Step 3: Enter gateway: vpn.meridiantech.com
Step 4: Authenticate with your Okta credentials.

Note: Cisco AnyConnect is no longer supported. Contact IT helpdesk if needed.`}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <RefreshCw size={18} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Brief in progress</p>
                <p className="text-xs text-gray-400 max-w-[240px]">
                  LoopCraft is diagnosing ticket #{ticketId} and drafting a KB correction.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-fw-blue animate-pulse" />
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
              <CheckCircle size={14} /> Approve &amp; Publish
            </Button>
            <button type="button" className="inline-flex items-center h-8 px-3 text-sm font-medium rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
              Edit Draft
            </button>
            <button type="button" className="inline-flex items-center h-8 px-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer">
              Discard
            </button>
          </div>
        )}

        {isApproved && (
          <div className="px-4 py-3 border-t border-green-200 bg-green-50 shrink-0">
            <p className="text-xs text-green-700 font-medium flex items-center gap-1.5">
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

  /* Demo state */
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
    setApprovedIds([]);
    setSelectedId("T-4821");
    setDemoComplete(false);
    setPulseStats(false);
    setPulseArticle(false);
    setPulseApprove(false);

    setDemoStep(1); setPulseStats(true);
    setDemoToast({ step: 1, msg: DEMO_STEPS[0] });

    after(() => {
      setPulseStats(false); setSelectedId("T-4821");
      setDemoStep(2); setDemoToast({ step: 2, msg: DEMO_STEPS[1] });
      document.getElementById("ticket-T-4821")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 2500);

    after(() => {
      setPulseArticle(true);
      setDemoStep(3); setDemoToast({ step: 3, msg: DEMO_STEPS[2] });
    }, 5000);

    after(() => {
      setPulseArticle(false); setPulseApprove(true);
      setDemoStep(4); setDemoToast({ step: 4, msg: DEMO_STEPS[3] });
    }, 7500);

    after(() => {
      setPulseApprove(false); setApprovedIds(["T-4821"]);
      setDemoStep(5); setDemoToast({ step: 5, msg: DEMO_STEPS[4] });
    }, 10000);

    after(() => {
      setDemoStep(0); setDemoToast(null); setDemoComplete(true);
    }, 13000);
  }

  const demoRunning = demoStep > 0;

  return (
    <div className="px-6 py-5 flex flex-col gap-5 min-h-screen">

      {/* Header */}
      <PageHeader onDemo={startDemo} running={demoRunning} />

      {/* Demo banner */}
      {(demoRunning || demoComplete) && (
        <div className="fs-card px-4 py-3">
          {demoRunning ? (
            <StepIndicator active={demoStep} />
          ) : (
            <div className="flex items-start gap-2.5">
              <CheckCircle size={15} className="text-fw-success shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 font-medium leading-snug">
                Demo complete. LoopCraft closed the loop — Freddy AI will no longer route VPN queries to the deprecated Cisco guide.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <StatsRow onKBClick={() => setShowKBPanel(true)} pulse={pulseStats} />

      {/* Split panel */}
      <div
        className="grid gap-4 flex-1"
        style={{ gridTemplateColumns: "1fr 1fr", minHeight: 0 }}
      >
        <div style={{ height: "calc(100vh - 280px)", minHeight: 380 }}>
          <FailureQueue
            selectedId={selectedId}
            approvedIds={approvedIds}
            onSelect={setSelectedId}
          />
        </div>
        <div style={{ height: "calc(100vh - 280px)", minHeight: 380 }}>
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
