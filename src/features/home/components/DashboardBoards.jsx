import { LayoutGrid, Plus, Star } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import BoardFormDialog from "@/features/boards/components/Dialogs/BoardFormDialog";
import BoardCard from "@/features/boards/components/List/BoardCard";
import { useMyBoards } from "@/features/boards/api/useBoards";
import { BoardSkeleton, Button } from "@/Components/UI";
import { useFavoritesStore } from "@/store";

function DashboardBoards({ searchQuery = "" }) {
  const { data: boards = [], isLoading } = useMyBoards();
  const favoriteBoards = useFavoritesStore((s) => s.favoriteBoards);

  // Dữ liệu bảng
  const processedBoards = useMemo(() => {
    return boards.map((b) => ({
      ...b,
      is_starred: favoriteBoards.some((fb) => fb._id === b._id),
    }));
  }, [boards, favoriteBoards]);

  const filteredBoards = processedBoards.filter((board) => {
    const matchesSearch =
      (board.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (board.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );
    return matchesSearch;
  });

  const recentBoards = filteredBoards.slice(0, 4);
  const starredBoards = filteredBoards.filter((b) => b.is_starred);

  return (
    <>
      {starredBoards.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 fill-yellow-500" />
              Bảng yêu thích
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {starredBoards.map((board) => (
              <BoardCard key={board._id} board={board} />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-semibold flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            Bảng xem gần đây
          </h2>
          <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
            <Link to="/workspaces">Xem tất cả</Link>
          </Button>
        </div>

        {isLoading ? (
          <BoardSkeleton />
        ) : processedBoards.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-muted rounded-xl text-center flex flex-col items-center bg-muted/5">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <LayoutGrid className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Chưa có bảng nào</p>
            <p className="text-xs text-muted-foreground mb-4">
              Bạn chưa tham gia bảng nào gần đây.
            </p>
            <BoardFormDialog
              trigger={<Button size="sm">Tạo bảng đầu tiên</Button>}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentBoards.map((board) => (
              <BoardCard key={board._id} board={board} />
            ))}
            {recentBoards.length < 4 && (
              <BoardFormDialog
                trigger={
                  <div className="group cursor-pointer transition-all duration-200 hover:shadow-md border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 rounded-lg p-4 h-[100px] flex gap-2 items-center justify-center bg-muted/5">
                    <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      Tạo bảng mới
                    </span>
                  </div>
                }
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default DashboardBoards;
