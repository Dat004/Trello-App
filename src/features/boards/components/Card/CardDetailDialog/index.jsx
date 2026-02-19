import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { useCardRealtime } from "@/features/boards/hooks/useCardRealtime";

import CardAttachments from "./CardAttachments";
import CardChecklist from "./CardChecklist";
import CardComments from "./CardComments";
import CardDescription from "./CardDescription";
import CardHeader from "./CardHeader";
import CardMembers from "./CardMembers";
import CardMetadata from "./CardMetadata";

function CardDetailDialog({ card, listId, boardId, trigger }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Use Context instead of Store for currentBoard
  const { boardData } = useBoardContext();
  const currentBoard = boardData.currentBoard;
  
  // Join/Leave room khi dialog mở/đóng
  useCardRealtime(open ? card?._id : null);

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
