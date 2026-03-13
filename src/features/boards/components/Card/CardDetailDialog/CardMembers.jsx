import { Loader2, Plus, User, X } from "lucide-react";
import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@/Components/UI";
import {
  useAssignCardMember,
  useRemoveCardMember,
} from "@/features/boards/api/useCardMembers";
import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { useBoardAccess } from "../../BoardAccessGuard";

function CardMembers({ card, boardId, listId, activeUsers = [] }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingMemberId, setProcessingMemberId] = useState(null);
  const { boardData } = useBoardContext();
  const { readOnly } = useBoardAccess();

  // API hooks
  const { mutate: assignMember, isLoading: isAssigning } =
    useAssignCardMember();
  const { mutate: removeMember, isLoading: isRemoving } =
    useRemoveCardMember();

  // ✅ Get current card members from cache (Hybrid Approach)
  const cardMembers = card?._membersCache || card?.members || [];
  const cardMemberIds = card?.memberIds || cardMembers.map((m) => m._id);

  // Get available board members (excluding already assigned)
  const availableMembers = (boardData.boardMembers || [])
    .filter((boardMember) => {
      const userId = boardMember.user?._id || boardMember._id;
      return !cardMemberIds.includes(userId);
    })
    .filter((boardMember) => {
      if (!searchQuery) return true;
      const userName = boardMember.user?.full_name || boardMember.full_name || "";
      return userName.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const handleAssignMember = (member) => {
    setProcessingMemberId(member._id);
    assignMember(
      {
        boardId,
        listId,
        cardId: card._id,
        data: { userId: member._id },
      },
      {
        onSuccess: () => {
          setOpen(false);
          setSearchQuery("");
        },
        onSettled: () => setProcessingMemberId(null),
      }
    );
  };

  const handleRemoveMember = (memberId) => {
    setProcessingMemberId(memberId);
    removeMember({
      boardId,
      listId,
      cardId: card._id,
      userId: memberId,
    }, {
      onSettled: () => setProcessingMemberId(null),
    });
  };

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <User className="h-4 w-4" />
          Thành viên
        </Label>

        {!readOnly && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              disabled={isAssigning || isRemoving}
            >
              <Plus className="h-3 w-3 mr-1" />
              Gán thành viên
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Gán thành viên</DialogTitle>
              <DialogDescription>
                Chọn thành viên từ board để gán vào thẻ này
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Search input */}
              <div className="grid gap-2">
                <Label htmlFor="search">Tìm kiếm</Label>
                <Input
                  id="search"
                  placeholder="Nhập tên thành viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Available members list */}
              <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                {availableMembers.length > 0 ? (
                  availableMembers.map((boardMember) => {
                    const member = boardMember.user || boardMember;
                    const memberName = member.full_name || member.name || "Unknown";
                    const memberAvatar = member.avatar.url || "";

                    return (
                      <div
                        key={member._id}
                        disabled={isAssigning}
                        onClick={() => handleAssignMember(member)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted hover:border-muted transition-all text-left group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        role="button"
                        tabIndex={0}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={memberAvatar} alt={memberName} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {memberName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {activeUsers.some(u => u._id === (member._id)) && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background shadow-sm" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {memberName}
                          </p>
                          {boardMember.role && (
                            <p className="text-xs text-muted-foreground">
                              {boardMember.role === "owner"
                                ? "Chủ sở hữu"
                                : boardMember.role === "admin"
                                ? "Quản trị viên"
                                : "Thành viên"}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isAssigning}
                          className="h-8 w-8"
                        >
                          {isAssigning && processingMemberId === member._id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">
                      {searchQuery
                        ? "Không tìm thấy thành viên"
                        : "Tất cả thành viên đã được gán"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {/* Current members */}
      <div className="flex items-center gap-2 flex-wrap">
        {cardMembers.length > 0 ? (
          cardMembers.map((member) => {
            const memberName = member.full_name || member.name || "Unknown";
            const memberAvatar = member.avatar.url || "";

            return (
              <div
                key={member._id}
                className="group relative flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs transition-all border border-transparent hover:border-primary/20"
              >
                <div className="relative">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={memberAvatar} alt={memberName} />
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                      {memberName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {activeUsers.some(u => u._id === (member._id)) && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 border border-background shadow-sm" />
                  )}
                </div>

                <span className="max-w-[120px] truncate font-medium">
                  {memberName}
                </span>

                {!readOnly && (
                <button
                  onClick={() => handleRemoveMember(member._id)}
                  disabled={isRemoving}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:bg-destructive/10 rounded-full p-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Xóa thành viên"
                >
                  {isRemoving && processingMemberId === member._id ? (
                      <Loader2 className="h-3 w-3 animate-spin text-destructive" />
                  ) : (
                      <X className="h-3 w-3 text-destructive" />
                  )}
                </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-xs text-muted-foreground py-2">
            Chưa có thành viên được gán
          </p>
        )}
      </div>
    </div>
  );
}

export default CardMembers;
