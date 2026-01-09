import { useState, useEffect } from "react";
import { Search, Star, Grid3x3, List, Filter, X, Plus } from "lucide-react";

import CreateBoardDialog from "@/Components/CreateBoardDialog";
import BoardCard from "@/Components/BoardCard";
import { Input, Button } from "@/Components/UI";
import { BoardSkeleton } from "@/Components/UI/LoadingSkeleton";

const boards = [
  {
    id: "1",
    name: "Dự án Website",
    description: "Phát triển website công ty",
    color: "bg-blue-500",
    starred: true,
    members: 5,
    lastActivity: "2 giờ trước",
    lists: [
      {
        id: "list-1",
        title: "Cần làm",
        boardId: "1",
        order: 0,
        color: "blue",
        cards: [
          {
            id: "card-1",
            title: "Thiết kế giao diện trang chủ",
            description: "Tạo mockup và wireframe cho trang chủ",
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            priority: "high",
            labels: [
              { id: "label-1", name: "Design", color: "purple" },
              { id: "label-2", name: "UI/UX", color: "pink" },
            ],
            checklist: [
              {
                id: "check-1",
                text: "Nghiên cứu đối thủ",
                completed: true,
                createdAt: new Date(),
              },
              {
                id: "check-2",
                text: "Tạo wireframe",
                completed: true,
                createdAt: new Date(),
              },
              {
                id: "check-3",
                text: "Thiết kế mockup",
                completed: false,
                createdAt: new Date(),
              },
              {
                id: "check-4",
                text: "Review với team",
                completed: false,
                createdAt: new Date(),
              },
            ],
            members: [
              {
                id: "member-1",
                name: "Nguyễn Văn A",
                avatar: "/diverse-avatars.png",
              },
              {
                id: "member-2",
                name: "Trần Thị B",
                avatar: "/diverse-avatars.png",
              },
            ],
            comments: [
              {
                id: "comment-1",
                text: "Đã hoàn thành phần nghiên cứu, sẽ bắt đầu wireframe",
                author: "Nguyễn Văn A",
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
              },
            ],
            attachments: [],
          },
          {
            id: "card-2",
            title: "Viết API backend",
            description: "Xây dựng REST API cho hệ thống",
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            priority: "medium",
            labels: [{ id: "label-3", name: "Backend", color: "green" }],
            checklist: [
              {
                id: "check-5",
                text: "Thiết kế database schema",
                completed: false,
                createdAt: new Date(),
              },
              {
                id: "check-6",
                text: "Viết API endpoints",
                completed: false,
                createdAt: new Date(),
              },
              {
                id: "check-7",
                text: "Viết unit tests",
                completed: false,
                createdAt: new Date(),
              },
            ],
            members: [
              {
                id: "member-3",
                name: "Lê Văn C",
                avatar: "/diverse-avatars.png",
              },
            ],
            comments: [],
            attachments: [],
          },
        ],
      },
      {
        id: "list-2",
        title: "Đang làm",
        boardId: "1",
        order: 1,
        color: "orange",
        cards: [
          {
            id: "card-3",
            title: "Tích hợp thanh toán",
            description: "Kết nối với cổng thanh toán",
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            priority: "high",
            labels: [
              { id: "label-4", name: "Payment", color: "yellow" },
              { id: "label-5", name: "Integration", color: "blue" },
            ],
            checklist: [
              {
                id: "check-8",
                text: "Đăng ký tài khoản Stripe",
                completed: true,
                createdAt: new Date(),
              },
              {
                id: "check-9",
                text: "Tích hợp SDK",
                completed: true,
                createdAt: new Date(),
              },
              {
                id: "check-10",
                text: "Test thanh toán",
                completed: false,
                createdAt: new Date(),
              },
            ],
            members: [
              {
                id: "member-1",
                name: "Nguyễn Văn A",
                avatar: "/diverse-avatars.png",
              },
              {
                id: "member-3",
                name: "Lê Văn C",
                avatar: "/diverse-avatars.png",
              },
            ],
            comments: [
              {
                id: "comment-2",
                text: "Đã tích hợp xong SDK, đang test",
                author: "Lê Văn C",
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
              },
            ],
            attachments: [
              {
                id: "attach-1",
                name: "stripe-integration-guide.pdf",
                url: "#",
                type: "application/pdf",
                size: 1024000,
                createdAt: new Date(),
              },
            ],
          },
        ],
      },
      {
        id: "list-3",
        title: "Hoàn thành",
        boardId: "1",
        order: 2,
        color: "emerald",
        cards: [
          {
            id: "card-4",
            title: "Setup dự án",
            description: "Khởi tạo repository và cấu hình môi trường",
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            priority: "low",
            labels: [{ id: "label-6", name: "Setup", color: "gray" }],
            checklist: [
              {
                id: "check-11",
                text: "Tạo repository",
                completed: true,
                createdAt: new Date(),
              },
              {
                id: "check-12",
                text: "Cấu hình CI/CD",
                completed: true,
                createdAt: new Date(),
              },
            ],
            members: [
              {
                id: "member-3",
                name: "Lê Văn C",
                avatar: "/diverse-avatars.png",
              },
            ],
            comments: [],
            attachments: [],
          },
          {
            id: "card-5",
            title: "Thiết lập database",
            description: "Tạo schema và migration",
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            priority: "medium",
            labels: [{ id: "label-7", name: "Database", color: "indigo" }],
            checklist: [
              {
                id: "check-13",
                text: "Thiết kế schema",
                completed: true,
                createdAt: new Date(),
              },
              {
                id: "check-14",
                text: "Chạy migration",
                completed: true,
                createdAt: new Date(),
              },
            ],
            members: [
              {
                id: "member-3",
                name: "Lê Văn C",
                avatar: "/diverse-avatars.png",
              },
            ],
            comments: [],
            attachments: [],
          },
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Marketing Q4",
    description: "Chiến lược marketing quý 4",
    color: "bg-green-500",
    starred: false,
    members: 3,
    lastActivity: "1 ngày trước",
    lists: [
      {
        id: "list-4",
        title: "Ý tưởng",
        boardId: "2",
        order: 0,
        color: "purple",
        cards: [
          {
            id: "card-6",
            title: "Chiến dịch social media",
            description: "Lên kế hoạch cho các nền tảng mạng xã hội",
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            priority: "medium",
            labels: [{ id: "label-8", name: "Marketing", color: "red" }],
            checklist: [],
            members: [
              {
                id: "member-2",
                name: "Trần Thị B",
                avatar: "/diverse-avatars.png",
              },
            ],
            comments: [],
            attachments: [],
          },
        ],
      },
      {
        id: "list-5",
        title: "Đang thực hiện",
        boardId: "2",
        order: 1,
        color: "yellow",
        cards: [],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Phát triển App",
    description: "Ứng dụng mobile mới",
    color: "bg-purple-500",
    starred: true,
    members: 8,
    lastActivity: "3 giờ trước",
    lists: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Thiết kế UI/UX",
    description: "Cải thiện trải nghiệm người dùng",
    color: "bg-orange-500",
    starred: false,
    members: 4,
    lastActivity: "5 giờ trước",
    lists: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function Members() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStarred, setFilterStarred] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredBoards = boards.filter((board) => {
    const matchesSearch =
      board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterStarred || board.starred;
    return matchesSearch && matchesFilter;
  });

  const sortedBoards = [...filteredBoards].sort((a, b) => {
    if (filterStarred) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

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
          <CreateBoardDialog />
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

          {/* Active Filters Display */}
          {(searchQuery || filterStarred) && (
            <div className="flex items-center gap-2 text-sm">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Đang lọc:{" "}
                {[
                  searchQuery && `"${searchQuery}"`,
                  filterStarred && "Yêu thích",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStarred(false);
                }}
                className="text-primary hover:text-primary/80 underline text-xs"
              >
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Boards Grid/List */}
      {isLoading ? (
        <BoardSkeleton count={8} />
      ) : sortedBoards.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {sortedBoards.length} bảng
          </h2>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedBoards.map((board, index) => (
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
          ) : (
            <div className="space-y-2">
              {sortedBoards.map((board, index) => (
                <div
                  key={board.id}
                  className="animate-slide-in-up flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="h-12 w-12 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: board.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {board.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {board.description || "Không có mô tả"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {board.members} thành viên
                    </span>
                    {board.starred && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                </div>
              ))}
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
            <CreateBoardDialog trigger={<Button>Tạo bảng mới</Button>} />
          </div>
        </div>
      )}
    </>
  );
}

export default Members;
