import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useBoardContext } from "../../context/BoardStateContext";
import { useBoardAccess } from "../BoardAccessGuard";
import AddListButton from "../Detail/AddListButton";
import BoardList from "../Detail/BoardList.jsx";
import CardItem from "../Card/CardItem";
import { useBoardDnD } from "@/hooks";

const customDropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

function BoardKanbanView() {
  const { readOnly } = useBoardAccess(); 
  const { boardData } = useBoardContext();
  const { listOrder, currentBoard } = boardData;

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
  );
}

export default BoardKanbanView;
