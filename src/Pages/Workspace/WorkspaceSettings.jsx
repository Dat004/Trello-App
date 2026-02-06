import { useState, useEffect } from "react";

import { workspaceSchema } from "@/schemas/workspaceSchema";
import DeleteDialog from "@/Components/DeleteDialog";
import { BACKGROUND_COLORS } from "@/config/theme";
import { useWorkspace, useZodForm } from "@/hooks";
import { useWorkspaceStore } from "@/store";
import { 
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    TextArea,
    Label,
} from "@/Components/UI"

function WorkspaceSettings({ workspace }) {
    const [selectedColor, setSelectedColor] = useState(workspace.color);
    const [visibility, setVisibility] = useState(workspace.visibility || "private");

    const setCurrentWorkspace = useWorkspaceStore((state) => state.setCurrentWorkspace);
    const { updateWorkspace, removeWorkspace } = useWorkspace();
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
        if (workspace) {
            setSelectedColor(workspace.color);
            setVisibility(workspace.visibility || "private");

            setValue("name", workspace.name);
            setValue("description", workspace.description);
            setValue("max_members", workspace.max_members);
        }
    }, [workspace]);

    const handleUpdateWorkspace = async (data) => {
        const res = await updateWorkspace(workspace._id, {
            ...data,
            color: selectedColor,
        });

        if (!res.data.success) {
            setValue("name", workspace.name);
            setValue("description", workspace.description);
            setValue("max_members", workspace.max_members);
            setSelectedColor(workspace.color);

            return;
        }

        setCurrentWorkspace(res.data.data.workspace);
    };

    const handleUpdateVisibility = async () => {
        const res = await updateWorkspace(workspace._id, {
            ...workspace,
            visibility,
        });

        if (!res.data.success) {
            setVisibility(workspace.visibility || "private");

            return;
        }

        setCurrentWorkspace(res.data.data.workspace);
    };

    const handleRemoveWorkspace = async () => {
        const res = await removeWorkspace(workspace._id);

        if (!res.data.success) {
            setValue("name", workspace.name);
            setValue("description", workspace.description);
            setValue("max_members", workspace.max_members);
            setSelectedColor(workspace.color);
        }
    };
      
  return (
    <div className="flex items-start flex-wrap gap-4.5">
      {/* Basic Info */}
      <section className="flex-1">
        <Card>
            <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Cập nhật thông tin workspace của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Button type="button" onClick={handleSubmit(handleUpdateWorkspace)}>Lưu thay đổi</Button>
            </CardContent>
        </Card>
      </section>

      {/* Privacy */}
      <section className="flex-1">
        <Card>
            <CardHeader>
                <CardTitle>Quyền riêng tư</CardTitle>
                <CardDescription>Quản lý quyền truy cập workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <section className="space-y-2">
                    <section className="flex items-center gap-2">
                        <Input 
                            onChange={() => setVisibility("private")}
                            checked={visibility === "private"}
                            className="h-4 w-4" 
                            type="radio" 
                            name="privacy" 
                            id="private" 
                        />
                        <Label htmlFor="private">Riêng tư</Label>
                    </section>
                    <p className="text-xs text-muted-foreground ml-6">Chỉ những người được mời mới có thể truy cập</p>
                </section>
                <section className="space-y-2">
                    <section className="flex items-center gap-2">
                        <Input 
                            onChange={() => setVisibility("public")}
                            checked={visibility === "public"}
                            className="h-4 w-4" 
                            type="radio" 
                            name="privacy" 
                            id="public" 
                        />
                        <Label htmlFor="public">Công khai</Label>
                    </section>
                    <p className="text-xs text-muted-foreground ml-6">Bất kỳ ai có link đều có thể truy cập</p>
                </section>
                <Button type="button" onClick={handleUpdateVisibility}>Lưu cài đặt</Button>
            </CardContent>
        </Card>
      </section>

      {/* Danger Zone */}
      <section className="flex-1">
        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="text-destructive">Vùng nguy hiểm</CardTitle>
                <CardDescription>Các hành động này không thể hoàn tác</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <DeleteDialog
                    title="Xóa workspace này?"
                    description={`Bạn có chắc muốn xóa workspace "${workspace.name}"? Hành động này không thể hoàn tác.`}
                    onConfirm={() => handleRemoveWorkspace()}
                    trigger={
                        <Button variant="destructive">Xóa workspace</Button>
                    }
                />
            </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default WorkspaceSettings;
