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
import { getMyRole, getRoleText } from "@/helpers/role";
import { formatDateOnly } from "@/helpers/formatTime";
import { useWorkspaceStore } from "@/store";
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

function Workspaces() {
  const { loading, workspaces } = useWorkspaceStore();

  const handleToggleStar = (id) => {};

  const handleDeleteWorkspace = (id) => {};

  const handleUpdateWorkspace = (id) => {};

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

  return (
    <>
      {/* Welcome Section */}
      <div className="flex mb-6 md:mb-8 flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <section>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Không gian làm việc
          </h1>
          <p className="text-sm sm:text-base md:text-base text-muted-foreground">
            Quản lý và tổ chức các không gian làm việc của bạn
          </p>
        </section>
        <section className="sm:ml-auto">
          <CreateWorkspaceDialog />
        </section>
      </div>

      {/* Stats Cards */}
      <section className="mb-6 md:mb-8">
        {loading ? (
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
                        {workspaces.reduce((sum, w) => sum + w.board_count, 0)}
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
                        {workspaces.reduce(
                          (sum, w) => sum + w.members.length,
                          0
                        )}
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
                        {workspaces.filter((w) => w.is_starred).length}
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
      {loading ? (
        <WorkspacesSkeleton />
      ) : (
        <div
          className="animate-slide-in-up"
          style={{ animationDelay: `${workspaces.length * 50}ms` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {workspaces.map((workspace) => (
              <Card
                key={workspace._id}
                className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader className="pb-3 sm:pb-4">
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
                        <CardTitle className="text-base">
                          {workspace.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={getRoleBadgeVariant(
                              getMyRole(workspace.members)
                            )}
                            className="text-xs leading-[1.15]"
                          >
                            {getRoleText(getMyRole(workspace.members))}
                          </Badge>
                          {workspace.is_starred && (
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
                            handleUpdateWorkspace(workspace._id, data)
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
                          onClick={() => handleToggleStar(workspace._id)}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          {workspace.is_starred ? "Bỏ yêu thích" : "Yêu thích"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {getMyRole(workspace.members) === "admin" && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteWorkspace(workspace._id)}
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
                          <span>
                            {workspace.board_count === 0
                              ? "Chưa có bảng"
                              : `${workspace.board_count} bảng`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{workspace.members.length} thành viên</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Activity className="h-3 w-3" />
                      <span>
                        Hoạt động: {formatDateOnly(workspace.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 h-8 sm:h-9 font-normal sm:font-medium"
                      >
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
    </>
  );
}

export default Workspaces;
