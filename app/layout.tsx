import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoopCraft — AI Feedback Intelligence",
  description:
    "LoopCraft admin dashboard for monitoring, triaging, and resolving Freddy AI Agent feedback events in real time.",
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
