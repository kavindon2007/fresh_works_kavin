"use client";

import { useState } from "react";
import GlobalNav from "@/components/layout/GlobalNav";
import AgentMenu from "@/components/layout/AgentMenu";
import MainCanvas from "@/components/layout/MainCanvas";

export default function Page() {
  const [activeTab, setActiveTab] = useState("feedback");

  return (
    <div className="flex flex-row h-screen overflow-hidden">
      <GlobalNav />
      <AgentMenu activeTab={activeTab} onTabChange={setActiveTab} />
      <MainCanvas activeTab={activeTab} />
    </div>
  );
}
