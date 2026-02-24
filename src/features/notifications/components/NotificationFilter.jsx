import { Bell, Check, CheckCircle2 } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/Components/UI";

function NotificationFilter({
  filter,
  counts,
  onFilterChange
}) {
  return (
    <Tabs value={filter} onValueChange={onFilterChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all" className="gap-2">
          <Bell className="h-4 w-4" />
          Tất cả {counts.all > 0 && `(${counts.all})`}
        </TabsTrigger>
        <TabsTrigger value="unread" className="gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Chưa đọc {counts.unread > 0 && `(${counts.unread})`}
        </TabsTrigger>
        <TabsTrigger value="read" className="gap-2">
          <Check className="h-4 w-4" />
          Đã đọc {counts.read > 0 && `(${counts.read})`}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default NotificationFilter;
