import { useAuthStore } from "@/store";

export const getCurrentUserId = () => {
  const { user } = useAuthStore.getState();
  return user?._id;
};

export const getMyRole = (members) => {
  if (!members || !Array.isArray(members)) return null;

  const userId = getCurrentUserId();
  if (!userId) return null;

  const member = members.find((m) => m.user === userId || m.user?._id === userId);
  return member ? member.role : null;
};

export const getRoleText = (role) => {
  switch (role) {
    case "admin":
      return "Quản trị";
    case "member":
      return "Thành viên";
    case "viewer":
      return "Người xem";
    default:
      return "Thành viên";
  }
};

export const getRoleVariant = (role) => {
  switch (role) {
    case "admin":
      return "default";
    case "member":
      return "secondary";
    case "viewer":
      return "outline";
    default:
      return "destructive";
  }
}