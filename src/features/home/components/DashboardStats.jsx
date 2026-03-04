import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ListTodo,
} from "lucide-react";
import { isPast, isToday, isTomorrow, parseISO } from "date-fns";

import { useMyTasks } from "@/features/home/api/useMyTasks";
import { Card, CardContent } from "@/Components/UI";

function DashboardStats() {
  const { data: allTasks = [] } = useMyTasks("all");

  const stats = {
    total: allTasks.length,
    completed: allTasks.filter((t) => t.due_complete).length,
    overdue: allTasks.filter((t) => {
      if (!t.due_date) return false;
      const d = parseISO(t.due_date);
      return isPast(d) && !isToday(d) && !t.due_complete;
    }).length,
    dueSoon: allTasks.filter((t) => {
      if (!t.due_date) return false;
      const d = parseISO(t.due_date);
      return (isToday(d) || isTomorrow(d)) && !t.due_complete;
    }).length,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-background to-muted/30 border-muted/50 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl shadow-sm">
            <ListTodo className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Việc của tôi
            </p>
            <p className="text-xl md:text-2xl font-bold">{stats.total}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-background to-muted/30 border-muted/50 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-5 flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl shadow-sm">
            <AlertTriangle className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Quá hạn
            </p>
            <p className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.overdue}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-background to-muted/30 border-muted/50 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl shadow-sm">
            <Clock className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Sắp đến hạn
            </p>
            <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.dueSoon}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-background to-muted/30 border-muted/50 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-5 flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl shadow-sm">
            <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Đã hoàn thành
            </p>
            <p className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completed}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardStats;
