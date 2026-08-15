import { useState } from "react";
import { Image, Palette, Check, X, Link as LinkIcon } from "lucide-react";

import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/UI";
import { COVER_COLORS, PRESET_COVER_IMAGES } from "../../../constants/coverConstants";
import { useCardCover } from "../../../hooks/useCardCover";
import { cn } from "@/lib/utils";

function CardCoverPicker({ card, boardId, listId, trigger }) {
  const [customUrl, setCustomUrl] = useState("");
  const [open, setOpen] = useState(false);

  const {
    currentCover,
    isUpdating,
    handleSetCoverColor,
    handleSetCoverUrl,
    handleRemoveCover,
  } = useCardCover({ card, boardId, listId });

  const onApplyCustomUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    handleSetCoverUrl(customUrl.trim());
    setCustomUrl("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <Palette className="h-3.5 w-3.5 mr-1" />
            Ảnh bìa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-6 space-y-4">
        <DialogHeader className="pb-2 border-b">
          <div className="flex items-center justify-between pr-4">
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Palette className="h-4 w-4 text-primary" />
              Ảnh bìa thẻ
            </DialogTitle>
            {currentCover && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleRemoveCover();
                  setOpen(false);
                }}
                className="h-7 text-xs text-destructive hover:text-destructive gap-1 px-2"
                disabled={isUpdating}
              >
                <X className="h-3 w-3" />
                Gỡ bìa
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Color Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Màu sắc
          </label>
          <div className="grid grid-cols-5 gap-2">
            {COVER_COLORS.map((color) => {
              const isSelected = currentCover?.color === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => {
                    handleSetCoverColor(color.id);
                    setOpen(false);
                  }}
                  disabled={isUpdating}
                  className={cn(
                    "h-9 rounded-md transition-all relative flex items-center justify-center hover:scale-105 shadow-sm border border-black/10 cursor-pointer",
                    color.bgClass,
                    isSelected && "ring-2 ring-primary ring-offset-2"
                  )}
                  title={color.name}
                >
                  {isSelected && <Check className="h-4 w-4 text-white shadow-sm" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preset Photos */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Image className="h-3.5 w-3.5" />
            Hình ảnh gợi ý
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_COVER_IMAGES.map((img) => {
              const isSelected = currentCover?.url === img.url;
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => {
                    handleSetCoverUrl(img.url);
                    setOpen(false);
                  }}
                  disabled={isUpdating}
                  className={cn(
                    "h-16 rounded-md overflow-hidden relative group border transition-all hover:opacity-90 cursor-pointer",
                    isSelected && "ring-2 ring-primary ring-offset-1"
                  )}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white font-bold" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom URL Input */}
        <form onSubmit={onApplyCustomUrl} className="space-y-2 pt-2 border-t">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <LinkIcon className="h-3.5 w-3.5" />
            URL ảnh tùy chỉnh
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/image.jpg"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="h-9 text-xs flex-1"
              autoFocus
            />
            <Button
              type="submit"
              size="sm"
              className="h-9 text-xs px-4 shrink-0"
              disabled={isUpdating || !customUrl.trim()}
            >
              Áp dụng
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CardCoverPicker;
