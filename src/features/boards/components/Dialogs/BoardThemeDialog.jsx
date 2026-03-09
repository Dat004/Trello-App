import { Palette, Check, Image as ImageIcon } from "lucide-react";

import { LIGHT_THEMES, DARK_THEMES, GRADIENT_THEMES } from "@/config/theme";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from "@/Components/UI";

function BoardThemeDialog({ trigger, currentTheme, onThemeChange }) {
  const globalTheme = useUIStore((state) => state.theme);
  
  const resolvedTheme = globalTheme === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : globalTheme;
    
  const colorPresets = resolvedTheme === "dark" ? DARK_THEMES : LIGHT_THEMES;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-2xl shadow-2xl border-none">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Palette className="h-5 w-5 text-primary" />
            Chủ đề bảng
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6 pb-6">
          <div className="space-y-6 py-4">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Màu sắc gợi ý</h4>
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

            <section className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gradients (Đa dụng)</h4>
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
                     <span className="text-[10px] font-bold bg-background/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
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

            {/* <section className="p-4 bg-muted/50 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center gap-2 text-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-xs text-muted-foreground font-medium">Bạn muốn thêm ảnh nền?</p>
                <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-tight" disabled>
                   Kết nối Unsplash
                </Button>
            </section> */}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default BoardThemeDialog;
