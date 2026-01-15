const DATE_OPTIONS = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

const TIME_OPTIONS = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false, // 24h format
};

const DATE_TIME_OPTIONS = { ...DATE_OPTIONS, ...TIME_OPTIONS };

export function formatRelativeTime(dateInput) {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  const now = new Date();
  const diffInMs = now - date;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Việt Nam UTC+7
  const localHour = date.getUTCHours() + 7;
  const displayHour = localHour >= 24 ? localHour - 24 : localHour;

  if (diffInSeconds < 60) {
    return "Vừa xong";
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }
  if (diffInDays === 1) {
    return `Hôm qua lúc ${displayHour.toString().padStart(2, "0")}:${date
      .getUTCMinutes()
      .toString()
      .padStart(2, "0")}`;
  }
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  // Hơn 7 ngày thì hiển thị ngày tháng đầy đủ
  return date.toLocaleDateString("vi-VN", DATE_TIME_OPTIONS);
}

export function formatDateOnly(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  return date.toLocaleDateString("vi-VN", DATE_OPTIONS);
}

export function formatTimeOnly(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  const localHour = date.getUTCHours() + 7;
  const displayHour = localHour >= 24 ? localHour - 24 : localHour;
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${displayHour.toString().padStart(2, "0")}:${minutes}`;
}

export const formatDueDate = (date) => {
  if (!date) return null;
  const targetDate = new Date(date);
  const now = new Date();

  // Reset giờ về 0
  const today = new Date(now.setHours(0, 0, 0, 0));
  const target = new Date(targetDate.setHours(0, 0, 0, 0));

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: "Quá hạn", color: "destructive" };
  if (diffDays === 0) return { text: "Hôm nay", color: "warning" };
  if (diffDays === 1) return { text: "Ngày mai", color: "secondary" };
  if (diffDays <= 3) return { text: `${diffDays} ngày nữa`, color: "default" };

  return {
    text: targetDate.toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
    }),
    color: "default",
  };
};

export const toDateInputValue = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toISOString().split("T")[0];
}
