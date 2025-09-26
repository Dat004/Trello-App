import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Trello,
  Plus,
  Settings,
  Star,
  MoreHorizontal,
  Activity,
  Trash2,
} from "lucide-react";

import SettingWorkspaceDialog from "@/Components/SettingWorkspaceDialog";
import CreateWorkspaceDialog from "@/Components/CreateWorkspaceDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  Button,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatsSkeleton,
  WorkspacesSkeleton,
} from "@/Components/UI";
import { DefaultLayout } from "@/Layouts";

function Workspaces() {
  const [isLoading, setIsLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState([
    {
      id: "1",
      name: "Công ty ABC",
      description: "Không gian làm việc chính của công ty",
      members: 24,
      boards: 12,
      isStarred: true,
      role: "admin",
      lastActivity: "2 giờ trước",
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Dự án cá nhân",
      description: "Các dự án và ý tưởng cá nhân",
      members: 3,
      boards: 5,
      isStarred: false,
      role: "admin",
      lastActivity: "1 ngày trước",
      color: "bg-green-500",
    },
    {
      id: "3",
      name: "Team Marketing",
      description: "Chiến lược và campaigns marketing",
      members: 8,
      boards: 7,
      isStarred: true,
      role: "member",
      lastActivity: "3 giờ trước",
      color: "bg-purple-500",
    },
    {
      id: "4",
      name: "Phát triển sản phẩm",
      description: "Roadmap và tính năng mới",
      members: 15,
      boards: 9,
      isStarred: false,
      role: "viewer",
      lastActivity: "5 giờ trước",
      color: "bg-orange-500",
    },
  ]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateWorkspace = (data) => {
    const newWorkspace = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      members: 1,
      boards: 0,
      isStarred: false,
      role: "admin",
      lastActivity: "Vừa tạo",
      color: data.color,
    };
    setWorkspaces((prev) => [...prev, newWorkspace]);
  };

  const handleToggleStar = (id) => {
    setWorkspaces((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isStarred: !w.isStarred } : w))
    );
    const workspace = workspaces.find((w) => w.id === id);
  };

  const handleDeleteWorkspace = (id) => {
    const workspace = workspaces.find((w) => w.id === id);
    setWorkspaces((prev) => prev.filter((w) => w.id !== id));
  };

  const handleUpdateWorkspace = (id) => {
    setWorkspaces((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...data } : w))
    );
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "default";
      case "member":
        return "secondary";
      case "viewer":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị";
      case "member":
        return "Thành viên";
      case "viewer":
        return "Xem";
      default:
        return "Thành viên";
    }
  };

  return (
    <DefaultLayout>
      {/* Welcome Section */}
      <div className="flex items-center mb-6 md:mb-8">
        <section>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Không gian làm việc
          </h1>
          <p className="text-muted-foreground">
            Quản lý và tổ chức các không gian làm việc của bạn
          </p>
        </section>
        <section className="ml-auto">
          <CreateWorkspaceDialog onCreateWorkspace={handleCreateWorkspace} />
        </section>
      </div>

      {/* Stats Cards */}
      <section className="mb-6 md:mb-8">
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="animate-slide-in-up">
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <section className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tổng workspace
                      </p>
                      <p className="text-2xl font-bold">{workspaces.length}</p>
                    </div>
                  </section>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <section className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Trello className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng bảng</p>
                      <p className="text-2xl font-bold">
                        {workspaces.reduce((sum, w) => sum + w.boards, 0)}
                      </p>
                    </div>
                  </section>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <section className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tổng thành viên
                      </p>
                      <p className="text-2xl font-bold">
                        {workspaces.reduce((sum, w) => sum + w.members, 0)}
                      </p>
                    </div>
                  </section>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <section className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Yêu thích</p>
                      <p className="text-2xl font-bold">
                        {workspaces.filter((w) => w.isStarred).length}
                      </p>
                    </div>
                  </section>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </section>

      {/* Workspaces Grid */}
      {isLoading ? (
        <WorkspacesSkeleton />
      ) : (
        <div
          className="animate-slide-in-up"
          style={{ animationDelay: `${workspaces.length * 50}ms` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <Card
                key={workspace.id}
                className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback
                          className={`${workspace.color} text-white font-semibold`}
                        >
                          {workspace.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {workspace.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={getRoleBadgeVariant(workspace.role)}
                            className="text-xs"
                          >
                            {getRoleText(workspace.role)}
                          </Badge>
                          {workspace.isStarred && (
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <SettingWorkspaceDialog
                          workspace={workspace}
                          onUpdateWorkspace={(data) =>
                            handleUpdateWorkspace(workspace.id, data)
                          }
                          trigger={
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Cài đặt
                            </DropdownMenuItem>
                          }
                        />
                        <DropdownMenuItem
                          onClick={() => handleToggleStar(workspace.id)}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          {workspace.isStarred ? "Bỏ yêu thích" : "Yêu thích"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {workspace.role === "admin" && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteWorkspace(workspace.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa workspace
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="mb-4 line-clamp-2">
                    {workspace.description}
                  </CardDescription>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Trello className="h-4 w-4 text-muted-foreground" />
                          <span>{workspace.boards} bảng</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{workspace.members} thành viên</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Activity className="h-3 w-3" />
                      <span>Hoạt động {workspace.lastActivity}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        Xem bảng
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Create New Workspace Card */}
            <CreateWorkspaceDialog
              onCreateWorkspace={handleCreateWorkspace}
              trigger={
                <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50">
                  <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] text-center p-6">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                      <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-medium text-foreground mb-2">
                      Tạo workspace mới
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tạo không gian làm việc mới để tổ chức dự án
                    </p>
                  </CardContent>
                </Card>
              }
            />
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}

export default Workspaces;
