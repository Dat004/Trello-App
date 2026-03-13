import { Loader2, Palette, Plus, X } from "lucide-react";
import { useState } from "react";

import { Button, Card, CardContent, Input } from "@/Components/UI";
import { BACKGROUND_COLORS } from "@/config/theme";
import { useCreateList } from "@/features/boards/api/useLists";
import { cn } from "@/lib/utils";

function AddListButton({ boardId }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    BACKGROUND_COLORS[0].class
  );
  
  const { mutateAsync: createList, isLoading } = useCreateList();

  const handleAdd = async () => {
    if (!title.trim()) return;

    const newData = {
      title: title.trim(),
      color: selectedColor,
    };

    try {
      await createList({ boardId, data: newData });
      setTitle("");
      setIsAdding(false);
    } catch (error) {
    }
  };

  const handleCancel = () => {
    setTitle("");
    setIsAdding(false);
  };

  const handleKeyPress = (e) => {
      if (e.key === "Enter") {
          handleAdd();
      } else if (e.key === "Escape") {
          handleCancel();
      }
  };

  if (isAdding) {
    return (
      <div className="flex-shrink-0 w-72">
        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <Input
              placeholder="Nhập tên danh sách..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              className="mb-3"
              autoFocus
              disabled={isLoading}
            />

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Màu header:</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUND_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.class)}
                    className={cn(
                      "relative h-8 rounded-md transition-all hover:scale-105",
                      selectedColor === color.class
                        ? "ring-2 ring-white ring-offset-2 ring-offset-card"
                        : "",
                      color.class
                    )}
                    title={color.name}
                    disabled={isLoading}
                  >
                    {selectedColor === color.class && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleAdd}
                className="leading-1.5"
                disabled={!title.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang thêm...</span>
                  </div>
                ) : (
                  "Thêm danh sách"
                )}
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
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-72">
      <Button
        variant="secondary"
        onClick={() => setIsAdding(true)}
        className="w-full h-12 transition-all"
      >
        <Plus className="h-4 w-4 mr-2" />
        Thêm danh sách
      </Button>
    </div>
  );
}

export default AddListButton;
