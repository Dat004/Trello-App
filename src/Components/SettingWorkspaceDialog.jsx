import { Settings, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { workspaceSchema } from "@/schemas/workspaceSchema";
import { useWorkspace, useZodForm } from "@/hooks";
import { UserToast } from "@/context/ToastContext";
import { BACKGROUND_COLORS } from "@/config/theme";
import { workspaceApi } from "@/api/workspace";
import { getRoleText } from "@/helpers/role";
import { useAuthStore } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextArea,
} from "./UI";

function SettingWorkspaceDialog({ workspace, trigger }) {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedColor, setSelectedColor] = useState(workspace.color);
  const [editingRoles, setEditingRoles] = useState({});

  const { user } = useAuthStore();
  const { addToast } = UserToast();
  const { updateWorkspace } = useWorkspace();
  const form = useZodForm(workspaceSchema, {
    defaultValues: {
      name: workspace.name,
      description: workspace.description,
      max_members: workspace.max_members,
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const myMember = members.find((m) => m.user._id === user._id);
  const isMyWorkspace = user._id === workspace.owner;
  const isAdminWorkspace = myMember?.role === "admin";

  useEffect(() => {
    if (activeTab === "members" && members.length === 0) {
      (async () => {
        setIsLoadingMembers(true);
        try {
          const result = await workspaceApi.getMemberInWorkspace(workspace._id);
          if (result.data.success) {
            setMembers(result.data.data.members);
          }
        } finally {
          setIsLoadingMembers(false);
        }
      })();
    }
  }, [activeTab, workspace._id]);

  useEffect(() => {
    setSelectedColor(workspace.color);

    setValue("name", workspace.name);
    setValue("description", workspace.description);
    setValue("max_members", workspace.max_members);
  }, [workspace]);

  const handleUpdateWorkspace = (data) => {
    updateWorkspace(workspace._id, {
      ...data,
      color: selectedColor,
    });

    // Close
    setOpen(false);
  };

  const handleUpdateRoleMember = async (role, member) => {
    if (!canEditRole(member)) return;
    if (workspace.owner === member.user._id) return;

    const result = await workspaceApi.updateMemberRole(workspace._id, {
      member_id: member.user._id,
      role,
    });

    addToast({
      type: result.data.success ? "success" : "error",
      title: result.data.message,
    });

    if (result.data.success) {
      setMembers((prevMembers) =>
        prevMembers.map((m) =>
          m.user._id === member.user._id ? { ...m, role: role } : m
        )
      );
    }
  };

  const handleKickMember = async (member_id) => {
    if (!member_id) return;

    const result = await workspaceApi.kickMember(workspace._id, {
      member_id,
    });

    addToast({
      type: result.data.success ? "success" : "error",
      title: result.data.message,
    });

    if (result.data.success) {
      setMembers((prevMembers) => [
        ...prevMembers.filter((m) => m.user._id !== member_id),
      ]);
    }
  };

  // Xác định ai có thể chỉnh sửa
  const canEditRole = (member) => {
    const isTargetOwner = member.user._id === workspace.owner;
    const isMe = member.user._id === user._id;

    if (isMyWorkspace) return !isTargetOwner;

    if (isAdminWorkspace) {
      return !isTargetOwner && !isMe;
    }

    return false;
  };

  // Xác định có thể cấp quyền admin không
  const canManagerMembers = (member) => {
    const isTargetOwner = member.user._id === workspace.owner;
    const isMe = member.user._id === user._id;

    if (isMyWorkspace) return !isTargetOwner;

    if (isAdminWorkspace) {
      return !isTargetOwner && !isMe && member.role !== "admin";
    }

    return false;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cài đặt workspace
          </DialogTitle>
          <DialogDescription>
            Quản lý thông tin và thành viên của workspace.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          onValueChange={(value) => setActiveTab(value)}
          defaultValue="general"
          value={activeTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Chung</TabsTrigger>
            <TabsTrigger value="members">Thành viên</TabsTrigger>
            <TabsTrigger value="permissions">Quyền hạn</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <section className="flex items-center">
                <Label htmlFor="name">Tên workspace</Label>
                {errors.name?.message && (
                  <span className="ml-auto text-xs text-destructive">
                    {errors.name.message}
                  </span>
                )}
              </section>
              <Input
                id="name"
                placeholder="Nhập tên workspace..."
                {...register("name")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả (tùy chọn)</Label>
              <TextArea
                id="description"
                placeholder="Mô tả ngắn về workspace..."
                {...register("description")}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <section className="flex items-center">
                <Label htmlFor="max_members">Số lượng thành viên</Label>
                {errors.max_members?.message && (
                  <span className="ml-auto text-xs text-destructive">
                    {errors.max_members.message}
                  </span>
                )}
              </section>
              <Input
                type="number"
                id="max_members"
                {...register("max_members")}
              />
            </div>

            <div className="space-y-2">
              <Label>Màu workspace</Label>
              <div className="flex mt-2 gap-2 flex-wrap">
                {BACKGROUND_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`h-8 w-8 rounded-full ${
                      color.class
                    } border-2 transition-all ${
                      selectedColor === color.class
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    onClick={() => setSelectedColor(color.class)}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between pt-4 border-t">
              <div className="">
                <h4 className="text-sm font-medium text-destructive mb-2">
                  Vùng nguy hiểm
                </h4>
                <Button
                  size="sm"
                  type="button"
                  variant="destructive"
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa workspace
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit(handleUpdateWorkspace)}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">
                Thành viên ({members.length})
              </h4>
              <Button size="sm" className="gap-2">
                <Users className="h-4 w-4" />
                Mời thành viên
              </Button>
            </div>

            <div className="space-y-3">
              {isLoadingMembers ? (
                <div className="text-center text-sm py-4 text-muted-foreground">
                  Đang tải thành viên...
                </div>
              ) : (
                <>
                  {members.map((member) => {
                    const isOwner = workspace.owner === member.user._id;
                    const isMe = member.user._id === user._id;

                    return (
                      <div
                        key={member._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.user.full_name.charAt(0)}
                            </AvatarFallback>
                            <AvatarImage
                              src={member.user.avatar.url}
                              alt={member.user.full_name}
                            ></AvatarImage>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {member.user.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                        <section className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {isOwner || isMe ? (
                              <>
                                {isOwner && <Badge>Chủ sở hữu</Badge>}
                                {isMe && !isOwner && (
                                  <Badge>{getRoleText(member.role)}</Badge>
                                )}
                              </>
                            ) : (
                              <Select
                                value={member.role}
                                disabled={!canEditRole(member)}
                                onValueChange={(value) =>
                                  handleUpdateRoleMember(value, member)
                                }
                              >
                                <SelectTrigger id="role">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">
                                    Quản trị
                                  </SelectItem>
                                  <SelectItem value="member">
                                    Thành viên
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>

                          {canManagerMembers(member) && (
                            <section>
                              <DropdownMenu>
                                <DropdownMenuTrigger align="start">
                                  <Button variant="ghost" className="w-8 h-8">
                                    <Settings />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleKickMember(member.user._id)
                                    }
                                    className="hover:bg-destructive hover:text-background justify-center"
                                  >
                                    Kick thành viên
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </section>
                          )}
                        </section>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="text-sm font-medium">Tạo bảng</h4>
                  <p className="text-xs text-muted-foreground">
                    Ai có thể tạo bảng mới
                  </p>
                </div>
                <Badge>Thành viên</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="text-sm font-medium">Mời thành viên</h4>
                  <p className="text-xs text-muted-foreground">
                    Ai có thể mời thành viên mới
                  </p>
                </div>
                <Badge>Quản trị</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="text-sm font-medium">Xóa workspace</h4>
                  <p className="text-xs text-muted-foreground">
                    Ai có thể xóa workspace
                  </p>
                </div>
                <Badge variant="destructive">Chỉ chủ sở hữu</Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default SettingWorkspaceDialog;
