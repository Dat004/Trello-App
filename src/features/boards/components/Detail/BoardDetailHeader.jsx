import { Activity, ArrowLeft, Filter, Loader2, MoreHorizontal, Settings, Share2, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { useFavoritesStore } from "@/store";
import BoardActivitiesDialog from "../Dialogs/BoardActivitiesDialog";

import { useHandleBoardJoinRequest } from "@/features/boards/api/useBoardMembers";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/Components/UI";
import MembersDialog from "@/Components/MembersDialog";
import { useFavorites } from "@/hooks";
import { cn } from "@/lib/utils";

function BoardDetailHeader() {
    const navigate = useNavigate();
    
    // Use Context
    const { boardData, addBoardMember, removeJoinRequest } = useBoardContext();
    const { currentBoard, boardMembers, joinRequests } = boardData;

    const favoriteBoards = useFavoritesStore((state) => state.favoriteBoards);
    const { toggleBoardStar, isTogglingBoard } = useFavorites();

    const { mutate: handleJoinRequest } = useHandleBoardJoinRequest();
  
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

    if (!currentBoard) return null;

    return (
        <section className="container mx-auto px-4 py-4">
          <section className="flex items-center justify-between">
            <section className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <section>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentBoard.title}
                </h1>
                {currentBoard.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentBoard.description}
                  </p>
                )}
              </section>
            </section>

            <section className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleBoardStar(currentBoard)}
                className="text-gray-700 cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isTogglingBoard ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Star
                  className={cn("h-5 w-5", 
                    favoriteBoards.some((board) => board._id === currentBoard._id)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-700 dark:text-gray-300")}
                  />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                // onClick={handleShareBoard}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-200 gap-1 hidden sm:flex"
                title="Chia sẻ bảng"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden md:inline text-xs">Chia sẻ</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                // onClick={handleFilterBoard}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-200 gap-1 hidden sm:flex"
                title="Bộ lọc"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden md:inline text-xs">Bộ lọc</span>
              </Button>

              <BoardActivitiesDialog
                boardId={currentBoard._id}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    // onClick={handleViewActivity}
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-200 gap-1 hidden sm:flex"
                    title="Hoạt động"
                  >
                    <Activity className="h-4 w-4" />
                    <span className="hidden md:inline text-xs">Hoạt động</span>
                  </Button>
                }
              />

      <div className="border-l border-gray-300 dark:border-gray-700 mx-1 h-6" />
              
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
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-200 cursor-pointer"
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
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-200 gap-1 hidden sm:flex"
                title="Cài đặt"
              >
                <Settings className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-200"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </section>
          </section>
        </section>
    )
}

export default BoardDetailHeader;
