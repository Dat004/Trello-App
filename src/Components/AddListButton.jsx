import { Palette, Plus, X } from "lucide-react";
import { useState } from "react";

import { listApi } from "@/api/list";
import { BACKGROUND_COLORS } from "@/config/theme";
import { useApiMutation } from "@/hooks";
import { cn } from "@/lib/utils";
import { useBoardDetailStore } from "@/store";
import { Button, Card, CardContent, Input } from "./UI";

function AddListButton({ boardId }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    BACKGROUND_COLORS[0].class
  );
  const addList = useBoardDetailStore((state) => state.addList);

  const { mutate: createList, isLoading } = useApiMutation(
    (data) => listApi.create(boardId, data),
    (responseData) => {
      addList(responseData.list);
      setTitle("");
      setIsAdding(false);
    }
  );

  const handleAdd = () => {
    const newData = {
      title: title.trim(),
      color: selectedColor,
    };

    createList(newData);
  };

  const handleCancel = () => {
    setTitle("");
    setIsAdding(false);
  };

  const handleKeyPress = () => {};

  if (isAdding) {
    return (
      <section className="flex-shrink-0 w-72">
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

            <section className="mb-4">
              <section className="flex items-center gap-2 mb-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Màu header:</span>
              </section>
              <section className="grid grid-cols-4 gap-2">
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
                      <section className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </section>
                    )}
                  </button>
                ))}
              </section>
            </section>

            <section className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleAdd}
                className="leading-1.5"
                disabled={!title.trim() || isLoading}
              >
                {isLoading ? "Đang thêm..." : "Thêm danh sách"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </section>
          </CardContent>
        </Card>
      </section>
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
