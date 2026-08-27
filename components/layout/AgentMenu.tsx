"use client";

import React from "react";
import {
  LayoutDashboard,
  Database,
  GitBranch,
  FileText,
  RefreshCw,
  FlaskConical,
  Rocket,
  BarChart2,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/* ── Types ───────────────────────────────────────────────────────────────── */
interface NavItemDef {
  icon: React.ElementType;
  label: string;
  tab: string;
  badge?: React.ReactNode;
}

interface NavSectionDef {
  heading: string;
  items: NavItemDef[];
}

/* ── Data ────────────────────────────────────────────────────────────────── */

/** "NEW" badge — blue pill, Freshworks blue tokens */
const NewBadge = () => (
  <span
    className="ml-auto shrink-0 rounded px-1.5 py-px text-[10px] font-semibold leading-tight"
    style={{ backgroundColor: "#EBF5FF", color: "#1D6AE5" }}
  >
    NEW
  </span>
);

const MAIN_SECTIONS: NavSectionDef[] = [
  {
    heading: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Overview", tab: "overview" },
    ],
  },
  {
    heading: "Build",
    items: [
      { icon: Database,   label: "Knowledge Sources", tab: "knowledge" },
      { icon: GitBranch,  label: "Workflows",         tab: "workflows" },
      { icon: FileText,   label: "Instructions",      tab: "instructions" },
      {
        icon: RefreshCw,
        label: "Feedback Loops",
        tab: "feedback",
        badge: <NewBadge />,
      },
    ],
  },
  {
    heading: "Manage",
    items: [
      { icon: FlaskConical, label: "Test",        tab: "test" },
      { icon: Rocket,       label: "Deploy",      tab: "deploy" },
      { icon: BarChart2,    label: "Performance", tab: "performance" },
    ],
  },
];

const BOTTOM_ITEMS: NavItemDef[] = [
  { icon: HelpCircle,   label: "Help & Documentation",  tab: "help" },
  { icon: ExternalLink, label: "Open in Freshservice",  tab: "external" },
];

/* ── Sub-component: NavItem ──────────────────────────────────────────────── */
interface NavItemProps {
  def: NavItemDef;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ def, isActive, onClick }: NavItemProps) {
  const Icon = def.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        /* base layout */
        "group w-full flex items-center gap-2.5",
        "px-4 py-2 text-sm",
        "cursor-pointer select-none text-left",
        "transition-colors duration-100 ease-out",
        /* border-left slot — always reserve the 2px so layout doesn't shift */
        "border-l-2",
        /* state: default */
        !isActive && [
          "border-l-transparent text-gray-600",
          "hover:bg-gray-50 hover:text-gray-900",
        ],
        /* state: active — flat left-border only, no radius (Freshservice style) */
        isActive && [
          "border-l-fw-blue bg-blue-50 text-fw-blue font-medium",
        ]
      )}
    >
      <Icon
        size={16}
        strokeWidth={1.75}
        className={cn(
          "shrink-0 transition-colors duration-100",
          isActive
            ? "text-fw-blue"
            : "text-gray-400 group-hover:text-gray-600"
        )}
      />

      <span className="truncate">{def.label}</span>

      {def.badge}
    </button>
  );
}

/* ── Sub-component: SectionLabel ─────────────────────────────────────────── */
function SectionLabel({ text }: { text: string }) {
  return (
    <p className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 select-none">
      {text}
    </p>
  );
}

/* ── Props ───────────────────────────────────────────────────────────────── */
export interface AgentMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function AgentMenu({ activeTab, onTabChange }: AgentMenuProps) {
  return (
    <aside
      aria-label="Agent Studio navigation"
      style={{
        width: 240,
        left: 56,
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E5E7EB",
      }}
      className="fixed top-0 z-20 h-screen flex flex-col overflow-y-auto"
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-4 shrink-0">
        {/* Studio label */}
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1.5">
          AI Agent Studio
        </p>

        {/* Agent name */}
        <p className="text-sm font-semibold text-gray-900 leading-snug">
          LoopCraft Supervisor Agent
        </p>

        {/* Status */}
        <div className="flex items-center gap-1.5 mt-1.5">
          {/* Pulsing green dot */}
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ backgroundColor: "#16A34A" }}
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#16A34A" }}
            />
          </span>
          <span className="text-xs text-gray-500">Active</span>
        </div>
      </div>

      <Separator />

      {/* ── Main nav sections ─────────────────────────────────────────────── */}
      <nav aria-label="Agent Studio menu" className="flex-1 py-2">
        {MAIN_SECTIONS.map((section) => (
          <div key={section.heading}>
            <SectionLabel text={section.heading} />
            {section.items.map((item) => (
              <NavItem
                key={item.tab}
                def={item}
                isActive={activeTab === item.tab}
                onClick={() => onTabChange(item.tab)}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* ── Bottom section ────────────────────────────────────────────────── */}
      <div className="shrink-0 pb-3">
        <Separator className="mb-2" />
        {BOTTOM_ITEMS.map((item) => (
          <NavItem
            key={item.tab}
            def={item}
            isActive={activeTab === item.tab}
            onClick={() => onTabChange(item.tab)}
          />
        ))}
      </div>
    </aside>
  );
}
