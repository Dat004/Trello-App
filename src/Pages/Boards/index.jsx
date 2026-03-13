import { Grid3x3, List, Search, Star, X } from "lucide-react";
import { useMemo, useState } from "react";

import BoardFormDialog from "@/features/boards/components/Dialogs/BoardFormDialog";
import CreateNewBoard from "@/features/boards/components/List/CreateNewBoard";
import BoardCard from "@/features/boards/components/List/BoardCard";
import { BoardSkeleton } from "@/Components/UI/LoadingSkeleton";
import { useMyBoards } from "@/features/boards/api/useBoards";
import { Button, Input } from "@/Components/UI";
import { useFavoritesStore } from "@/store";
import { cn } from "@/lib/utils";

function Boards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStarred, setFilterStarred] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const { data: rawBoards = [], isLoading: loading } = useMyBoards();
  const favoriteBoards = useFavoritesStore(s => s.favoriteBoards);

  const starredCount = useMemo(() => {
    return rawBoards.filter(board => favoriteBoards.some(fav => fav._id === board._id)).length;
  }, [rawBoards, favoriteBoards]);

  const boards = useMemo(() => {
    return rawBoards.map(board => ({
      ...board,
      is_starred: favoriteBoards.some(fav => fav._id === board._id)
    })).filter(board => {
       if (filterStarred && !board.is_starred) return false;
       if (searchQuery) {
           return board.title.toLowerCase().includes(searchQuery.toLowerCase());
       }
       return true;
    });
  }, [rawBoards, favoriteBoards, filterStarred, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterStarred(false);
  };


  return (
    <>
      <div className="flex flex-col mb-6 md:mb-8 sm:flex-row sm:items-center sm:justify-between gap-4">
        <section>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Tất cả bảng
          </h1>
          <p className="text-sm sm:text-base md:text-base text-muted-foreground">
            Quản lý và tìm kiếm tất cả bảng công việc của bạn
          </p>
        </section>
        <section className="sm:ml-auto">
          <BoardFormDialog />
        </section>
      </div>

      <div className="mb-6 md:mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bảng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            <div className="flex items-center flex-nowrap gap-2">
              <Button
                variant={filterStarred ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFilterStarred(!filterStarred)}
                className={cn(
                  "gap-2 text-sm transition-all h-10",
                  filterStarred && "bg-yellow-400/10 text-yellow-600 border-yellow-400/50 hover:bg-yellow-400/20"
                )}
              >
                <Star
                  className={cn(
                    "h-4 w-4 transition-all",
                    filterStarred ? "fill-yellow-500 text-yellow-500 scale-110" : "text-muted-foreground"
                  )}
                />
                <span className="hidden sm:inline">
                  Bảng yêu thích
                </span>
                {starredCount > 0 && (
                   <span className={cn(
                     "ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                     filterStarred ? "bg-yellow-500 text-white" : "bg-muted text-muted-foreground"
                   )}>
                     {starredCount}
                   </span>
                )}
              </Button>

              <div className="flex border border-input rounded-lg p-1 bg-background">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <BoardSkeleton count={8} />
      ) : boards.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {boards.length} bảng
          </h2>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {boards.map((board, index) => (
                <BoardCard
                  key={board._id}
                  view={viewMode}
                  index={index}
                  board={board}
                />
              ))}
              <div
                className="animate-slide-in-up"
                style={{
                  animationDelay: `${boards.length * 50}ms`,
                }}
              >
                <CreateNewBoard />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {boards.map((board, index) => (
                <BoardCard
                  key={board._id}
                  view={viewMode}
                  index={index}
                  board={board}
                />
              ))}
              <div
                className="animate-slide-in-up"
                style={{
                  animationDelay: `${boards.length * 50}ms`,
                }}
              >
                <CreateNewBoard />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 animate-fade-in">
          <div className="max-w-md mx-auto px-4">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Không tìm thấy bảng nào
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {searchQuery || filterStarred
                ? `Không có bảng nào khớp với bộ lọc của bạn.`
                : "Bạn chưa tạo bảng nào. Hãy tạo bảng đầu tiên của bạn để bắt đầu."}
            </p>
            {searchQuery || filterStarred ? (
               <Button variant="outline" onClick={handleClearFilters} className="gap-2">
                 <X className="h-4 w-4" />
                 Xóa tất cả bộ lọc
               </Button>
            ) : (
                <BoardFormDialog trigger={<Button>Tạo bảng mới</Button>} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Boards;
