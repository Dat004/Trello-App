export const UPLOAD_INTENT = {
  AVATAR: "avatar",
  CARD_COMMENTS: "card_comments",
  CARD_ATTACHMENTS: "card_attachment",
};

export const FILE_RULES = {
  [UPLOAD_INTENT.AVATAR]: {
    maxSize: 2 * 1024 * 1024, // 2MB
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    label: "Ảnh đại diện",
  },

  [UPLOAD_INTENT.CARD_COMMENTS]: {
    maxSize: 20 * 1024 * 1024, // 20MB
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    label: "Tệp đính kèm",
  },

  [UPLOAD_INTENT.CARD_ATTACHMENTS]: {
    maxSize: 20 * 1024 * 1024, // 20MB
    mimeTypes: "*",
    label: "Tệp trong thẻ",
  },
};

// Convert bytes → MB để hiển thị
const bytesToMB = (bytes) => Math.round((bytes / 1024 / 1024) * 10) / 10;

// Validate file theo intent
export const validateFileByIntent = (file, intent) => {
  if (!file) return "Không tìm thấy FILE được tải lên";

  const rule = FILE_RULES[intent];
  if (!rule) return "Không xác định được loại upload";

  // Check size
  if (file.size > rule.maxSize) {
    return `${rule.label} vượt quá ${bytesToMB(rule.maxSize)}MB`;
  }

  // Check MIME type
  if (!rule.mimeTypes.includes(file.type)) {
    return `${rule.label} không đúng định dạng cho phép`;
  }

  return null;
};

// Helper: format accept cho <input type="file" />
export const getAcceptByIntent = (intent) => {
  const rule = FILE_RULES[intent];
  if (!rule) return "";
  return rule === "*" ? rule : rule.mimeTypes.join(",");
};
