import { useState } from "react";
import { Search, Star, Grid3x3, List, X } from "lucide-react";

import { BoardSkeleton } from "@/Components/UI/LoadingSkeleton";
import BoardFormDialog from "@/Components/BoardFormDialog";
import { useBoardsWithFavorites } from "@/hooks";
import { Input, Button } from "@/Components/UI";
import BoardCard from "@/Components/BoardCard";
import CreateNewBoard from "./CreateNewBoard";
import { useBoardStore } from "@/store";

function Boards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStarred, setFilterStarred] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const boards = useBoardsWithFavorites();
  const loading = useBoardStore(s => s.loading);

  return (
    <>
      {/* Welcome Section */}
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
          {/* Search and Filters */}
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
                variant={filterStarred ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStarred(!filterStarred)}
                className="gap-2 text-sm"
              >
                <Star
                  className={`h-4 w-4 ${filterStarred ? "fill-current" : ""}`}
                />
                <span className="hidden sm:inline">
                  {filterStarred ? "Bộ lọc yêu thích" : "Yêu thích"}
                </span>
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

      {/* Boards Grid/List */}
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
              {searchQuery
                ? `Không có bảng nào khớp với "${searchQuery}"`
                : "Bạn chưa tạo bảng nào. Hãy tạo bảng đầu tiên của bạn."}
            </p>
            <BoardFormDialog trigger={<Button>Tạo bảng mới</Button>} />
          </div>
        </div>
      )}
    </>
  );
}

export default Boards;
