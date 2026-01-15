import { Link } from "react-router-dom";
import { Users, Clock } from "lucide-react";

import { Badge, Card, CardContent, CardHeader, CardTitle, Button } from "./UI";
import { getRoleText, getRoleVariant } from "@/helpers/role";
import { formatRelativeTime } from "@/helpers/formatTime";
import BoardActions from "@/Pages/Boards/BoardActions";
import { usePermissions } from "@/hooks";
import { cn } from "@/lib/utils";

function BoardCard({ index, board, view = "grid" }) {
  const { isBoardOwner, role, canDelete } = usePermissions({ board });

  const renderRoleBadge = () => {
    if (!role && !isBoardOwner) return null;

    return (
      <Badge
        variant={isBoardOwner ? "destructive" : getRoleVariant(role)}
        className="ml-2 px-1.5 h-5 text-[10px] sm:text-xs sm:h-auto font-normal pointer-events-none"
      >
        {isBoardOwner ? "Chủ sở hữu" : getRoleText(role)}
      </Badge>
    );
  };

  // Animation Styles
  const animationProps = {
    className: "animate-slide-in-up",
    style: { animationDelay: `${index * 50}ms` },
  };

  // --- VIEW: GRID ---
  if (view === "grid") {
    return (
      <div {...animationProps}>
        <Link to={`/board/${board._id}`}>
          <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div
                className={`h-12 w-full rounded-md ${board.color} mb-3 relative overflow-hidden`}
              ></div>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                  <section className="flex items-center">
                    <h3>{board.title}</h3>
                    {renderRoleBadge()}
                  </section>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <BoardActions board={board} canDelete={canDelete} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {board.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{board.members.length} thành viên</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatRelativeTime(board.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    );
  }

  // --- VIEW: LIST ---
  return (
    <div {...animationProps}>
      <Link to={`/board/${board._id}`}>
        <div
          className={cn(
            "bg-card border border-border rounded-lg p-3 cursor-pointer group flex items-center gap-4 transition-all hover:border-primary/50 hover:shadow-sm"
          )}
        >
          <div
            className={cn(
              "h-10 w-10 sm:h-12 sm:w-12 rounded-md flex-shrink-0 shadow-sm",
              board.color
            )}
          />

          <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm sm:text-base text-foreground truncate group-hover:text-primary transition-colors">
                  {board.title}
                </h3>
                {renderRoleBadge()}
              </div>

              {board.description && (
                <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                  {board.description}
                </p>
              )}

              {/* Thông tin phụ cho mobile view nếu cần */}
              <div className="flex sm:hidden items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                <span>{board.members?.length || 0} tv</span>
                <span>{formatRelativeTime(board.updated_at)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Ẩn thông tin ngày tháng trên mobile để gọn */}
              <div className="hidden sm:flex flex-col items-end text-xs text-muted-foreground gap-1">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {board.members?.length}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />{" "}
                  {formatRelativeTime(board.updated_at)}
                </span>
              </div>

              {/* Action Buttons */}
              <BoardActions board={board} canDelete={canDelete} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BoardCard;
