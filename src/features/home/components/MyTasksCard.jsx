import { useState } from "react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { AlertCircle, Calendar, CheckCircle2, ListTodo } from "lucide-react";

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ScrollArea,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/Components/UI";
import { useMyTasks } from "@/features/home/api/useMyTasks";
import { cn } from "@/lib/utils";

const formatDueDate = (dateString, isCompleted) => {
  if (!dateString) return null;
  
  try {
    const date = parseISO(dateString);
    let text = "";
    
    if (isToday(date)) text = "Hôm nay";
    else if (isTomorrow(date)) text = "Ngày mai";
    else text = format(date, "dd MMM");
    return { text };
  } catch {
    return null;
  }
};

function MyTasksCard() {
  const [taskFilter, setTaskFilter] = useState("all");
  const { data: tasks = [], isLoading } = useMyTasks(taskFilter);

  return (
    <Card className="border-muted/50 shadow-sm flex flex-col">
      <CardHeader className="p-4 md:p-5 border-b border-muted/50 flex flex-row items-center justify-between bg-muted/10 rounded-t-xl">
        <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-primary" />
          Công việc của tôi
        </CardTitle>
        <Tabs value={taskFilter} onValueChange={setTaskFilter} className="w-auto">
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs px-3">
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs px-3">
              Chưa xong
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0 flex-1 relative">
        <ScrollArea className="max-h-[350px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <p className="text-sm text-muted-foreground animate-pulse">
                Đang tải công việc...
              </p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Bảng công việc trống</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tuyệt vời! Bạn không có công việc nào đang chờ xử lý.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-muted/50">
              {tasks.map((task) => {
                const dateInfo = formatDueDate(
                  task.due_date,
                  task.due_complete
                );
                const boardName = task.board?.title || "Bảng không tên";
                const workspaceName =
                  task.workspace?.title || task.workspace?.name || "Không gian làm việc";
                const listId = task.list?._id;

                return (
                  <div
                    key={task._id}
                    className={cn(
                      "p-4 hover:bg-muted/30 transition-colors flex items-start gap-3 group cursor-pointer",
                      task.due_complete && "bg-green-50/30 dark:bg-green-950/10 opacity-80"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 max-w-[70%]">
                           {task.due_complete && (
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                           )}
                          <p
                            className={cn(
                              "font-medium text-sm truncate",
                              task.due_complete && "text-muted-foreground"
                            )}
                          >
                            {task.title}
                          </p>
                        </div>
                        {dateInfo && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "ml-auto shrink-0 text-[10px] px-1.5 py-0 h-5 flex items-center gap-1 border-transparent",
                              task.due_complete
                                ? "bg-muted text-muted-foreground"
                                : task.is_overdue
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : isToday(parseISO(task.due_date)) || isTomorrow(parseISO(task.due_date))
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-secondary text-secondary-foreground"
                            )}
                          >
                            <Calendar className="h-3 w-3" />
                            {dateInfo.text}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 text-[11px] md:text-xs text-muted-foreground">
                        <span className="truncate max-w-[100px] md:max-w-[150px]">
                          {workspaceName}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0"></span>
                        <span className="truncate max-w-[100px] md:max-w-[150px]">
                          {boardName}
                        </span>

                        {task.priority === "high" && !task.due_complete && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0 hidden md:block"></span>
                            <span className="flex items-center gap-1 text-red-500 font-medium ml-auto md:ml-0">
                              <AlertCircle className="h-3 w-3" /> Cao
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default MyTasksCard;
