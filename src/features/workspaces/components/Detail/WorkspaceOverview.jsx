import { BarChart3, Users, FolderOpen, Clock } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/UI"

export function WorkspaceOverview({ workspace }) {
  const boards = Array.isArray(workspace?.boards) ? workspace.boards : []
  const members = Array.isArray(workspace?.members) ? workspace.members : []
  const recentBoards = [...boards]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 3)
  const stats = [
    { label: "Bảng", value: boards.length, icon: FolderOpen, bgColor: "bg-blue-100", color: "text-blue-600" },
    { label: "Thành viên", value: members.length, icon: Users, bgColor: "bg-emerald-100", color: "text-emerald-600" },
    { label: "Giới hạn thành viên", value: workspace?.max_members ?? "—", icon: BarChart3, bgColor: "bg-violet-100", color: "text-violet-600" },
    { label: "Cập nhật", value: workspace?.updatedAt ? new Date(workspace.updatedAt).toLocaleDateString("vi-VN") : "—", icon: Clock, bgColor: "bg-amber-100", color: "text-amber-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Boards */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng gần đây</CardTitle>
          <CardDescription>Các bảng được cập nhật gần đây nhất</CardDescription>
        </CardHeader>
        <CardContent>
          {recentBoards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-1">Chưa có bảng nào</p>
              <p className="text-sm text-muted-foreground">Tạo bảng đầu tiên để bắt đầu làm việc</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentBoards.map((board) => (
                <div key={board._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="font-medium text-sm">{board.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {board.updatedAt ? new Date(board.updatedAt).toLocaleDateString("vi-VN") : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
