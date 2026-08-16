import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import { Moon, Sun, SunMedium } from "lucide-react";

import RecentActivitiesCard from "@/features/home/components/RecentActivitiesCard";
import DashboardBoards from "@/features/home/components/DashboardBoards";
import DashboardStats from "@/features/home/components/DashboardStats";
import MyTasksCard from "@/features/home/components/MyTasksCard";
import QuickActionsBar from "@/features/home/components/QuickActionsBar";
import { useAuthStore } from "@/store";

function getGreetingInfo() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      text: "Chào buổi sáng",
      Icon: SunMedium,
      color: "text-amber-500",
    };
  }
  if (hour >= 12 && hour < 18) {
    return {
      text: "Chào buổi chiều",
      Icon: Sun,
      color: "text-orange-500",
    };
  }
  return {
    text: "Chào buổi tối",
    Icon: Moon,
    color: "text-indigo-400",
  };
}

function Home() {
  const { user } = useAuthStore();
  const [searchQuery] = useState("");
  const greeting = getGreetingInfo();
  const GreetingIcon = greeting.Icon;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-1 flex items-center gap-2">
            <GreetingIcon className={`h-7 w-7 ${greeting.color} shrink-0`} />
            {greeting.text}, {user?.full_name || user?.username || "bạn"}!
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Hôm nay là{" "}
            {format(new Date(), "EEEE, 'ngày' dd 'tháng' MM, yyyy", {
              locale: vi,
            })}
          </p>
        </div>
      </div>

      <QuickActionsBar />

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
