import { useState, useEffect } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import { BoardFilterProvider } from "../../context/BoardFilterContext";
import { useBoardContext } from "../../context/BoardStateContext";
import { useBoardRealtime } from "../../hooks/useBoardRealtime";
import CardDetailDialog from "../Card/CardDetailDialog";
import BoardAnalyticsView from "../Views/BoardAnalyticsView";
import BoardCalendarView from "../Views/BoardCalendarView";
import BoardKanbanView from "../Views/BoardKanbanView";
import BoardTableView from "../Views/BoardTableView";
import BoardDetailHeader from "./BoardDetailHeader";
import { useAuthStore, useUIStore } from "@/store";
import { cn } from "@/lib/utils";

function BoardContent() {
  const globalTheme = useUIStore((state) => state.theme);
  const userId = useAuthStore((state) => state.user?._id);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState("kanban");
  
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
  const storageKey = currentBoard
    ? `trello_board_preferences:${userId || "anonymous"}:${currentBoard._id}`
    : null;

  // Realtime Sync
  useBoardRealtime(currentBoard?._id, actions);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (["kanban", "table", "calendar", "analytics"].includes(saved?.view)) {
        setCurrentView(saved.view);
      }
    } catch {
      // Ignore invalid or unavailable local storage.
    }
  }, [storageKey]);

  if (!currentBoard) return null;

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (!storageKey) return;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey)) || {};
      localStorage.setItem(storageKey, JSON.stringify({ ...saved, view }));
    } catch {
      // The view remains usable when storage is unavailable.
    }
  };

  const selectedCardId = searchParams.get("card");
  const selectedCard = selectedCardId ? boardData.cards[selectedCardId] : null;

  const handleCardDialogChange = (open) => {
    if (open) return;
    const next = new URLSearchParams(searchParams);
    next.delete("card");
    setSearchParams(next);
  };

  const renderView = () => {
    switch (currentView) {
      case "kanban":
        return <BoardKanbanView />;
      case "calendar":
        return <BoardCalendarView />;
      case "table":
        return <BoardTableView />;
      case "analytics":
        return <BoardAnalyticsView />;
      default:
        return <BoardKanbanView />;
    }
  };

  return (
    <BoardFilterProvider storageKey={storageKey}>
      <section className={cn("flex flex-col h-screen transition-all duration-500", boardTheme)}>
        <section className="bg-background/40 backdrop-blur-md border-b border-border/50 shadow-sm shrink-0">
          <BoardDetailHeader 
            currentView={currentView} 
            onViewChange={handleViewChange}
            currentTheme={boardTheme}
            onThemeChange={setBoardTheme}
          />
        </section>
        <section className="flex-1 overflow-auto relative">
          <AnimatePresence mode="wait">
            <Motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              {renderView()}
            </Motion.div>
          </AnimatePresence>
        </section>
        <CardDetailDialog
          card={selectedCard}
          listId={selectedCard?.listId || selectedCard?.list}
          boardId={currentBoard._id}
          open={Boolean(selectedCard)}
          onOpenChange={handleCardDialogChange}
        />
      </section>
    </BoardFilterProvider>
  );
}

export default BoardContent;
