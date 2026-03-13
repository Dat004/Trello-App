import { Globe, Loader2, Lock, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
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
import { useCreateBoard, useUpdateBoard } from "@/features/boards/api/useBoards";
import { useZodForm } from "@/hooks";
import { cn } from "@/lib/utils";
import { boardSchema } from "@/schemas/boardSchema";

function BoardFormDialog({ trigger, isEdit = false, boardData }) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    BACKGROUND_COLORS[0].class
  );

  const { mutateAsync: createBoard, isLoading: isCreating } = useCreateBoard();
  const { mutateAsync: updateBoard, isLoading: isUpdating } = useUpdateBoard();
  
  const form = useZodForm(boardSchema, {
    defaultValue: {
      title: isEdit ? boardData.title : "",
      description: isEdit ? boardData.description : "",
      visibility: isEdit ? boardData.visibility : "workspace",
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (open) {
      if (isEdit) {
        setValue("title", boardData.title);
        setValue("description", boardData.description);
        setValue("visibility", boardData.visibility);
        setSelectedColor(boardData.color);
      } else {
        form.reset();
        setValue("visibility", "workspace");
        setSelectedColor(BACKGROUND_COLORS[0].class);
      }
    }
  }, [open, boardData, isEdit]); // Added isEdit to deps

  const handleActionsCard = async (data) => {
    const payload = { ...data, color: selectedColor };

    try {
        if (isEdit) {
            await updateBoard({ id: boardData._id, data: payload });
        } else {
            await createBoard(payload);
        }
        setOpen(false);
    } catch (error) {
        // Error handling is done in hooks
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full leading-1.5 gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isEdit ? "Cập nhật bảng" : "Tạo bảng mới"}
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Cập nhật bảng" : "Tạo bảng mới"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Thay đổi thông tin bảng làm việc của bạn."
              : "Tạo một bảng làm việc mới để tổ chức dự án của bạn."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleActionsCard)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <section className="flex items-center justify-between">
                <Label htmlFor="name">Tên bảng *</Label>
                {errors.title?.message && (
                  <span className="ml-auto text-xs text-destructive">
                    {errors.title.message}
                  </span>
                )}
              </section>
              <Input
                id="name"
                {...register("title")}
                placeholder="Nhập tên bảng..."
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <section className="flex items-center justify-between">
                <Label htmlFor="name">Mô tả</Label>
                {errors.description?.message && (
                  <span className="ml-auto text-xs text-destructive">
                    {errors.description.message}
                  </span>
                )}
              </section>
              <TextArea
                rows={3}
                id="description"
                {...register("description")}
                placeholder="Mô tả ngắn về bảng này..."
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label>Quyền riêng tư (Visibility)</Label>
              <div className="grid gap-2">
                {[
                  { id: "private", label: "Riêng tư (Private)", desc: "Chỉ thành viên bảng mới có quyền truy cập.", icon: Lock },
                  { id: "workspace", label: "Không gian làm việc (Workspace)", desc: "Tất cả thành viên Workspace có thể xem.", icon: Users },
                  { id: "public", label: "Công khai (Public)", desc: "Bất kỳ ai cũng có thể xem.", icon: Globe },
                ].map((option) => (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 select-none",
                      form.watch("visibility") === option.id ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                    )}
                    onClick={() => setValue("visibility", option.id)}
                  >
                    <div className="mt-0.5" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={form.watch("visibility") === option.id}
                        onCheckedChange={(checked) => {
                          if (checked) setValue("visibility", option.id);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <option.icon className={cn("h-4 w-4", form.watch("visibility") === option.id ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-sm font-semibold">{option.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{option.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Màu nền</Label>
              <div className="flex gap-2 flex-wrap">
                {BACKGROUND_COLORS.map((color) => (
                  <Button
                    type="button"
                    key={color.value}
                    className={`p-0 h-8 w-8 rounded-full hover:opacity-60 hover:${
                      color.class
                    } ${color.class} border-2 transition-all ${
                      selectedColor === color.class
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    onClick={() => setSelectedColor(color.class)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="leading-1.5"
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" className="leading-1.5 gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                isEdit ? "Lưu thay đổi" : "Tạo bảng"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default BoardFormDialog;
