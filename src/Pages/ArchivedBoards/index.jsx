import { Archive, AlertCircle, RotateCcw, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { BoardSkeleton } from "@/Components/UI/LoadingSkeleton";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@/Components/UI";
import { boardListPath } from "@/config/paths";
import BoardCard from "@/features/boards/components/List/BoardCard";
import { useArchivedBoards } from "@/features/boards/api/useBoards";
import { getApiErrorMessage } from "@/utils/apiError";

function ArchivedBoards() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: rawBoards = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useArchivedBoards();

  const boards = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("vi");
    if (!query) return rawBoards;
    return rawBoards.filter((board) =>
      board.title?.toLocaleLowerCase("vi").includes(query)
    );
  }, [rawBoards, searchQuery]);

  return (
    <>
      <div className="flex flex-col mb-6 md:mb-8 sm:flex-row sm:items-center sm:justify-between gap-4">
        <section>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Bảng đã lưu trữ
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Khôi phục các bảng đã ẩn khỏi danh sách làm việc
          </p>
        </section>
        <Button
          isLink
          to={boardListPath}
          variant="outline"
          className="gap-2 sm:ml-auto"
        >
          <RotateCcw className="h-4 w-4" />
          Về danh sách bảng
        </Button>
      </div>

      <div className="mb-6 md:mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm bảng đã lưu trữ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label="Xóa từ khóa tìm kiếm"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <BoardSkeleton count={6} />
      ) : isError ? (
        <Card className="max-w-lg mx-auto border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Không tải được bảng đã lưu trữ
            </CardTitle>
            <CardDescription>
              {getApiErrorMessage(error, "Đã xảy ra lỗi khi tải danh sách.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} variant="outline">
              Thử lại
            </Button>
          </CardContent>
        </Card>
      ) : boards.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {boards.length} bảng đã lưu trữ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {boards.map((board, index) => (
              <BoardCard
                key={board._id}
                index={index}
                board={board}
                archived
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 animate-fade-in">
          <div className="max-w-md mx-auto px-4">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Archive className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery
                ? "Không tìm thấy bảng phù hợp"
                : "Chưa có bảng nào được lưu trữ"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {searchQuery
                ? "Thử từ khóa khác hoặc xóa bộ lọc tìm kiếm."
                : "Khi bạn lưu trữ một bảng, bảng đó sẽ xuất hiện tại đây để khôi phục sau."}
            </p>
            {searchQuery ? (
              <Button variant="outline" onClick={() => setSearchQuery("")} className="gap-2">
                <X className="h-4 w-4" />
                Xóa tìm kiếm
              </Button>
            ) : (
              <Button isLink to={boardListPath}>
                Đến danh sách bảng
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ArchivedBoards;
