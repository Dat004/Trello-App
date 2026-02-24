import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Download, ExternalLink, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/Components/UI";
import { UserToast } from "@/context/ToastContext";
import { useDeleteAttachment } from "@/features/boards/api/useCardData";
import { useBoardAccess } from "@/features/boards/components/BoardAccessGuard";
import { formatFileSize, getFileTypeLabel, isPreviewableImage } from "@/helpers/attachment";
import { getFileIcon } from "@/helpers/fileIcon";
import { usePermissions } from "@/hooks";
import { downloadFile } from "@/utils/download";

function AttachmentItem({ boardId, cardId, attachment, onDeleteSuccess }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const FileIcon = getFileIcon(attachment.type);
  const isImage = isPreviewableImage(attachment.type);

  const { addToast } = UserToast();

  const { board: currentBoard } = useBoardAccess();
  // Check can delete attachment
  const { canDelete } = usePermissions({ board: currentBoard, entity: {
    ownerId: attachment.uploaded_by,
  } });
  
  const timeAgo = formatDistanceToNow(new Date(attachment.created_at), {
    addSuffix: true,
    locale: vi,
  });

  // Delete attachment (converted to React Query Hook)
  // Toast handled inside useDeleteAttachment hook
  const { mutateAsync: deleteAttachmentAsync, isLoading: isDeleting } = useDeleteAttachment();

  const handleDelete = async () => {
     try {
         await deleteAttachmentAsync({ boardId, cardId, attachmentId: attachment._id });
         // Toast handled by hook
         if (onDeleteSuccess) onDeleteSuccess(attachment._id);
     } catch (err) {
         // Toast handled by hook
     }
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    const isDownload = await downloadFile(attachment.url, attachment.name);
    if (!isDownload) {
      addToast({
        type: "error",
        title: "Có lỗi xảy ra. Vui lòng thử lại",
      })
    }

    setIsDownloading(false);
  };

  return (
    <div className="group flex gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      {/* Thumbnail / Icon */}
      <div className="shrink-0">
        {isImage ? (
          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
            <img 
              src={attachment.url} 
              alt={attachment.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
            <FileIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate" title={attachment.name}>
            {attachment.name}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
            {getFileTypeLabel(attachment.type)}
          </span>
        </div>

        {attachment.message && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {attachment.message}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatFileSize(attachment.size)}</span>
          <span>•</span>
          <span>{attachment.uploaded_by?.full_name}</span>
          <span>•</span>
          <span>{timeAgo}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Xem chi tiết">
          <a href={attachment.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleDownload}
          disabled={isDownloading}
          title="Tải về"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Xóa đính kèm"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default AttachmentItem;
