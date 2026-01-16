import { CheckSquare, Plus } from "lucide-react";
import { useState } from "react";

import { cardApi } from "@/api/card";
import { Button, Input, Label } from "@/Components/UI";
import { getChecklistProgress } from "@/helpers/card";
import { useApiMutation } from "@/hooks";
import { useBoardDetailStore } from "@/store";
import ChecklistItem from "./ChecklistItem";
import ChecklistProgress from "./ChecklistProgress";

function CardChecklist({ card, boardId, listId }) {
  const { addChecklistItem, toggleChecklistItem, deleteChecklistItem } =
    useBoardDetailStore();
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const checklistProgress = getChecklistProgress(card);

  const { mutate: addChecklist } = useApiMutation(
    (data) => cardApi.addChecklist(boardId, listId, card._id, data),
    (res) => {
      addChecklistItem(card._id, res.checklist);
      setNewChecklistItem("");
    }
  );

  const { mutate: toggleChecklist } = useApiMutation(
    (data) => cardApi.toggleChecklistItem(boardId, listId, card._id, data),
    (res) => {
      toggleChecklistItem(card._id, res.checklist);
    }
  );

  const { mutate: deleteChecklist } = useApiMutation(
    (data) => cardApi.deleteChecklist(boardId, listId, card._id, data)
  );

  const handleAddChecklistItem = () => {
    if (!card || !newChecklistItem.trim()) return;

    addChecklist({
      text: newChecklistItem.trim(),
    });
  };

  const handleToggleChecklistItem = (itemId) => {
    if (!card) return;

    toggleChecklist({
      checklistId: itemId,
    });
  };

  const handleDeleteChecklist = async (itemId) => {
    if (!card) return;

    const res = await deleteChecklist({
      checklistId: itemId,
    });

    if (res.success) {
      deleteChecklistItem(card._id, itemId);
    }
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

      {card.checklist.length > 0 && (
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
        />
        <Button
          size="sm"
          onClick={handleAddChecklistItem}
          disabled={!newChecklistItem.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default CardChecklist;
