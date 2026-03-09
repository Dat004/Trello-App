import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { BoardFilterProvider } from "../../context/BoardFilterContext";
import { useBoardContext } from "../../context/BoardStateContext";
import { useBoardRealtime } from "../../hooks/useBoardRealtime";
import BoardCalendarView from "../Views/BoardCalendarView";
import BoardKanbanView from "../Views/BoardKanbanView";
import BoardTableView from "../Views/BoardTableView";
import BoardDetailHeader from "./BoardDetailHeader";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";

function BoardContent() {
  const globalTheme = useUIStore((state) => state.theme);
  const [currentView, setCurrentView] = useState("kanban"); // kanban, calendar, table
  
  const getResolvedTheme = (t) => t === "system" 
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : t;

  const [boardTheme, setBoardTheme] = useState(() => {
    const resolved = getResolvedTheme(globalTheme);
    return resolved === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900";
  });

  useEffect(() => {
    const resolved = getResolvedTheme(globalTheme);
    setBoardTheme(resolved === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900");
  }, [globalTheme]);

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
    <BoardFilterProvider>
      <section className={cn("flex flex-col h-screen transition-all duration-500", boardTheme)}>
        <section className="bg-background/40 backdrop-blur-md border-b border-border/50 shadow-sm shrink-0">
          <BoardDetailHeader 
            currentView={currentView} 
            onViewChange={setCurrentView} 
            currentTheme={boardTheme}
            onThemeChange={setBoardTheme}
          />
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
    </BoardFilterProvider>
  );
}

export default BoardContent;
