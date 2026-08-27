"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

/* ── Provider (wrap your root layout or feature with this) ──────────────── */
const TooltipProvider = TooltipPrimitive.Provider;

/* ── Root ────────────────────────────────────────────────────────────────── */
const Tooltip = TooltipPrimitive.Root;

/* ── Trigger ─────────────────────────────────────────────────────────────── */
const TooltipTrigger = TooltipPrimitive.Trigger;

/* ── Content ─────────────────────────────────────────────────────────────── */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        // ── Base ───────────────────────────────────────────────────────────
        "z-50 max-w-xs rounded px-2.5 py-1.5",
        "bg-fw-navy text-white text-xs font-medium leading-snug",
        "shadow-md",
        // ── Animation ──────────────────────────────────────────────────────
        "animate-fade-in",
        "data-[state=closed]:opacity-0",
        // ── Arrow ───────────────────────────────────────────────────────────
        className
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow
        className="fill-fw-navy"
        width={10}
        height={5}
      />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

/* ── Convenience wrapper ─────────────────────────────────────────────────── */
interface SimpleTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
}

function SimpleTooltip({
  content,
  children,
  side = "top",
  delayDuration = 300,
}: SimpleTooltipProps) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  );
}

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  SimpleTooltip,
};
