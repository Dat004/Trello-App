import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { BACKGROUND_COLORS } from "@/config/theme";
import { useCreateCard, useUpdateCard } from "@/features/boards/api/useCards";
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
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(
    BACKGROUND_COLORS[0].class
  );

  const { mutateAsync: createCard, isLoading: isCreating } = useCreateCard();
  const { mutateAsync: updateCard, isLoading: isUpdating } = useUpdateCard();

  const isLoading = isCreating || isUpdating;

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

  const handleAddLabel = (e) => {
    e?.preventDefault(); 
    if (newLabelName.trim()) {
      const newLabel = {
        name: newLabelName.trim(),
        color: newLabelColor,
      };
      setLabels((prev) => [...prev, newLabel]);
      setNewLabelName("");
      setNewLabelColor(BACKGROUND_COLORS[0].class);
    }
  };

  const handleRemoveLabel = (labelName) => {
    setLabels((prev) => prev.filter((l) => l.name !== labelName));
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
    setLabels([]);
    setNewLabelName("");
    setNewLabelColor(BACKGROUND_COLORS[0].class);
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
          {/* Title */}
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

          {/* Description */}
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

          {/* Due Date */}
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

          {/* Priority */}
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

          {/* Labels */}
          <div className="space-y-2">
            <Label>Nhãn</Label>

            {labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {labels.map((label) => (
                  <Badge
                    style={{ lineHeight: 1.45 }}
                    key={label._id}
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

            <div className="flex gap-2 items-center">
              <Input
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="Tên nhãn..."
                disabled={isSubmitting || isLoading}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddLabel(e))
                }
              />
              <Select
                value={newLabelColor}
                onValueChange={setNewLabelColor}
                disabled={isSubmitting || isLoading}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BACKGROUND_COLORS.map((option) => (
                    <SelectItem key={option.name} value={option.class}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full flex-grow-0 flex-shrink-0 ${option.class}`}
                        />
                        {option.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                size="sm"
                onClick={handleAddLabel}
                disabled={!newLabelName.trim() || isSubmitting || isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Buttons */}
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
              ) : (
                isEdit ? "Lưu thay đổi" : "Thêm thẻ"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CardFormDialog;
