import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useBoardDnD } from "@/hooks";
import { useBoardContext } from "../../context/BoardStateContext";
import { useBoardRealtime } from "../../hooks/useBoardRealtime";
import { useBoardAccess } from "../BoardAccessGuard";
import AddListButton from "./AddListButton";
import BoardDetailHeader from "./BoardDetailHeader";
import BoardList from "./BoardList.jsx";
import CardItem from "../Card/CardItem";

const customDropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

function BoardContent() {
  // Board Access Info (from API/Guard)
  const { board, readOnly } = useBoardAccess(); 

  // Local Board State (from Context/DnD)
  const { boardData, ...actions } = useBoardContext();
  const { listOrder, currentBoard } = boardData;

  // Realtime Sync (Updates local state + invalidates query)
  useBoardRealtime(currentBoard?._id, actions);

  // DnD Hook (Uses local state via Context)
  const {
    sensors,
    activeId,
    activeType,
    activeData,
    customCollisionDetectionStrategy,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDnD(currentBoard?._id);

  if (!currentBoard) return null;

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <BoardDetailHeader />
        {/* Board Content */}
      </section>
      <section className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full px-4 py-6 inline-block min-w-full">
          <DndContext
            sensors={sensors}
            collisionDetection={customCollisionDetectionStrategy}
            onDragStart={!readOnly ? handleDragStart : undefined}
            onDragOver={!readOnly ? handleDragOver : undefined}
            onDragEnd={!readOnly ? handleDragEnd : undefined}
          >
            <div className="flex items-start gap-4 h-full">
              <SortableContext
                items={listOrder}
                strategy={horizontalListSortingStrategy}
              >
                {listOrder?.map((listId) => (
                  <BoardList
                    key={listId}
                    listId={listId}
                    boardId={currentBoard._id}
                  />
                ))}
              </SortableContext>
              
              {!readOnly && (
                <div className="w-72 flex-shrink-0">
                  <AddListButton boardId={currentBoard._id} />
                </div>
              )}
            </div>

            <DragOverlay dropAnimation={customDropAnimation}>
              {!activeType ? null : activeType === "list" ? (
                <div className="w-72">
                  <BoardList
                    listId={activeId}
                    boardId={currentBoard._id}
                    isOverlay
                  />
                </div>
              ) : activeType === "card" ? (
                <div className="w-full max-w-[280px]">
                  <CardItem
                    cardId={activeId}
                    listId={activeData?.listId}
                    boardId={currentBoard._id}
                    isOverlay
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </section>
    </section>
  );
}

export default BoardContent;
