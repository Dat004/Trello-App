import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";

import { commentsApi } from "@/api/comments";
import { Button, Label } from "@/Components/UI";
import { CARD_KEYS, useCardComments } from "@/features/boards/api/useCardData";
import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { useWorkspacesList } from "@/features/workspaces/api/useWorkspacesList";
import { resolvePermissions } from "@/helpers/permission";
import { useAuthStore } from "@/store";
import { useBoardAccess } from "../../../BoardAccessGuard";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

function CardComments({ card, boardId, board }) {
  const { user } = useAuthStore();
  const { data: workspaces = [] } = useWorkspacesList();
  const queryClient = useQueryClient();

  // Board Context for updating card comment_count
  const { updateCard } = useBoardContext();
  const { readOnly } = useBoardAccess();
  
  const [isAdding, setIsAdding] = useState(false);

  // Use React Query for fetching comments
  const { 
      data, 
      fetchNextPage, 
      hasNextPage, 
      isFetchingNextPage,
      isLoading: isInitialLoading
  } = useCardComments(boardId, card._id);

  // Flatten comments from infinite query pages
  const comments = useMemo(() => {
      return data?.pages.flatMap((page) => page.data.comments) || [];
  }, [data]);

  const total = data?.pages[0]?.data?.total || 0;

  // Apply permissions to comments
  const commentsWithPermissions = useMemo(() => {
    if (!user || !board) return comments;
    
    // Find workspace object from React Query cache list
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

  // Calculate strict Admin/Owner rights for Threads
  const isAdminOrOwner = useMemo(() => {
        if (!user || !board) return false;
        
        const currentUserId = user._id.toString();

        // Check Board Owner
        const boardOwnerId = (board.owner._id || board.owner).toString();
        if (boardOwnerId === currentUserId) return true;
        
        // Check Workspace Rights
        if (board.workspace) {
            const workspace = workspaces.find((w) => w._id.toString() === board.workspace.toString());
            if (workspace) {
                 const wsOwnerId = (workspace.owner._id || workspace.owner).toString();
                 if (wsOwnerId === currentUserId) return true;
            }
        }
        return false;
  }, [board, user, workspaces]);

  // Load more comments
  const handleLoadMore = () => {
    fetchNextPage();
  };

  // Add new comment
  const handleAddComment = async (content) => {
    setIsAdding(true);
    try {
      const response = await commentsApi.addComment(boardId, card._id, content);
      if (response.data.success) {
        // Invalidate query to refetch list
        queryClient.invalidateQueries(CARD_KEYS.comments(card._id));
        
        // Update card's comment_count locally
        const currentCount = card.comment_count || 0;
        updateCard(card._id, { comment_count: currentCount + 1 });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // Reply to comment (Recursively add comment)
  const handleReply = async (content) => {
      await handleAddComment(content);
  };

  // Delete comment
  const { mutateAsync: deleteCommentAsync } = useMutation({
      mutationFn: ({ commentId }) => commentsApi.deleteComment(boardId, card._id, commentId),
      onSuccess: () => {
        queryClient.invalidateQueries(CARD_KEYS.comments(card._id));
        // Update card's comment_count
        const currentCount = card.comment_count || 0;
        updateCard(card._id, { comment_count: Math.max(0, currentCount - 1) });
      },
      onError: (error) => {
        console.error("Error deleting comment:", error);
      }
  });

  const handleDeleteComment = async (commentId, parentCommentId) => {
      await deleteCommentAsync({ commentId });
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
      {!readOnly && (
        <CommentInput cardId={card._id} user={user} onSubmit={handleAddComment} isLoading={isAdding} />
      )}

      {/* Loading Initial */}
      {isInitialLoading ? (
          <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
      ) : (
          /* Comments List */
          commentsWithPermissions.length > 0 ? (
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
                  userId={user?._id}
                  isAdminOrOwner={isAdminOrOwner}
                />
              ))}

              {/* Load More Button */}
              {hasNextPage && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Đang tải..." : "Xem thêm bình luận"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có bình luận nào
            </p>
          )
      )}
    </div>
  );
}

export default CardComments;
