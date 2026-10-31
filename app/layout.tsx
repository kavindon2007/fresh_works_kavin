import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoopCraft — Closed-Loop AI Support Optimization | Exasol Personal",
  description:
    "LoopCraft closed-loop AI support feedback intelligence and knowledge base optimization engine powered by Exasol Personal in-memory analytics for ExaThon India 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
