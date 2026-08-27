"use client";

import React, { useEffect } from "react";
import { X, FileText, AlertTriangle, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

type ArticleStatus = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface KBArticle {
  title: string;
  shown: number;
  escalation: number; // percent
  updated: string;
  status: ArticleStatus;
}

const KB_ARTICLES: KBArticle[] = [
  { title: "Cisco AnyConnect VPN Setup v2.1",  shown: 214, escalation: 82, updated: "Nov 2023", status: "CRITICAL" },
  { title: "Software Request Process 2022",      shown: 89,  escalation: 71, updated: "Jan 2022", status: "CRITICAL" },
  { title: "Printer Setup Guide - Floor 3",      shown: 134, escalation: 54, updated: "Jun 2023", status: "HIGH"     },
  { title: "Office 365 Activation Steps",        shown: 67,  escalation: 48, updated: "Mar 2023", status: "MEDIUM"   },
  { title: "Expense Report Submission",          shown: 45,  escalation: 41, updated: "Aug 2023", status: "MEDIUM"   },
  { title: "New Employee IT Checklist",          shown: 201, escalation: 33, updated: "Dec 2023", status: "LOW"      },
];

/* ── Stale = updated before July 2024 (>~1 year) ── */
const STALE_CUTOFF_YEAR  = 2024;
const STALE_CUTOFF_MONTH = 6; // July (0-indexed)

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function isStale(updated: string): boolean {
  const [mon, yr] = updated.split(" ");
  const year  = parseInt(yr, 10);
  const month = MONTHS[mon] ?? 0;
  return (
    year < STALE_CUTOFF_YEAR ||
    (year === STALE_CUTOFF_YEAR && month < STALE_CUTOFF_MONTH)
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS STYLES
═══════════════════════════════════════════════════════════════════════════ */

const STATUS_PILL: Record<ArticleStatus, string> = {
  CRITICAL: "bg-red-50   text-red-700   border-red-200",
  HIGH:     "bg-amber-50 text-amber-700 border-amber-200",
  MEDIUM:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  LOW:      "bg-blue-50  text-fw-blue   border-blue-200",
};

/** Bar fill colour based on escalation rate */
function barColor(pct: number): string {
  if (pct >= 50) return "bg-red-500";
  if (pct >= 30) return "bg-amber-400";
  return "bg-blue-400";
}

/* ═══════════════════════════════════════════════════════════════════════════
   ARTICLE CARD
═══════════════════════════════════════════════════════════════════════════ */

function ArticleCard({ article }: { article: KBArticle }) {
  const stale   = isStale(article.updated);

  return (
    <div className="border border-fw-border rounded-lg p-3.5 bg-white hover:border-gray-300 transition-colors duration-100">
      {/* Top row: title + status badge */}
      <div className="flex items-start gap-2 mb-2.5">
        <FileText
          size={14}
          strokeWidth={1.75}
          className="text-gray-400 shrink-0 mt-0.5"
        />
        <p className="text-sm font-medium text-gray-800 leading-snug flex-1">
          {article.title}
        </p>
        <span
          className={cn(
            "shrink-0 inline-flex items-center rounded border px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide",
            STATUS_PILL[article.status]
          )}
        >
          {article.status}
        </span>
      </div>

      {/* Failure rate bar */}
      <div className="mb-2.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">
            Shown <span className="font-medium text-gray-700">{article.shown}×</span>
            {" · "}Escalated{" "}
            <span
              className={cn(
                "font-semibold",
                article.escalation >= 50 ? "text-red-600" : "text-amber-600"
              )}
            >
              {article.escalation}%
            </span>{" "}
            of the time
          </span>
        </div>

        {/* Progress bar track */}
        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", barColor(article.escalation))}
            style={{ width: `${article.escalation}%` }}
          />
        </div>
      </div>

      {/* Last updated */}
      <div className="flex items-center gap-1.5 mb-3">
        {stale && (
          <AlertTriangle size={11} strokeWidth={2} className="text-amber-500 shrink-0" />
        )}
        <span
          className={cn(
            "text-xs",
            stale ? "text-amber-600 font-medium" : "text-gray-400"
          )}
        >
          Last updated: {article.updated}
          {stale && " · Stale"}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded",
            "border border-fw-border bg-white text-gray-600",
            "hover:bg-gray-50 hover:text-gray-900 transition-colors duration-100"
          )}
        >
          <ExternalLink size={11} strokeWidth={2} />
          View Article
        </button>

        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded",
            "border border-amber-200 bg-amber-50 text-amber-700",
            "hover:bg-amber-100 transition-colors duration-100"
          )}
        >
          Flag for Review
        </button>

        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded",
            "border border-blue-200 bg-blue-50 text-fw-blue",
            "hover:bg-blue-100 transition-colors duration-100"
          )}
        >
          Auto-Draft Fix
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DRAWER COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

export interface KBHealthPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function KBHealthPanel({ open, onClose }: KBHealthPanelProps) {
  /* Close on Escape key */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]",
          "transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* ── Drawer ───────────────────────────────────────────────────────── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="KB Health Audit"
        style={{ width: 384 /* w-96 */ }}
        className={cn(
          "fixed right-0 top-0 z-50 h-full",
          "bg-white shadow-xl",
          "flex flex-col",
          "transition-transform duration-250 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-fw-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              KB Health Audit
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Articles causing Freddy AI deflection failures
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close KB Health panel"
            className={cn(
              "w-7 h-7 rounded-md flex items-center justify-center",
              "text-gray-400 hover:text-gray-700 hover:bg-gray-100",
              "transition-colors duration-100 cursor-pointer -mt-0.5 -mr-0.5"
            )}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* ── Summary stats bar ───────────────────────────────────────────── */}
        <div className="flex items-center gap-4 px-5 py-2.5 border-b border-fw-border bg-fw-sidebar shrink-0">
          {[
            { label: "Critical",  count: 2, color: "text-red-600"    },
            { label: "High",      count: 1, color: "text-amber-600"  },
            { label: "Medium",    count: 2, color: "text-yellow-600" },
            { label: "Low",       count: 1, color: "text-fw-blue"    },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={cn("text-sm font-bold", color)}>{count}</span>
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Article list ────────────────────────────────────────────────── */}
        <ScrollArea className="flex-1 px-4 py-3">
          <div className="flex flex-col gap-3">
            {KB_ARTICLES.map((article) => (
              <ArticleCard key={article.title} article={article} />
            ))}
          </div>

          {/* ── Bottom summary card ─────────────────────────────────────── */}
          <div className="mt-4 mb-2 rounded-lg border border-blue-100 bg-blue-50 p-3">
            <p className="text-sm font-medium text-blue-700 leading-snug">
              Estimated deflection gain if all critical articles fixed:
              <span className="font-bold"> +23 percentage points</span>
            </p>
            <p className="text-xs text-blue-500 mt-1">
              Based on historical resolution data across 303 affected tickets.
            </p>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
