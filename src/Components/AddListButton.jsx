import { useState } from "react";
import { Plus, X, Palette } from "lucide-react";

import { Button, Input, Card, CardContent } from "./UI";
import { listColors } from "@/config/data";
import { cn } from "@/lib/utils";

function AddListButton() {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(listColors[0]);

  const handleAdd = async () => {
    if (!title.trim()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setTitle("");
    setIsLoading(false);
    setIsAdding(false);
    setSelectedColor(listColors[0]);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setTitle("");
    setSelectedColor(listColors[0]);
  };

  const handleKeyPress = () => {
    if (e.key === "Enter") {
      handleAdd();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

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
                {listColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "relative h-8 rounded-md transition-all hover:scale-105",
                      selectedColor.value === color.value
                        ? "ring-2 ring-white ring-offset-2 ring-offset-card"
                        : "",
                      color.class
                    )}
                    title={color.name}
                    disabled={isLoading}
                  >
                    {selectedColor.value === color.value && (
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
        variant="ghost"
        onClick={() => setIsAdding(true)}
        className="w-full h-12 border-2 border-dashed border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all"
      >
        <Plus className="h-4 w-4 mr-2" />
        Thêm danh sách
      </Button>
    </div>
  );
}

export default AddListButton;
