import { Loader2, Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import { useState } from "react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI";
import { BACKGROUND_COLORS } from "@/config/theme";
import {
  useCreateBoardLabel,
  useDeleteBoardLabel,
  useUpdateBoardLabel,
} from "@/features/boards/api/useBoardLabels";
import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { cn } from "@/lib/utils";
import { useBoardAccess } from "../BoardAccessGuard";

function BoardLabelsDialog({ trigger }) {
  const { boardData } = useBoardContext();
  const { readOnly } = useBoardAccess();
  const boardId = boardData?.currentBoard?._id;
  const labels = boardData?.currentBoard?.labels || [];

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(BACKGROUND_COLORS[0].class);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState(BACKGROUND_COLORS[0].class);

  const { mutate: createLabel, isLoading: isCreating } = useCreateBoardLabel();
  const { mutate: updateLabel, isLoading: isUpdating } = useUpdateBoardLabel();
  const { mutate: deleteLabel, isLoading: isDeleting } = useDeleteBoardLabel();

  const isBusy = isCreating || isUpdating || isDeleting;

  const resetCreateForm = () => {
    setName("");
    setColor(BACKGROUND_COLORS[0].class);
  };

  const handleCreate = (e) => {
    e?.preventDefault();
    if (!name.trim() || !boardId) return;
    createLabel(
      { boardId, data: { name: name.trim(), color } },
      { onSuccess: () => resetCreateForm() }
    );
  };

  const startEdit = (label) => {
    setEditingId(label._id);
    setEditName(label.name);
    setEditColor(label.color);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditColor(BACKGROUND_COLORS[0].class);
  };

  const handleUpdate = (label) => {
    if (!editName.trim() || !boardId) return;
    updateLabel(
      {
        boardId,
        labelId: label._id,
        oldName: label.name,
        oldColor: label.color,
        data: { name: editName.trim(), color: editColor },
      },
      { onSuccess: () => cancelEdit() }
    );
  };

  const handleDelete = (label) => {
    if (!boardId) return;
    deleteLabel({
      boardId,
      labelId: label._id,
      labelName: label.name,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Nhãn board
          </DialogTitle>
          <DialogDescription>
            Quản lý palette nhãn dùng chung cho mọi thẻ trên board này.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!readOnly && (
            <form onSubmit={handleCreate} className="flex gap-2 items-center">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên nhãn..."
                disabled={isBusy}
                className="flex-1"
              />
              <Select value={color} onValueChange={setColor} disabled={isBusy}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BACKGROUND_COLORS.map((option) => (
                    <SelectItem key={option.value} value={option.class}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", option.class)} />
                        {option.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="submit"
                size="sm"
                disabled={!name.trim() || isBusy}
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </form>
          )}

          <div className="space-y-2 max-h-[320px] overflow-y-auto">
            {labels.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Chưa có nhãn nào. Tạo nhãn đầu tiên để gắn vào thẻ.
              </p>
            ) : (
              labels.map((label) => (
                <div
                  key={label._id}
                  className="flex items-center gap-2 p-2 rounded-xl border border-border/60"
                >
                  {editingId === label._id ? (
                    <>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={isBusy}
                        className="flex-1 h-8"
                      />
                      <Select
                        value={editColor}
                        onValueChange={setEditColor}
                        disabled={isBusy}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BACKGROUND_COLORS.map((option) => (
                            <SelectItem key={option.value} value={option.class}>
                              <div className="flex items-center gap-2">
                                <div className={cn("w-3 h-3 rounded-full", option.class)} />
                                {option.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        className="h-8"
                        disabled={!editName.trim() || isBusy}
                        onClick={() => handleUpdate(label)}
                      >
                        Lưu
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={cancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge
                        className={cn("text-white", label.color)}
                        style={{ lineHeight: 1.45 }}
                      >
                        {label.name}
                      </Badge>
                      <div className="flex-1" />
                      {!readOnly && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => startEdit(label)}
                            disabled={isBusy}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(label)}
                            disabled={isBusy}
                          >
                            {isDeleting ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BoardLabelsDialog;
