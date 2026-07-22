import {
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

import { cardApi } from "@/api/card";
import { listApi } from "@/api/list";
import { UserToast } from "@/context/ToastContext";
import { BOARD_KEYS } from "../api/useBoards";
import { useBoardActions, useBoardSelector } from "../context/BoardStateContext";
import { selectListOrder, selectLists } from "../state/boardSelectors";

function useBoardDnD(boardId) {
    const lists = useBoardSelector(selectLists);
    const listOrder = useBoardSelector(selectListOrder);
    const { moveList, moveCard, updateCardPosition, setCardOrder } = useBoardActions();
    const queryClient = useQueryClient();
    const { addToast } = UserToast();

    const [activeId, setActiveId] = useState(null);
    const [activeType, setActiveType] = useState(null);
    const [activeData, setActiveData] = useState(null);
    const sourceListIdRef = useRef(null);
    const lastOverListIdRef = useRef(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const findListIdByCardId = useCallback((id) => {
        if (lists[id]) return id;

        const foundListId = Object.keys(lists).find((listId) =>
            lists[listId].cardOrderIds.includes(id)
        );

        return foundListId || null;
    }, [lists]);

    const resolveOverListId = useCallback((over) => {
        if (!over) return null;
        return over.data.current?.listId || findListIdByCardId(over.id);
    }, [findListIdByCardId]);

    const customCollisionDetectionStrategy = useCallback((args) => {
        const draggedType = args.active.data.current?.type || activeType;
        if (draggedType === "list") {
            return closestCorners({
                ...args,
                droppableContainers: args.droppableContainers.filter(
                    (container) => container.data.current?.type === "list"
                ),
            });
        }

        return closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter((container) =>
                ["card", "card-container"].includes(container.data.current?.type)
            ),
        });
    }, [activeType]);

    const handleDragStart = (event) => {
        const { active } = event;
        const id = active.id;
        const type = active.data.current?.type;

        setActiveId(id);
        setActiveType(type);
        setActiveData({
            ...active.data.current,
            width: active.rect.current.initial?.width,
        });

        if (type === "card") {
            const sourceListId = active.data.current?.listId || findListIdByCardId(id);
            sourceListIdRef.current = sourceListId;
            lastOverListIdRef.current = sourceListId;
        }
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        const draggedType = active.data.current?.type || activeType;
        if (!over || draggedType === "list") return;

        const draggedId = active.id;
        const activeListId = findListIdByCardId(draggedId);
        const overListId = resolveOverListId(over);

        if (!activeListId || !overListId) return;
        lastOverListIdRef.current = overListId;

        if (activeListId !== overListId) {
            const overCardId = over.data.current?.type === "card" ? over.id : null;
            moveCard(draggedId, overCardId, activeListId, overListId);
        }
    };

    const resetDragState = () => {
        setActiveId(null);
        setActiveType(null);
        setActiveData(null);
        sourceListIdRef.current = null;
        lastOverListIdRef.current = null;
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) {
            resetDragState();
            return;
        }

        try {
            const overType = over.data.current?.type;
            const draggedType = active.data.current?.type || activeType;

            if (draggedType === "list" && (overType === "list" || over.id)) {
                if (active.id === over.id) return;
                const oldIndex = listOrder.indexOf(active.id);
                const newIndex = listOrder.indexOf(over.id);
                if (oldIndex < 0 || newIndex < 0) return;

                const newListOrder = [...listOrder];
                const [movedItem] = newListOrder.splice(oldIndex, 1);
                newListOrder.splice(newIndex, 0, movedItem);
                moveList(active.id, over.id);

                const prevListId = newIndex > 0 ? newListOrder[newIndex - 1] : null;
                const nextListId = newIndex < newListOrder.length - 1 ? newListOrder[newIndex + 1] : null;

                await listApi.move(boardId, active.id, { prevListId, nextListId });
            } else {
                const sourceListId = sourceListIdRef.current;
                const overListId = resolveOverListId(over) || lastOverListIdRef.current;

                if (!overListId || !sourceListId) return;

                const overCardId = overType === "card" && over.id !== active.id
                    ? over.id
                    : null;

                // Prefer live list order (may already include cross-list dragOver moves).
                const currentOrder = [...(lists[overListId]?.cardOrderIds || [])];
                const oldIndex = currentOrder.indexOf(active.id);
                const overIndex = overCardId ? currentOrder.indexOf(overCardId) : -1;

                let newOrder;
                if (oldIndex >= 0) {
                    const toIndex = overIndex >= 0 ? overIndex : currentOrder.length - 1;
                    if (oldIndex === toIndex && sourceListId === overListId) return;
                    newOrder = arrayMove(currentOrder, oldIndex, toIndex);
                } else {
                    newOrder = currentOrder.filter((id) => id !== active.id);
                    const insertAt = overIndex >= 0 ? overIndex : newOrder.length;
                    newOrder.splice(insertAt, 0, active.id);
                }

                setCardOrder({
                    listId: overListId,
                    cardOrderIds: newOrder,
                    cardId: active.id,
                    sourceListId,
                });

                const index = newOrder.indexOf(active.id);
                const res = await cardApi.move(boardId, sourceListId, active.id, {
                    prevCardId: index > 0 ? newOrder[index - 1] : null,
                    nextCardId: index < newOrder.length - 1 ? newOrder[index + 1] : null,
                    destinationListId: overListId,
                });

                const moved = res?.data?.data;
                if (moved?.pos != null) {
                    updateCardPosition(
                        String(moved.cardId || active.id),
                        String(moved.listId || overListId),
                        moved.pos,
                    );
                }
            }
        } catch (error) {
            await queryClient.invalidateQueries({ queryKey: BOARD_KEYS.detail(boardId) });
            addToast({
                type: "error",
                title: error.response?.data?.message || "Không thể lưu vị trí mới",
            });
        } finally {
            resetDragState();
        }
    };

    return {
        sensors,
        activeId,
        activeType,
        activeData,
        customCollisionDetectionStrategy,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleDragCancel: () => {
            const currentListId = activeId ? findListIdByCardId(activeId) : null;
            if (sourceListIdRef.current && currentListId !== sourceListIdRef.current) {
                queryClient.invalidateQueries({ queryKey: BOARD_KEYS.detail(boardId) });
            }
            resetDragState();
        },
    };
}

export default useBoardDnD;
