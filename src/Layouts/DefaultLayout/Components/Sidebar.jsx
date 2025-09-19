import { useState } from "react";
import {
  Home,
  Trello,
  Users,
  Settings,
  Plus,
  ChevronRight,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, Separator, ScrollArea } from "@/Components/UI";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => setCollapsed((state) => !state);

  const recentBoards = [
    { id: 1, name: "Dự án Website", starred: true },
    { id: 2, name: "Marketing Q4", starred: false },
    { id: 3, name: "Phát triển App", starred: true },
  ];

  const workspaces = [
    { id: 1, name: "Công ty ABC", boards: 12 },
    { id: 2, name: "Dự án cá nhân", boards: 5 },
  ];

  return (
    <aside
      className={cn(
        "bg-sidebar border-r w-64 transition-all duration-300 overflow-hidden",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <section className="flex flex-col w-full h-full">
        <header className="flex items-center h-16 px-4 border-b">
          <span
            className={cn(
              "font-semibold text-sidebar-foreground whitespace-nowrap transition-opacity",
              collapsed
                ? "hidden invisible opacity-0"
                : "block visible opacity-100"
            )}
          >
            Không gian làm việc
          </span>

          {/* Toggle button sidebar */}
          <Button
            onClick={toggleCollapsed}
            className="w-8 h-8 ml-auto p-0"
            variant="ghost"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed ? "rotate-0" : "rotate-180"
              )}
            />
          </Button>
        </header>

        <ScrollArea className="flex-1">
          <section className="p-4 space-y-4">
            <section className="space-y-2">
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3",
                  collapsed ? "p-0 justify-center" : "justify-start"
                )}
              >
                <Home className="h-6 w-4" />
                <span
                  className={cn(
                    "leading-5 transition-opacity",
                    collapsed
                      ? "hidden invisible opacity-0"
                      : "block visible opacity-100"
                  )}
                >
                  Trang chủ
                </span>
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3",
                  collapsed ? "p-0 justify-center" : "justify-start"
                )}
              >
                <Trello className="h-6 w-4" />
                <span
                  className={cn(
                    "leading-5 transition-opacity",
                    collapsed
                      ? "hidden invisible opacity-0"
                      : "block visible opacity-100"
                  )}
                >
                  Bảng làm việc
                </span>
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3",
                  collapsed ? "p-0 justify-center" : "justify-start"
                )}
              >
                <Users className="h-6 w-4" />
                <span
                  className={cn(
                    "leading-5 transition-opacity",
                    collapsed
                      ? "hidden invisible opacity-0"
                      : "block visible opacity-100"
                  )}
                >
                  Thành viên
                </span>
              </Button>
            </section>

            <Separator />

            {!collapsed && (
              <>
                <section className="space-y-2">
                  <section className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-sidebar-foreground">
                      Bảng gần đây
                    </h3>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </section>

                  {recentBoards.map((board) => (
                    <Button
                      key={board.id}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-8"
                    >
                      <Trello className="h-6 w-3" />
                      <span className="flex-1 leading-5 text-left text-sm">
                        {board.name}
                      </span>
                      {board.starred && (
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      )}
                    </Button>
                  ))}
                </section>

                <Separator />

                <section className="space-y-2">
                  <section className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-sidebar-foreground">
                      Không gian làm việc
                    </h3>
                  </section>

                  {workspaces.map((workspace) => (
                    <div key={workspace.id} className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 py-4"
                      >
                        <div className="h-6 w-6 rounded bg-primary/30 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-foreground">
                            {workspace.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">
                            {workspace.name}
                          </div>
                          <div className="text-xs">{workspace.boards} bảng</div>
                        </div>
                      </Button>
                    </div>
                  ))}
                </section>
              </>
            )}
          </section>
        </ScrollArea>

        <footer className="flex justify-center items-center h-16 px-4 border-t">
          <Button
            variant="ghost"
            className={cn(
              "w-full gap-3",
              collapsed ? "p-0 justify-center" : "justify-start"
            )}
          >
            <Settings className="h-4 w-4" />
            <span
              className={cn(
                "leading-5 transition-opacity",
                collapsed
                  ? "hidden invisible opacity-0"
                  : "block visible opacity-100"
              )}
            >
              Cài đặt
            </span>
          </Button>
        </footer>
      </section>
    </aside>
  );
}

export default Sidebar;
