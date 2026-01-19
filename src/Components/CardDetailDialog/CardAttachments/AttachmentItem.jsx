import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Download, ExternalLink, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

import { formatFileSize, getFileTypeLabel, isPreviewableImage } from "@/helpers/attachment";
import { UserToast } from "@/context/ToastContext";
import { attachmentsApi } from "@/api/attachments";
import { getFileIcon } from "@/helpers/fileIcon";
import { downloadFile } from "@/utils/download";
import { useBoardDetailStore } from "@/store";
import { usePermissions } from "@/hooks";
import { Button } from "@/Components/UI";
import { useApiMutation } from "@/hooks";

function AttachmentItem({ boardId, cardId, attachment, onDeleteSuccess }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const FileIcon = getFileIcon(attachment.type);
  const isImage = isPreviewableImage(attachment.type);

  const { addToast } = UserToast();

  const currentBoard = useBoardDetailStore((s) => s.currentBoard);
  // Check can delete attachment
  const { canDelete } = usePermissions({ board: currentBoard, entity: {
    ownerId: attachment.uploaded_by,
  } });
  
  const timeAgo = formatDistanceToNow(new Date(attachment.created_at), {
    addSuffix: true,
    locale: vi,
  });

  // Delete attachment
  const { mutate: deleteAttachment, isLoading: isDeleting } = useApiMutation(
    () => attachmentsApi.deleteAttachment(boardId, cardId, attachment._id),
    () => {
      if (onDeleteSuccess) {
        onDeleteSuccess(attachment._id);
      }
    },
    {
      successMessage: "Xóa tệp đính kèm thành công",
    }
  );

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
            onClick={deleteAttachment}
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
