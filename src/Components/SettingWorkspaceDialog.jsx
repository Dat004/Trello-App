import { useEffect, useState } from "react";
import { Settings, Users, Trash2 } from "lucide-react";

import { workspaceSchema } from "@/schemas/workspaceSchema";
import { BACKGROUND_COLORS } from "@/config/theme";
import { useZodForm, useWorkspace } from "@/hooks";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  TextArea,
  Avatar,
  AvatarFallback,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./UI";

function SettingWorkspaceDialog({ workspace, trigger }) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(workspace.color);

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

  useEffect(() => {
    setSelectedColor(workspace.color);

    setValue("name", workspace.name);
    setValue("description", workspace.description);
    setValue("max_members", workspace.max_members);
  }, [workspace]);

  const members = [
    { id: "1", name: "Nguyễn Văn A", email: "a@example.com", role: "admin" },
    { id: "2", name: "Trần Thị B", email: "b@example.com", role: "member" },
    { id: "3", name: "Lê Văn C", email: "c@example.com", role: "viewer" },
  ];

  const handleUpdateWorkspace = (data) => {
    updateWorkspace(workspace._id, {
      ...data,
      color: selectedColor,
    });

    // Close
    setOpen(false);
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

        <Tabs defaultValue="general" className="w-full">
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
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        member.role === "admin" ? "default" : "secondary"
                      }
                    >
                      {member.role === "admin"
                        ? "Quản trị"
                        : member.role === "member"
                        ? "Thành viên"
                        : "Xem"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
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
