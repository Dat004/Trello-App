import {
  AlertCircle,
  Calendar,
  CheckSquare,
  Clock,
  Plus,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";

import { getChecklistProgress } from "@/helpers/card";
import { formatDateOnly } from "@/helpers/formatTime";
// import MemberSelectorDialog from "@/Components/MemberSelectorDialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  TextArea,
  Label,
  Progress,
  Separator,
} from "@/Components/UI";
import { useBoardDetailStore } from "@/store";

function CardDetailModal({ card, listId, boardId, trigger }) {
  const { updateCard } = useBoardDetailStore();
  const [open, setOpen] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newComment, setNewComment] = useState("");
  const [showMemberSelector, setShowMemberSelector] = useState(false);

  const workspaceMembers = [
    { id: "1", name: "Nguyễn Văn A", avatar: "/placeholder.svg" },
    { id: "2", name: "Trần Thị B", avatar: "/placeholder.svg" },
    { id: "3", name: "Phạm Văn C", avatar: "/placeholder.svg" },
    { id: "4", name: "Hoàng Thị D", avatar: "/placeholder.svg" },
  ];

  const handleToggleChecklistItem = (itemId) => {
    if (!card) return;

    const updatedChecklist = card.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const updatedCard = {
      ...card,
      checklist: updatedChecklist,
      updatedAt: new Date(),
    };

    updateCard(card._id, updatedCard);
  };

  const handleAddChecklistItem = () => {
    if (!card || !newChecklistItem.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      text: newChecklistItem.trim(),
      completed: false,
      createdAt: new Date(),
    };

    const updatedCard = {
      ...card,
      checklist: [...card.checklist, newItem],
      updatedAt: new Date(),
    };

    updateCard(card._id, updatedCard);
    setNewChecklistItem("");
  };

  const handleDeleteChecklistItem = (itemId) => {
    if (!card) return;

    const updatedCard = {
      ...card,
      checklist: card.checklist.filter((item) => item.id !== itemId),
      updatedAt: new Date(),
    };

    updateCard(card._id, updatedCard);
  };

  const handleAddComment = () => {
    if (!card || !newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: "Bạn",
      createdAt: new Date(),
    };

    const updatedCard = {
      ...card,
      comments: [...card.comments, comment],
      updatedAt: new Date(),
    };

    updateCard(card._id, updatedCard);
    setNewComment("");
  };

  const handleAddCommentWithReply = (replyTo) => {
    // Logic to add comment with reply
    if (!card || !newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: "Bạn",
      createdAt: new Date(),
      replyTo: replyTo,
    };

    const updatedCard = {
      ...card,
      comments: [...card.comments, comment],
      updatedAt: new Date(),
    };

    updateCard(card._id, updatedCard);
    setNewComment("");
  };

  const handleAddMembers = (members) => {
    if (!card) return;

    const updatedCard = {
      ...card,
      members: members,
      updatedAt: new Date(),
    };

    updateCard(card._id, updatedCard);
  };

  if (!card) return null;

  const checklistProgress = getChecklistProgress(card);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Chi tiết thẻ
          </DialogTitle>
          <DialogDescription>
            Xem và chỉnh sửa thông tin chi tiết của thẻ, bao gồm tiêu đề, mô tả,
            thành viên và danh sách công việc.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="card-title" className="text-sm font-medium">
              Tiêu đề
            </Label>
            <Input
              id="card-title"
              value={card.title}
              readOnly
              className="text-base"
            />
          </div>

          <div className="grid gap-3">
            {card.labels.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-gray-500" />
                {card.labels.map((label) => (
                  <div
                    key={label._id}
                    className={`${label.color} text-white text-xs px-2 py-1 rounded`}
                  >
                    {label.name}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm">
              {card.priority && (
                <div className="flex items-center gap-2">
                  <AlertCircle
                    className={`h-4 w-4 ${
                      card.priority === "high"
                        ? "text-red-500"
                        : card.priority === "medium"
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span className="capitalize text-gray-700 dark:text-gray-300">
                    Độ ưu tiên: <strong>{card.priority}</strong>
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  Hạn:{" "}
                  <strong>
                    {card.due_date
                      ? formatDateOnly(card.due_date)
                      : "Không có hạn"}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Thành viên
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setShowMemberSelector(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Thêm
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {card && card.members.length > 0 ? (
                card.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                      />
                      <AvatarFallback className="text-xs">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[100px] truncate">
                      {member.name}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">Chưa có thành viên</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="card-description" className="text-sm font-medium">
              Mô tả
            </Label>
            <TextArea
              id="card-description"
              value={card.description || ""}
              readOnly
              placeholder="Chưa có mô tả"
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Checklist
              </Label>
              {checklistProgress && (
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {checklistProgress.completed}/{checklistProgress.total} (
                  {checklistProgress.percentage}%)
                </span>
              )}
            </div>

            {checklistProgress && (
              <Progress value={checklistProgress.percentage} className="h-2" />
            )}

            <div className="space-y-2">
              {card.checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handleToggleChecklistItem(item.id)}
                    id={`check-${item.id}`}
                  />
                  <label
                    htmlFor={`check-${item.id}`}
                    className={`flex-1 text-sm cursor-pointer ${
                      item.completed
                        ? "line-through text-gray-500"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {item.text}
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={() => handleDeleteChecklistItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Thêm mục mới..."
                onKeyDown={(e) => e.key === "Enter" && handleAddChecklistItem()}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={handleAddChecklistItem}
                disabled={!newChecklistItem.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* {card.attachments.length > 0 && (
            <div className="grid gap-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Tệp đính kèm
              </Label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {card.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border hover:shadow-md transition-shadow"
                  >
                    <Paperclip className="h-4 w-4 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{attachment.name}</p>
                      <p className="text-xs text-gray-500">
                        {(attachment.size / 1024).toFixed(0)} KB • {attachment.createdAt.toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* <div className="grid gap-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Bình luận ({card.comments.length})
            </Label>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {card.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{comment.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          {comment.createdAt.toLocaleString("vi-VN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                    </div>
                    <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setNewComment(`@${comment.author} `)}
                      >
                        Trả lời
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setNewComment(`@${comment.author} `)}
                      >
                        Nhắc đến
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <TextArea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận..."
                rows={2}
                className="resize-none text-sm"
              />
              <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div> */}

          <Separator />

          {/* Card Info */}
          <div className="grid gap-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Thông tin thẻ
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Tạo: {formatDateOnly(card.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Cập nhật: {formatDateOnly(card.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* {card && (
          <MemberSelectorDialog
            open={showMemberSelector}
            onOpenChange={setShowMemberSelector}
            workspaceMembers={workspaceMembers}
            selectedMembers={card.members}
            onConfirm={handleAddMembers}
          />
        )} */}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CardDetailModal;
