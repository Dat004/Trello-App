import {
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Users, MoreHorizontal } from "lucide-react";

import AddListButton from "@/Components/AddListButton";
import { initialBoards } from "@/config/data";
import BoardList from "@/Components/BoardList";
import { Button } from "@/Components/UI";

function Board() {
  const { id } = useParams();
  const navigate = useNavigate();

  const listRefs = useRef([]);
  const dragOverlayRef = useRef(null);
  const dragState = useRef({
    offsetX: 0,
    offsetY: 0,
    currentOrder: null,
    originalOrder: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [currentBoard, setCurrentBoard] = useState({});
  const [lists, setLists] = useState([]);
  const [ordListsMap, setOrdListsMap] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isOverlay, setIsOverLay] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useLayoutEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => setIsLoading(false), 1000);
    const board = initialBoards.find((board) => board?.id == id);

    setCurrentBoard(board);
    setLists(board.lists);
    setOrdListsMap(board.lists.map((list) => list.order));

    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    const handlePointerMove = (e) => {
      // setIsOverLay(true);
      // if (!isDragging || !dragOverlayRef.current || draggedIndex === null)
      //   return;

      // // Cập nhật vị trí overlay theo con trỏ chuột chính xác
      // const x = e.clientX - dragState.current.offsetX;
      // const y = e.clientY - dragState.current.offsetY;

      // dragOverlayRef.current.style.left = `${x}px`;
      // dragOverlayRef.current.style.top = `${y}px`;

      // // Tìm vị trí drop mới
      // const newPosition = findNearestDropPosition(e.clientX, listRefs.current);
      // console.log(newPosition);

      // if (
      //   newPosition !== null &&
      //   newPosition !== dragState.current.currentOrder
      // ) {
      //   // Di chuyển vị trí được kéo đến vị trí mới
      //   moveListToPosition(dragState.current.currentOrder, newPosition);
      //   dragState.current.currentOrder = newPosition;
      // }
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  const setDragOverlayRef = useCallback((node) => {
    dragOverlayRef.current = node;
  }, []);

  const findNearestDropPosition = (mouseX, siblings) => {
    // if (!siblings || siblings.length === 0) return null;

    // let nearestIndex = null;
    // let minDistance = Infinity;

    // siblings.forEach((ref, index) => {
    //   if (!ref || index === draggedIndex) return;

    //   const rect = ref.getBoundingClientRect();
    //   const centerX = rect.left + rect.width / 2;
    //   const distance = Math.abs(mouseX - centerX);

    //   if (distance < minDistance) {
    //     minDistance = distance;
    //     nearestIndex = index;
    //   }
    // });

    // // Kiểm tra xem có nên swap không dựa vào vị trí chuột
    // if (
    //   nearestIndex !== null &&
    //   nearestIndex !== dragState.current.currentOrder
    // ) {
    //   const targetRef = siblings[nearestIndex];
    //   if (targetRef) {
    //     const targetRect = targetRef.getBoundingClientRect();
    //     const targetCenter = targetRect.left + targetRect.width / 2;
    //     const targetLeft = mouseX + targetRect.width / 2;
    //     const targetRight = mouseX - targetRect.width / 2;

    //     // Xác định hướng di chuyển
    //     if (nearestIndex > dragState.current.currentOrder) {
    //       // Di chuyển sang phải: chỉ swap khi chuột vượt qua nửa phải của target
    //       if (targetCenter >= targetRight && targetCenter <= targetLeft) {
    //         return nearestIndex;
    //       }
    //     } else {
    //       // Di chuyển sang trái: chỉ swap khi chuột vượt qua nửa trái của target
    //       if (targetCenter >= targetRight && targetCenter <= targetLeft) {
    //         return nearestIndex;
    //       }
    //     }
    //   }
    // }

    // return dragState.current.currentOrder;
  };

  const moveListToPosition = (fromIndex, toIndex) => {
    // if (fromIndex === toIndex || fromIndex === null || toIndex === null) return;

    // // Tính toán khoảng cách dịch chuyển cho từng list
    // const draggedRef = listRefs.current[draggedIndex];
    // const dropRef = listRefs.current[toIndex];
    // if (!draggedRef) return;

    // let dropFrom = null;
    // const draggedWidth = draggedRef.getBoundingClientRect().width + 16;
    // const dragTo = ordListsMap[toIndex] - ordListsMap[draggedIndex];

    // if (draggedIndex < toIndex)
    //   dropFrom =
    //     fromIndex > toIndex
    //       ? ordListsMap[fromIndex] - ordListsMap[toIndex]
    //       : ordListsMap[fromIndex] - ordListsMap[toIndex];
    // else
    //   dropFrom =
    //     toIndex > fromIndex
    //       ? ordListsMap[fromIndex] - ordListsMap[toIndex]
    //       : ordListsMap[fromIndex] - ordListsMap[toIndex];

    // // console.log(ordListsMap);

    // draggedRef.style = `transform: translateX(${
    //   dragTo * draggedWidth
    // }px); transition: transform 0.2s`;

    // dropRef.style = `transform: translateX(${
    //   dropFrom * draggedWidth
    // }px); transition: transform 0.2s`;
  };

  const handlePointerDown = useCallback((e, order) => {
    // if (e.target.closest(".cursor-grab")) {
    //   e.preventDefault();

    //   const listElement = listRefs.current[order];
    //   if (!listElement) return;

    //   const rect = listElement.getBoundingClientRect();

    //   // Tính offset từ con trỏ đến góc trên trái của list
    //   const offsetX = e.clientX - rect.left;
    //   const offsetY = e.clientY - rect.top;

    //   dragState.current = {
    //     offsetX: offsetX,
    //     offsetY: offsetY,
    //     currentOrder: order,
    //     originalOrder: order,
    //   };

    //   setDraggedIndex(order);
    //   setIsDragging(true);

    //   // Thiết lập vị trí ban đầu cho overlay
    //   if (dragOverlayRef.current) {
    //     dragOverlayRef.current.style.left = `${rect.left}px`;
    //     dragOverlayRef.current.style.top = `${rect.top}px`;
    //     dragOverlayRef.current.style.width = `${rect.width}px`;
    //   }

    //   // Ẩn list gốc
    //   listElement.style.opacity = "0.5";
    //   listElement.style.pointerEvents = "none";
    // }
  }, []);

  const handlePointerUp = useCallback(
    // (e) => {
    //   if (isDragging && draggedIndex !== null) {
    //     // Reset transform và style cho tất cả các list
    //     listRefs.current.forEach((ref, index) => {
    //       if (ref) {
    //         ref.style.transition = "";
    //         ref.style.transform = "";
    //         ref.style.opacity = "";
    //         ref.style.pointerEvents = "";
    //       }
    //     });

    //     // Sắp xếp lại data nếu vị trí thay đổi
    //     if (
    //       dragState.current.originalOrder !== dragState.current.currentOrder
    //     ) {
    //       const newLists = handleReOrderLists(
    //         dragState.current.originalOrder,
    //         dragState.current.currentOrder
    //       );
    //       setLists(newLists);
    //       setOrdListsMap(newLists.map((list) => list.order));
    //     }

    //     // Reset state
    //     setIsOverLay(false);
    //     setIsDragging(false);
    //     setDraggedIndex(null);
    //     dragState.current = {
    //       offsetX: 0,
    //       offsetY: 0,
    //       currentOrder: null,
    //       originalOrder: null,
    //     };
    //   }
    // },
    // [isDragging, draggedIndex, lists]
  );

  const handleReOrderLists = (fromOrder, toOrder) => {
    const newLists = [...lists].map((list) => ({ ...list }));
    const [movedList] = newLists.splice(fromOrder, 1);
    newLists.splice(toOrder, 0, movedList);
    newLists.forEach((list, i) => (list.order = i));

    return newLists;
  };

  if (isLoading) {
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
                  {currentBoard.name}
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
                  className={`h-4 w-4 ${
                    currentBoard.starred
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Users className="h-4 w-4 mr-2" />
                {currentBoard.members}
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
        {!isLoading && (
          <>
            <section className="relative flex gap-4 overflow-x-auto pb-4">
              {lists
                .sort((a, b) => a.order - b.order)
                .map((list, index) => (
                  <BoardList
                    ref={(ref) => (listRefs.current[index] = ref)}
                    list={list}
                    key={list.id}
                    index={index}
                    isDragging={isDragging && draggedIndex === index}
                    boardId={currentBoard.id}
                    onPointerUp={handlePointerUp}
                    onPointerDown={(e) => handlePointerDown(e, index)}
                  />
                ))}

              {/* Add List Button */}
              <AddListButton boardId={currentBoard.id} />
            </section>

            {/* Empty State */}
            {lists.length === 0 && (
              <section className="text-center py-16">
                <section className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Bảng trống
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Thêm danh sách đầu tiên để bắt đầu tổ chức công việc của bạn
                  </p>
                  <AddListButton boardId={currentBoard.id} />
                </section>
              </section>
            )}
          </>
        )}
      </section>

      {isDragging && isOverlay && draggedIndex !== null && (
        <div
          ref={setDragOverlayRef}
          className="fixed z-[9999] pointer-events-none touch-none select-none shadow-2xl"
          style={{ willChange: "transform" }}
        >
          <BoardList
            index={draggedIndex}
            boardId={currentBoard.id}
            list={lists[draggedIndex]}
            key={lists[draggedIndex].id}
          />
        </div>
      )}
    </section>
  );
}

export default Board;
