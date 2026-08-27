import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Freshworks Brand ───────────────────────────────── */
        "fw-navy":           "#12344D",
        "fw-blue":           "#1D6AE5",
        "fw-blue-dark":      "#1558C0",

        /* ── Backgrounds ────────────────────────────────────── */
        "fw-bg":             "#F8FAFC",
        "fw-sidebar":        "#F9FAFB",
        "fw-card":           "#FFFFFF",

        /* ── Borders ────────────────────────────────────────── */
        "fw-border":         "#E5E7EB",

        /* ── Typography ─────────────────────────────────────── */
        "fw-text":           "#111827",
        "fw-text-secondary": "#6B7280",

        /* ── Semantic ───────────────────────────────────────── */
        "fw-success":        "#16A34A",
        "fw-warning":        "#D97706",
        "fw-danger":         "#DC2626",

        /* ── Tints ──────────────────────────────────────────── */
        "fw-success-bg":     "#F0FDF4",
        "fw-warning-bg":     "#FFFBEB",
        "fw-danger-bg":      "#FEF2F2",
      },

      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },

      fontSize: {
        "2xs": ["11px", { lineHeight: "16px" }],
        xs:    ["12px", { lineHeight: "16px" }],
        sm:    ["13px", { lineHeight: "20px" }],
        base:  ["14px", { lineHeight: "20px" }],
        md:    ["15px", { lineHeight: "22px" }],
        lg:    ["16px", { lineHeight: "24px" }],
        xl:    ["18px", { lineHeight: "28px" }],
        "2xl": ["20px", { lineHeight: "28px" }],
        "3xl": ["24px", { lineHeight: "32px" }],
      },

      borderRadius: {
        sm:  "4px",
        DEFAULT: "6px",
        md:  "8px",
        lg:  "12px",
        xl:  "16px",
      },

      boxShadow: {
        sm:  "0 1px 3px rgba(0, 0, 0, 0.08)",
        DEFAULT: "0 2px 8px rgba(0, 0, 0, 0.10)",
        md:  "0 4px 16px rgba(0, 0, 0, 0.12)",
        lg:  "0 8px 32px rgba(0, 0, 0, 0.15)",
      },

      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to:   { transform: "translateX(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.3" },
        },
      },

      animation: {
        "fade-in":       "fade-in 0.2s ease-out",
        "slide-in-left": "slide-in-left 0.25s ease-out",
        "pulse-dot":     "pulse-dot 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
