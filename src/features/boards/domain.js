/**
 * @typedef {Object} BoardMember
 * @property {string} _id
 * @property {{ _id: string, full_name?: string, avatar?: string }} user
 * @property {string=} role
 */

/**
 * @typedef {Object} BoardCard
 * @property {string} _id
 * @property {string=} title
 * @property {string|Object=} list
 * @property {string=} listId
 * @property {number=} pos
 * @property {string[]=} memberIds
 * @property {Object[]=} _membersCache
 * @property {Object[]=} checklist
 * @property {Object[]=} attachments
 */

/**
 * @typedef {Object} BoardList
 * @property {string} _id
 * @property {string=} title
 * @property {number=} pos
 * @property {BoardCard[]=} cards
 * @property {string[]=} cardOrderIds
 */

/**
 * Server board detail before it is normalized into working state.
 * @typedef {Object} Board
 * @property {string} _id
 * @property {string=} title
 * @property {BoardList[]=} lists
 * @property {BoardMember[]=} members
 * @property {Object[]=} joinRequests
 */

/**
 * Mutable-by-reducer, normalized working state owned by Board Context.
 * React Query remains the owner of the server response cache.
 * @typedef {Object} NormalizedBoardState
 * @property {Board|null} currentBoard
 * @property {Record<string, Object>} users
 * @property {Record<string, BoardList>} lists
 * @property {Record<string, BoardCard>} cards
 * @property {string[]} listOrder
 * @property {BoardMember[]} boardMembers
 * @property {Object[]} joinRequests
 * @property {Object[]=} activeUsers
 */

export {};
