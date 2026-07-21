import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/UI";
import { CARD_KEYS, useCardCommentReplies } from "@/features/boards/api/useCardData";
import { cn } from "@/lib/utils";

import CommentInput from "./CommentInput";
import CommentWrapper from "./CommentWrapper";
import ReplyLine from "./ReplyLine";
import { renderCommentBody } from "./renderCommentBody";
import ThreadLine from "./ThreadLine";
import ToggleRepliesComment from "./ToggleRepliesComment";

function CommentItem({
  comment,
  onDelete,
  onReply,
  onEdit,
  canDelete,
  canEdit,
  isDeleting,
  isEditing,
  boardId,
  cardId,
  userId,
  user,
  isAdminOrOwner,
}) {
  const queryClient = useQueryClient();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    data: threadRepliesRaw,
    isLoading: isLoadingThread,
  } = useCardCommentReplies(boardId, cardId, comment._id, showReplies);

  const threadComments = useMemo(() => {
    if (!threadRepliesRaw) return [];
    return threadRepliesRaw.map((reply) => {
      const authorId = (reply.author?._id || reply.author)?.toString();
      const currentUserId = userId?.toString();
      const isAuthor = authorId === currentUserId;

      return {
        ...reply,
        canDelete: isAdminOrOwner || isAuthor,
        canEdit: isAuthor,
      };
    });
  }, [threadRepliesRaw, isAdminOrOwner, userId]);

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: vi,
  });

  const wasEdited =
    comment.updated_at &&
    comment.created_at &&
    new Date(comment.updated_at).getTime() - new Date(comment.created_at).getTime() > 1000;

  const depth = comment.depth;
  const isReply = depth > 0;
  const hasReplies = comment.reply_count > 0;
  const avatarStyles = isReply ? "h-6 w-6" : "h-8 w-8";

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async (data) => {
    setIsReplying(true);
    try {
      await onReply({
        ...data,
        parent_comment: comment._id,
      });

      setShowReplyInput(false);
      await queryClient.invalidateQueries({ queryKey: CARD_KEYS.replies(comment._id) });
      if (!showReplies) setShowReplies(true);
    } finally {
      setIsReplying(false);
    }
  };

  const handleEditSubmit = async (data) => {
    await onEdit(comment._id, data, comment.parent_comment);
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    try {
      await onDelete(comment._id, comment.parent_comment);
      if (comment.parent_comment) {
        await queryClient.invalidateQueries({
          queryKey: CARD_KEYS.replies(comment.parent_comment),
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div>
      <CommentWrapper isReply={isReply} depth={depth}>
        {hasReplies && <ThreadLine className="top-[43px] h-[calc(100%-43px)]" depth={depth} />}
        {Array.from({ length: depth }).map((_, i) => (
          <ThreadLine key={i} depth={i} />
        ))}
        {depth - 1 >= 0 && <ReplyLine isReply={isReply} depth={depth - 1} />}
        <div className="flex gap-1.5 pt-1 group">
          <section>
            <div className="flex justify-center items-center shrink-0 w-8 h-8">
              <Avatar className={cn(avatarStyles)}>
                <AvatarImage
                  src={comment.author?.avatar?.url || comment.author?.avatar}
                  alt={comment.author?.full_name}
                />
                <AvatarFallback className="text-xs">
                  {comment.author?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </section>

          <div className="flex-1 space-y-1">
            {isEditMode ? (
              <div className="pt-1">
                <CommentInput
                  cardId={cardId}
                  user={user}
                  initialText={comment.text}
                  initialMentions={comment.mentions}
                  onSubmit={handleEditSubmit}
                  onCancel={() => setIsEditMode(false)}
                  isLoading={isEditing}
                  placeholder="Chỉnh sửa bình luận..."
                  submitLabel="Lưu"
                />
              </div>
            ) : (
              <>
                <div className="bg-muted/50 rounded-2xl px-3 py-2 inline-block max-w-full">
                  <span className="font-medium text-sm">{comment.author?.full_name}</span>
                  <p className="text-sm whitespace-pre-wrap">
                    {renderCommentBody(
                      comment.text,
                      comment.mentions,
                      isReply ? comment.reply_to : null
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3 px-2 mb-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    {timeAgo}
                    {wasEdited ? " · Đã sửa" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowReplyInput(!showReplyInput)}
                    className="text-xs font-semibold text-muted-foreground hover:underline"
                    disabled={isDeleting}
                  >
                    Trả lời
                  </button>

                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => setIsEditMode(true)}
                      disabled={isDeleting || isEditing}
                      className="text-xs font-semibold text-muted-foreground hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Sửa
                    </button>
                  )}

                  {canDelete && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-xs font-semibold text-red-500 hover:underline opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 flex items-center gap-1"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" /> Xóa...
                        </>
                      ) : (
                        "Xóa"
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </CommentWrapper>

      {showReplies && threadComments.length > 0 && (
        <>
          {threadComments.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onDelete={onDelete}
              onReply={onReply}
              onEdit={onEdit}
              canDelete={reply.canDelete}
              canEdit={reply.canEdit}
              isDeleting={isDeleting}
              isEditing={isEditing}
              boardId={boardId}
              cardId={cardId}
              userId={userId}
              user={user}
              isAdminOrOwner={isAdminOrOwner}
            />
          ))}
        </>
      )}

      {hasReplies && (
        <ToggleRepliesComment
          comment={comment}
          showReplies={showReplies}
          isLoadingThread={isLoadingThread}
          handleToggleReplies={handleToggleReplies}
        />
      )}

      {showReplyInput && (
        <CommentWrapper depth={depth}>
          {Array.from({ length: depth }).map((_, i) => (
            <ThreadLine key={i} depth={i} />
          ))}
          <div className="pt-2 ml-5">
            <CommentInput
              cardId={cardId}
              user={user}
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplyInput(false)}
              isLoading={isReplying}
              placeholder="Viết câu trả lời..."
              replyToName={comment.author?.full_name}
            />
          </div>
        </CommentWrapper>
      )}
    </div>
  );
}

export default CommentItem;
