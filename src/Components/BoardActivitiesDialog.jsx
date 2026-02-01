import { Activity } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/UI";
import { useBoardActivities } from "@/hooks";
import ActivityItem from "./ActivityItem";

function BoardActivitiesDialog({ boardId, trigger }) {
  const [open, setOpen] = useState(false);
  const { activities, hasMore, total, loading, loadMore } = useBoardActivities(boardId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Hoạt động gần đây
          </DialogTitle>
          <DialogDescription>
            {total > 0 ? `${activities.length} / ${total} hoạt động` : "Nhật ký các hoạt động trên bảng này"}
          </DialogDescription>
        </DialogHeader>

        {loading && activities.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Chưa có hoạt động nào</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {activities.map((activity) => (
                <ActivityItem key={activity._id} activity={activity} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-4 flex justify-center border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? "Đang tải..." : "Xem thêm"}
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BoardActivitiesDialog;
