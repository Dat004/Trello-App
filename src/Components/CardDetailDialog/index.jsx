import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
} from "@/Components/UI";
import { ROOM_TYPES, SOCKET_EVENTS } from "@/constants/socketEvents";
import { useBoardDetailStore, useCommentsStore } from "@/store";
import CardDescription from "./CardDescription";
import CardAttachments from "./CardAttachments";
import CardChecklist from "./CardChecklist";
import CardComments from "./CardComments";
import CardMetadata from "./CardMetadata";
import CardMembers from "./CardMembers";
import CardHeader from "./CardHeader";
import { useSocket } from "@/hooks";

function CardDetailDialog({ card, listId, boardId, trigger }) {
  const currentBoard = useBoardDetailStore((state) => state.currentBoard);
  
  const addCommentToStore = useCommentsStore((state) => state.addCommentFromSocket);
  const deleteCommentFromStore = useCommentsStore((state) => state.deleteCommentFromSocket);
  
  const [open, setOpen] = useState(false);
  const { joinRoom, leaveRoom, on, off, isConnected } = useSocket();

  // Join/Leave room khi dialog mở/đóng
  useEffect(() => {
    if (!open || !card._id || !isConnected) return;

    console.log(`[CardDetailDialog] Joining room for card: ${card._id}`);
    joinRoom(ROOM_TYPES.CARD, card._id);

    // Listen socket events
    const handleCommentAdded = (newComment) => {
      console.log("[Socket] Comment added:", newComment);
      // Update comment data trong commentsStore
      addCommentToStore(newComment);
    };

    const handleCommentDeleted = (data) => {
      console.log("[Socket] Comment deleted:", data);
      // Delete comment từ commentsStore
      deleteCommentFromStore(data.commentId, data.parentId);
    };

    // Listen socket events
    on(SOCKET_EVENTS.COMMENT_ADDED, handleCommentAdded);
    on(SOCKET_EVENTS.COMMENT_DELETED, handleCommentDeleted);

    // Cleanup khi dialog đóng
    return () => {
      console.log(`[CardDetailDialog] Leaving room for card: ${card._id}`);
      off(SOCKET_EVENTS.COMMENT_ADDED, handleCommentAdded);
      off(SOCKET_EVENTS.COMMENT_DELETED, handleCommentDeleted);

      leaveRoom(ROOM_TYPES.CARD, card._id);
    };
  }, [open, card._id, isConnected, joinRoom, leaveRoom, on, off, addCommentToStore, deleteCommentFromStore]);

  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết thẻ</DialogTitle>
          <DialogDescription>
            Xem và chỉnh sửa thông tin chi tiết của thẻ, bao gồm tiêu đề, mô tả,
            thành viên và danh sách công việc.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <CardHeader card={card} />
          
          <CardMembers card={card} boardId={boardId} listId={listId} />
          
          <CardDescription card={card} />
          
          <Separator />
          
          <CardChecklist card={card} boardId={boardId} listId={listId} />
          
          <Separator />
          
          <CardAttachments card={card} boardId={boardId} />
          
          <Separator />
          
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
