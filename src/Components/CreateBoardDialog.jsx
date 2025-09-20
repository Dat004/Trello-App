import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

import { boardColors } from "../../config/data";
import {
  Input,
  Button,
  TextArea,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./UI";

function CreateBoardDialog({ trigger }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(boardColors[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="leading-1.5 gap-2">
            <Plus className="h-4 w-4" />
            Tạo bảng mới
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>Tạo bảng mới</DialogTitle>
          <DialogDescription>
            Tạo một bảng làm việc mới để tổ chức dự án của bạn.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên bảng *</Label>
              <Input
                id="name"
                placeholder="Nhập tên bảng..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <TextArea
                id="description"
                placeholder="Mô tả ngắn về bảng này..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={isLoading}
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label>Màu nền</Label>
              <div className="flex gap-2 flex-wrap">
                {boardColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    disabled={isLoading}
                    className={`h-8 w-8 rounded-md ${color} border-2 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      selectedColor === color
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="leading-1.5"
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              className="leading-1.5"
              type="submit"
              disabled={!name.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo bảng"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateBoardDialog;
