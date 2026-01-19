import {
    File,
    FileArchive,
    FileAudio,
    FileImage,
    FileSpreadsheet,
    FileText,
    FileVideo,
} from "lucide-react";

// Get file icon based on MIME type
export const getFileIcon = (type) => {
    if (type.startsWith("image/")) return FileImage;
    if (type.startsWith("video/")) return FileVideo;
    if (type.startsWith("audio/")) return FileAudio;
    if (type.includes("pdf") || type.includes("document") || type.includes("text")) return FileText;
    if (type.includes("spreadsheet") || type.includes("excel")) return FileSpreadsheet;
    if (type.includes("zip") || type.includes("rar") || type.includes("archive")) return FileArchive;
    return File;
};
