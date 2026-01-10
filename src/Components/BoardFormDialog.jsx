import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { boardSchema } from "@/schemas/boardSchema";
import { BACKGROUND_COLORS } from "@/config/theme";
import { useZodForm, useBoard } from "@/hooks";
import {
  Input,
  Button,
  TextArea,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./UI";

function BoardFormDialog({ trigger, isEdit = false, boardData }) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    BACKGROUND_COLORS[0].class
  );

  const { createBoard } = useBoard();
  const form = useZodForm(boardSchema, {
    defaultValue: {
      title: isEdit ? boardData.title : "",
      description: isEdit ? boardData.description : "",
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
        setSelectedColor(boardData.color);
      } else {
        form.reset();
        setSelectedColor(BACKGROUND_COLORS[0].class);
      }
    }
  }, [open, boardData]);

  const handleActionsCard = async (data) => {
    const payload = { ...data, color: selectedColor, visibility: "private" };

    console.log(payload);

    if (isEdit) {
    } else {
      await createBoard(payload);
    }

    // Reset
    setOpen(false);
  };

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
            <Button type="submit" className="leading-1.5">
              {isEdit ? "Lưu thay đổi" : "Tạo bảng"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default BoardFormDialog;
