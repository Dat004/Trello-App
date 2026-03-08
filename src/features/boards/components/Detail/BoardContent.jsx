import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useBoardContext } from "../../context/BoardStateContext";
import { useBoardRealtime } from "../../hooks/useBoardRealtime";
import BoardCalendarView from "../Views/BoardCalendarView";
import BoardKanbanView from "../Views/BoardKanbanView";
import BoardTableView from "../Views/BoardTableView";
import BoardDetailHeader from "./BoardDetailHeader";

function BoardContent() {
  const [currentView, setCurrentView] = useState("kanban"); // kanban, calendar, table

  // Local Board State (from Context)
  const { boardData, ...actions } = useBoardContext();
  const { currentBoard } = boardData;

  // Realtime Sync
  useBoardRealtime(currentBoard?._id, actions);

  if (!currentBoard) return null;

  const renderView = () => {
    switch (currentView) {
      case "kanban":
        return <BoardKanbanView />;
      case "calendar":
        return <BoardCalendarView />;
      case "table":
        return <BoardTableView />;
      default:
        return <BoardKanbanView />;
    }
  };

  return (
    <section className="flex flex-col h-screen bg-muted/30">
      <section className="bg-background/80 backdrop-blur-sm border-b border-border shadow-sm shrink-0">
        <BoardDetailHeader currentView={currentView} onViewChange={setCurrentView} />
      </section>
      <section className="flex-1 overflow-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </section>
    </section>
  );
}

export default BoardContent;
