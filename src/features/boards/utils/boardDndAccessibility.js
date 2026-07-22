function getItemLabel(active) {
  const data = active?.data?.current;
  if (!data) return "mục";
  const title = data.title ? ` ${data.title}` : "";
  if (data.type === "list") {
    return `danh sách${title}`.trim();
  }
  if (data.type === "card") {
    return `thẻ${title}`.trim();
  }
  return "mục";
}

function getOverLabel(over) {
  if (!over) return null;
  const data = over.data?.current;
  if (!data) return "vị trí mới";
  const title = data.title ? ` ${data.title}` : "";
  if (data.type === "list") {
    return `danh sách${title}`.trim();
  }
  if (data.type === "card") {
    return `thẻ${title}`.trim();
  }
  if (data.type === "card-container") {
    return `cột${title || (data.listId ? ` ${data.listId}` : "")}`.trim();
  }
  return "vị trí mới";
}

export const boardDndAnnouncements = {
  onDragStart({ active }) {
    return `Bắt đầu kéo ${getItemLabel(active)}. Dùng mũi tên để di chuyển, thả để đặt, Escape để hủy.`;
  },
  onDragOver({ active, over }) {
    const overLabel = getOverLabel(over);
    if (!overLabel) {
      return `${getItemLabel(active)} đang được kéo.`;
    }
    return `${getItemLabel(active)} đang ở trên ${overLabel}.`;
  },
  onDragEnd({ active, over }) {
    const overLabel = getOverLabel(over);
    if (!overLabel) {
      return `Đã thả ${getItemLabel(active)}.`;
    }
    return `Đã đặt ${getItemLabel(active)} vào ${overLabel}.`;
  },
  onDragCancel({ active }) {
    return `Đã hủy kéo ${getItemLabel(active)}.`;
  },
};

export const boardDndScreenReaderInstructions = {
  draggable: `
    Để lấy một mục có thể kéo, nhấn phím cách hoặc Enter.
    Khi đang kéo, dùng các phím mũi tên để di chuyển mục.
    Nhấn phím cách hoặc Enter lần nữa để thả mục vào vị trí mới,
    hoặc nhấn Escape để hủy.
  `.trim(),
};
