import { useState } from "react";
import {
  Crown,
  Shield,
  Users,
  Eye,
  Calendar,
  Activity,
  Trello,
  Building2,
  Mail,
  Clock,
} from "lucide-react";

import {
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/UI";

function MemberDetailsDialog({ member, trigger }) {
  const [open, setOpen] = useState(false);

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
        return "Quản trị viên";
      case "member":
        return "Thành viên";
      case "viewer":
        return "Người xem";
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

  // Mock data for demonstration
  const recentBoards = [
    { id: "1", name: "Website Redesign", lastAccessed: "2 giờ trước" },
    { id: "2", name: "Marketing Campaign Q4", lastAccessed: "1 ngày trước" },
    { id: "3", name: "Product Roadmap", lastAccessed: "3 ngày trước" },
  ];

  const activities = [
    {
      id: "1",
      action: "Tạo thẻ mới",
      target: "Fix login bug",
      board: "Website Redesign",
      time: "2 giờ trước",
    },
    {
      id: "2",
      action: "Bình luận",
      target: "Design review",
      board: "Marketing Campaign",
      time: "5 giờ trước",
    },
    {
      id: "3",
      action: "Di chuyển thẻ",
      target: "User testing",
      board: "Product Roadmap",
      time: "1 ngày trước",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={member.avatar || "/placeholder.svg"}
                alt={member.name}
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                {member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span>{member.name}</span>
                {getRoleIcon(member.role)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(member.status)}
                <Badge variant="outline">{getRoleText(member.role)}</Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>{member.email}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="activity">Hoạt động</TabsTrigger>
            <TabsTrigger value="permissions">Quyền hạn</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Trello className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Bảng tham gia
                      </p>
                      <p className="text-xl font-bold">{member.boardsCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Workspace</p>
                      <p className="text-xl font-bold">
                        {member.workspacesCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Member Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Thông tin thành viên
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Tham gia từ {member.joinedAt}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Hoạt động lần cuối: {member.lastActive}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Boards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bảng gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentBoards.map((board) => (
                    <div
                      key={board.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center gap-2">
                        <Trello className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {board.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {board.lastAccessed}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Hoạt động gần đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 border rounded"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.action}</span>{" "}
                          "{activity.target}" trong{" "}
                          <span className="font-medium">{activity.board}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quyền hạn hiện tại</CardTitle>
                <CardDescription>
                  Vai trò: {getRoleText(member.role)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Xem bảng và thẻ</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Có
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Tạo và chỉnh sửa thẻ</span>
                    <Badge
                      className={
                        member.role !== "viewer"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {member.role !== "viewer" ? "Có" : "Không"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Quản lý thành viên</span>
                    <Badge
                      className={
                        member.role === "admin" || member.role === "owner"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {member.role === "admin" || member.role === "owner"
                        ? "Có"
                        : "Không"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Xóa workspace</span>
                    <Badge
                      className={
                        member.role === "owner"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {member.role === "owner" ? "Có" : "Không"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default MemberDetailsDialog;
