import { useState } from "react";
import {
  Star,
  Users,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Loader2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./UI";

function BoardCard({ board }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStarToggle = async (e) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc chắn muốn xóa bảng "${board.name}"?`)) {
      setIsDeleting(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
      } finally {
        setIsDeleting(false);
      }
    }
  };
  return (
    <Card
      className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div
          className={`h-12 w-full rounded-md ${board.color} mb-3 relative overflow-hidden`}
        >
          {isDeleting && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            </div>
          )}
        </div>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {board.name}
          </CardTitle>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleStarToggle}
              disabled={isLoading || isDeleting}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Star
                  className={`h-4 w-4 ${
                    board.starred
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => e.stopPropagation()}
                  disabled={isDeleting}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Copy className="mr-2 h-4 w-4" />
                  Sao chép
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa bảng
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <span>{board.members} thành viên</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{board.lastActivity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BoardCard;
