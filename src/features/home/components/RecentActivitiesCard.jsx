import { Activity, MessageSquare } from "lucide-react";

import { useMyActivities } from "@/features/home/api/useMyActivities";
import ActivityItem from "@/Components/ActivityItem";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ScrollArea,
} from "@/Components/UI";

function RecentActivitiesCard() {
  const { data: activities = [], isLoading } = useMyActivities(20);

  return (
    <div className="sticky top-24 space-y-6">
      <Card className="border-muted/50 shadow-sm flex flex-col">
        <CardHeader className="p-4 md:p-5 border-b border-muted/50 flex flex-row items-center justify-between bg-muted/10 rounded-t-xl">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Hoạt động gần đây
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <ScrollArea className="max-h-[500px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <p className="text-sm text-muted-foreground animate-pulse">
                  Đang tải hoạt động...
                </p>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  Chưa có hoạt động nào gần đây
                </p>
              </div>
            ) : (
              <div className="p-4 md:p-5 space-y-4">
                {activities.map((activity) => (
                  <ActivityItem key={activity._id} activity={activity} />
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export default RecentActivitiesCard;
