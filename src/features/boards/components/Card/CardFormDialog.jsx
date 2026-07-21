import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useCreateCard, useUpdateCard } from "@/features/boards/api/useCards";
import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { toDateInputValue } from "@/helpers/formatTime";
import { useZodForm } from "@/hooks";
import { cardSchema } from "@/schemas/cardSchema";

import {
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TextArea,
} from "@/Components/UI";
import { cn } from "@/lib/utils";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Thấp" },
  { value: "medium", label: "Trung bình" },
  { value: "high", label: "Cao" },
];

function CardFormDialog({
  trigger,
  isEdit = false,
  cardData = {},
  listId,
  boardId,
}) {
  const { boardData } = useBoardContext(false) || {};
  const boardLabels = boardData?.currentBoard?.labels || [];

  const form = useZodForm(cardSchema, {
    defaultValues: {
      title: "",
      description: "",
      due_date: null,
      priority: "medium",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = form;

  const titleValue = watch("title");
  const priority = watch("priority") ?? "medium";

  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState([]);

  const { mutateAsync: createCard, isLoading: isCreating } = useCreateCard();
  const { mutateAsync: updateCard, isLoading: isUpdating } = useUpdateCard();

  const isLoading = isCreating || isUpdating;

  const selectedNames = new Set(labels.map((label) => label.name?.toLowerCase()));
  const availableLabels = boardLabels.filter(
    (label) => !selectedNames.has(label.name?.toLowerCase())
  );

  useEffect(() => {
    if (isEdit && cardData && open) {
      reset({
        title: cardData.title || "",
        description: cardData.description || "",
        due_date: toDateInputValue(cardData.due_date) || null,
        priority: cardData.priority || "medium",
      });
      setLabels(cardData.labels || []);
    }
  }, [cardData, open, isEdit, reset]);

  const handleToggleBoardLabel = (boardLabel) => {
    setLabels((prev) => {
      const exists = prev.some(
        (label) => label.name?.toLowerCase() === boardLabel.name?.toLowerCase()
      );
      if (exists) {
        return prev.filter(
          (label) => label.name?.toLowerCase() !== boardLabel.name?.toLowerCase()
        );
      }
      return [...prev, { name: boardLabel.name, color: boardLabel.color }];
    });
  };

  const handleRemoveLabel = (labelName) => {
    setLabels((prev) => prev.filter((l) => l.name !== labelName));
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
    setLabels([]);
  };

  const handleAddCard = async (data) => {
    const payload = {
      ...data,
      labels,
      boardId,
      listId,
    };

    if (isEdit) {
      await updateCard({ boardId, listId, id: cardData._id, data: payload });
    } else {
      await createCard(payload);
    }
    handleCancel();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full" asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Chỉnh sửa thẻ" : "Thêm thẻ mới"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Cập nhật thông tin thẻ."
              : "Tạo thẻ mới để tổ chức công việc của bạn trong mỗi cột."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleAddCard)}
          className="grid gap-4 py-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Tiêu đề *</Label>
              {errors.title && (
                <span className="text-xs text-destructive">
                  {errors.title.message}
                </span>
              )}
            </div>
            <Input
              id="title"
              placeholder="Nhập tiêu đề thẻ..."
              disabled={isSubmitting || isLoading}
              {...register("title")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <TextArea
              id="description"
              placeholder="Nhập mô tả (không bắt buộc)..."
              rows={3}
              className="resize-none"
              disabled={isSubmitting || isLoading}
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Ngày hết hạn</Label>
            <div className="flex items-center gap-2">
              <Input
                id="due_date"
                type="date"
                disabled={isSubmitting || isLoading}
                {...register("due_date", { valueAsDate: true })}
              />
              {watch("due_date") && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setValue("due_date", null)}
                  disabled={isSubmitting || isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Độ ưu tiên</Label>
            <Select
              value={priority}
              onValueChange={(value) =>
                setValue("priority", value, {
                  shouldValidate: true,
                })
              }
              disabled={isSubmitting || isLoading}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Chọn mức độ..." />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-xs text-destructive">
                {errors.priority.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Nhãn</Label>

            {labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {labels.map((label) => (
                  <Badge
                    style={{ lineHeight: 1.45 }}
                    key={label._id || label.name}
                    className={cn(
                      "text-white cursor-pointer hover:opacity-80",
                      label.color
                    )}
                  >
                    {label.name}
                    <button
                      onClick={() => handleRemoveLabel(label.name)}
                      className="ml-1 hover:bg-white/20 rounded"
                      type="button"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {boardLabels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableLabels.map((label) => (
                  <button
                    key={label._id}
                    type="button"
                    disabled={isSubmitting || isLoading}
                    onClick={() => handleToggleBoardLabel(label)}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Badge
                      style={{ lineHeight: 1.45 }}
                      className={cn(
                        "text-white border border-dashed border-white/40",
                        label.color
                      )}
                    >
                      + {label.name}
                    </Badge>
                  </button>
                ))}
                {availableLabels.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Đã chọn tất cả nhãn của board
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Chưa có nhãn trên board. Mở mục Nhãn trên header để tạo.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="min-w-[100px] gap-2"
              disabled={isSubmitting || isLoading || !titleValue.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : isEdit ? (
                "Lưu thay đổi"
              ) : (
                "Thêm thẻ"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CardFormDialog;
