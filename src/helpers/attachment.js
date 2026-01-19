export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// Format file size
export const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Get file type label
export const getFileTypeLabel = (type) => {
    if (type.startsWith("image/")) return "Hình ảnh";
    if (type.startsWith("video/")) return "Video";
    if (type.startsWith("audio/")) return "Âm thanh";
    if (type.includes("pdf")) return "PDF";
    if (type.includes("spreadsheet") || type.includes("excel")) return "Bảng tính";
    if (type.includes("document") || type.includes("word")) return "Tài liệu";
    if (type.includes("zip") || type.includes("rar") || type.includes("archive")) return "Nén";
    return "Tệp";
};

// Check if file is previewable image
export const isPreviewableImage = (type) => {
    return type.startsWith("image/");
};
