import { useState } from "react";
import {
  FileText,
  FolderKanban,
  Keyboard,
  Navigation,
  Search,
} from "lucide-react";

import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
} from "@/Components/UI";

const isMac =
  typeof window !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
const modKey = isMac ? "⌘" : "Ctrl";

const SHORTCUT_CATEGORIES = [
  {
    category: "Điều hướng & Tìm kiếm",
    icon: Navigation,
    color: "text-blue-500",
    items: [
      {
        keys: [modKey, "K"],
        action: "Tìm kiếm toàn bộ hệ thống",
        note: "Mở ô tìm kiếm công việc & bảng từ bất kỳ đâu",
      },
      {
        keys: [modKey, "B"],
        action: "Tạo Bảng công việc mới",
        note: "Mở hộp thoại tạo bảng nhanh",
      },
    ],
  },
  {
    category: "Thao tác trên Bảng & Thẻ",
    icon: FolderKanban,
    color: "text-green-500",
    items: [
      {
        keys: ["N"],
        action: "Thêm Thẻ mới nhanh",
        note: "Chỉ áp dụng khi bạn đang ở trong trang Bảng công việc",
      },
      {
        keys: ["Esc"],
        action: "Đóng Hộp thoại / Modal",
        note: "Thoát nhanh khỏi cửa sổ đang mở",
      },
    ],
  },
  {
    category: "Soạn thảo Mô tả Thẻ (Editor)",
    icon: FileText,
    color: "text-purple-500",
    items: [
      {
        keys: [modKey, "B"],
        action: "In đậm (Bold)",
        note: "Tô đen văn bản và bấm để bật/tắt **văn bản**",
      },
      {
        keys: [modKey, "I"],
        action: "In nghiêng (Italic)",
        note: "Tô đen văn bản và bấm để bật/tắt *văn bản*",
      },
      {
        keys: ["`"],
        action: "Chèn Khối mã (Code)",
        note: "Bật/tắt định dạng `mã nguồn`",
      },
    ],
  },
  {
    category: "Hệ thống",
    icon: Keyboard,
    color: "text-amber-500",
    items: [
      {
        keys: ["?"],
        action: "Mở Bảng tra cứu phím tắt",
        note: "Bấm phím Shift + / để mở nhanh bảng trợ giúp này",
      },
    ],
  },
];

function KeyboardShortcutsDialog({ open, onOpenChange }) {
  const [search, setSearch] = useState("");

  const filteredCategories = SHORTCUT_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.action.toLowerCase().includes(search.toLowerCase()) ||
        item.note.toLowerCase().includes(search.toLowerCase()) ||
        item.keys.some((k) => k.toLowerCase().includes(search.toLowerCase()))
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-lg font-bold">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Keyboard className="h-5 w-5" />
            </div>
            Bảng Tra Cứu Phím Tắt (Keyboard Shortcuts)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Search Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm phím tắt (ví dụ: Tạo bảng, Esc, Bold...)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-muted/30 focus-visible:ring-primary/50"
            />
          </div>

          {/* Categories List */}
          {filteredCategories.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground bg-muted/20 rounded-lg">
              Không tìm thấy phím tắt phù hợp với từ khóa "{search}".
            </div>
          ) : (
            filteredCategories.map((group, groupIdx) => {
              const CategoryIcon = group.icon;
              return (
                <div key={groupIdx} className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground tracking-wide uppercase">
                    <CategoryIcon className={`h-4 w-4 ${group.color}`} />
                    <span>{group.category}</span>
                  </div>

                  <div className="divide-y rounded-xl border bg-card shadow-2xs overflow-hidden">
                    {group.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex items-center justify-between p-3 text-xs hover:bg-muted/30 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <p className="font-semibold text-foreground text-sm">
                            {item.action}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {item.note}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-3">
                          {item.keys.map((key, keyIdx) => (
                            <Badge
                              key={keyIdx}
                              variant="outline"
                              className="px-2 py-1 text-xs font-mono font-bold bg-muted/60 border-border text-foreground shadow-2xs min-w-[26px] justify-center"
                            >
                              {key}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}

          <div className="pt-2 text-center text-[11px] text-muted-foreground border-t flex items-center justify-between">
            <span>Hệ điều hành hiện tại: <strong className="text-foreground">{isMac ? "macOS (⌘)" : "Windows/Linux (Ctrl)"}</strong></span>
            <span>Bấm <kbd className="px-1.5 py-0.5 border rounded bg-muted text-foreground font-mono">Esc</kbd> để đóng</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default KeyboardShortcutsDialog;
