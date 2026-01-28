import {
    File,
    FileArchive,
    FileAudio,
    FileImage,
    FileSpreadsheet,
    FileText,
    FileVideo,
    Briefcase,
    Users,
    Code,
    Heart,
    Zap,
    Calendar,
    Target,
    BookOpen,
    Rocket,
    Coffee,
} from "lucide-react";

// Get file icon based on MIME type
export const getFileIcon = (type) => {
    if (!type) return File;
    if (type.includes("image/")) return FileImage;
    if (type.includes("video/")) return FileVideo;
    if (type.includes("audio/")) return FileAudio;
    if (type.includes("pdf") || type.includes("document") || type.includes("text")) return FileText;
    if (type.includes("spreadsheet") || type.includes("excel")) return FileSpreadsheet;
    if (type.includes("zip") || type.includes("rar") || type.includes("archive")) return FileArchive;
    return File;
};

export const getCategoryIcon = {
  "project-management": Briefcase,
  "development": Code,
  "marketing": Target,
  "personal": Heart,
  "team": Coffee,
  "event": Calendar,
  "product": Rocket,
  "content": BookOpen,
  "hr": Users,
};