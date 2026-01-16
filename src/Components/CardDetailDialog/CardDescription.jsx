import { Label, TextArea } from "@/Components/UI";

function CardDescription({ card }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="card-description" className="text-sm font-medium">
        Mô tả
      </Label>
      <TextArea
        id="card-description"
        value={card.description || ""}
        readOnly
        placeholder="Chưa có mô tả"
        className="min-h-[100px] resize-none bg-muted/50"
      />
    </div>
  );
}

export default CardDescription;
