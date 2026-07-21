import { Loader2, Plus, Tag, X } from "lucide-react";
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
  Label,
} from "@/Components/UI";
import {
  useAssignCardLabel,
  useRemoveCardLabel,
} from "@/features/boards/api/useCardLabels";
import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { cn } from "@/lib/utils";
import { useBoardAccess } from "../../BoardAccessGuard";

function CardLabels({ card, boardId, listId }) {
  const [open, setOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const { boardData } = useBoardContext();
  const { readOnly } = useBoardAccess();

  const { mutate: assignLabel, isLoading: isAssigning } = useAssignCardLabel();
  const { mutate: removeLabel, isLoading: isRemoving } = useRemoveCardLabel();

  const cardLabels = card?.labels || [];
  const boardLabels = boardData?.currentBoard?.labels || [];
  const assignedNames = new Set(
    cardLabels.map((label) => label.name?.toLowerCase())
  );

  const availableLabels = boardLabels.filter(
    (label) => !assignedNames.has(label.name?.toLowerCase())
  );

  const handleAssign = (boardLabelId) => {
    setProcessingId(boardLabelId);
    assignLabel(
      {
        boardId,
        listId,
        cardId: card._id,
        data: { labelId: boardLabelId },
      },
      {
        onSuccess: () => setOpen(false),
        onSettled: () => setProcessingId(null),
      }
    );
  };

  const handleRemove = (labelId) => {
    setProcessingId(labelId);
    removeLabel(
      {
        boardId,
        listId,
        cardId: card._id,
        labelId,
      },
      {
        onSettled: () => setProcessingId(null),
      }
    );
  };

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Nhãn
        </Label>

        {!readOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                disabled={isAssigning || isRemoving}
              >
                <Plus className="h-3 w-3 mr-1" />
                Gán nhãn
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Gán nhãn</DialogTitle>
                <DialogDescription>
                  Chọn nhãn từ palette của board để gắn vào thẻ này.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-2 max-h-[300px] overflow-y-auto py-2">
                {availableLabels.length > 0 ? (
                  availableLabels.map((label) => (
                    <button
                      key={label._id}
                      type="button"
                      onClick={() => handleAssign(label._id)}
                      disabled={isAssigning}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted text-left disabled:opacity-50"
                    >
                      <Badge
                        className={cn("text-white", label.color)}
                        style={{ lineHeight: 1.45 }}
                      >
                        {label.name}
                      </Badge>
                      <div className="flex-1" />
                      {isAssigning && processingId === label._id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Tag className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">
                      {boardLabels.length === 0
                        ? "Board chưa có nhãn. Tạo nhãn trong header trước."
                        : "Tất cả nhãn đã được gán"}
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {cardLabels.length > 0 ? (
          cardLabels.map((label) => (
            <div
              key={label._id || label.name}
              className="group relative"
            >
              <Badge
                className={cn(
                  "text-white pr-6",
                  label.color
                )}
                style={{ lineHeight: 1.45 }}
              >
                {label.name}
              </Badge>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemove(label._id)}
                  disabled={isRemoving}
                  className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 rounded-full p-0.5 disabled:opacity-50"
                  title="Gỡ nhãn"
                >
                  {isRemoving && processingId === label._id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground py-2">
            Chưa có nhãn
          </p>
        )}
      </div>
    </div>
  );
}

export default CardLabels;
