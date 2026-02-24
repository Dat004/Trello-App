import { Bell, Calendar, MessageSquare, Settings, Trello, User, UserPlus } from "lucide-react";

export const getNotificationIcon = (type) => {
  switch (type) {
    case "mention": return User;
    case "assignment":
    case "card_member_assigned":
      return Trello;
    case "comment":
    case "comment_created":
      return MessageSquare;
    case "invitation":
    case "workspace_invitation":
      return UserPlus;
    case "due_date":
    case "card_due_soon":
      return Calendar;
    case "board_update": return Settings;
    default: return Bell;
  }
};

export const getNotificationIconColor = (type) => {
  switch (type) {
    case "mention": return "text-blue-500";
    case "assignment":
    case "card_member_assigned":
      return "text-green-500";
    case "comment":
    case "comment_created":
      return "text-purple-500";
    case "invitation":
    case "workspace_invitation":
      return "text-orange-500";
    case "due_date":
    case "card_due_soon":
      return "text-red-500";
    case "board_update": return "text-gray-500";
    default: return "text-gray-500";
  }
};
