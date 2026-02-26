import { Label, TextArea } from "@/Components/UI";
import { cn } from "@/lib/utils";

function CardDescription({ card, locks }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="card-description" className="text-sm font-medium">
          Mô tả
        </Label>
        {locks?.description && (
          <div className="flex items-center gap-1.5 text-[10px] text-orange-500 font-medium animate-pulse">
             <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
             {locks.description.full_name} đang sửa...
          </div>
        )}
      </div>
      <TextArea
        id="card-description"
        value={card.description || ""}
        readOnly
        placeholder="Chưa có mô tả"
        className={cn(
          "min-h-[100px] resize-none transition-all",
          locks?.description ? "bg-orange-50/50 border-orange-200" : "bg-muted/50"
        )}
      />
    </div>
  );
}

export default CardDescription;
