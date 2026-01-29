import { FolderOpen, Users, MessageSquare, Plus, History } from "lucide-react"

import { Avatar, AvatarFallback, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/UI"

function WorkspaceActivity() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>Nhật ký tất cả hoạt động trong workspace</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-medium mb-1">Chưa có hoạt động nào</p>
              <p className="text-sm text-muted-foreground">Hoạt động trong workspace sẽ hiển thị ở đây</p>
            </div>
          {/* {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-medium mb-1">Chưa có hoạt động nào</p>
              <p className="text-sm text-muted-foreground">Hoạt động trong workspace sẽ hiển thị ở đây</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <Avatar className="h-9 w-9 mt-1">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-semibold">
                        {activity.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold text-foreground">{activity.user}</span>
                        <span className="text-muted-foreground"> {activity.action} </span>
                        <span className="font-semibold text-foreground">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>

                    <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                )
              })}
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  )
}

export default WorkspaceActivity;
