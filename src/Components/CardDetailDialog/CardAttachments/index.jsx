import { Paperclip } from "lucide-react";
import { useEffect, useState } from "react";

import { attachmentsApi } from "@/api/attachments";
import { Button, Label } from "@/Components/UI";
import AttachmentItem from "./AttachmentItem";
import UploadForm from "./UploadForm";

function CardAttachments({ card, boardId }) {
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  // Pagination state
  const [hasMore, setHasMore] = useState(false);
  const [nextSkip, setNextSkip] = useState(0);
  const [total, setTotal] = useState(0);

  // Fetch attachments
  useEffect(() => {
    const fetchAttachments = async () => {
      setIsLoading(true);
      try {
        const response = await attachmentsApi.getAttachmentsByCardId(boardId, card._id);
        if (response?.data?.success) {
          const { attachments: data, hasMore: more, nextSkip: skip, total: count } = response.data.data;
          setAttachments(data || []);
          setHasMore(more || false);
          setNextSkip(skip || 0);
          setTotal(count || 0);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tệp đính kèm:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttachments();
  }, [boardId, card._id]);

  // Load more attachments
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const response = await attachmentsApi.getAttachmentsByCardId(boardId, card._id, 10, nextSkip);
      if (response?.data?.success) {
        const { attachments: data, hasMore: more, nextSkip: skip } = response.data.data;
        setAttachments((prev) => [...prev, ...(data || [])]);
        setHasMore(more || false);
        setNextSkip(skip || 0);
      }
    } catch (error) {
      console.error("Lỗi khi tải thêm tệp đính kèm:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleDeleteSuccess = (attachmentId) => {
    setAttachments((prev) => prev.filter((a) => a._id !== attachmentId));
    setTotal((prev) => Math.max(prev - 1, 0));
  };

  const handleUploadSuccess = (newAttachment) => {
    setAttachments((prev) => [newAttachment, ...prev]);
    setTotal((prev) => prev + 1);
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
        {!showUploadForm && (
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
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
