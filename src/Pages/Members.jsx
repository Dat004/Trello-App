import { useState, useEffect } from "react";
import {
  Search,
  Users,
  Crown,
  Shield,
  Eye,
  MoreHorizontal,
  Mail,
  Calendar,
  Activity,
  Settings,
} from "lucide-react";

import MemberDetailsDialog from "@/Components/MemberDetailsDialog";
import InviteMemberDialog from "@/Components/InviteMemberDialog";
import {
  Badge,
  Input,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  StatsSkeleton,
} from "@/Components/UI";
import { MembersSkeleton } from "@/Components/UI/LoadingSkeleton";

const members = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "an@company.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "owner",
    status: "active",
    joinedAt: "2024-01-15",
    lastActive: "2 phút trước",
    boardsCount: 12,
    workspacesCount: 3,
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    email: "binh@company.com",
    role: "admin",
    status: "active",
    joinedAt: "2024-02-01",
    lastActive: "1 giờ trước",
    boardsCount: 8,
    workspacesCount: 2,
  },
  {
    id: "3",
    name: "Lê Văn Cường",
    email: "cuong@company.com",
    role: "member",
    status: "active",
    joinedAt: "2024-02-15",
    lastActive: "3 giờ trước",
    boardsCount: 5,
    workspacesCount: 1,
  },
  {
    id: "4",
    name: "Phạm Thị Dung",
    email: "dung@company.com",
    role: "member",
    status: "pending",
    joinedAt: "2024-03-01",
    lastActive: "Chưa kích hoạt",
    boardsCount: 0,
    workspacesCount: 0,
  },
  {
    id: "5",
    name: "Hoàng Văn Em",
    email: "em@company.com",
    role: "viewer",
    status: "active",
    joinedAt: "2024-03-10",
    lastActive: "1 ngày trước",
    boardsCount: 2,
    workspacesCount: 1,
  },
  {
    id: "6",
    name: "Vũ Thị Phương",
    email: "phuong@company.com",
    role: "member",
    status: "inactive",
    joinedAt: "2024-01-20",
    lastActive: "2 tuần trước",
    boardsCount: 3,
    workspacesCount: 1,
  },
];

function Members() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getRoleIcon = (role) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "member":
        return <Users className="h-4 w-4 text-green-500" />;
      case "viewer":
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "owner":
        return "Chủ sở hữu";
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Hoạt động
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Chờ xác nhận
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Không hoạt động
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === "active").length,
    pending: members.filter((m) => m.status === "pending").length,
    admins: members.filter((m) => m.role === "admin" || m.role === "owner")
      .length,
  };

  return (
    <>
      {/* Welcome Section */}
      <div className="flex flex-col mb-6 md:mb-8 sm:flex-row sm:items-center sm:justify-between gap-4">
        <section>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Thành viên
          </h1>
          <p className="text-sm sm:text-base md:text-base text-muted-foreground">
            Quản lý thành viên và quyền truy cập trong workspace
          </p>
        </section>
        <section className="sm:ml-auto">
          <InviteMemberDialog />
        </section>
      </div>

      {/* Stats Cards */}
      <section className="mb-6 md:mb-8">
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tổng thành viên
                    </p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Đang hoạt động
                    </p>
                    <p className="text-2xl font-bold">{stats.active}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Chờ xác nhận
                    </p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Quản trị viên
                    </p>
                    <p className="text-2xl font-bold">{stats.admins}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </section>

      {/* Search and Filter */}
      <section className="mb-6">
        <section className="flex flex-col sm:items-center sm:flex-row gap-4 gap-y-2">
          <section className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm thành viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </section>
          <section className="flex items-center gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="owner">Chủ sở hữu</SelectItem>
                <SelectItem value="admin">Quản trị</SelectItem>
                <SelectItem value="member">Thành viên</SelectItem>
                <SelectItem value="viewer">Xem</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="pending">Chờ xác nhận</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </section>
        </section>
      </section>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thành viên ({filteredMembers.length})</CardTitle>
          <CardDescription>
            Quản lý thành viên và phân quyền trong workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredMembers.length === 0 ? (
            <section className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Không tìm thấy thành viên
              </h3>
              <p className="text-muted-foreground mb-4">
                Thử thay đổi bộ lọc hoặc mời thành viên mới
              </p>
              <InviteMemberDialog />
            </section>
          ) : (
            <section>
              {isLoading ? (
                <MembersSkeleton />
              ) : (
                <section className="divide-y">
                  {filteredMembers.map((member) => (
                    <section
                      key={member.id}
                      className="p-4 hover:bg-muted/50 transition-colors"
                    >
                      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <section className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={member.avatar || "/placeholder.svg"}
                              alt={member.name}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <section className="flex-1">
                            <section className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{member.name}</h3>
                              {getRoleIcon(member.role)}
                              <span className="ml-auto sm:ml-0">
                                {getStatusBadge(member.status)}
                              </span>
                            </section>
                            <p className="text-sm text-muted-foreground">
                              {member.email}
                            </p>
                            <span className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">
                              <div className="inline-flex h-4 items-end">
                                <Calendar className="inline-block h-3 w-3" />
                              </div>
                              <span className="ml-1">
                                Tham gia {member.joinedAt}
                              </span>
                              <span className="mx-1"></span>
                              <div className="inline-flex h-4 items-end">
                                <Activity className="inline-block h-3 w-3" />
                              </div>
                              <span className="ml-1">
                                Hoạt động {member.lastActive}
                              </span>
                            </span>
                          </section>
                        </section>

                        <section className="flex items-center justify-between gap-4">
                          <section className="sm:text-right text-sm">
                            <p className="font-medium">
                              {getRoleText(member.role)}
                            </p>
                            <p className="text-muted-foreground">
                              {member.boardsCount} bảng •{" "}
                              {member.workspacesCount} workspace
                            </p>
                          </section>

                          <section className="flex items-center gap-2">
                            <MemberDetailsDialog
                              member={member}
                              trigger={
                                <Button
                                  className="leading-1.5 text-xs font-normal"
                                  variant="outline"
                                  size="sm"
                                >
                                  Chi tiết
                                </Button>
                              }
                            />

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Settings className="h-4 w-4 mr-2" />
                                  Chỉnh sửa quyền
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Gửi lời mời lại
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Xóa khỏi workspace
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </section>
                        </section>
                      </section>
                    </section>
                  ))}
                </section>
              )}
            </section>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default Members;
