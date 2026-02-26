// Socket Room Types
// Định nghĩa các loại phòng (room) trong hệ thống real-time
export const ROOM_TYPES = {
    WORKSPACE: 'workspace',
    BOARD: 'board',
    CARD: 'card',
    USER: 'user',
};

// Socket Events
// Định nghĩa các event names được sử dụng trong socket communication
export const SOCKET_EVENTS = {
    // Activity events
    ACTIVITY_CREATED: 'activity-created',

    // Workspace events
    WORKSPACE_UPDATED: 'workspace-updated',
    WORKSPACE_PERMISSIONS_UPDATED: 'workspace-permissions-updated',
    WORKSPACE_DELETED: 'workspace-deleted',

    // Member events
    MEMBER_JOINED: 'member-joined',
    MEMBER_ROLE_UPDATED: 'member-role-updated',
    MEMBER_REMOVED: 'member-removed',

    // Join request events
    JOIN_REQUEST_RECEIVED: 'join-request-received',

    // Board events
    BOARD_UPDATED: 'board-updated',
    BOARD_MEMBER_REMOVED: 'board-member-removed',
    BOARDS_ADDED: 'boards-added',
    BOARDS_REMOVED: 'boards-removed',
    BOARD_CREATED: 'board-created',
    BOARD_UPDATED_IN_WORKSPACE: 'board-updated-in-workspace',
    BOARD_DELETED: 'board-deleted',

    // List events
    LIST_CREATED: 'list-created',
    LIST_UPDATED: 'list-updated',
    LIST_DELETED: 'list-deleted',
    LIST_MOVED: 'list-moved',

    // Card events
    CARD_CREATED: 'card-created',
    CARD_UPDATED: 'card-updated',
    CARD_DELETED: 'card-deleted',
    CARD_MOVED: 'card-moved',

    // Checklist events
    CHECKLIST_ITEM_ADDED: 'checklist-item-added',
    CHECKLIST_ITEM_TOGGLED: 'checklist-item-toggled',
    CHECKLIST_ITEM_DELETED: 'checklist-item-deleted',

    // Card member events
    CARD_MEMBER_ASSIGNED: 'card-member-assigned',
    CARD_MEMBER_REMOVED: 'card-member-removed',

    // Comment events
    COMMENT_ADDED: 'comment-added',
    COMMENT_DELETED: 'comment-deleted',

    // Global / Notification events
    NOTIFICATION_NEW: 'notification-new',

    // Presence events
    REGISTER_USER: 'register-user',
    BOARD_PRESENCE_UPDATE: 'board-presence-update',
    CARD_PRESENCE_UPDATE: 'card-presence-update',

    // Typing events
    CARD_TYPING_START: 'card-typing-start',
    CARD_TYPING_STOP: 'card-typing-stop',
    CARD_TYPING_UPDATE: 'card-typing-update',

    // Field locking events
    CARD_FIELD_LOCK: 'card-field-lock',
    CARD_FIELD_UNLOCK: 'card-field-unlock',
    CARD_FIELD_LOCKED: 'card-field-locked',
    CARD_FIELD_UNLOCKED: 'card-field-unlocked',
    CARD_LOCKS_INIT: 'card-locks-init',
};

// Helper function để tạo join/leave event names
export const getRoomEvents = (roomType) => ({
    join: `join-${roomType}`,
    leave: `leave-${roomType}`,
});
