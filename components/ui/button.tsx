import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // ── Base styles ──────────────────────────────────────────────────────────
  [
    "inline-flex items-center justify-center gap-1.5",
    "rounded border-0 font-medium whitespace-nowrap select-none",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fw-blue",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-fw-blue text-white",
          "hover:bg-fw-blue-dark hover:shadow-[0_2px_6px_rgba(29,106,229,0.30)]",
          "active:translate-y-px",
        ],
        secondary: [
          "bg-white text-fw-text border border-fw-border",
          "hover:bg-fw-sidebar hover:border-gray-300",
        ],
        ghost: [
          "bg-transparent text-fw-text-secondary",
          "hover:bg-fw-sidebar hover:text-fw-text",
        ],
        danger: [
          "bg-fw-danger text-white",
          "hover:bg-red-700",
        ],
        "danger-ghost": [
          "bg-transparent text-fw-danger",
          "hover:bg-fw-danger-bg border border-transparent hover:border-red-200",
        ],
        outline: [
          "bg-transparent text-fw-blue border border-fw-blue",
          "hover:bg-blue-50",
        ],
      },
      size: {
        sm:   "h-7 px-2.5 text-xs",
        md:   "h-8 px-3 text-sm",
        lg:   "h-9 px-4 text-sm",
        icon: "h-8 w-8 p-0 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
