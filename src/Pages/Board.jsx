import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Users, MoreHorizontal } from "lucide-react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import AddListButton from "@/Components/AddListButton";
import { useBoardDnD, usePermissions } from "@/hooks";
import BoardList from "@/Components/BoardList";
import { useBoardDetailStore } from "@/store";
import CardItem from "@/Components/CardItem";
import { Button } from "@/Components/UI";
import { boardApi } from "@/api/board";
import { cn } from "@/lib/utils";

function Board() {
  const navigate = useNavigate();  
  const { id } = useParams();
  
  const currentBoard = useBoardDetailStore((state) => state.currentBoard);
  const isLoading = useBoardDetailStore((state) => state.isLoading);
  const listOrder = useBoardDetailStore((state) => state.listOrder);
  const setCurrentBoard = useBoardDetailStore((state) => state.setCurrentBoard);

  const {
    sensors,
    activeId,
    activeType,
    activeData,
    customCollisionDetectionStrategy,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDnD();
  const { canEdit } = usePermissions({ board: currentBoard });

  useEffect(() => {
    if (!id) {
      navigate("/boards");
      return;
    }

    const fetchBoardDetail = async () => {
      const response = await boardApi.detailBoard(id);
      if (response.data.success) {
        setCurrentBoard(response.data.data.board);
      } else {
        navigate("/boards");
      }
    };

    fetchBoardDetail();
  }, [id, navigate, setCurrentBoard]);

  if (isLoading || !currentBoard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Đang tải...</h2>
          <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <section className="container mx-auto px-4 py-4">
          <section className="flex items-center justify-between">
            <section className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <section>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentBoard.title}
                </h1>
                {currentBoard.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentBoard.description}
                  </p>
                )}
              </section>
            </section>

            <section className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Star
                  className={cn("h-4 w-4", 
                    currentBoard.starred
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-700 dark:text-gray-300")}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Users className="h-4 w-4 mr-2" />
                {currentBoard.members?.length || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </section>
          </section>
        </section>
      </section>

      {/* Board Content */}
      <section className="container mx-auto px-4 py-6">
        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionDetectionStrategy}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <section className="relative flex gap-4 overflow-x-auto pb-4 items-start min-h-[calc(100vh-200px)]">
            <SortableContext items={listOrder} strategy={horizontalListSortingStrategy}>
              {listOrder.map((listId) => (
                <BoardList key={listId} listId={listId} boardId={currentBoard._id} />
              ))}
            </SortableContext>

            {/* Add List Button */}
            {canEdit && <AddListButton boardId={currentBoard._id} />}
          </section>

          <DragOverlay>
            {activeId ? (
              <div className="opacity-80 rotate-3 shadow-2xl">
                {activeType === 'list' ? (
                  <BoardList listId={activeId} boardId={currentBoard._id} isOverlay />
                ) : (
                  <CardItem cardId={activeId} listId={activeData?.listId} boardId={currentBoard._id} isOverlay />
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </section>
    </section>
  );
}

export default Board;
