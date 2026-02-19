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
import ThreadLine from "./ThreadLine";
import ToggleRepliesComment from "./ToggleRepliesComment";

function CommentItem({ 
  comment, 
  onDelete, 
  onReply,
  canDelete,
  boardId,
  cardId,
  userId,
  isAdminOrOwner,
}) {
  const queryClient = useQueryClient();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  // Use React Query to fetch replies
  const { 
    data: threadRepliesRaw, 
    isLoading: isLoadingThread 
  } = useCardCommentReplies(boardId, cardId, comment._id, showReplies);

  // Apply permissions and memoize
  const threadComments = useMemo(() => {
     if (!threadRepliesRaw) return [];
     return threadRepliesRaw.map(reply => {
        const authorId = (reply.author?._id || reply.author)?.toString();
        const currentUserId = userId?.toString();
        const isAuthor = authorId === currentUserId;
        
        return {
            ...reply,
            canDelete: isAdminOrOwner || isAuthor
        };
     });
  }, [threadRepliesRaw, isAdminOrOwner, userId]);

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: vi,
  });

  const depth = comment.depth;
  const isReply = depth > 0;
  const hasReplies = comment.reply_count > 0;
  const avatarStyles = isReply ? "h-6 w-6" : "h-8 w-8";

  // Toggle replies visibility
  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  // Handle reply submit
  const handleReplySubmit = async (data) => {
    setIsReplying(true);
    try {
      // Call parent handler (which calls API)
      await onReply({
        ...data,
        parent_comment: comment._id,
      });
      
      setShowReplyInput(false);
      
      // Invalidate replies cache to show new reply
      await queryClient.invalidateQueries(CARD_KEYS.replies(comment._id));
      
      // Ensure replies are shown
      if (!showReplies) setShowReplies(true);
    } finally {
      setIsReplying(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(comment._id, comment.parent_comment);
      // Parent handles invalidation of main list via mutation callbacks
      
      // If deleting a reply, invalidate parent thread
      if (comment.parent_comment) {
           await queryClient.invalidateQueries(CARD_KEYS.replies(comment.parent_comment));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <CommentWrapper isReply={isReply} depth={depth}>
        {hasReplies && <ThreadLine className="top-[43px] h-[calc(100%-43px)]" depth={depth} />}
        {Array.from({ length: depth }).map((_, i) => <ThreadLine key={i} depth={i} />)}
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
            <div className="bg-muted/50 rounded-2xl px-3 py-2 inline-block max-w-full">
              <span className="font-medium text-sm">{comment.author?.full_name}</span>
              <p className="text-sm whitespace-pre-wrap">
                {/* Hiển thị tên người được reply - chỉ khi là reply và có thông tin parent author */}
                {isReply && comment.reply_to?.full_name && (
                  <span className="text-primary font-medium bg-primary/10 rounded px-1 mr-1">
                    @{comment.reply_to.full_name}
                  </span>
                )}
                {comment.text}
              </p>
            </div>

            <div className="flex items-center gap-3 px-2 mb-1">
              <span className="text-xs text-muted-foreground font-medium">{timeAgo}</span>
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-xs font-semibold text-muted-foreground hover:underline"
                disabled={isDeleting}
              >
                Trả lời
              </button>
              
              {canDelete && (
                <button
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
          </div>
        </div>
      </CommentWrapper>

      {/* Thread Replies List */}
      {showReplies && threadComments.length > 0 && (
        <>
          {threadComments.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onDelete={onDelete}
              onReply={onReply}
              canDelete={reply.canDelete}
              boardId={boardId}
              cardId={cardId}
              userId={userId}
              isAdminOrOwner={isAdminOrOwner}
            />
          ))}
        </>
      )}

      {/* Toggle Replies Button */}
      {hasReplies && (
        <ToggleRepliesComment 
          comment={comment} 
          showReplies={showReplies} 
          isLoadingThread={isLoadingThread}
          handleToggleReplies={handleToggleReplies} 
        />
      )}

      {/* Reply Input - positioned based on depth */}
      {showReplyInput && (
        <CommentWrapper depth={depth}>
          {Array.from({ length: depth }).map((_, i) => <ThreadLine key={i} depth={i} />)}
          <div className="pt-2 ml-5">
            <CommentInput
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplyInput(false)}
              isLoading={isReplying}
              placeholder="Viết câu trả lời..."
              replyTo={comment._id}
              replyToName={comment.author?.full_name}
            />
          </div>
        </CommentWrapper>
      )}
    </div>
  );
}

export default CommentItem;
