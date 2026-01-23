import { MessageSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { commentsApi } from "@/api/comments";
import { Button, Label } from "@/Components/UI";
import { resolvePermissions } from "@/helpers/permission";
import { useAuthStore, useBoardDetailStore, useCommentsStore, useWorkspaceStore } from "@/store";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

function CardComments({ card, boardId, board }) {
  const { user } = useAuthStore();
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  
  // Comments Store
  const {
    total,
    hasMore,
    nextSkip,
    comments,
    initComments,
    appendComments,
    addComment: addCommentToStore,
    deleteComment: deleteCommentFromStore,
    reset: resetComments,
  } = useCommentsStore();
  const updateCommentCount = useBoardDetailStore((state) => state.addCommentFromSocket);
  const decrementCommentCount = useBoardDetailStore((state) => state.removeCommentFromSocket);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      const response = await commentsApi.getCommentsByCardId(boardId, card._id);
      if (response.data.success) {
        initComments(response.data.data);
      }
    };

    fetchComments();

    // Cleanup on unmount
    return () => resetComments();
  }, [boardId, card._id, initComments, resetComments]);

  // Apply permissions to comments
  const commentsWithPermissions = useMemo(() => {
    if (!user || !board) return comments;
    
    const workspace = board.workspace
      ? workspaces.find((w) => w._id.toString() === board.workspace.toString())
      : null;

    return comments.map((comment) => {
      const { canDelete } = resolvePermissions({
        userId: user._id.toString(),
        workspace,
        board,
        entity: { ownerId: comment.author?._id },
      });
      return { ...comment, canDelete };
    });
  }, [comments, board, user, workspaces]);

  // Load more comments
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    
    const response = await commentsApi.getCommentsByCardId(boardId, card._id, 10, nextSkip);
    if (response.data.success) {
      appendComments(response.data.data);
    }

    setIsLoadingMore(false);
  };

  // Add new comment
  const handleAddComment = async (data) => {
    setIsAdding(true);
    try {
      const response = await commentsApi.addComment(boardId, card._id, data);
      if (response.data.success) {
        addCommentToStore(response.data.data.comment);
        updateCommentCount(card._id);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // Reply to comment
  const handleReply = async (data) => {
    try {
      const response = await commentsApi.addComment(boardId, card._id, data);
      if (response.data.success) {
        addCommentToStore(response.data.data.comment);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId, parentCommentId) => {
    try {
      const response = await commentsApi.deleteComment(boardId, card._id, commentId);
      if (response.data.success) {
        deleteCommentFromStore(commentId, parentCommentId);
        decrementCommentCount(card._id);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Bình luận
          {total > 0 && (
            <span className="text-muted-foreground">({total})</span>
          )}
        </Label>
      </div>

      {/* Add Comment */}
      <CommentInput onSubmit={handleAddComment} isLoading={isAdding} />

      {/* Comments List */}
      {commentsWithPermissions.length > 0 ? (
        <div className="space-y-1">
          {commentsWithPermissions.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onReply={handleReply}
              canDelete={comment.canDelete}
              onDelete={handleDeleteComment}
              boardId={boardId}
              cardId={card._id}
            />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Đang tải..." : "Xem thêm bình luận"}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Chưa có bình luận nào
        </p>
      )}
    </div>
  );
}

export default CardComments;
