import { Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { formatFileSize, getFileTypeLabel, isPreviewableImage } from "@/helpers/attachment";
import { getAcceptByIntent, UPLOAD_INTENT, validateFileByIntent } from "@/lib/file";
import { uploadService } from "@/services/uploadService";
import { attachmentsApi } from "@/api/attachments";
import { UserToast } from "@/context/ToastContext";
import { getFileIcon } from "@/helpers/fileIcon";
import { Button, Input } from "@/Components/UI";
import { useApiMutation } from "@/hooks";

function UploadForm({ boardId, cardId, onUploadSuccess, onCancel }) {
  const { addToast, removeToast } = UserToast();
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingCloudinary, setIsUploadingCloudinary] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Save attachment to DB
  const { mutate: addAttachment, isLoading: isSaving } = useApiMutation(
    (data) => attachmentsApi.addAttachment(boardId, cardId, data),
    (response) => {
      onUploadSuccess(response.attachment);
      setSelectedFile(null);
      setMessage("");
    }
  );

  const handleFileSelect = (file) => {
    setError("");
    const validationError = validateFileByIntent(file, UPLOAD_INTENT.CARD_ATTACHMENTS);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile || isUploadingCloudinary || isSaving) return;

    setIsUploadingCloudinary(true);
    const toastId = addToast({
      type: "loading",
      title: "Đang tải tệp lên...",
    });

    try {
      // 1. Upload lên Cloudinary
      const result = await uploadService.upload(selectedFile, UPLOAD_INTENT.CARD_ATTACHMENTS);
      
      if (result.error) {
        addToast({
          type: "error",
          title: "Upload tệp thất bại",
        });
        return;
      }

      // 2. Lưu metadata vào DB
      const attachmentData = {
        name: selectedFile.name,
        url: result.secure_url,
        public_id: result.public_id,
        size: selectedFile.size,
        type: selectedFile.type,
        resource_type: result.resource_type,
        message: message.trim(),
      };

      await addAttachment(attachmentData);
    } catch (err) {
      console.error("Upload error:", err);
      addToast({
        type: "error",
        title: "Có lỗi xảy ra khi upload",
      });
    } finally {
      removeToast(toastId);
      setIsUploadingCloudinary(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isProcessing = isUploadingCloudinary || isSaving;
  const FileIcon = selectedFile ? getFileIcon(selectedFile.type) : null;

  return (
    <div className="border-2 border-dashed rounded-lg p-4 space-y-4">
      {/* Drag & Drop Zone */}
      {!selectedFile ? (
        <div
          className={`
            flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-md cursor-pointer
            transition-colors
            ${isDragging ? "bg-primary/10 border-primary" : "bg-muted/30 hover:bg-muted/50"}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <Upload className={`h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          <div className="text-center">
            <p className="text-sm font-medium">
              Kéo thả file vào đây hoặc <span className="text-primary">chọn file</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Hỗ trợ mọi định dạng, tối đa 20MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleInputChange}
            accept={getAcceptByIntent(UPLOAD_INTENT.CARD_ATTACHMENTS)}
            disabled={isProcessing}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center shrink-0">
            {isPreviewableImage(selectedFile.type) ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt={selectedFile.name}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              FileIcon && <FileIcon className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(selectedFile.size)} • {getFileTypeLabel(selectedFile.type)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleRemoveFile}
            disabled={isProcessing}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive font-medium">{error}</p>}

      {selectedFile && (
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Thêm lời nhắn (tùy chọn)..."
          className="rounded-full"
          disabled={isProcessing}
        />
      )}

      <div className="flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          disabled={isProcessing}
        >
          Hủy
        </Button>
        <Button 
          size="sm" 
          onClick={handleSubmit} 
          disabled={!selectedFile || isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Tải lên
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default UploadForm;
