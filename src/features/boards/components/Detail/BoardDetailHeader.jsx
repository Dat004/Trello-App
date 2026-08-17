import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ChartNoAxesCombined,
  Calendar,
  Filter,
  Kanban,
  Loader2,
  Palette,
  Sparkles,
  Star,
  Table,
  Tag,
  UserPlus,
  Users,
} from "lucide-react";
import { motion as Motion } from "framer-motion";

import { useHandleBoardJoinRequest, useInviteBoardMember } from "@/features/boards/api/useBoardMembers";
import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/Components/UI";
import BoardActivitiesDialog from "../Dialogs/BoardActivitiesDialog";
import BoardThemeDialog from "../Dialogs/BoardThemeDialog";
import BoardAIDialog from "../Dialogs/BoardAIDialog";
import BoardLabelsDialog from "../Dialogs/BoardLabelsDialog";
import { useBoardFilter } from "../../context/BoardFilterContext";
import InviteMemberDialog from "@/Components/InviteMemberDialog";
import BoardFilterDialog from "../Dialogs/BoardFilterDialog";
import MembersDialog from "@/Components/MembersDialog";
import { useBoardAccess } from "../BoardAccessGuard";
import { useFavoritesStore } from "@/store";
import { useFavorites } from "@/hooks";
import { cn } from "@/lib/utils";

function BoardDetailHeader({ currentView, onViewChange, currentTheme, onThemeChange }) {
  const navigate = useNavigate();
  const { isFiltering } = useBoardFilter();

  const { readOnly } = useBoardAccess();
  const { boardData } = useBoardContext();
  const { currentBoard, boardMembers, joinRequests } = boardData;

  const favoriteBoards = useFavoritesStore((state) => state.favoriteBoards);
  const { toggleBoardStar, isTogglingBoard } = useFavorites();

  const { mutate: handleJoinRequest, isLoading: isHandlingJoinRequest } = useHandleBoardJoinRequest();
  const { mutate: inviteMember, isLoading: isInviting } = useInviteBoardMember();

  const handleInviteMembers = ({ emails, role, message, onSuccess, onSettled }) => {
    inviteMember(
      {
        boardId: currentBoard._id,
        emails,
        role,
        message,
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
        onSettled: () => {
          if (onSettled) onSettled();
        },
      }
    );
  };

  const handleAcceptRequest = (requestId) => {
    handleJoinRequest({
      boardId: currentBoard._id,
      requestId,
      status: "accepted",
    });
  };

  const handleRejectRequest = (requestId) => {
    handleJoinRequest({
      boardId: currentBoard._id,
      requestId,
      status: "declined",
    });
  };

  const views = [
    { id: "kanban", label: "Bảng", icon: Kanban },
    { id: "table", label: "Bảng biểu", icon: Table },
    { id: "calendar", label: "Lịch", icon: Calendar },
    { id: "analytics", label: "Phân tích", icon: ChartNoAxesCombined },
  ];

  const isStarred = favoriteBoards.some((board) => board._id === currentBoard?._id);

  if (!currentBoard) return null;

  const toolBtn =
    "h-8 shrink-0 gap-1.5 px-2 text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-md lg:px-2.5";
  const toolLabel = "hidden text-xs font-medium lg:inline";

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/boards");
    }
  };

  return (
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-3 py-3 sm:px-4 lg:px-6">
        {/* Top: title left · members/invite right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-muted"
              aria-label="Quay lại"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <h1
              className="min-w-0 truncate text-base font-semibold tracking-tight text-foreground sm:text-lg"
              title={currentBoard.title}
            >
              {currentBoard.title}
            </h1>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => toggleBoardStar(currentBoard)}
              className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-muted"
              aria-label="Đánh dấu bảng yêu thích"
              aria-pressed={isStarred}
            >
              {isTogglingBoard ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Star
                  className={cn(
                    "h-4 w-4",
                    isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                  )}
                />
              )}
            </Button>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center -space-x-2 sm:flex">
              {boardData.activeUsers?.slice(0, 3).map((active) => (
                <Avatar
                  key={active._id}
                  className="h-7 w-7 border-2 border-background shadow-sm"
                  title={`${active.full_name} đang online`}
                >
                  <AvatarImage src={active.avatar?.url} alt={active.full_name} />
                  <AvatarFallback className="bg-emerald-100 text-[10px] text-emerald-700">
                    {active.full_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {boardData.activeUsers?.length > 3 && (
                <div className="z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-muted-foreground shadow-sm">
                  +{boardData.activeUsers.length - 3}
                </div>
              )}
            </div>

            <MembersDialog
              type="board"
              entity={currentBoard}
              members={boardMembers}
              pendingMembers={!readOnly ? joinRequests : []}
              activeUsers={boardData.activeUsers}
              onAcceptRequest={!readOnly ? handleAcceptRequest : undefined}
              onRejectRequest={!readOnly ? handleRejectRequest : undefined}
              isLoading={isHandlingJoinRequest}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-8 gap-1.5 rounded-md px-2 text-muted-foreground hover:bg-muted"
                  title="Xem thành viên"
                  aria-label={`Thành viên board, ${currentBoard.members?.length || 0} người`}
                >
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium tabular-nums">
                    {currentBoard.members?.length || 0}
                  </span>
                  {!readOnly && joinRequests?.length > 0 && (
                    <span className="absolute -right-0.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white ring-2 ring-background">
                      {joinRequests.length}
                    </span>
                  )}
                </Button>
              }
            />

            {!readOnly && (
              <InviteMemberDialog
                type="board"
                onInvite={handleInviteMembers}
                isLoading={isInviting}
                trigger={
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 rounded-md px-2.5 sm:px-3"
                    title="Mời thành viên"
                    aria-label="Mời thành viên"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span className="hidden text-xs font-medium sm:inline">Mời</span>
                  </Button>
                }
              />
            )}
          </div>
        </div>

        {/* Bottom: views · tools (labels from lg up to fill wide screens) */}
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          <nav
            className="flex w-full items-center gap-0.5 overflow-x-auto rounded-lg bg-muted/40 p-1 lg:w-auto"
            aria-label="Chế độ xem board"
          >
            {views.map((view) => {
              const isActive = currentView === view.id;
              return (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => onViewChange(view.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <Motion.div
                      layoutId="activeView"
                      className="absolute inset-0 rounded-md border border-border/60 bg-background shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                    />
                  )}
                  <view.icon
                    className={cn(
                      "relative z-10 h-3.5 w-3.5",
                      isActive && "text-primary"
                    )}
                  />
                  <span className="relative z-10 whitespace-nowrap">{view.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 overflow-x-auto lg:gap-1.5 lg:justify-end">
            <BoardFilterDialog
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    toolBtn,
                    "relative",
                    isFiltering && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                  )}
                  title="Bộ lọc"
                  aria-label="Bộ lọc thẻ"
                >
                  <Filter className="h-4 w-4" />
                  <span className={toolLabel}>Bộ lọc</span>
                  {isFiltering && (
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary lg:right-2" />
                  )}
                </Button>
              }
            />

            <BoardLabelsDialog
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className={toolBtn}
                  title="Nhãn board"
                  aria-label="Quản lý nhãn"
                >
                  <Tag className="h-4 w-4" />
                  <span className={toolLabel}>Nhãn</span>
                </Button>
              }
            />

            <div className="mx-0.5 hidden h-4 w-px bg-border lg:block" aria-hidden="true" />

            <BoardAIDialog
              boardId={currentBoard._id}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    toolBtn,
                    "border border-transparent text-primary hover:border-primary/20 hover:bg-primary/10 hover:text-primary lg:border-primary/15 lg:bg-primary/5"
                  )}
                  title="AI Trợ lý"
                  aria-label="AI Trợ lý"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className={toolLabel}>AI</span>
                </Button>
              }
            />

            <BoardThemeDialog
              currentTheme={currentTheme}
              onThemeChange={onThemeChange}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className={toolBtn}
                  title="Thay đổi chủ đề"
                  aria-label="Thay đổi chủ đề"
                >
                  <Palette className="h-4 w-4" />
                  <span className={toolLabel}>Chủ đề</span>
                </Button>
              }
            />

            <BoardActivitiesDialog
              boardId={currentBoard._id}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className={toolBtn}
                  title="Hoạt động"
                  aria-label="Xem hoạt động"
                >
                  <Activity className="h-4 w-4" />
                  <span className={toolLabel}>Hoạt động</span>
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default BoardDetailHeader;
