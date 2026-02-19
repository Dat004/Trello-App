import { Building2, Users, Trello, Star } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/Components/UI";

function WorkspaceStats({ workspaces }) {
  const totalWorkspaces = workspaces.length;
  const totalBoards = workspaces.reduce(
    (sum, w) => sum + (w.board_count || 0),
    0
  );
  const totalMembers = workspaces.reduce(
    (sum, w) => sum + (w.members?.length || 0),
    0
  );
  const starredCount = workspaces.filter((w) => w.is_starred).length;

  const stats = [
    {
      label: "Tổng workspace",
      value: totalWorkspaces,
      icon: Building2,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Tổng bảng",
      value: totalBoards,
      icon: Trello,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Tổng thành viên",
      value: totalMembers,
      icon: Users,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Yêu thích",
      value: starredCount,
      icon: Star,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="animate-slide-in-up">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, bg, iconColor }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <section className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center`}
                >
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              </section>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

export default WorkspaceStats;
