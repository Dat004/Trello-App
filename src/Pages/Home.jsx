import { Filter, Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";

import BoardCard from "@/Components/BoardCard";
import BoardFormDialog from "@/Components/BoardFormDialog";
import { BoardSkeleton, Button, Input } from "@/Components/UI";
import { initialBoards } from "@/config/data";

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStarred, setFilterStarred] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredBoards = initialBoards.filter((board) => {
    const matchesSearch =
      board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterStarred || board.starred;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
          Chào mừng trở lại!
        </h1>
        <p className="text-sm sm:text-base md:text-base text-muted-foreground">
          Quản lý dự án của bạn một cách hiệu quả với Trello Clone
        </p>
      </div>

      <div className="mb-4 sm:mb-6 md:mb-8">
        <section className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center justify-between">
          {/* Search and Filter */}
          <section className="flex flex-col sm:items-center sm:flex-row gap-2 sm:gap-4 flex-1">
            <section className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bảng..."
                value={searchQuery}
                className="pl-10 text-sm"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </section>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterStarred(!filterStarred)}
              className="gap-2 leading-1.5 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">
                {filterStarred ? "Đã lọc yêu thích" : "Lọc yêu thích"}
              </span>
              <span className="sm:hidden">
                {filterStarred ? "Yêu thích" : "Lọc"}
              </span>
            </Button>
          </section>

          <section className="flex items-center gap-2 w-full sm:w-auto">
            <section className="w-1/6 sm:w-auto">
              <BoardFormDialog />
            </section>
            <Button
              variant="outline"
              className="gap-2 leading-1.5 bg-transparent flex-1 sm:flex-none"
            >
              <Users className="h-4 w-4" />
              Mời thành viên
            </Button>
          </section>
        </section>
      </div>

      {/* Boards Section */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
            {searchQuery || filterStarred
              ? `Kết quả (${filteredBoards.length})`
              : "Bảng gần đây"}
          </h2>
          {!searchQuery && !filterStarred && (
            <Button
              className="leading-1.5 text-xs sm:text-sm"
              variant="ghost"
              size="sm"
            >
              Xem tất cả
            </Button>
          )}
        </div>

        {isLoading ? (
          <BoardSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredBoards.map((board, index) => (
              <div
                key={board.id}
                className="animate-slide-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <BoardCard board={board} />
              </div>
            ))}

            {/* Create New Board Card */}
            {!searchQuery && !filterStarred && (
              <div
                className="animate-slide-in-up"
                style={{ animationDelay: `${filteredBoards.length * 50}ms` }}
              >
                <BoardFormDialog
                  trigger={
                    <div className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 rounded-lg p-4 sm:p-6 h-full min-h-[150px] sm:min-h-[200px]">
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                          <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <h3 className="font-medium text-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                          Tạo bảng mới
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Bắt đầu dự án mới với bảng làm việc
                        </p>
                      </div>
                    </div>
                  }
                />
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredBoards.length === 0 && (
          <section className="text-center py-8 sm:py-12 animate-fade-in">
            <section className="max-w-md mx-auto px-4">
              <section className="h-16 sm:h-24 w-16 sm:w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Search className="h-8 sm:h-12 w-8 sm:w-12 text-muted-foreground" />
              </section>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                {searchQuery
                  ? "Không tìm thấy bảng nào"
                  : "Chưa có bảng yêu thích"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                {searchQuery
                  ? `Không có bảng nào khớp với "${searchQuery}"`
                  : "Đánh dấu sao các bảng quan trọng để xem chúng ở đây"}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  size="sm"
                >
                  Xóa tìm kiếm
                </Button>
              )}
            </section>
          </section>
        )}
      </div>
    </>
  );
}

export default Home;
