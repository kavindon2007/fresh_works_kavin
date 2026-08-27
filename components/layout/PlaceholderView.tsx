"use client";

import { Construction } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderViewProps {
  tabName: string;
}

/** Formats a tab ID like "ai-studio" → "Ai Studio" */
function formatTabName(tab: string): string {
  return tab
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function PlaceholderView({ tabName }: PlaceholderViewProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "h-full min-h-[calc(100vh-0px)]",
        "px-8 py-16 text-center select-none"
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          "w-16 h-16 rounded-2xl mb-6",
          "flex items-center justify-center",
          "bg-gray-100"
        )}
      >
        <Construction
          size={28}
          strokeWidth={1.5}
          className="text-gray-400"
        />
      </div>

      {/* Tab label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
        {formatTabName(tabName)}
      </p>

      {/* Primary message */}
      <h2 className="text-base font-semibold text-gray-700 mb-2 max-w-sm">
        This section is part of the live Freshservice platform.
      </h2>

      {/* Secondary message */}
      <p className="text-sm text-gray-400 max-w-md leading-relaxed">
        In your production deployment, this connects to your Freshservice
        instance. Navigate to{" "}
        <span className="font-medium text-fw-blue">Feedback Loops</span> to
        explore LoopCraft&apos;s custom functionality.
      </p>

      {/* Decorative rule */}
      <div className="mt-8 flex items-center gap-3">
        <span className="h-px w-12 bg-gray-200" />
        <span className="text-xs text-gray-300 font-medium">
          Freshservice · AI Agent Studio
        </span>
        <span className="h-px w-12 bg-gray-200" />
      </div>
    </div>
  );
}
