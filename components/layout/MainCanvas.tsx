import PlaceholderView from "@/components/layout/PlaceholderView";
import FeedbackLoopsDashboard from "@/components/dashboard/FeedbackLoopsDashboard";

export interface MainCanvasProps {
  activeTab: string;
}

export default function MainCanvas({ activeTab }: MainCanvasProps) {
  return (
    <main
      aria-label="Main content"
      style={{ marginLeft: 296, backgroundColor: "#F8FAFC" }}
      className="flex-1 h-screen overflow-y-auto"
    >
      {activeTab === "feedback" ? (
        <FeedbackLoopsDashboard />
      ) : (
        <PlaceholderView tabName={activeTab} />
      )}
    </main>
  );
}
