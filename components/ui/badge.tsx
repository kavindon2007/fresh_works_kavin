import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  // ── Base ─────────────────────────────────────────────────────────────────
  [
    "inline-flex items-center gap-1",
    "rounded-full px-2 py-0.5",
    "text-xs font-medium leading-tight whitespace-nowrap",
    "border",
  ],
  {
    variants: {
      variant: {
        /* Status variants matching Freshworks semantic palette */
        green: "bg-fw-success-bg text-fw-success border-green-200",
        amber: "bg-fw-warning-bg text-fw-warning border-yellow-200",
        red:   "bg-fw-danger-bg  text-fw-danger  border-red-200",

        /* Neutral / informational */
        blue:  "bg-blue-50  text-fw-blue   border-blue-200",
        gray:  "bg-gray-100 text-gray-600  border-gray-200",
        navy:  "bg-[#EBF1F8] text-fw-navy  border-[#C4D9EE]",

        /* Resolved / closed states */
        resolved:  "bg-fw-success-bg text-fw-success border-green-200",
        pending:   "bg-fw-warning-bg text-fw-warning  border-yellow-200",
        critical:  "bg-fw-danger-bg  text-fw-danger   border-red-200",
        reviewing: "bg-blue-50       text-fw-blue      border-blue-200",
        closed:    "bg-gray-100      text-gray-500     border-gray-200",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
