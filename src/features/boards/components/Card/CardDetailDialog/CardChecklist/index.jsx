import { CheckSquare, Plus } from "lucide-react";
import { useState } from "react";

import { Button, Input, Label } from "@/Components/UI";
import { useAddChecklistItem, useDeleteChecklistItem, useToggleChecklistItem } from "@/features/boards/api/useCards";
import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { getChecklistProgress } from "@/helpers/card";
import ChecklistItem from "./ChecklistItem";
import ChecklistProgress from "./ChecklistProgress";

function CardChecklist({ card, boardId, listId }) {
  // Use Context for Optimistic Updates (Optional now since we invalidate queries)
  // Or remove context logic if queries are fast enough. Keeping for consistency if desired.
  // Actually, let's rely on React Query Invalidation for cleaner code unless lag is noticed.
  const { addChecklistItem, toggleChecklistItem, deleteChecklistItem } = useBoardContext(); 
  
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const checklistProgress = getChecklistProgress(card);

  const { mutate: addChecklist, isLoading: isAdding } = useAddChecklistItem();
  const { mutate: toggleChecklist } = useToggleChecklistItem();
  const { mutate: deleteChecklist } = useDeleteChecklistItem();

  const handleAddChecklistItem = () => {
    if (!card || !newChecklistItem.trim()) return;

    addChecklist({
        boardId, 
        listId, 
        cardId: card._id,
        data: { text: newChecklistItem.trim(), title: newChecklistItem.trim() }
    }, {
        onSuccess: (res) => {
             if (res.data?.success) {
                setNewChecklistItem("");
             }
        }
    });
  };

  const handleToggleChecklistItem = (itemId, completed) => {
    if (!card) return;
    
    toggleChecklist({
      boardId, listId, cardId: card._id,
      data: { checklistId: itemId, completed }
    });
  };

  const handleDeleteChecklist = (itemId) => {
    if (!card) return;

    deleteChecklist({
      boardId, listId, cardId: card._id,
      data: { checklistId: itemId }
    });
  };

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          Checklist
        </Label>
      </div>

      {checklistProgress && (
        <ChecklistProgress
          completed={checklistProgress.completed}
          total={checklistProgress.total}
          percentage={checklistProgress.percentage}
        />
      )}

      {card.checklist && card.checklist.length > 0 && (
        <div className="space-y-2">
          {card.checklist.map((item) => (
            <ChecklistItem
              key={item._id}
              item={item}
              onToggle={handleToggleChecklistItem}
              onDelete={handleDeleteChecklist}
            />
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Thêm công việc mới..."
          value={newChecklistItem}
          onChange={(e) => setNewChecklistItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddChecklistItem();
            }
          }}
          className="flex-1"
          disabled={isAdding}
        />
        <Button
          size="sm"
          onClick={handleAddChecklistItem}
          disabled={!newChecklistItem.trim() || isAdding}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default CardChecklist;
