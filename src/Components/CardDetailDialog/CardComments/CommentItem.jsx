import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/UI";
import ToggleRepliesComment from "./ToggleRepliesComment";
import CommentWrapper from "./CommentWrapper";
import { commentsApi } from "@/api/comments";
import CommentInput from "./CommentInput";
import ThreadLine from "./ThreadLine";
import ReplyLine from "./ReplyLine";
import { cn } from "@/lib/utils";

function CommentItem({ 
  comment, 
  onDelete, 
  onReply,
  canDelete,
  boardId,
  cardId,
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [threadComments, setThreadComments] = useState([]);
  const [isLoadingThread, setIsLoadingThread] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: vi,
  });

  const depth = comment.depth;
  const isReply = depth > 0;
  const hasReplies = comment.reply_count > 0;
  const avatarStyles = isReply ? "h-6 w-6" : "h-8 w-8";

  const handleToggleReplies = async () => {
    if (!showReplies && threadComments.length === 0) {
      setIsLoadingThread(true);
      try {
        const response = await commentsApi.getThreadComment(boardId, cardId, comment._id);
        if (response.data.success) {
          const replies = response.data.data.comments;
          const repliesWithPermissions = replies.map((reply) => ({
            ...reply,
            canDelete: canDelete || reply.author?._id === comment.author?._id,
          }));
          setThreadComments(repliesWithPermissions);
        }
      } catch (error) {
        console.error("Error fetching thread:", error);
      } finally {
        setIsLoadingThread(false);
      }
    }
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async (data) => {
    onReply({
      ...data,
      parent_comment: comment._id,
    });
    setShowReplyInput(false);
    
    // Refresh thread sau khi reply để hiển thị comment mới
    // Force fetch lại từ API
    setIsLoadingThread(true);
    try {
      const response = await commentsApi.getThreadComment(boardId, cardId, comment._id);
      if (response.data.success) {
        const replies = response.data.data.comments;
        const repliesWithPermissions = replies.map((reply) => ({
          ...reply,
          canDelete: canDelete || reply.author?._id === comment.author?._id,
        }));
        setThreadComments(repliesWithPermissions);
        setShowReplies(true);
      }
    } catch (error) {
      console.error("Error refreshing thread:", error);
    } finally {
      setIsLoadingThread(false);
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
              <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
            </div>

            <div className="flex items-center gap-3 px-2 mb-1">
              <span className="text-xs text-muted-foreground font-medium">{timeAgo}</span>
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-xs font-semibold text-muted-foreground hover:underline"
              >
                Trả lời
              </button>
              
              {canDelete && (
                <button
                  onClick={onDelete}
                  className="text-xs font-semibold text-red-500 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Xóa
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
              onDelete={() => {
                // Xóa reply khỏi local state
                setThreadComments((prev) => prev.filter((c) => c._id !== reply._id));
                // Gọi callback để update parent state (nếu cần)
                onDelete(reply._id, comment._id);
              }}
              onReply={onReply}
              canDelete={reply.canDelete}
              boardId={boardId}
              cardId={cardId}
            />
          ))}
        </>
      )}

      {/* Reply Input */}
      {showReplyInput && (
        <div className="ml-11 mt-2">
          <CommentInput
            onSubmit={handleReplySubmit}
            placeholder="Viết câu trả lời..."
            replyTo={comment._id}
          />
        </div>
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
    </div>
  );
}

export default CommentItem;
