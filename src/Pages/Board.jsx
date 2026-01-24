import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Users, MoreHorizontal } from "lucide-react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import AddListButton from "@/Components/AddListButton";
import { useBoardDnD, useSocket } from "@/hooks";
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
  const moveCardFromSocket = useBoardDetailStore((state) => state.moveCardFromSocket);
  const moveListFromSocket = useBoardDetailStore((state) => state.moveListFromSocket);
  const updateCardFromSocket = useBoardDetailStore((state) => state.updateCardFromSocket);
  const addChecklistItemFromSocket = useBoardDetailStore((state) => state.addChecklistItemFromSocket);
  const toggleChecklistItemFromSocket = useBoardDetailStore((state) => state.toggleChecklistItemFromSocket);
  const deleteChecklistItemFromSocket = useBoardDetailStore((state) => state.deleteChecklistItemFromSocket);
  const addListFromSocket = useBoardDetailStore((state) => state.addListFromSocket);
  const updateListFromSocket = useBoardDetailStore((state) => state.updateListFromSocket);
  const deleteListFromSocket = useBoardDetailStore((state) => state.deleteListFromSocket);
  const addCardFromSocket = useBoardDetailStore((state) => state.addCardFromSocket);
  const deleteCardFromSocket = useBoardDetailStore((state) => state.deleteCardFromSocket);

  const { joinBoard, leaveBoard, on, off, isConnected } = useSocket();
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

  // Socket: Join/Leave board room và listen events
  useEffect(() => {
    if (!currentBoard?._id || !isConnected) return;

    console.log(`[Board] Joining board room: ${currentBoard._id}`);
    joinBoard(currentBoard._id);

    // Listen card movement
    const handleCardMoved = (data) => {
      console.log("[Socket] Card moved:", data);
      moveCardFromSocket(data);
    };

    // Listen list movement
    const handleListMoved = (data) => {
      console.log("[Socket] List moved:", data);
      moveListFromSocket(data);
    };

    // Listen card updates
    const handleCardUpdated = (data) => {
      console.log("[Socket] Card updated:", data);
      updateCardFromSocket(data);
    };

    // Listen checklist operations
    const handleChecklistItemAdded = (data) => {
      console.log("[Socket] Checklist item added:", data);
      addChecklistItemFromSocket(data);
    };

    const handleChecklistItemToggled = (data) => {
      console.log("[Socket] Checklist item toggled:", data);
      toggleChecklistItemFromSocket(data);
    };

    const handleChecklistItemDeleted = (data) => {
      console.log("[Socket] Checklist item deleted:", data);
      deleteChecklistItemFromSocket(data);
    };

    // Listen card movement
    on("card-moved", handleCardMoved);
    on("list-moved", handleListMoved);

    // Listen list operations
    const handleListCreated = (data) => {
      console.log("[Socket] List created:", data);
      addListFromSocket(data);
    };

    const handleListUpdated = (data) => {
      console.log("[Socket] List updated:", data);
      updateListFromSocket(data);
    };

    const handleListDeleted = (data) => {
      console.log("[Socket] List deleted:", data);
      deleteListFromSocket(data);
    };

    // Listen card addition/deletion
    const handleCardCreated = (data) => {
      console.log("[Socket] Card created:", data);
      addCardFromSocket(data);
    };

    const handleCardDeleted = (data) => {
      console.log("[Socket] Card deleted:", data);
      deleteCardFromSocket(data);
    };

    on("card-updated", handleCardUpdated);
    on("checklist-item-added", handleChecklistItemAdded);
    on("checklist-item-toggled", handleChecklistItemToggled);
    on("checklist-item-deleted", handleChecklistItemDeleted);
    on("list-created", handleListCreated);
    on("list-updated", handleListUpdated);
    on("list-deleted", handleListDeleted);
    on("card-created", handleCardCreated);
    on("card-deleted", handleCardDeleted);

    // Cleanup
    return () => {
      console.log(`[Board] Leaving board room: ${currentBoard._id}`);
      off("card-moved", handleCardMoved);
      off("list-moved", handleListMoved);
      off("card-updated", handleCardUpdated);
      off("checklist-item-added", handleChecklistItemAdded);
      off("checklist-item-toggled", handleChecklistItemToggled);
      off("checklist-item-deleted", handleChecklistItemDeleted);
      off("list-created", handleListCreated);
      off("list-updated", handleListUpdated);
      off("list-deleted", handleListDeleted);
      off("card-created", handleCardCreated);
      off("card-deleted", handleCardDeleted);
      leaveBoard(currentBoard._id);
    };
  }, [
    currentBoard?._id, 
    isConnected, 
    joinBoard, 
    leaveBoard, 
    on, 
    off, 
    moveCardFromSocket, 
    moveListFromSocket,
    updateCardFromSocket,
    addChecklistItemFromSocket,
    toggleChecklistItemFromSocket,
    deleteChecklistItemFromSocket,
    addListFromSocket,
    updateListFromSocket,
    deleteListFromSocket,
    addCardFromSocket,
    deleteCardFromSocket
  ]);

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
            <AddListButton boardId={currentBoard._id} />
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
