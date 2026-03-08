import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  Calendar,
  Filter,
  Kanban,
  Loader2,
  MoreHorizontal,
  Settings,
  Star,
  Table,
  UserPlus,
  Users
} from "lucide-react";

import { useHandleBoardJoinRequest, useInviteBoardMember } from "@/features/boards/api/useBoardMembers";
import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/Components/UI";
import BoardActivitiesDialog from "../Dialogs/BoardActivitiesDialog";
import { useBoardFilter } from "../../context/BoardFilterContext";
import InviteMemberDialog from "@/Components/InviteMemberDialog";
import BoardFilterDialog from "../Dialogs/BoardFilterDialog";
import MembersDialog from "@/Components/MembersDialog";
import { useFavoritesStore } from "@/store";
import { useFavorites } from "@/hooks";
import { cn } from "@/lib/utils";

function BoardDetailHeader({ currentView, onViewChange }) {
    const navigate = useNavigate();
    const { isFiltering } = useBoardFilter();
    
    // Use Context
    const { boardData, addBoardMember, removeJoinRequest } = useBoardContext();
    const { currentBoard, boardMembers, joinRequests } = boardData;

    const favoriteBoards = useFavoritesStore((state) => state.favoriteBoards);
    const { toggleBoardStar, isTogglingBoard } = useFavorites();

    const { mutate: handleJoinRequest } = useHandleBoardJoinRequest();
    const { mutate: inviteMember } = useInviteBoardMember();
  
    const handleInviteMembers = ({ emails, role, message, onSuccess, onSettled }) => {
      inviteMember(
        {
            boardId: currentBoard._id,
            emails,
            role,
            message,
        },
        {
            onSuccess: () => {if (onSuccess) onSuccess()},
            onSettled: () => {if (onSettled) onSettled()}
        }
      );
    };
  
    const handleAcceptRequest = (requestId) => {
        handleJoinRequest({
            boardId: currentBoard._id,
            requestId,
            status: "accepted"
        });
    }
  
    const handleRejectRequest = (requestId) => {
        handleJoinRequest({
            boardId: currentBoard._id,
            requestId,
            status: "declined"
        });
    }

    const views = [
      { id: 'kanban', label: 'Bảng', icon: Kanban },
      { id: 'table', label: 'Bảng biểu', icon: Table },
      { id: 'calendar', label: 'Lịch', icon: Calendar },
    ];

    if (!currentBoard) return null;

    return (
        <section className="container mx-auto px-4 py-3">
          <section className="flex items-center justify-between">
            <section className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="text-muted-foreground hover:bg-muted h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <section>
                  <h1 className="text-xl font-bold text-foreground">
                    {currentBoard.title}
                  </h1>
                </section>
              </div>

              {/* View Switcher */}
              <div className="hidden lg:flex items-center bg-muted/50 p-1 rounded-xl border border-border/50 backdrop-blur-sm">
                {views.map((view) => {
                  const isActive = currentView === view.id;
                  return (
                    <button
                      key={view.id}
                      onClick={() => onViewChange(view.id)}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeView"
                          className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border/50"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <view.icon className={cn("h-3.5 w-3.5 relative z-10 transition-transform duration-300", isActive && "scale-110")} />
                      <span className="relative z-10">{view.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleBoardStar(currentBoard)}
                className="text-muted-foreground cursor-pointer hover:bg-muted"
              >
                {isTogglingBoard ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Star
                  className={cn("h-5 w-5", 
                    favoriteBoards.some((board) => board._id === currentBoard._id)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground")}
                  />
                )}
              </Button>
              <InviteMemberDialog
                type="board"
                onInvite={handleInviteMembers}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:bg-muted gap-1 hidden sm:flex cursor-pointer"
                    title="Mời thành viên"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden md:inline text-xs">Thêm</span>
                  </Button>
                }
              />

              <BoardFilterDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-muted-foreground hover:bg-muted gap-1 hidden sm:flex relative",
                      isFiltering && "text-primary bg-primary/10"
                    )}
                    title="Bộ lọc"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden md:inline text-xs">Bộ lọc</span>
                    {isFiltering && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                    )}
                  </Button>
                }
              />

               <BoardActivitiesDialog
                boardId={currentBoard._id}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    // onClick={handleViewActivity}
                    className="text-muted-foreground hover:bg-muted gap-1 hidden sm:flex"
                    title="Hoạt động"
                  >
                    <Activity className="h-4 w-4" />
                    <span className="hidden md:inline text-xs">Hoạt động</span>
                  </Button>
                }
              />

      <div className="border-l border-border mx-1 h-6" />
              
              <MembersDialog
                type="board"
                entity={currentBoard}
                members={boardMembers}
                pendingMembers={joinRequests}
                activeUsers={boardData.activeUsers}
                onAcceptRequest={handleAcceptRequest}
                onRejectRequest={handleRejectRequest}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:bg-muted cursor-pointer"
                    title="Xem thành viên"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-xs">{currentBoard.members?.length || 0}</span>
                  </Button>
                }
              />

              <div className="flex items-center -space-x-2 ml-2 mr-4">
                {boardData.activeUsers?.slice(0, 3).map((active) => (
                  <Avatar key={active._id} className="h-7 w-7 border-2 border-background shadow-sm" title={`${active.full_name} đang online`}>
                    <AvatarImage src={active.avatar?.url} alt={active.full_name} />
                    <AvatarFallback className="text-[10px] bg-green-100 text-green-700">
                      {active.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {boardData.activeUsers?.length > 3 && (
                  <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground z-10 shadow-sm">
                    +{boardData.activeUsers.length - 3}
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                // onClick={handleBoardSettings}
                className="text-muted-foreground hover:bg-muted gap-1 hidden sm:flex"
                title="Cài đặt"
              >
                <Settings className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-muted"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </section>
          </section>
        </section>
    )
}

export default BoardDetailHeader;
