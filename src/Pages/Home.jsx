import { useState, useEffect } from "react";
import { Plus, Search, Filter, Users } from "lucide-react";

import CreateBoardDialog from "@/Components/CreateBoardDialog";
import { Button, Input, BoardSkeleton } from "@/Components/UI";
import { initialBoards } from "../../config/data";
import BoardCard from "@/Components/BoardCard";
import { DefaultLayout } from "@/Layouts";

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
    <DefaultLayout>
      {/* Welcome Section */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Chào mừng trở lại!
        </h1>
        <p className="text-muted-foreground">
          Quản lý dự án của bạn một cách hiệu quả với Trello App
        </p>
      </div>

      <div className="mb-6 md:mb-8">
        <section className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search and Filter */}
          <section className="flex flex-col sm:flex-row gap-4 flex-1">
            <section className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bảng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </section>
            <Button
              variant={filterStarred ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStarred(!filterStarred)}
              className="gap-2 leading-1.5 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              {filterStarred ? "Đã lọc yêu thích" : "Lọc yêu thích"}
            </Button>
          </section>

          <section className="flex items-center gap-2 w-full sm:w-auto">
            <CreateBoardDialog />
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
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            {searchQuery || filterStarred
              ? `Kết quả (${filteredBoards.length})`
              : "Bảng gần đây"}
          </h2>
          {!searchQuery && !filterStarred && (
            <Button className="leading-1.5" variant="ghost" size="sm">
              Xem tất cả
            </Button>
          )}
        </div>

        {isLoading ? (
          <BoardSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                <CreateBoardDialog
                  trigger={
                    <div className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 rounded-lg p-6 h-full min-h-[200px]">
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                          <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <h3 className="font-medium text-foreground mb-2">
                          Tạo bảng mới
                        </h3>
                        <p className="text-sm text-muted-foreground">
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
      </div>
    </DefaultLayout>
  );
}

export default Home;
