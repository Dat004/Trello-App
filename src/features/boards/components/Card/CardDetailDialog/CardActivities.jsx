import { useMemo, useState } from "react";
import { Activity, ChevronDown, ChevronUp } from "lucide-react";

import ActivityItem from "@/Components/ActivityItem";
import { Button } from "@/Components/UI";
import { useBoardActivities } from "@/features/boards/api/useBoardActivities";

function CardActivities({ cardId, cardTitle, boardId }) {
  const [showAll, setShowAll] = useState(false);
  const { activities, loading } = useBoardActivities(boardId);

  // Filter activities relevant to this specific card
  const cardActivities = useMemo(() => {
    if (!activities || !cardId) return [];
    return activities.filter((act) => {
      // 1. Direct entityId match for cards
      if (
        (act.entity_type === "card" || act.entityType === "card") &&
        String(act.entity_id || act.entityId) === String(cardId)
      ) {
        return true;
      }

      // 2. Metadata card_id match
      const actCardId =
        act.card?._id ||
        (typeof act.card === "string" ? act.card : null) ||
        act.metadata?.card_id ||
        act.metadata?.cardId ||
        act.metadata?.card?._id;

      if (actCardId && String(actCardId) === String(cardId)) {
        return true;
      }

      // 3. Fallback match by card_title if present
      if (cardTitle && act.metadata?.card_title === cardTitle) {
        return true;
      }

      return false;
    });
  }, [activities, cardId, cardTitle]);

  if (!loading && cardActivities.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Activity className="h-4 w-4 text-primary" />
          <span>Nhật ký hoạt động thẻ</span>
        </div>
        <p className="text-xs text-muted-foreground italic px-1">
          Chưa có nhật ký hoạt động nào cho thẻ này.
        </p>
      </div>
    );
  }

  const displayedActivities = showAll ? cardActivities : cardActivities.slice(0, 5);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Activity className="h-4 w-4 text-primary" />
          <span>Nhật ký hoạt động thẻ ({cardActivities.length})</span>
        </div>

        {cardActivities.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll((prev) => !prev)}
            className="h-7 text-xs font-medium gap-1 text-primary hover:text-primary"
          >
            {showAll ? (
              <>
                <span>Thu gọn</span>
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <span>Xem tất cả ({cardActivities.length})</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-2 border rounded-xl p-3 bg-muted/10">
        {displayedActivities.map((act) => (
          <ActivityItem key={act._id} activity={act} />
        ))}
      </div>
    </div>
  );
}

export default CardActivities;
