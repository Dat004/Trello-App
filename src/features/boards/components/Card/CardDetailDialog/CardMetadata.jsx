import { Clock } from "lucide-react";

import { formatDateOnly } from "@/helpers/formatTime";

function CardMetadata({ card }) {
  return (
    <div className="grid gap-2">
      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Thông tin thẻ
      </h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Tạo: {formatDateOnly(card.created_at)}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Cập nhật: {formatDateOnly(card.updated_at)}</span>
        </div>
      </div>
    </div>
  );
}

export default CardMetadata;
