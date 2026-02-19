import { Settings, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

import DeleteDialog from "@/Components/DeleteDialog";
import { BACKGROUND_COLORS } from "@/config/theme";
import {
  useKickMember,
  useUpdateMemberRole,
  useWorkspaceMembers
} from "@/features/workspaces/api/useWorkspaceMembers";
import {
  useDeleteWorkspace,
  useUpdateWorkspace
} from "@/features/workspaces/api/useWorkspacesList";
import { getRoleText } from "@/helpers/role";
import { useZodForm } from "@/hooks";
import { workspaceSchema } from "@/schemas/workspaceSchema";
import { useAuthStore } from "@/store";

import {
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextArea,
} from "@/Components/UI";

function SettingWorkspaceDialog({ workspace, trigger }) {
  const [activeTab, setActiveTab] = useState("general");
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(workspace.color);
  const { user } = useAuthStore();

  // React Query Hooks
  const { mutate: updateWorkspace } = useUpdateWorkspace();
  const { mutate: deleteWorkspace } = useDeleteWorkspace();
  const {
    data: members = [],
    isLoading: isLoadingMembers
  } = useWorkspaceMembers(workspace._id);
  const { mutate: updateMemberRole } = useUpdateMemberRole(workspace._id);
  const { mutate: kickMember } = useKickMember(workspace._id);

  const form = useZodForm(workspaceSchema, {
    defaultValues: {
      name: workspace.name,
      description: workspace.description,
      max_members: workspace.max_members,
    },
  });
  const { register, handleSubmit, setValue, formState: { errors } } = form;

  const myMember = members.find((m) => m.user._id === user._id);
  const isMyWorkspace = user._id === workspace.owner;
  const isAdminWorkspace = myMember?.role === "admin";

  useEffect(() => {
    if (open) {
        setSelectedColor(workspace.color);
        setValue("name", workspace.name);
        setValue("description", workspace.description);
        setValue("max_members", workspace.max_members);
    }
  }, [open, workspace, setValue]);

  const handleUpdateWorkspace = (data) => {
    updateWorkspace({
        id: workspace._id,
        data: { ...data, color: selectedColor }
    });
    setOpen(false);
  };

  const handleUpdateRoleMember = (role, member) => {
    updateMemberRole({ 
        workspaceId: workspace._id,
        member_id: member.user._id, 
        role 
    });
  };

  const handleKickMemberAction = (member_id) => {
     kickMember({ 
        workspaceId: workspace._id,
        member_id 
    });
  };

  // Permission Checks
  const canEditRole = (member) => {
    if (!member?.user?._id) return false;
    const isTargetOwner = member.user._id === workspace.owner;
    const isMe = member.user._id === user._id;

    if (isMyWorkspace) return !isTargetOwner;

    // Admin cannot change role of Owner or Themselves (usually)
    if (isAdminWorkspace) {
      if (isTargetOwner) return false;
      if (isMe) return false;
      // Admin cannot change another Admin's role? Assume NO for now (only owner can demote admin).
      if (member.role === 'admin') return false; 
      return true;
    }

    return false;
  };

  const canManagerMembers = (member) => {
    if (!member?.user?._id) return false;
    const isTargetOwner = member.user._id === workspace.owner;
    const isMe = member.user._id === user._id;

    if (isMyWorkspace) return !isTargetOwner;

    if (isAdminWorkspace) {
      if (isTargetOwner) return false;
      if (isMe) return false;
      if (member.role === "admin") return false; // Admin kick Admin? No.
      return true;
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto w-full">
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
                {...register("max_members", { valueAsNumber: true })}
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
                <DeleteDialog
                  title="Xóa workspace này?"
                  description={`Bạn có chắc chắn muốn xóa workspace "${workspace.name}" không? Hành động này không thể hoàn tác.`}
                  onConfirm={() => {
                      deleteWorkspace(workspace._id);
                      setOpen(false);
                  }}
                  trigger={
                    <Button
                      size="sm"
                      type="button"
                      variant="destructive"
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa workspace
                    </Button>
                  }
                />
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

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
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
                              {member.user.full_name?.charAt(0)}
                            </AvatarFallback>
                            <AvatarImage
                              src={member.user.avatar?.url}
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
                            {(!canEditRole(member)) ? (
                              <Badge>{getRoleText(member.role, member.user._id, workspace.owner)}</Badge>
                            ) : (
                              <Select
                                value={member.role}
                                disabled={!canEditRole(member)}
                                onValueChange={(value) =>
                                  handleUpdateRoleMember(value, member)
                                }
                              >
                                <SelectTrigger id={`role-${member._id}`} className="w-[110px]">
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
                                    <DeleteDialog
                                        title="Kick thành viên?"
                                        description="Bạn có chắc muốn xóa thành viên này khỏi workspace?"
                                        onConfirm={() => handleKickMemberAction(member.user._id)}
                                        trigger={
                                            <DropdownMenuItem
                                            onSelect={(e) => e.preventDefault()}
                                            className="hover:bg-destructive hover:text-background justify-center cursor-pointer text-destructive"
                                            >
                                            Kick thành viên
                                            </DropdownMenuItem>
                                        }
                                    />
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
