import PlaceholderView from "@/components/layout/PlaceholderView";
import FeedbackLoopsDashboard from "@/components/dashboard/FeedbackLoopsDashboard";

export interface MainCanvasProps {
  activeTab: string;
}

export default function MainCanvas({ activeTab }: MainCanvasProps) {
  return (
    /*
     * IMPORTANT: overflow must live on an INNER element, not on `main`.
     * If `overflow-y-auto` is on a flex/grid parent, the browser creates a
     * new stacking context which breaks `position: fixed` for any children
     * (they become fixed relative to the stacking context, not the viewport).
     * The KB Health drawer uses createPortal to render at document.body,
     * but this keeps the layout predictable for all other fixed elements.
     */
    <main
      aria-label="Main content"
      style={{ marginLeft: 296, backgroundColor: "#F8FAFC" }}
      className="flex-1 h-screen overflow-hidden"
    >
      <div className="h-full overflow-y-auto">
        {activeTab === "feedback" ? (
          <FeedbackLoopsDashboard />
        ) : (
          <PlaceholderView tabName={activeTab} />
        )}
      </div>
    </main>
  );
}
