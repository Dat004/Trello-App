import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, LayoutGrid } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI";
import { getRecentBoards } from "@/utils/recentBoardsStorage";

function RecentBoardsCard() {
  const [recentBoards, setRecentBoards] = useState([]);

  useEffect(() => {
    setRecentBoards(getRecentBoards());
  }, []);

  if (!recentBoards || recentBoards.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card shadow-sm border border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Bảng vừa xem gần đây
        </CardTitle>
        <Link
          to="/boards"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Xem tất cả
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentBoards.map((board) => (
            <Link
              key={board._id}
              to={`/boards/${board._id}`}
              className="group relative overflow-hidden rounded-lg border bg-muted/40 p-3 hover:shadow-md transition-all duration-200"
            >
              <div
                className={`h-2.5 w-full rounded-t-sm mb-2 ${
                  board.color || "bg-primary"
                }`}
              />
              <p className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                {board.title}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Đã xem gần đây
              </p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentBoardsCard;
