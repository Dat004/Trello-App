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
