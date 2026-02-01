import {
    Archive,
    ArchiveRestore,
    ArrowRightLeft,
    ArrowUpDown,
    // Workspace icons
    Building2,
    // Join request icons
    CheckCircle,
    Edit3,
    FileEdit,
    FileX,
    FolderMinus,
    // Board icons
    Layout,
    LayoutGrid,
    ListPlus,
    ListX,
    MessageCircle,
    // Comment icons
    MessageSquare,
    MoveHorizontal,
    Shield,
    // Card icons
    Square,
    Trash2,
    Upload,
    UserCog,
    UserMinus,
    // Member icons
    UserPlus,
    XCircle
} from "lucide-react";

// Định nghĩa các action của activity
export const ACTIVITY_ACTIONS = {
    // Workspace actions
    WORKSPACE_CREATED: 'workspace_created',
    WORKSPACE_UPDATED: 'workspace_updated',
    WORKSPACE_DELETED: 'workspace_deleted',

    // Board actions
    BOARD_CREATED: 'board_created',
    BOARD_UPDATED: 'board_updated',
    BOARD_DELETED: 'board_deleted',
    BOARD_ARCHIVED: 'board_archived',
    BOARD_RESTORED: 'board_restored',
    BOARD_MOVED_TO_WORKSPACE: 'board_moved_to_workspace',
    BOARD_REMOVED_FROM_WORKSPACE: 'board_removed_from_workspace',

    // Member actions
    MEMBER_ADDED: 'member_added',
    MEMBER_REMOVED: 'member_removed',
    MEMBER_ROLE_CHANGED: 'member_role_changed',

    // Permission actions
    PERMISSION_CHANGED: 'permission_changed',

    // Join request actions
    JOIN_REQUEST_APPROVED: 'join_request_approved',
    JOIN_REQUEST_REJECTED: 'join_request_rejected',

    // List actions
    LIST_CREATED: 'list_created',
    LIST_UPDATED: 'list_updated',
    LIST_DELETED: 'list_deleted',
    LIST_MOVED: 'list_moved',

    // Card actions
    CARD_CREATED: 'card_created',
    CARD_UPDATED: 'card_updated',
    CARD_DELETED: 'card_deleted',
    CARD_MOVED: 'card_moved',
    CARD_ARCHIVED: 'card_archived',
    CARD_RESTORED: 'card_restored',

    // Comment actions
    COMMENT_CREATED: 'comment_created',
    COMMENT_UPDATED: 'comment_updated',
    COMMENT_DELETED: 'comment_deleted',

    // Attachment actions
    ATTACHMENT_UPLOADED: 'attachment_uploaded',
    ATTACHMENT_DELETED: 'attachment_deleted',
};

// Định nghĩa icon và color cho từng action
export const ACTIVITY_CONFIG = {
    // Workspace actions
    [ACTIVITY_ACTIONS.WORKSPACE_CREATED]: {
        icon: Building2,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        label: "Tạo workspace"
    },
    [ACTIVITY_ACTIONS.WORKSPACE_UPDATED]: {
        icon: Edit3,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        label: "Cập nhật workspace"
    },
    [ACTIVITY_ACTIONS.WORKSPACE_DELETED]: {
        icon: Trash2,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950",
        label: "Xóa workspace"
    },

    // Board actions
    [ACTIVITY_ACTIONS.BOARD_CREATED]: {
        icon: LayoutGrid,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        label: "Tạo bảng"
    },
    [ACTIVITY_ACTIONS.BOARD_UPDATED]: {
        icon: Edit3,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        label: "Cập nhật bảng"
    },
    [ACTIVITY_ACTIONS.BOARD_DELETED]: {
        icon: Trash2,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950",
        label: "Xóa bảng"
    },
    [ACTIVITY_ACTIONS.BOARD_ARCHIVED]: {
        icon: Archive,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950",
        label: "Lưu trữ bảng"
    },
    [ACTIVITY_ACTIONS.BOARD_RESTORED]: {
        icon: ArchiveRestore,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        label: "Khôi phục bảng"
    },
    [ACTIVITY_ACTIONS.BOARD_MOVED_TO_WORKSPACE]: {
        icon: ArrowRightLeft,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950",
        label: "Di chuyển bảng đến workspace"
    },
    [ACTIVITY_ACTIONS.BOARD_REMOVED_FROM_WORKSPACE]: {
        icon: FolderMinus,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950",
        label: "Xóa bảng khỏi workspace"
    },

    // Member actions
    [ACTIVITY_ACTIONS.MEMBER_ADDED]: {
        icon: UserPlus,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        label: "Thêm thành viên"
    },
    [ACTIVITY_ACTIONS.MEMBER_REMOVED]: {
        icon: UserMinus,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950",
        label: "Xóa thành viên"
    },
    [ACTIVITY_ACTIONS.MEMBER_ROLE_CHANGED]: {
        icon: UserCog,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        label: "Thay đổi vai trò"
    },

    // Permission actions
    [ACTIVITY_ACTIONS.PERMISSION_CHANGED]: {
        icon: Shield,
        color: "text-amber-600",
        bgColor: "bg-amber-50 dark:bg-amber-950",
        label: "Thay đổi quyền"
    },

    // Join request actions
    [ACTIVITY_ACTIONS.JOIN_REQUEST_APPROVED]: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        label: "Chấp nhận yêu cầu"
    },
    [ACTIVITY_ACTIONS.JOIN_REQUEST_REJECTED]: {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950",
        label: "Từ chối yêu cầu"
    },

    // List actions
    [ACTIVITY_ACTIONS.LIST_CREATED]: {
        icon: ListPlus,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        label: "Tạo danh sách"
    },
    [ACTIVITY_ACTIONS.LIST_UPDATED]: {
        icon: Edit3,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        label: "Cập nhật danh sách"
    },
    [ACTIVITY_ACTIONS.LIST_DELETED]: {
        icon: ListX,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950",
        label: "Xóa danh sách"
    },
    [ACTIVITY_ACTIONS.LIST_MOVED]: {
        icon: ArrowUpDown,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950",
        label: "Di chuyển danh sách"
    },

    // Card actions
    [ACTIVITY_ACTIONS.CARD_CREATED]: {
        icon: Square,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        label: "Tạo thẻ"
    },
    [ACTIVITY_ACTIONS.CARD_UPDATED]: {
        icon: FileEdit,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        label: "Cập nhật thẻ"
    },
    [ACTIVITY_ACTIONS.CARD_DELETED]: {
        icon: FileX,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950",
        label: "Xóa thẻ"
    },
    [ACTIVITY_ACTIONS.CARD_MOVED]: {
        icon: MoveHorizontal,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950",
        label: "Di chuyển thẻ"
    },
    [ACTIVITY_ACTIONS.CARD_ARCHIVED]: {
        icon: Archive,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950",
        label: "Lưu trữ thẻ"
    },
    [ACTIVITY_ACTIONS.CARD_RESTORED]: {
        icon: ArchiveRestore,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        label: "Khôi phục thẻ"
    },

    // Comment actions
    [ACTIVITY_ACTIONS.COMMENT_CREATED]: {
        icon: MessageSquare,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        label: "Bình luận"
    },
    [ACTIVITY_ACTIONS.COMMENT_UPDATED]: {
        icon: MessageCircle,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        label: "Cập nhật bình luận"
    },
    [ACTIVITY_ACTIONS.COMMENT_DELETED]: {
        icon: Trash2,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950",
        label: "Xóa bình luận"
    },

    // Attachment actions
    [ACTIVITY_ACTIONS.ATTACHMENT_UPLOADED]: {
        icon: Upload,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        label: "Tải lên tệp đính kèm"
    },
    [ACTIVITY_ACTIONS.ATTACHMENT_DELETED]: {
        icon: Trash2,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950",
        label: "Xóa tệp đính kèm"
    },
};

// Lấy icon và color của activity
export const getActivityConfig = (action) => {
    return ACTIVITY_CONFIG[action] || {
        icon: Layout,
        color: "text-gray-600",
        bgColor: "bg-gray-50 dark:bg-gray-950",
        label: "Hoạt động khác"
    };
};
