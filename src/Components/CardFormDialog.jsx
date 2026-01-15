import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";

import { toDateInputValue } from "@/helpers/formatTime";
import { UserToast } from "@/context/ToastContext";
import { BACKGROUND_COLORS } from "@/config/theme";
import { cardSchema } from "@/schemas/cardSchema";
import { useBoardDetailStore } from "@/store";
import { cardApi } from "@/api/card";
import { useZodForm } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  Input,
  Label,
  TextArea,
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/Components/UI";

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
  const addCard = useBoardDetailStore((state) => state.addCard);
  const updateCard = useBoardDetailStore((state) => state.updateCard);
  const { addToast } = UserToast();

  const titleValue = watch("title");
  const priority = watch("priority") ?? "medium";

  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState([]);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(
    BACKGROUND_COLORS[0].class
  );
  const [isLoading, setIsLoading] = useState(false);

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
  }, [cardData, open, isEdit]);

  const handleAddLabel = () => {
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
    setIsLoading(true);

    const payload = {
      ...data,
      labels,
    };

    const res = isEdit
      ? await cardApi.update(boardId, listId, cardData._id, payload)
      : await cardApi.create(boardId, listId, payload);

    if (res.data.success) {
      isEdit
        ? updateCard(cardData._id, res.data.data.card)
        : addCard(res.data.data.card);
    }

    addToast({
      type: res.data.success ? "success" : "error",
      title: res.data.message,
    });

    handleCancel();
    setIsLoading(false);
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

          {/* Labels - giữ nguyên logic state riêng */}
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
                  e.key === "Enter" && (e.preventDefault(), handleAddLabel())
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
              disabled={isSubmitting || isLoading || !titleValue.trim()}
            >
              {isEdit ? "Lưu thay đổi" : "Thêm thẻ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CardFormDialog;
