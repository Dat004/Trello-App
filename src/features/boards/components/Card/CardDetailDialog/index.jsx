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
  Separator,
} from "@/Components/UI";
import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { useCardRealtime } from "@/features/boards/hooks/useCardRealtime";
import { useBoardAccess } from "../../BoardAccessGuard";

import CardAttachments from "./CardAttachments";
import CardChecklist from "./CardChecklist";
import CardComments from "./CardComments";
import CardDescription from "./CardDescription";
import CardHeader from "./CardHeader";
import CardMembers from "./CardMembers";
import CardMetadata from "./CardMetadata";

function CardDetailDialog({ card, listId, boardId, trigger, open: externalOpen, onOpenChange: externalOnOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? externalOnOpenChange : setInternalOpen;
  
  // Use Context instead of Store for currentBoard
  const { boardData } = useBoardContext();
  const { readOnly } = useBoardAccess();
  const currentBoard = boardData.currentBoard;
  
  // Join/Leave room khi dialog mở/đóng
  const { activeUsers, typingUsers, fieldLocks } = useCardRealtime(open ? card?._id : null);

  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between">
          <div>
            <DialogTitle>Chi tiết thẻ</DialogTitle>
            <DialogDescription>
              {readOnly ? "Xem thông tin thẻ." : "Xem và chỉnh sửa thông tin thẻ."}
            </DialogDescription>
          </div>
          
          {/* Card Presence */}
          <div className="flex items-center -space-x-2 mr-6 mt-1">
            {activeUsers?.map((u) => (
              <Avatar key={u._id} className="h-6 w-6 border-2 border-background shadow-sm" title={`${u.full_name} đang xem`}>
                <AvatarImage src={u.avatar?.url} alt={u.full_name} />
                <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">
                  {u.full_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <CardHeader 
            card={card} 
            locks={fieldLocks} 
            boardId={boardId} 
            listId={listId} 
            currentBoard={currentBoard} 
          />
          
          <CardMembers card={card} boardId={boardId} listId={listId} activeUsers={activeUsers} />
          
          <CardDescription card={card} locks={fieldLocks} />
          
          <Separator />
          
          <CardChecklist card={card} boardId={boardId} listId={listId} />

          <Separator />
          
          <CardAttachments card={card} boardId={boardId} />
          
          <Separator />

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse px-1">
              <div className="flex -space-x-1">
                {typingUsers.map(u => (
                   <div key={u._id} className="h-4 w-4 rounded-full border border-background bg-muted overflow-hidden">
                      <img src={u.avatar?.url} alt={u.full_name} className="h-full w-full object-cover" />
                   </div>
                ))}
              </div>
              <span>
                {typingUsers.length === 1 
                  ? `${typingUsers[0].full_name} đang nhập...` 
                  : `${typingUsers.length} người đang nhập...`}
              </span>
            </div>
          )}
          
          <CardComments card={card} boardId={boardId} board={currentBoard} />
          
          <Separator />
          
          <CardMetadata card={card} />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CardDetailDialog;
