import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Home,
  Plus,
  Settings,
  Star,
  Trello
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useWorkspacesList } from "@/features/workspaces/api/useWorkspacesList";
import { Button, ScrollArea, Separator } from "@/Components/UI";
import { useFavoritesStore, useUIStore } from "@/store";
import ThemeToggle from "@/Components/ThemeToggle";
import { useFavorites } from "@/hooks";
import { cn } from "@/lib/utils";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // UI Store for Sidebar State
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const collapsed = !isSidebarOpen;

  // Data Hooks
  const { data: workspaces = [], isLoading: isLoadingWorkspaces } = useWorkspacesList();
  const favoriteBoards = useFavoritesStore((s) => s.favoriteBoards);
  const favoriteWorkspaces = useFavoritesStore((s) => s.favoriteWorkspaces);
  const { toggleWorkspaceStar } = useFavorites();

  // Helper to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={cn(
        "bg-background border-r transition-all duration-300 overflow-hidden flex flex-col h-screen sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
        <header className="flex items-center h-14 px-3 border-b shrink-0">
         {!collapsed && (
            <span className="font-semibold text-foreground whitespace-nowrap ml-2">
              MyTrello
            </span>
         )}
          <Button
            onClick={toggleSidebar}
            className={cn("h-8 w-8 p-0 ml-auto")}
            variant="ghost"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            {/* Main Navigation */}
            <nav className="space-y-1">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                className={cn("w-full justify-start", collapsed ? "px-2 justify-center" : "px-3")}
                onClick={() => navigate("/")}
                title="Trang chủ"
              >
                <Home className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="ml-3 truncate">Trang chủ</span>}
              </Button>
              <Button
                variant={isActive("/workspaces") ? "secondary" : "ghost"}
                className={cn("w-full justify-start", collapsed ? "px-2 justify-center" : "px-3")}
                onClick={() => navigate("/workspaces")}
                title="Không gian làm việc"
              >
                <Briefcase className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="ml-3 truncate">Không gian làm việc</span>}
              </Button>
              <Button
                variant={isActive("/boards") ? "secondary" : "ghost"}
                className={cn("w-full justify-start", collapsed ? "px-2 justify-center" : "px-3")}
                onClick={() => navigate("/boards")}
                title="Bảng"
              >
                <Trello className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="ml-3 truncate">Bảng</span>}
              </Button>
            </nav>

            <Separator />

            {/* Favorite Boards */}
            <div className="space-y-1">
                {!collapsed && (
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                      Bảng yêu thích
                  </div>
                )}
                {favoriteBoards.length > 0 ? (
                    favoriteBoards.map((board) => (
                        <Button
                            key={board._id}
                            variant="ghost"
                            className={cn("w-full justify-start", collapsed ? "px-2 justify-center" : "px-3")}
                            onClick={() => navigate(`/boards/${board._id}`)}
                            title={board.title}
                        >
                            <span className="h-4 w-4 shrink-0 bg-yellow-400 rounded-sm flex items-center justify-center">
                                <Star className="h-3 w-3 text-white fill-white" />
                            </span>
                             {!collapsed && <span className="ml-3 truncate">{board.title}</span>}
                        </Button>
                    ))
                ) : (
                    !collapsed && <div className="px-3 text-xs text-muted-foreground italic">Chưa có bảng yêu thích</div>
                )}
            </div>
            
            <Separator />

            {/* Workspaces */}
            <div className="space-y-1">
                {!collapsed ? (
                  <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Workspace</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => navigate("/workspaces/create")}>
                          <Plus className="h-3 w-3" />
                      </Button>
                  </div>
                ) : (
                  <div className="flex justify-center py-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}

                {isLoadingWorkspaces ? (
                     // Loading Skeletons - Using inline styles
                     Array(3).fill(0).map((_, i) => (
                         <div key={i} className={cn("flex items-center gap-3 p-2", collapsed && "justify-center")}>
                             <div className="h-6 w-6 rounded bg-muted animate-pulse shrink-0" />
                             {!collapsed && <div className="h-4 bg-muted animate-pulse rounded flex-1" />}
                         </div>
                     ))
                ) : (
                    workspaces.map((ws) => {
                        const isStarred = favoriteWorkspaces.some(w => w._id === ws._id);
                        return (
                            <div key={ws._id} className="group relative">
                                <Button
                                    variant={isActive(`/workspaces/${ws._id}`) ? "secondary" : "ghost"}
                                    className={cn("w-full justify-start", collapsed ? "px-2 justify-center" : "px-3", !collapsed && "pr-8")}
                                    onClick={() => navigate(`/workspaces/${ws._id}`)}
                                    title={ws.name}
                                >
                                    <div className={cn("h-5 w-5 rounded flex items-center justify-center shrink-0 border text-xs font-bold text-white", ws.color || "bg-primary")}>
                                        {ws.name.charAt(0).toUpperCase()}
                                    </div>
                                    {!collapsed && <span className="ml-3 truncate">{ws.name}</span>}
                                </Button>
                                {/* Star Button */}
                                {!collapsed && (
                                     <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                                            isStarred && "opacity-100"
                                        )}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWorkspaceStar(ws);
                                        }}
                                    >
                                        <Star className={cn("h-3 w-3", isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                                    </Button>
                                )}
                            </div>
                        );
                    })
                )}
                 {!collapsed && workspaces.length === 0 && (
                     <div className="px-3 text-xs text-muted-foreground italic">Bạn chưa tham gia workspace nào</div>
                 )}
            </div>

          </div>
        </ScrollArea>

        <footer className="p-3 border-t shrink-0 space-y-1">
          <ThemeToggle collapsed={collapsed} />
          <Button
            variant="ghost"
            className={cn("w-full justify-start", collapsed ? "px-2 justify-center" : "px-3")}
              onClick={() => navigate("/settings")} // Global settings if any
              title="Cài đặt"
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-3 truncate">Cài đặt</span>}
          </Button>
        </footer>
    </aside>
  );
}

export default Sidebar;
