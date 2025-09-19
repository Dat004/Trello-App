import {
  Home,
  Trello,
  Users,
  Settings,
  Plus,
  ChevronRight,
  Star,
} from "lucide-react";

import { Button, Separator, ScrollArea } from "@/Components/UI";

function Sidebar() {
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
    <aside className="bg-sidebar border-r w-64">
      <section className="flex flex-col w-full h-full">
        <header className="flex items-center h-16 px-4 border-b">
          <span className="font-semibold text-sidebar-foreground">
            Không gian làm việc
          </span>

          {/* Toggle button sidebar */}
          <Button className="w-8 h-8 ml-auto p-0" variant="ghost">
            <ChevronRight className="h-4 w-4 transition-transform" />
          </Button>
        </header>

        <section className="flex-1">
          <section className="p-4 space-y-4">
            <section className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Home className="h-6 w-4" />
                <span className="leading-5">Trang chủ</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Trello className="h-6 w-4" />
                <span className="leading-5">Bảng làm việc</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Users className="h-6 w-4" />
                <span className="leading-5">Thành viên</span>
              </Button>
            </section>

            <div className="shrink-0 bg-border h-[1px] w-full"></div>

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

            <div className="shrink-0 bg-border h-[1px] w-full"></div>

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
          </section>
        </section>

        <footer className="flex justify-center items-center h-16 px-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
          >
            <Settings className="h-4 w-4" />
            <span>Cài đặt</span>
          </Button>
        </footer>
      </section>
    </aside>
  );
}

export default Sidebar;
