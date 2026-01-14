import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Users, MoreHorizontal } from "lucide-react";

import AddListButton from "@/Components/AddListButton";
import BoardList from "@/Components/BoardList";
import { useBoardDetailStore } from "@/store";
import { Button } from "@/Components/UI";
import { boardApi } from "@/api/board";

function Board() {
  const navigate = useNavigate();

  const { id } = useParams();
  const currentBoard = useBoardDetailStore((state) => state.currentBoard);
  const isLoading = useBoardDetailStore((state) => state.isLoading);
  const listOrder = useBoardDetailStore((state) => state.listOrder);
  const setCurrentBoard = useBoardDetailStore((state) => state.setCurrentBoard);

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
  }, [id]);

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
            {listOrder.length > 0 && (
              <section className="relative flex gap-4 overflow-x-auto pb-4">
                {listOrder.map((list) => (
                  <BoardList key={list} listId={list} boardId={currentBoard._id} />
                ))}

                {/* Add List Button */}
                <AddListButton boardId={currentBoard._id} />
              </section>
            )}

            {/* Empty State */}
            {listOrder.length === 0 && (
              <section className="text-center py-16">
                <section className="flex flex-col items-center justify-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Bảng trống
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Thêm danh sách đầu tiên để bắt đầu tổ chức công việc của bạn
                  </p>
                  <AddListButton boardId={currentBoard._id} />
                </section>
              </section>
            )}
          </>
        )}
      </section>
    </section>
  );
}

export default Board;
