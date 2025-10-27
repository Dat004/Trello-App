import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  User,
  Tag,
  CheckSquare,
  Plus,
  Trash2,
  MessageSquare,
  Paperclip,
  AlertCircle,
  Clock,
} from "lucide-react";

import {
  Button,
  Input,
  Label,
  TextArea,
  Checkbox,
  Progress,
  Separator,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./UI";

function CardDetailDialog({ card, listId, boardId, open, onOpenChange }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || "");
    }
  }, [card]);

  const handleSave = async () => {
    if (!card || !title.trim()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedCard = {
      ...card,
      title: title.trim(),
      description: description.trim(),
      updatedAt: new Date(),
    };

    dispatch({
      type: "UPDATE_CARD",
      payload: { boardId, listId, card: updatedCard },
    });
    setIsLoading(false);
    onOpenChange(false);
  };

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

    setNewChecklistItem("");
  };

  const handleDeleteChecklistItem = (itemId) => {
    if (!card) return;

    const updatedCard = {
      ...card,
      checklist: card.checklist.filter((item) => item.id !== itemId),
      updatedAt: new Date(),
    };
  };

  const handleAddComment = () => {
    if (!card || !newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: "Người dùng hiện tại",
      createdAt: new Date(),
    };

    const updatedCard = {
      ...card,
      comments: [...card.comments, comment],
      updatedAt: new Date(),
    };

    setNewComment("");
  };

  const getChecklistProgress = () => {
    if (!card || card.checklist.length === 0) return null;
    const completed = card.checklist.filter((item) => item.completed).length;
    const total = card.checklist.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  const getLabelColor = (color) => {
    const colors = {
      red: "bg-red-500",
      orange: "bg-orange-500",
      yellow: "bg-yellow-500",
      green: "bg-green-500",
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      indigo: "bg-indigo-500",
      gray: "bg-gray-500",
    };
    return colors[color] || "bg-gray-500";
  };
  // </CHANGE>

  const handleClose = () => {
    onOpenChange(false);
    if (card) {
      setTitle(card.title);
      setDescription(card.description || "");
    }
  };

  if (!card) return null;

  const checklistProgress = getChecklistProgress();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <section className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Chi tiết thẻ
            </DialogTitle>
          </section>
        </DialogHeader>

        <section className="grid gap-6 py-4">
          {/* Title */}
          <section className="grid gap-2">
            <Label htmlFor="card-title" className="text-sm font-medium">
              Tiêu đề *
            </Label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề thẻ..."
              className="text-base"
            />
          </section>

          <section className="grid gap-3">
            {card.labels.length > 0 && (
              <section className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-gray-500" />
                {card.labels.map((label) => (
                  <section
                    key={label.id}
                    className={`${getLabelColor(
                      label.color
                    )} text-white text-xs px-2 py-1 rounded`}
                  >
                    {label.name}
                  </section>
                ))}
              </section>
            )}

            <section className="flex items-center gap-4 text-sm">
              {card.priority && (
                <section className="flex items-center gap-2">
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
                </section>
              )}

              {card.dueDate && (
                <section className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Hạn:{" "}
                    <strong>{card.dueDate.toLocaleDateString("vi-VN")}</strong>
                  </span>
                </section>
              )}
            </section>
          </section>
          {/* </CHANGE> */}

          {/* Members */}
          {card.members.length > 0 && (
            <section className="grid gap-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Thành viên
              </Label>
              <section className="flex items-center gap-2 flex-wrap">
                {card.members.map((member) => (
                  <section
                    key={member.id}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                      />
                      <AvatarFallback className="text-xs">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.name}</span>
                  </section>
                ))}
              </section>
            </section>
          )}

          {/* Description */}
          <section className="grid gap-2">
            <Label htmlFor="card-description" className="text-sm font-medium">
              Mô tả
            </Label>
            <TextArea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Thêm mô tả chi tiết cho thẻ này..."
              rows={4}
              className="resize-none"
            />
          </section>

          <section className="grid gap-3">
            <section className="flex items-center justify-between">
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
            </section>

            {checklistProgress && (
              <Progress value={checklistProgress.percentage} className="h-2" />
            )}

            <section className="space-y-2">
              {card.checklist.map((item) => (
                <section key={item.id} className="flex items-center gap-2 group">
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
                </section>
              ))}
            </section>

            <section className="flex gap-2">
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
            </section>
          </section>
          {/* </CHANGE> */}

          {card.attachments.length > 0 && (
            <section className="grid gap-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Tệp đính kèm
              </Label>
              <section className="space-y-2">
                {card.attachments.map((attachment) => (
                  <section
                    key={attachment.id}
                    className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded border"
                  >
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <section className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(attachment.size / 1024).toFixed(0)} KB •{" "}
                        {attachment.createdAt.toLocaleDateString("vi-VN")}
                      </p>
                    </section>
                  </section>
                ))}
              </section>
            </section>
          )}
          {/* </CHANGE> */}

          <section className="grid gap-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Bình luận ({card.comments.length})
            </Label>

            <section className="space-y-3">
              {card.comments.map((comment) => (
                <section key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {comment.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <section className="flex-1">
                    <section className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      <section className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {comment.author}
                        </span>
                        <span className="text-xs text-gray-500">
                          {comment.createdAt.toLocaleString("vi-VN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </section>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.text}
                      </p>
                    </section>
                  </section>
                </section>
              ))}
            </section>

            <section className="flex gap-2">
              <TextArea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận..."
                rows={2}
                className="resize-none text-sm"
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </section>
          </section>
          {/* </CHANGE> */}

          <Separator />

          {/* Card Info */}
          <section className="grid gap-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Thông tin thẻ
            </h4>
            <section className="grid grid-cols-2 gap-4 text-sm">
              <section className="flex items-center gap-2 text-muted-foreground">
                <span>Tạo: {card.createdAt.toLocaleDateString("vi-VN")}</span>
              </section>
              <section className="flex items-center gap-2 text-muted-foreground">
                <span>
                  Cập nhật: {card.updatedAt.toLocaleDateString("vi-VN")}
                </span>
              </section>
            </section>
          </section>
        </section>

        <section className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Đóng
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </section>
      </DialogContent>
    </Dialog>
  );
}

export default CardDetailDialog;
