import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Paperclip } from "lucide-react";
import { useMemo, useState } from "react";

import { Button, Label } from "@/Components/UI";
import { CARD_KEYS, useCardAttachments } from "@/features/boards/api/useCardData";
import { useBoardAccess } from "../../../BoardAccessGuard";
import AttachmentItem from "./AttachmentItem";
import UploadForm from "./UploadForm";

function CardAttachments({ card, boardId }) {
  const queryClient = useQueryClient();
  const { readOnly } = useBoardAccess();
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  // Fetch attachments via React Query
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useCardAttachments(boardId, card._id);

  const attachments = useMemo(() => 
    data?.pages.flatMap((page) => page.data?.attachments || []) || [], 
    [data]
  );

  const total = data?.pages[0]?.data?.total || 0;

  // Handlers
  const handleLoadMore = () => {
    fetchNextPage();
  };

  const handleDeleteSuccess = (attachmentId) => {
    // Invalidate to refresh list and total count
    queryClient.invalidateQueries(CARD_KEYS.attachments(card._id));
  };

  const handleUploadSuccess = (newAttachment) => {
    queryClient.invalidateQueries(CARD_KEYS.attachments(card._id));
    setShowUploadForm(false);
  };

  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Paperclip className="h-4 w-4" />
          Đính kèm
          {total > 0 && (
            <span className="text-muted-foreground">({total})</span>
          )}
        </Label>
        {!readOnly && !showUploadForm && (
          <Button variant="outline" size="sm" onClick={() => setShowUploadForm(true)}>
            Thêm tệp
          </Button>
        )}
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <UploadForm
          boardId={boardId}
          cardId={card._id}
          onUploadSuccess={handleUploadSuccess}
          onCancel={() => setShowUploadForm(false)}
        />
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <AttachmentItem
              key={attachment._id}
              boardId={boardId}
              cardId={card._id}
              attachment={attachment}
              onDeleteSuccess={handleDeleteSuccess}
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
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Đang tải...
                  </div>
                ) : (
                  "Xem thêm"
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        !showUploadForm && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có tệp đính kèm nào
          </p>
        )
      )}
    </div>
  );
}

export default CardAttachments;
