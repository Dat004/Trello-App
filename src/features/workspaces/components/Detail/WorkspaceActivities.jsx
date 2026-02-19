import { History, Loader2 } from "lucide-react";

import ActivityItem from "@/Components/ActivityItem";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/UI";
import { useWorkspaceActivities } from "@/features/workspaces/api/useWorkspaceActivities";

function WorkspaceActivity({ workspace }) {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useWorkspaceActivities(workspace._id);

  const activities = data?.pages.flatMap(page => page.activities) || [];
  const total = data?.pages?.[0]?.total || 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Nhật ký tất cả hoạt động trong workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary mb-4" />
                <p className="text-muted-foreground">Đang tải...</p>
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

              {hasNextPage && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Đang tải..." : "Xem thêm"}
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
