import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";

import RecentActivitiesCard from "@/features/home/components/RecentActivitiesCard";
import DashboardBoards from "@/features/home/components/DashboardBoards";
import DashboardStats from "@/features/home/components/DashboardStats";
import MyTasksCard from "@/features/home/components/MyTasksCard";
import { useAuthStore } from "@/store";

function Home() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-1">
            Chào buổi sáng, {user?.full_name || user?.username || "bạn"}!
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Hôm nay là{" "}
            {format(new Date(), "EEEE, 'ngày' dd 'tháng' MM, yyyy", {
              locale: vi,
            })}
          </p>
        </div>
        {/* <div className="relative w-full md:w-72 shrink-0 shadow-sm rounded-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm công việc, bảng..."
            value={searchQuery}
            className="pl-9 bg-background/50 border-muted focus-visible:ring-primary/50"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          <MyTasksCard />

          <DashboardBoards searchQuery={searchQuery} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <RecentActivitiesCard />
        </div>
      </div>
    </div>
  );
}

export default Home;
