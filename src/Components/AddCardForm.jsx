import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Button, Input, TextArea } from "./UI";

function AddCardForm({ listId, boardId, onCancel, onSuccess }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentList = state.currentBoard?.lists.find(
      (list) => list.id === listId
    );
    const maxOrder = currentList?.cards.length
      ? Math.max(...currentList.cards.map((card) => card.order))
      : -1;
    const newOrder = maxOrder + 1;

    const newCard = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim() || undefined,
      order: newOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
      labels: [],
      checklist: [],
      members: [],
      comments: [],
      attachments: [],
    };

    setTitle("");
    setDescription("");
    setIsLoading(false);
    setIsAdding(false);
    onSuccess?.();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setTitle("");
    setDescription("");
    onCancel?.();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isAdding) {
    return (
      <div className="space-y-3">
        <Input
          placeholder="Nhập tiêu đề thẻ..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
          disabled={isLoading}
        />
        <TextArea
          placeholder="Thêm mô tả (tùy chọn)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={2}
          disabled={isLoading}
        />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!title.trim() || isLoading}
          >
            {isLoading ? "Đang thêm..." : "Thêm thẻ"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsAdding(true)}
      className="w-full leading-1.5 justify-start text-muted-foreground hover:bg-muted/50"
    >
      <Plus className="h-4 w-4 mr-2" />
      Thêm thẻ
    </Button>
  );
}

export default AddCardForm;
