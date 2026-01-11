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

import { getRoleText, getMyRole, getRoleVariant } from "@/helpers/role";
import { formatRelativeTime } from "@/helpers/formatTime";
import { useAuthStore, useWorkspaceStore } from "@/store";
import BoardFormDialog from "./BoardFormDialog";
import DeleteDialog from "./DeleteDialog";
import { useBoard } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./UI";
import { Link } from "react-router-dom";

function BoardCard({ index, board, view = "grid" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { removeBoard } = useBoard();

  const user = useAuthStore((s) => s.user);
  const workspaces = useWorkspaceStore((s) => s.workspaces);

  const myRole = getMyRole(board.members);
  const variantRole = getRoleVariant(myRole);
  const isOwner = user._id === board.owner;

  const checkPermission = () => {
    if (board.workspace) {
      const workspace = workspaces.find((w) => w._id === board.workspace);
      if (!workspace) return false;

      const isWorkspaceOwner = workspace.owner === user._id;
      const isWorkspaceAdmin = workspace.members.some(
        (m) => m.user === user._id && m.role === "admin"
      );

      return isOwner || isWorkspaceOwner || isWorkspaceAdmin;
    } else {
      return isOwner;
    }
  };

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

  const handleDelete = async (boardId) => {
    setIsDeleting(true);

    await removeBoard(boardId);

    setIsDeleting(false);
  };

  return (
    <>
      {view === "grid" && (
        <div
          className="animate-slide-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
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
                  <section className="flex items-center">
                    <Link to={`/board/${board._id}`}>{board.title}</Link>
                    {myRole && (
                      <>
                        <span className="block w-1 h-1 mx-2 rounded-full bg-muted-foreground"></span>
                        <Badge variant={isOwner ? "destructive" : variantRole}>
                          {isOwner ? "Chủ sở hữu" : getRoleText(myRole)}
                        </Badge>
                      </>
                    )}
                  </section>
                </CardTitle>
                <div className="flex items-center gap-1">
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
                          board.is_starred
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
                      <BoardFormDialog
                        isEdit
                        boardData={board}
                        trigger={
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                        }
                      />
                      <DropdownMenuSeparator />
                      {checkPermission() && (
                        <DeleteDialog
                          onConfirm={() => handleDelete(board._id)}
                          trigger={
                            <DropdownMenuItem
                              className="text-destructive"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa bảng
                            </DropdownMenuItem>
                          }
                        />
                      )}
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
                  <span>{board.members.length} thành viên</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatRelativeTime(board.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {view === "list" && (
        <div
          className="animate-slide-in-up bg-card border border-border rounded-lg p-3 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer group"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "h-10 w-10 rounded-md flex-shrink-0 mt-0.5",
                board.color
              )}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                  {board.title}
                </h3>
                <section className="flex items-start gap-2">
                  {myRole && (
                    <section>
                      <Badge variant={isOwner ? "destructive" : variantRole}>
                        {isOwner ? "Chủ sở hữu" : getRoleText(myRole)}
                      </Badge>
                    </section>
                  )}
                  {board.starred && (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0 mt-0.5" />
                  )}
                </section>
              </div>
              {board.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {board.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                  {board.members.length} thành viên
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                  Cập nhật: {formatRelativeTime(board.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BoardCard;
