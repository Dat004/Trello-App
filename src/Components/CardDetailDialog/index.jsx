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
import CardChecklist from "./CardChecklist";
import CardDescription from "./CardDescription";
import CardHeader from "./CardHeader";
import CardMembers from "./CardMembers";
import CardMetadata from "./CardMetadata";

function CardDetailDialog({ card, listId, boardId, trigger }) {
  const [open, setOpen] = useState(false);

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
