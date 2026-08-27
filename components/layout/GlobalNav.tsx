"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Ticket,
  Bot,
  BarChart2,
  Settings,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/* ── Types ───────────────────────────────────────────────────────────────── */
interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

/* ── Nav item data ───────────────────────────────────────────────────────── */
const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "tickets",   icon: Ticket,          label: "Tickets" },
  { id: "ai-studio", icon: Bot,             label: "AI Agent Studio", active: true },
  { id: "analytics", icon: BarChart2,       label: "Analytics" },
  { id: "settings",  icon: Settings,        label: "Settings" },
];

/* ── Sub-component: NavIcon ──────────────────────────────────────────────── */
interface NavIconProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

function NavIcon({ item, isActive, onClick }: NavIconProps) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          aria-label={item.label}
          aria-current={isActive ? "page" : undefined}
          onClick={onClick}
          onKeyDown={(e) => e.key === "Enter" && onClick()}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            /* base */
            "relative w-9 h-9 rounded-lg",
            "flex items-center justify-center",
            "cursor-pointer select-none",
            "transition-colors duration-150 ease-out",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50",
            /* states */
            isActive
              ? "bg-[#1F4E78]"
              : hovered
              ? "bg-white/10"
              : "bg-transparent"
          )}
        >
          <Icon
            size={20}
            strokeWidth={1.75}
            className={cn(
              "transition-opacity duration-150",
              isActive || hovered ? "opacity-100" : "opacity-70"
            )}
            color="white"
          />

          {/* Active dot indicator */}
          {isActive && (
            <span
              className="absolute right-0.5 top-0.5 w-1.5 h-1.5 rounded-full bg-fw-blue"
              aria-hidden="true"
            />
          )}
        </div>
      </TooltipTrigger>

      <TooltipContent side="right" sideOffset={10}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function GlobalNav() {
  const [activeId, setActiveId] = useState<string>("ai-studio");

  return (
    <TooltipProvider>
      <nav
        aria-label="Global navigation"
        style={{ width: 56, backgroundColor: "#12344D" }}
        className={cn(
          "fixed left-0 top-0 z-50",
          "h-screen",
          "flex flex-col items-center",
          "py-3"
        )}
      >
        {/* ── Logo mark ──────────────────────────────────────────────────── */}
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <div
              aria-label="LoopCraft — Freshworks"
              className={cn(
                "w-8 h-8 rounded-lg",
                "flex items-center justify-center",
                "bg-white cursor-pointer",
                "shadow-sm",
                "transition-transform duration-150 hover:scale-105",
                "select-none"
              )}
            >
              <span
                className="text-[#12344D] font-bold leading-none"
                style={{ fontSize: 15 }}
              >
                F
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            LoopCraft · Freshworks
          </TooltipContent>
        </Tooltip>

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <div
          className="w-8 mt-3 mb-2 border-t border-white/10"
          aria-hidden="true"
        />

        {/* ── Icon list ──────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavIcon
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onClick={() => setActiveId(item.id)}
            />
          ))}
        </div>

        {/* ── User avatar ────────────────────────────────────────────────── */}
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              aria-label="User menu — MT"
              className={cn(
                "w-8 h-8 rounded-full",
                "flex items-center justify-center",
                "cursor-pointer select-none",
                "text-white font-semibold",
                "transition-all duration-150",
                "hover:ring-2 hover:ring-white/30 hover:ring-offset-1 hover:ring-offset-[#12344D]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
              )}
              style={{ backgroundColor: "#1F4E78", fontSize: 11 }}
            >
              MT
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            Moana Taka · IT Admin
          </TooltipContent>
        </Tooltip>
      </nav>
    </TooltipProvider>
  );
}
