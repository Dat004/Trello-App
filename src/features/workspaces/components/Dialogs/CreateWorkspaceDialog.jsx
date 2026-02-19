import { Building2, Plus } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  TextArea,
} from "@/Components/UI";
import { BACKGROUND_COLORS } from "@/config/theme";
import { useCreateWorkspace } from "@/features/workspaces/api/useWorkspacesList";
import { useZodForm } from "@/hooks";
import { workspaceSchema } from "@/schemas/workspaceSchema";

function CreateWorkSpaceDialog({ trigger }) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    BACKGROUND_COLORS[0].class
  );

  const { mutate: createWorkspace, isLoading } = useCreateWorkspace();
  const form = useZodForm(workspaceSchema);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleCreateWorspace = (data) => {
    createWorkspace({
      ...data,
      color: selectedColor,
    });

    // Reset data
    setOpen(false);
    setSelectedColor(BACKGROUND_COLORS[0].class);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full leading-1.5 gap-2">
            <Plus />
            Tạo workspace
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Tạo workspace mới
          </DialogTitle>
          <DialogDescription>
            Tạo không gian làm việc mới để tổ chức các dự án và bảng của bạn.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleCreateWorspace)}
          className="space-y-4"
        >
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang tạo..." : "Tạo workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkSpaceDialog;
