import { Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "./UI";
import { getRoleText, getRoleVariant } from "@/helpers/role";
import { formatRelativeTime } from "@/helpers/formatTime";
import BoardActions from "@/Pages/Boards/BoardActions";
import { getBoardGradient } from "@/helpers/board";
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
        <Link to={`/board/${board._id}`} className="block h-full">
          <Card className="group relative h-full cursor-pointer overflow-hidden border-none bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 ring-1 ring-border/50 hover:ring-primary/40">
            {/* Gradient Header Overlay */}
            <div
              className={cn(
                "h-16 w-full bg-gradient-to-br transition-all duration-300 group-hover:h-24 group-hover:saturate-150",
                getBoardGradient(board.color)
              )}
            >
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
              <span className="absolute top-2 right-2">
                {renderRoleBadge()}
              </span>
            </div>

            <CardHeader className="relative -mt-8 sm:p-5 p-3 bg-transparent">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 drop-shadow-sm">
                  <section className="flex items-center flex-wrap gap-2">
                    <span className="bg-background/95 backdrop-blur-md px-3 py-1 rounded-lg border border-border shadow-sm">
                      {board.title}
                    </span>
                  </section>
                </CardTitle>
                <div className="bg-background/80 backdrop-blur-md rounded-full shadow-sm translate-y-0">
                  <BoardActions board={board} canDelete={canDelete} />
                </div>
              </div>
            </CardHeader>

            <CardContent className="sm:p-5 p-3">
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2 font-medium leading-relaxed">
                {board.description || "Chưa có mô tả cho bảng này."}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border/40 text-[11px] font-semibold tracking-wide uppercase text-muted-foreground/80">
                <div className="flex items-start gap-1.5 px-2 py-1 rounded-md bg-muted/40 transition-colors group-hover:bg-primary/5 group-hover:text-primary">
                  <Users className="h-3.5 w-3.5" />
                  <span>{board.members.length} thành viên</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
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
