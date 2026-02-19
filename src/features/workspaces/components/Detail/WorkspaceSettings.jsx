import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DeleteDialog from "@/Components/DeleteDialog";
import { BACKGROUND_COLORS } from "@/config/theme";
import { useDeleteWorkspace, useUpdateWorkspace } from "@/features/workspaces/api/useWorkspacesList";
import { useZodForm } from "@/hooks";
import { workspaceSchema } from "@/schemas/workspaceSchema";

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    TextArea,
} from "@/Components/UI";

function WorkspaceSettings({ workspace }) {
    const navigate = useNavigate();
    const [selectedColor, setSelectedColor] = useState(workspace.color);
    const [visibility, setVisibility] = useState(workspace.visibility || "private");

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

    const { mutate: updateWorkspace } = useUpdateWorkspace();
    const { mutate: deleteWorkspace } = useDeleteWorkspace();

    useEffect(() => {
        if (workspace) {
            setSelectedColor(workspace.color);
            setVisibility(workspace.visibility || "private");

            setValue("name", workspace.name);
            setValue("description", workspace.description);
            setValue("max_members", workspace.max_members);
        }
    }, [workspace, setValue]);

    const handleUpdateWorkspace = (data) => {
        updateWorkspace({
            id: workspace._id,
            data: {
                ...data,
                color: selectedColor,
            }
        });
    };

    const handleUpdateVisibility = () => {
        updateWorkspace({
            id: workspace._id,
            data: {
                visibility: visibility
            }
        });
    };

    const handleRemoveWorkspace = async () => {
        const res = await deleteWorkspace(workspace._id);
        
        if (res.data.success) navigate('/workspaces');
    };
      
  return (
    <div className="flex items-start flex-wrap gap-4.5">
      {/* Basic Info */}
      <div className="flex-1 w-full min-w-[300px]">
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Cập nhật thông tin workspace của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(handleUpdateWorkspace)} className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Label htmlFor="name">Tên workspace</Label>
                            {errors.name?.message && (
                                <span className="ml-auto text-xs text-destructive">
                                {errors.name.message}
                                </span>
                            )}
                        </div>
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
                        <div className="flex items-center">
                            <Label htmlFor="max_members">Số lượng thành viên</Label>
                            {errors.max_members?.message && (
                                <span className="ml-auto text-xs text-destructive">
                                {errors.max_members.message}
                                </span>
                            )}
                        </div>
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
                    <Button type="submit">Lưu thay đổi</Button>
                </form>
            </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="flex-1 w-full min-w-[300px] space-y-4">
        {/* Privacy */}
        <Card>
            <CardHeader>
                <CardTitle>Quyền riêng tư</CardTitle>
                <CardDescription>Quản lý quyền truy cập workspace</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input 
                                onChange={() => setVisibility("private")}
                                checked={visibility === "private"}
                                className="h-4 w-4" 
                                type="radio" 
                                name="privacy" 
                                id="private" 
                            />
                            <Label htmlFor="private" className="cursor-pointer font-normal">Riêng tư</Label>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">Chỉ những người được mời mới có thể truy cập</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input 
                                onChange={() => setVisibility("public")}
                                checked={visibility === "public"}
                                className="h-4 w-4" 
                                type="radio" 
                                name="privacy" 
                                id="public" 
                            />
                            <Label htmlFor="public" className="cursor-pointer font-normal">Công khai</Label>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">Bất kỳ ai có link đều có thể truy cập</p>
                    </div>
                    <Button type="button" onClick={handleUpdateVisibility} variant="outline" className="w-full">Lưu cài đặt</Button>
                </div>
            </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="text-destructive">Vùng nguy hiểm</CardTitle>
                <CardDescription>Các hành động này không thể hoàn tác</CardDescription>
            </CardHeader>
            <CardContent>
                <DeleteDialog
                    title="Xóa workspace này?"
                    description={`Bạn có chắc muốn xóa workspace "${workspace.name}"? Hành động này không thể hoàn tác.`}
                    onConfirm={handleRemoveWorkspace}
                    trigger={
                        <Button variant="destructive" className="w-full">Xóa workspace</Button>
                    }
                />
            </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default WorkspaceSettings;
