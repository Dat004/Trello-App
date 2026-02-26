import { normalizeBoard } from "@/utils/boardUtils";
import { useCallback, useEffect, useState } from "react";

export const useBoardState = (initialBoardDetail) => {
    const [boardData, setBoardData] = useState({
        currentBoard: null,
        users: {},
        lists: {},
        cards: {},
        listOrder: [],
        boardMembers: [],
        joinRequests: [],
        activeUsers: [],
    });

    // Sync from props (when refetched)
    useEffect(() => {
        if (initialBoardDetail) {
            const normalizedCtx = normalizeBoard(initialBoardDetail);
            setBoardData(normalizedCtx);
        }
    }, [initialBoardDetail]);

    // -- BOARD ACTIONS --

    const updateBoard = useCallback((updatedData) => {
        setBoardData((prev) => ({
            ...prev,
            currentBoard: { ...prev.currentBoard, ...updatedData }
        }));
    }, []);

    // -- LIST ACTIONS --

    const addList = useCallback((list) => {
        setBoardData((prev) => {
            const newLists = { ...prev.lists };
            const newListOrder = [...prev.listOrder, list._id];

            newLists[list._id] = {
                ...list,
                cards: undefined,
                cardOrderIds: [],
            };

            return {
                ...prev,
                lists: newLists,
                listOrder: newListOrder,
                currentBoard: prev.currentBoard,
            };
        });
    }, []);

    const updateList = useCallback((listId, updatedData) => {
        setBoardData((prev) => {
            const newLists = { ...prev.lists };
            if (newLists[listId]) {
                newLists[listId] = { ...newLists[listId], ...updatedData };
            }
            return {
                ...prev,
                lists: newLists,
            };
        });
    }, []);

    const removeList = useCallback((listId) => {
        setBoardData((prev) => {
            const newLists = { ...prev.lists };
            const newCards = { ...prev.cards };
            const newListOrder = prev.listOrder.filter((id) => id !== listId);

            // Remove cards in list from card map
            const listToRemove = newLists[listId];
            if (listToRemove) {
                listToRemove.cardOrderIds?.forEach((cardId) => {
                    delete newCards[cardId];
                });
                delete newLists[listId];
            }

            return {
                ...prev,
                lists: newLists,
                cards: newCards,
                listOrder: newListOrder,
            };
        });
    }, []);

    const moveList = useCallback((activeId, overId) => {
        setBoardData((prev) => {
            const listOrder = [...prev.listOrder];
            const oldIndex = listOrder.indexOf(activeId);
            const newIndex = listOrder.indexOf(overId);

            if (oldIndex !== -1 && newIndex !== -1) {
                const [movedItem] = listOrder.splice(oldIndex, 1);
                listOrder.splice(newIndex, 0, movedItem);
                return { ...prev, listOrder: listOrder };
            }
            return prev;
        });
    }, []);

    // -- CARD ACTIONS --

    const addCard = useCallback((card) => {
        setBoardData((prev) => {
            const newCards = { ...prev.cards };

            // Normalize: Ensure both list and listId keys are present/consistent
            const listId = card.listId || card.list;

            newCards[card._id] = {
                ...card,
                list: listId,   // Legacy support
                listId: listId  // New standard
            };

            const newLists = { ...prev.lists };

            if (newLists[listId]) {
                const updatedCardOrderIds = [...newLists[listId].cardOrderIds, card._id];
                newLists[listId] = { ...newLists[listId], cardOrderIds: updatedCardOrderIds };
            }

            return { ...prev, cards: newCards, lists: newLists };
        });
    }, []);

    const updateCard = useCallback((cardId, updatedData) => {
        setBoardData((prev) => {
            const newCards = { ...prev.cards };
            if (newCards[cardId]) {
                newCards[cardId] = { ...newCards[cardId], ...updatedData };
            }
            return { ...prev, cards: newCards };
        });
    }, []);

    const removeCard = useCallback((cardId) => {
        setBoardData((prev) => {
            const newCards = { ...prev.cards };
            const cardToRemove = newCards[cardId];

            if (!cardToRemove) return prev;

            const listId = cardToRemove.listId || cardToRemove.list;
            delete newCards[cardId];

            const newLists = { ...prev.lists };
            if (newLists[listId]) {
                const updatedCardOrderIds = newLists[listId].cardOrderIds.filter(id => id !== cardId);
                newLists[listId] = { ...newLists[listId], cardOrderIds: updatedCardOrderIds };
            }

            return { ...prev, cards: newCards, lists: newLists };
        });
    }, []);

    const moveCard = useCallback((activeId, overId, activeListId, overListId) => {
        setBoardData((prev) => {
            const newLists = { ...prev.lists };
            const newCards = { ...prev.cards };

            // 1. Same List
            if (activeListId === overListId) {
                const targetList = newLists[activeListId];
                if (!targetList) return prev;

                const newCardOrderIds = [...targetList.cardOrderIds];
                const oldIndex = newCardOrderIds.indexOf(activeId);
                const newIndex = newCardOrderIds.indexOf(overId);

                if (oldIndex !== -1 && newIndex !== -1) {
                    const [movedCardId] = newCardOrderIds.splice(oldIndex, 1);
                    newCardOrderIds.splice(newIndex, 0, movedCardId);

                    newLists[activeListId] = {
                        ...targetList,
                        cardOrderIds: newCardOrderIds,
                    };
                }
                return { ...prev, lists: newLists };
            }

            // 2. Different List
            const sourceList = newLists[activeListId];
            const destList = newLists[overListId];

            if (sourceList && destList) {
                const sourceCardOrderIds = [...sourceList.cardOrderIds];
                const destCardOrderIds = [...destList.cardOrderIds];

                const oldIndex = sourceCardOrderIds.indexOf(activeId);
                // Destination logic (insert before overId or at end)
                let newIndex = destCardOrderIds.indexOf(overId);
                if (newIndex === -1) newIndex = destCardOrderIds.length;

                if (oldIndex !== -1) {
                    const [movedCardId] = sourceCardOrderIds.splice(oldIndex, 1);
                    destCardOrderIds.splice(newIndex, 0, movedCardId);

                    // Update card's list ref (update both for compatibility)
                    if (newCards[movedCardId]) {
                        newCards[movedCardId] = {
                            ...newCards[movedCardId],
                            list: overListId,
                            listId: overListId
                        };
                    }

                    newLists[activeListId] = { ...sourceList, cardOrderIds: sourceCardOrderIds };
                    newLists[overListId] = { ...destList, cardOrderIds: destCardOrderIds };

                    return { ...prev, lists: newLists, cards: newCards };
                }
            }

            return prev;
        });
    }, []);

    // -- REALTIME POS ACTIONS --

    const updateListPosition = useCallback((listId, newPos) => {
        setBoardData((prev) => {
            const newLists = { ...prev.lists };
            if (!newLists[listId]) return prev;

            newLists[listId] = { ...newLists[listId], pos: newPos };

            const newListOrder = [...prev.listOrder].sort((a, b) => {
                const posA = newLists[a]?.pos || 0;
                const posB = newLists[b]?.pos || 0;
                return posA - posB;
            });

            return { ...prev, lists: newLists, listOrder: newListOrder };
        });
    }, []);

    const updateCardPosition = useCallback((cardId, targetListId, newPos) => {
        setBoardData((prev) => {
            const newCards = { ...prev.cards };
            const currentCard = newCards[cardId];
            if (!currentCard) return prev;

            const sourceListId = currentCard.listId || currentCard.list;

            // Update Card Data
            newCards[cardId] = {
                ...currentCard,
                listId: targetListId,
                list: targetListId,
                pos: newPos
            };

            const newLists = { ...prev.lists };

            // Remove from Source List
            if (newLists[sourceListId] && sourceListId !== targetListId) {
                newLists[sourceListId] = {
                    ...newLists[sourceListId],
                    cardOrderIds: newLists[sourceListId].cardOrderIds.filter(id => id !== cardId)
                };
            }

            // Ensure Target List exists
            if (newLists[targetListId]) {
                const targetList = newLists[targetListId];
                // If moving within same list, filter out old instance first if we didn't do it above
                // Clone array to prevent state mutation on push
                let newCardOrderIds = [...targetList.cardOrderIds];

                if (sourceListId === targetListId) {
                    newCardOrderIds = newCardOrderIds.filter(id => id !== cardId);
                }

                if (!newCardOrderIds.includes(cardId)) {
                    newCardOrderIds.push(cardId);
                }

                // Sort
                newCardOrderIds.sort((a, b) => {
                    const posA = newCards[a]?.pos || 0;
                    const posB = newCards[b]?.pos || 0;
                    return posA - posB;
                });

                newLists[targetListId] = {
                    ...targetList,
                    cardOrderIds: newCardOrderIds
                };
            }

            return { ...prev, cards: newCards, lists: newLists };
        });
    }, []);

    // -- BOARD MEMBER ACTIONS --

    const addBoardMember = useCallback((member) => {
        setBoardData((prev) => {
            const currentMembers = prev.boardMembers || [];
            // Check duplicate by user ID
            if (currentMembers.find(m => m.user._id === member.user._id)) return prev;

            const newMembers = [...currentMembers, member];

            return {
                ...prev,
                boardMembers: newMembers,
                currentBoard: {
                    ...prev.currentBoard,
                    members: newMembers // Update metadata mirror if it exists
                }
            };
        });
    }, []);

    const updateBoardMember = useCallback((memberId, data) => {
        setBoardData((prev) => {
            const newMembers = prev.boardMembers.map(m =>
                m._id === memberId ? { ...m, ...data } : m
            );
            return {
                ...prev,
                boardMembers: newMembers,
                currentBoard: { ...prev.currentBoard, members: newMembers }
            };
        });
    }, []);

    const removeBoardMember = useCallback((memberId) => {
        setBoardData((prev) => {
            const newMembers = prev.boardMembers.filter(m => m._id !== memberId);
            return {
                ...prev,
                boardMembers: newMembers,
                currentBoard: { ...prev.currentBoard, members: newMembers }
            };
        });
    }, []);

    // -- JOIN REQUEST ACTIONS --

    const addJoinRequest = useCallback((request) => {
        setBoardData((prev) => {
            const currentRequests = prev.joinRequests || [];
            if (currentRequests.find(r => r._id === request._id)) return prev;
            return { ...prev, joinRequests: [...currentRequests, request] };
        });
    }, []);

    const removeJoinRequest = useCallback((requestId) => {
        setBoardData((prev) => ({
            ...prev,
            joinRequests: prev.joinRequests.filter(r => r._id !== requestId)
        }));
    }, []);

    // -- CHECKLIST ACTIONS --

    const addChecklistItem = useCallback((cardId, item) => {
        setBoardData((prev) => {
            const newCards = { ...prev.cards };
            if (newCards[cardId]) {
                const currentChecklist = newCards[cardId].checklist || [];
                // Check duplicate? Usually API generates unique ID
                newCards[cardId] = {
                    ...newCards[cardId],
                    checklist: [...currentChecklist, item]
                };

                console.log(newCards);
            }
            return { ...prev, cards: newCards };
        });
    }, []);

    const toggleChecklistItem = useCallback((cardId, updatedItem) => {
        setBoardData((prev) => {
            const newCards = { ...prev.cards };
            if (newCards[cardId]) {
                const currentChecklist = newCards[cardId].checklist || [];
                const newChecklist = currentChecklist.map(item =>
                    item._id === updatedItem._id ? updatedItem : item
                );
                newCards[cardId] = { ...newCards[cardId], checklist: newChecklist };
            }
            return { ...prev, cards: newCards };
        });
    }, []);

    const deleteChecklistItem = useCallback((cardId, itemId) => {
        setBoardData((prev) => {
            const newCards = { ...prev.cards };
            if (newCards[cardId]) {
                const currentChecklist = newCards[cardId].checklist || [];
                const newChecklist = currentChecklist.filter(item => item._id !== itemId);
                newCards[cardId] = { ...newCards[cardId], checklist: newChecklist };
            }
            return { ...prev, cards: newCards };
        });
    }, []);

    // -- ATTACHMENT ACTIONS --

    const addAttachment = useCallback((cardId, attachment) => {
        setBoardData((prev) => {
            const newCards = { ...prev.cards };
            if (newCards[cardId]) {
                const currentAttachments = newCards[cardId].attachments || [];
                newCards[cardId] = {
                    ...newCards[cardId],
                    attachments: [...currentAttachments, attachment],
                    attachment_count: (newCards[cardId].attachment_count || 0) + 1
                };
            }
            return { ...prev, cards: newCards };
        });
    }, []);

    const deleteAttachment = useCallback((cardId, attachmentId) => {
        setBoardData((prev) => {
            const newCards = { ...prev.cards };
            if (newCards[cardId]) {
                const currentAttachments = newCards[cardId].attachments || [];
                newCards[cardId] = {
                    ...newCards[cardId],
                    attachments: currentAttachments.filter(a => a._id !== attachmentId),
                    attachment_count: Math.max(0, (newCards[cardId].attachment_count || 0) - 1)
                };
            }
            return { ...prev, cards: newCards };
        });
    }, []);

    // -- CARD MEMBER ACTIONS --

    const assignCardMember = useCallback((cardId, user) => {
        setBoardData((prev) => {
            const newUsers = { ...prev.users };
            const newCards = { ...prev.cards };

            // Add user to users map
            newUsers[user._id] = user;

            // Add to card
            if (newCards[cardId]) {
                const memberIds = [...(newCards[cardId].memberIds || [])];
                const membersCache = [...(newCards[cardId]._membersCache || [])];

                // Check duplicate
                if (!memberIds.includes(user._id)) {
                    memberIds.push(user._id);
                    membersCache.push(user);

                    newCards[cardId] = {
                        ...newCards[cardId],
                        memberIds,
                        _membersCache: membersCache
                    };
                }
            }

            return { ...prev, users: newUsers, cards: newCards };
        });
    }, []);

    const removeCardMember = useCallback((cardId, userId) => {
        setBoardData((prev) => {
            const newCards = { ...prev.cards };

            if (newCards[cardId]) {
                const memberIds = (newCards[cardId].memberIds || [])
                    .filter(id => id !== userId);
                const membersCache = (newCards[cardId]._membersCache || [])
                    .filter(m => m._id !== userId);

                newCards[cardId] = {
                    ...newCards[cardId],
                    memberIds,
                    _membersCache: membersCache
                };
            }

            return { ...prev, cards: newCards };
        });
    }, []);

    const updateUser = useCallback((userId, updates) => {
        setBoardData((prev) => {
            const newUsers = { ...prev.users };
            const newCards = { ...prev.cards };

            // Update in users map
            if (newUsers[userId]) {
                newUsers[userId] = { ...newUsers[userId], ...updates };
            }

            // Update in all cards' cache
            Object.keys(newCards).forEach(cardId => {
                const card = newCards[cardId];
                if (card.memberIds?.includes(userId)) {
                    newCards[cardId] = {
                        ...card,
                        _membersCache: card._membersCache.map(m =>
                            m._id === userId ? { ...m, ...updates } : m
                        )
                    };
                }
            });

            return { ...prev, users: newUsers, cards: newCards };
        });
    }, []);

    const setActiveUsers = useCallback((users) => {
        setBoardData((prev) => ({ ...prev, activeUsers: users }));
    }, []);

    return {
        boardData,
        moveList,
        moveCard,
        addList, updateList, removeList, updateListPosition,
        addCard, updateCard, removeCard, updateCardPosition,
        addBoardMember, updateBoardMember, removeBoardMember,
        addJoinRequest, removeJoinRequest,
        addChecklistItem, toggleChecklistItem, deleteChecklistItem,
        addAttachment, deleteAttachment,
        assignCardMember, removeCardMember, updateUser,
        updateBoard,
        setActiveUsers
    };
};
