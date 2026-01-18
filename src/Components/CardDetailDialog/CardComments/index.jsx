import { MessageSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { commentsApi } from "@/api/comments";
import { Button, Label } from "@/Components/UI";
import { resolvePermissions } from "@/helpers/permission";
import { useApiMutation } from "@/hooks";
import { useAuthStore, useWorkspaceStore } from "@/store";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

function CardComments({ card, boardId, board }) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextSkip, setNextSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const workspaces = useWorkspaceStore((s) => s.workspaces);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      const response = await commentsApi.getCommentsByCardId(boardId, card._id);
      if (response.data.success) {
        const { comments: fetchedComments, hasMore: more, nextSkip: skip, total: totalCount } = response.data.data;
        setComments(fetchedComments);
        setHasMore(more);
        setNextSkip(skip);
        setTotal(totalCount);
      }
    };

    fetchComments();
  }, [boardId, card._id]);

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
    const limit = 10;
    const skip = nextSkip;

    setIsLoadingMore(true);
    
    const response = await commentsApi.getCommentsByCardId(boardId, card._id, limit, skip);
    if (response.data.success) {
      const { comments: moreComments, hasMore: more, nextSkip: skip } = response.data.data;
      setComments((prev) => [...prev, ...moreComments]);
      setHasMore(more);
      setNextSkip(skip);
    }

    setIsLoadingMore(false);
  };

  // Add comment
  const { mutate: addComment, isLoading: isAdding } = useApiMutation(
    (data) => commentsApi.addComment(boardId, card._id, data),
    (responseData) => {
      setComments((prev) => [responseData.comment, ...prev]);
      setTotal((prev) => prev + 1);
    },
    {
      successMessage: "Đã thêm bình luận",
    }
  );

  // Delete comment
  const { mutate: deleteComment } = useApiMutation(
    (commentId) => commentsApi.deleteComment(boardId, card._id, commentId),
  );

  const handleAddComment = (data) => {
    addComment(data);
  };

  const handleReply = (data) => {
    addComment(data, {
      onSuccess: (responseData) => {
        // Update reply count for the parent comment
        if (data.parent_comment) {
          setComments((prev) =>
            prev.map((c) =>
              c._id === data.parent_comment
                ? { ...c, reply_count: (c.reply_count || 0) + 1 }
                : c
            )
          );
        }
      },
    });
  };

  const handleDeleteComment = async (commentId, parentCommentId) => {
    const res = await deleteComment(commentId);

    if (res.success) {
      // If it's a root comment, remove from list
      if (!parentCommentId) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        setTotal((prev) => prev - 1);
      } else {
        // If it's a reply, update parent's reply count
        setComments((prev) =>
          prev.map((c) =>
            c._id === parentCommentId
              ? { ...c, reply_count: Math.max((c.reply_count || 1) - 1, 0) }
              : c
          )
        );
      }
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
              onDelete={() => handleDeleteComment(comment._id)}
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
