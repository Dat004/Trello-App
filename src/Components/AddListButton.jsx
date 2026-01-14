import { useState } from "react";
import { Plus, X, Palette } from "lucide-react";

import { Button, Input, Card, CardContent } from "./UI";
import { UserToast } from "@/context/ToastContext";
import { BACKGROUND_COLORS } from "@/config/theme";
import { useBoardDetailStore } from "@/store";
import { listApi } from "@/api/list";
import { cn } from "@/lib/utils";

function AddListButton({ boardId }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    BACKGROUND_COLORS[0].class
  );

  const { addToast } = UserToast();
  const addList = useBoardDetailStore((state) => state.addList);

  const handleAdd = async () => {
    const newData = {
      title: title.trim(),
      color: selectedColor,
    };

    setIsLoading(true);
    const response = await listApi.create(boardId, newData);
    setIsLoading(false);

    addToast({
      type: response.data.success ? "success" : "error",
      title: response.data.message,
    });

    if (response.data.success) {
      addList(response.data.data.list);

      setTitle("");
      setIsAdding(false);
    }
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
