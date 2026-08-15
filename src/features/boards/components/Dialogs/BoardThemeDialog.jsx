import { useState } from "react";
import { Palette, Check, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

import { LIGHT_THEMES, DARK_THEMES, GRADIENT_THEMES, PHOTO_WALLPAPERS } from "@/config/theme";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  ScrollArea,
} from "@/Components/UI";

function BoardThemeDialog({ trigger, currentTheme, onThemeChange }) {
  const globalTheme = useUIStore((state) => state.theme);
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");
  
  const resolvedTheme = globalTheme === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : globalTheme;
    
  const colorPresets = resolvedTheme === "dark" ? DARK_THEMES : LIGHT_THEMES;

  const handleApplyCustomPhoto = (e) => {
    e.preventDefault();
    if (!customPhotoUrl.trim()) return;
    onThemeChange(customPhotoUrl.trim());
    setCustomPhotoUrl("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-2xl shadow-2xl border-none">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Palette className="h-5 w-5 text-primary" />
            Chủ đề & Hình nền bảng
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] px-6 pb-6">
          <div className="space-y-6 py-4">
            {/* Photo Backgrounds */}
            <section className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-primary" />
                Hình ảnh đẹp (Unsplash)
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {PHOTO_WALLPAPERS.map((photo) => {
                  const isSelected = currentTheme === photo.url;
                  return (
                    <button
                      key={photo.id}
                      onClick={() => onThemeChange(photo.url)}
                      className={cn(
                        "group relative flex flex-col items-center h-20 rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.03] active:scale-95 shadow-sm",
                        isSelected ? "border-primary ring-2 ring-primary/40" : "border-transparent"
                      )}
                    >
                      <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-end p-1.5">
                        <span className="text-[10px] font-bold text-white drop-shadow truncate w-full">{photo.name}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Image URL Form */}
              <form onSubmit={handleApplyCustomPhoto} className="flex items-center gap-2 pt-1">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Nhập URL ảnh nền bất kỳ..."
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                <Button type="submit" size="sm" className="h-8 text-xs px-3" disabled={!customPhotoUrl.trim()}>
                  Đổi ảnh
                </Button>
              </form>
            </section>

            {/* Colors */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Màu sắc đơn</h4>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                  {resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {colorPresets.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => onThemeChange(color.value)}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all hover:border-primary/50 hover:bg-muted/50",
                      currentTheme === color.value ? "border-primary bg-primary/5 shadow-sm" : "border-transparent"
                    )}
                  >
                    <div className={cn("h-10 w-full rounded-lg shadow-inner", color.preview)} />
                    <span className="text-[10px] font-medium truncate w-full text-center">{color.name}</span>
                    {currentTheme === color.value && (
                      <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm scale-75">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Gradients */}
            <section className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gradients (Đa sắc)</h4>
              <div className="grid grid-cols-2 gap-3">
                {GRADIENT_THEMES.map((gradient) => (
                  <button
                    key={gradient.name}
                    onClick={() => onThemeChange(gradient.value)}
                    className={cn(
                      "h-16 w-full rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-95 group relative flex items-center justify-center overflow-hidden",
                      gradient.preview,
                      currentTheme === gradient.value ? "border-primary shadow-md" : "border-transparent shadow-sm"
                    )}
                  >
                     <span className="text-[10px] font-bold bg-background/70 px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
                        {gradient.name}
                      </span>
                    {currentTheme === gradient.value && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default BoardThemeDialog;

