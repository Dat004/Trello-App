import { ACTIVITY_ACTIONS } from "@/config/activityConfig";

// Định dạng message activity
export const formatActivityMessage = (activity) => {
    const { action, metadata, changes, actor } = activity;
    const actorName = actor?.full_name || "Người dùng";

    switch (action) {
        // ===== WORKSPACE =====
        case ACTIVITY_ACTIONS.WORKSPACE_CREATED:
            return `đã tạo workspace "${metadata.workspace_name}"`;

        case ACTIVITY_ACTIONS.WORKSPACE_UPDATED:
            const changeWorkspaceName = `. Thay đổi tên workspace từ "${changes?.name?.from}" thành "${changes?.name?.to}"`;
            const changeWorkspaceDescription = `. Thay đổi mô tả workspace từ "${changes?.description?.from}" thành "${changes?.description?.to}"`;
            const changeWorkspaceMaxMembers = `. Thay đổi số lượng thành viên tối đa từ "${changes?.max_members?.from}" thành "${changes?.max_members?.to}"`;
            const changeWorkspaceColor = `. Thay đổi màu sắc workspace từ "${changes?.color?.from}" thành "${changes?.color?.to}"`;
            const changeWorkspaceVisibility = `. Thay đổi quyền riêng tư workspace từ "${changes?.visibility?.from}" thành "${changes?.visibility?.to}"`;

            const changeMessage = `${changes.name ? changeWorkspaceName : ""} ${changes.description ? changeWorkspaceDescription : ""} ${changes.max_members ? changeWorkspaceMaxMembers : ""} ${changes.color ? changeWorkspaceColor : ""} ${changes.visibility ? changeWorkspaceVisibility : ""}`;

            return `đã cập nhật workspace "${metadata.workspace_name}"${changeMessage}`;

        case ACTIVITY_ACTIONS.WORKSPACE_DELETED:
            return `đã xóa workspace "${metadata.workspace_name}"`;

        // ===== BOARD =====
        case ACTIVITY_ACTIONS.BOARD_CREATED:
            return `đã tạo bảng "${metadata.board_title}"`;

        case ACTIVITY_ACTIONS.BOARD_UPDATED:
            const changeBoardTitle = `. Thay đổi tên bảng từ "${changes?.title?.from}" thành "${changes?.title?.to}"`;
            const changeBoardDescription = `. Thay đổi mô tả bảng từ "${changes?.description?.from}" thành "${changes?.description?.to}"`;
            const changeBoardColor = `. Thay đổi màu sắc bảng từ "${changes?.color?.from}" thành "${changes?.color?.to}"`;
            const changeBoardVisibility = `. Thay đổi quyền riêng tư bảng từ "${changes?.visibility?.from}" thành "${changes?.visibility?.to}"`;

            const changeBoardMessage = `${changes.title ? changeBoardTitle : ""} ${changes.description ? changeBoardDescription : ""} ${changes.color ? changeBoardColor : ""} ${changes.visibility ? changeBoardVisibility : ""}`;

            return `đã cập nhật bảng "${metadata.board_title}"${changeBoardMessage}`;

        case ACTIVITY_ACTIONS.BOARD_DELETED:
            return `đã xóa bảng "${metadata.board_title}"`;

        case ACTIVITY_ACTIONS.BOARD_ARCHIVED:
            return `đã lưu trữ bảng "${metadata.board_title}"`;

        case ACTIVITY_ACTIONS.BOARD_RESTORED:
            return `đã khôi phục bảng "${metadata.board_title}"`;

        case ACTIVITY_ACTIONS.BOARD_MOVED_TO_WORKSPACE:
            return `đã di chuyển bảng "${metadata.board_title}" vào workspace`;

        case ACTIVITY_ACTIONS.BOARD_REMOVED_FROM_WORKSPACE:
            return `đã xóa bảng "${metadata.board_title}" khỏi workspace`;

        // ===== MEMBER =====
        case ACTIVITY_ACTIONS.MEMBER_ADDED:
            return `đã thêm ${metadata.member_name} với vai trò ${metadata.role}`;

        case ACTIVITY_ACTIONS.MEMBER_REMOVED:
            return `đã xóa ${metadata.member_name} khỏi thành viên`;

        case ACTIVITY_ACTIONS.MEMBER_ROLE_CHANGED:
            return `đã thay đổi vai trò của ${metadata.member_name} từ ${changes?.role?.from} thành ${changes?.role?.to}`;

        // ===== PERMISSION =====
        case ACTIVITY_ACTIONS.PERMISSION_CHANGED:
            return `đã thay đổi quyền truy cập`;

        // ===== JOIN REQUEST =====
        case ACTIVITY_ACTIONS.JOIN_REQUEST_APPROVED:
            return `đã chấp nhận yêu cầu tham gia của ${metadata.request_user_name}`;

        case ACTIVITY_ACTIONS.JOIN_REQUEST_REJECTED:
            return `đã từ chối yêu cầu tham gia của ${metadata.request_user_name}`;

        // ===== LIST =====
        case ACTIVITY_ACTIONS.LIST_CREATED:
            return `đã tạo danh sách "${metadata.list_title}" trong bảng "${metadata.board_title}"`;

        case ACTIVITY_ACTIONS.LIST_UPDATED:
            const changeListTitle = `. Thay đổi tên danh sách từ "${changes?.title?.from}" thành "${changes?.title?.to}"`;
            const changeListColor = `. Thay đổi màu sắc danh sách từ "${changes?.color?.from}" thành "${changes?.color?.to}"`;

            const changePositionListMessage = `${changes.title ? changeListTitle : ""} ${changes.color ? changeListColor : ""}`;

            return `đã cập nhật danh sách "${metadata.list_title}"${changePositionListMessage}`;

        case ACTIVITY_ACTIONS.LIST_DELETED:
            return `đã xóa danh sách "${metadata.list_title}"`;

        case ACTIVITY_ACTIONS.LIST_MOVED:
            const changeListPosition = `. Thay đổi vị trí danh sách từ ${changes?.position?.from} sang ${changes?.position?.to}`;

            return `đã di chuyển danh sách "${metadata.list_title}"${changes?.position ? changeListPosition : ""}`;

        // ===== CARD =====
        case ACTIVITY_ACTIONS.CARD_CREATED:
            return `đã tạo thẻ "${metadata.card_title}" trong danh sách "${metadata.list_title}"`;

        case ACTIVITY_ACTIONS.CARD_UPDATED:
            const changeCardTitle = `. Thay đổi tên thẻ từ "${changes?.title?.from}" thành "${changes?.title?.to}"`;
            const changeCardDescription = `. Thay đổi mô tả thẻ từ "${changes?.description?.from}" thành "${changes?.description?.to}"`;
            const changeCardDueDate = `. Thay đổi thời hạn thẻ từ "${changes?.due_date?.from}" thành "${changes?.due_date?.to}"`;
            const changeCardPriority = `. Thay đổi mức độ ưu tiên thẻ từ "${changes?.priority?.from}" thành "${changes?.priority?.to}"`;

            const changeCardMessage = `${changes.title ? changeCardTitle : ""} ${changes.description ? changeCardDescription : ""} ${changes.dueDate ? changeCardDueDate : ""} ${changes.priority ? changeCardPriority : ""}`;

            return `đã cập nhật thẻ "${metadata.card_title}"${changeCardMessage}`;

        case ACTIVITY_ACTIONS.CARD_DELETED:
            return `đã xóa thẻ "${metadata.card_title}"`;

        case ACTIVITY_ACTIONS.CARD_MOVED:
            const changeCardList = `. Thay đổi danh sách thẻ từ "${changes?.list?.from}" sang "${changes?.list?.to}"`;
            const changeCardPosition = `. Thay đổi vị trí thẻ từ ${changes?.position?.from} sang ${changes?.position?.to}`;

            const changeCardPositionMessage = `${changes?.list ? changeCardList : ""} ${changes?.position ? changeCardPosition : ""}`;

            return `đã di chuyển thẻ "${metadata.card_title}"${changeCardPositionMessage}`;

        case ACTIVITY_ACTIONS.CARD_ARCHIVED:
            return `đã lưu trữ thẻ "${metadata.card_title}"`;

        case ACTIVITY_ACTIONS.CARD_RESTORED:
            return `đã khôi phục thẻ "${metadata.card_title}"`;

        // ===== COMMENT =====
        case ACTIVITY_ACTIONS.COMMENT_CREATED:
            return `đã bình luận trong thẻ "${metadata.card_title}"`;

        case ACTIVITY_ACTIONS.COMMENT_UPDATED:
            return `đã cập nhật bình luận trong thẻ "${metadata.card_title}"`;

        case ACTIVITY_ACTIONS.COMMENT_DELETED:
            return `đã xóa bình luận trong thẻ "${metadata.card_title}"`;

        // ===== ATTACHMENT =====
        case ACTIVITY_ACTIONS.ATTACHMENT_UPLOADED:
            return `đã tải lên tệp "${metadata.attachment_name}" vào thẻ "${metadata.card_title}"`;

        case ACTIVITY_ACTIONS.ATTACHMENT_DELETED:
            return `đã xóa tệp "${metadata.attachment_name}" khỏi thẻ "${metadata.card_title}"`;

        // ===== DEFAULT =====
        default:
            return "đã thực hiện một hành động";
    }
};

// Lấy context của activity
export const getActivityContext = (activity) => {
    const { action, metadata, changes } = activity;

    // Hiển thị context của board cho các activity liên quan đến list/card
    if ([
        ACTIVITY_ACTIONS.LIST_CREATED,
        ACTIVITY_ACTIONS.LIST_UPDATED,
        ACTIVITY_ACTIONS.LIST_DELETED,
        ACTIVITY_ACTIONS.LIST_MOVED,
        ACTIVITY_ACTIONS.CARD_CREATED,
        ACTIVITY_ACTIONS.CARD_UPDATED,
        ACTIVITY_ACTIONS.CARD_DELETED,
        ACTIVITY_ACTIONS.CARD_MOVED,
        ACTIVITY_ACTIONS.CARD_ARCHIVED,
        ACTIVITY_ACTIONS.CARD_RESTORED,
        ACTIVITY_ACTIONS.COMMENT_CREATED,
        ACTIVITY_ACTIONS.COMMENT_UPDATED,
        ACTIVITY_ACTIONS.COMMENT_DELETED,
        ACTIVITY_ACTIONS.ATTACHMENT_UPLOADED,
        ACTIVITY_ACTIONS.ATTACHMENT_DELETED
    ].includes(action)) {
        if (metadata.board_title) {
            return `Trong bảng: ${metadata.board_title}`;
        }
    }

    return null;
};
