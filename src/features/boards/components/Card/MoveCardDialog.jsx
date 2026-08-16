import { useEffect, useState } from "react";
import { ArrowRightLeft, Loader2 } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI";
import { useBoardContext } from "../../context/BoardStateContext";
import { useMoveCard } from "../../api/useCards";

function MoveCardDialog({ card, currentListId, trigger }) {
  const { boardData, setCardOrder, updateCardPosition } = useBoardContext();
  const { lists, listOrder, currentBoard } = boardData;
  const { mutate: moveCardApi, isLoading } = useMoveCard();

  const [open, setOpen] = useState(false);
  const [targetListId, setTargetListId] = useState(currentListId);
  const [targetPosition, setTargetPosition] = useState(1);

  // Sync initial targetListId and targetPosition when dialog opens
  useEffect(() => {
    if (open) {
      setTargetListId(currentListId);
      const cardOrderIds = lists[currentListId]?.cardOrderIds || [];
      const currentIdx = cardOrderIds.indexOf(card?._id);
      setTargetPosition(currentIdx >= 0 ? currentIdx + 1 : 1);
    }
  }, [open, currentListId, card?._id, lists]);

  // Available lists in board
  const availableLists = listOrder.map((id) => lists[id]).filter(Boolean);

  // Target list cards count for position calculation
  const targetList = lists[targetListId] || lists[currentListId];
  const maxPositions = targetList?.cardOrderIds?.length
    ? (targetListId === currentListId ? targetList.cardOrderIds.length : targetList.cardOrderIds.length + 1)
    : 1;

  const positions = Array.from({ length: maxPositions }, (_, i) => i + 1);

  const handleMoveCard = (e) => {
    e.preventDefault();
    if (!targetListId || !card?._id || !currentBoard?._id) return;

    const targetIndex = Math.max(0, Math.min(targetPosition - 1, maxPositions - 1));
    let newOrder = [];

    // 1. Update local UI state immediately
    if (targetListId === currentListId) {
      const currentOrder = [...(lists[currentListId]?.cardOrderIds || [])];
      const filteredOrder = currentOrder.filter((id) => id !== card._id);
      filteredOrder.splice(targetIndex, 0, card._id);
      newOrder = filteredOrder;

      setCardOrder({
        listId: currentListId,
        cardOrderIds: newOrder,
      });
    } else {
      const sourceOrder = (lists[currentListId]?.cardOrderIds || []).filter((id) => id !== card._id);
      const targetOrder = [...(lists[targetListId]?.cardOrderIds || [])];
      targetOrder.splice(targetIndex, 0, card._id);
      newOrder = targetOrder;

      setCardOrder({
        listId: currentListId,
        cardOrderIds: sourceOrder,
      });
      setCardOrder({
        listId: targetListId,
        cardOrderIds: newOrder,
        cardId: card._id,
        sourceListId: currentListId,
      });
    }

    // 2. Compute prevCardId & nextCardId according to server API contract
    const index = newOrder.indexOf(card._id);
    const prevCardId = index > 0 ? newOrder[index - 1] : null;
    const nextCardId = index < newOrder.length - 1 ? newOrder[index + 1] : null;

    // 3. Persist to server via API call
    moveCardApi(
      {
        boardId: currentBoard._id,
        listId: currentListId,
        id: card._id,
        data: {
          prevCardId,
          nextCardId,
          destinationListId: targetListId,
        },
      },
      {
        onSuccess: (res) => {
          const moved = res?.data?.data;
          if (moved?.pos != null) {
            updateCardPosition(
              String(moved.cardId || card._id),
              String(moved.listId || targetListId),
              moved.pos
            );
          }
        },
      }
    );

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <ArrowRightLeft className="h-3.5 w-3.5 mr-1" />
            Di chuyển
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <ArrowRightLeft className="h-4 w-4 text-primary" />
            Di chuyển thẻ "{card?.title}"
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleMoveCard} className="space-y-4 pt-2">
          {/* Target List Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Danh sách đích
            </label>
            <Select
              value={targetListId}
              onValueChange={(val) => {
                setTargetListId(val);
                // When switching list, default position to end of list
                const destList = lists[val];
                const destCount = destList?.cardOrderIds?.length || 0;
                setTargetPosition(val === currentListId ? (lists[currentListId]?.cardOrderIds?.indexOf(card?._id) + 1 || 1) : destCount + 1);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Chọn danh sách..." />
              </SelectTrigger>
              <SelectContent>
                {availableLists.map((l) => (
                  <SelectItem key={l._id} value={l._id} className="text-xs">
                    {l.title} {l._id === currentListId ? "(Hiện tại)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Position Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Vị trí trong danh sách
            </label>
            <Select
              value={String(targetPosition)}
              onValueChange={(val) => setTargetPosition(Number(val))}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Chọn vị trí..." />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos} value={String(pos)} className="text-xs">
                    Vị trí {pos} {pos === maxPositions ? "(Cuối cùng)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="h-8 text-xs px-3"
            >
              Hủy
            </Button>
            <Button type="submit" size="sm" disabled={isLoading} className="h-8 text-xs px-4 gap-1.5">
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Di chuyển
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default MoveCardDialog;
