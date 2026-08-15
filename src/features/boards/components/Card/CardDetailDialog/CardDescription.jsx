import { useState } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";

import { Button, Label } from "@/Components/UI";
import { useUpdateCard } from "@/features/boards/api/useCards";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";

// Custom essential toolbar commands (excluding HR and Title/Heading)
const essentialCommands = [
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.divider,
  commands.link,
  commands.quote,
  commands.code,
  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.checkedListCommand,
];

// Custom components to force links to open in a new tab
const customComponents = {
  a: ({ ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline hover:opacity-80 font-medium"
    />
  ),
};

function CardDescription({ card, locks, boardId, listId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [descriptionText, setDescriptionText] = useState(card?.description || "");

  const globalTheme = useUIStore((s) => s.theme);
  const isDark =
    globalTheme === "dark" ||
    (globalTheme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const colorMode = isDark ? "dark" : "light";
  const updateCardMutation = useUpdateCard();

  const handleSave = () => {
    if (!boardId || !listId || !card?._id) return;
    updateCardMutation.mutate(
      {
        boardId,
        listId,
        id: card._id,
        data: {
          title: card.title,
          description: descriptionText,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setDescriptionText(card?.description || "");
    setIsEditing(false);
  };

  return (
    <div className="grid gap-2" data-color-mode={colorMode}>
      <div className="flex items-center justify-between">
        <Label htmlFor="card-description" className="text-sm font-medium flex items-center gap-2">
          Mô tả
        </Label>

        {locks?.description && (
          <div className="flex items-center gap-1.5 text-[10px] text-orange-500 font-medium animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            {locks.description.full_name} đang sửa...
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="border rounded-lg overflow-hidden shadow-xs">
            <MDEditor
              value={descriptionText}
              onChange={(val) => setDescriptionText(val || "")}
              height={180}
              preview="edit"
              commands={essentialCommands}
              extraCommands={[]}
              components={customComponents}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={updateCardMutation.isPending}
              className="h-8 text-xs px-3"
            >
              {updateCardMutation.isPending ? "Đang lưu..." : "Lưu"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="h-8 text-xs px-3"
            >
              Hủy
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            if (!locks?.description) {
              setDescriptionText(card?.description || "");
              setIsEditing(true);
            }
          }}
          className={cn(
            "min-h-[90px] p-4 rounded-lg border text-sm transition-all cursor-pointer hover:bg-muted/40",
            card?.description
              ? "bg-muted/20 text-foreground"
              : "bg-muted/50 text-muted-foreground italic",
            locks?.description && "bg-orange-50/50 border-orange-200 cursor-not-allowed"
          )}
        >
          {card?.description ? (
            <MDEditor.Markdown
              source={card.description}
              style={{ backgroundColor: "transparent", color: "inherit" }}
              components={customComponents}
            />
          ) : (
            "Thêm mô tả chi tiết hơn..."
          )}
        </div>
      )}
    </div>
  );
}

export default CardDescription;
