import { History } from "lucide-react";

import ActivityItem from "@/Components/ActivityItem";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/UI";
import { useWorkspaceActivities } from "@/hooks";

function WorkspaceActivity({ workspace }) {
  const { activities, hasMore, total, loading, loadMore } = useWorkspaceActivities(workspace._id);

  if (loading && activities.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Nhật ký tất cả hoạt động trong workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="animate-pulse">
                <History className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Đang tải...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>
            {total > 0 ? `${activities.length} / ${total} hoạt động` : "Nhật ký tất cả hoạt động trong workspace"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-medium mb-1">Chưa có hoạt động nào</p>
              <p className="text-sm text-muted-foreground">Hoạt động trong workspace sẽ hiển thị ở đây</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <ActivityItem key={activity._id} activity={activity} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? "Đang tải..." : "Xem thêm"}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default WorkspaceActivity
