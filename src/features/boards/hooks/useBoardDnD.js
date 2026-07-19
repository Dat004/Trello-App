import {
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

import { cardApi } from "@/api/card";
import { listApi } from "@/api/list";
import { UserToast } from "@/context/ToastContext";
import { BOARD_KEYS } from "../api/useBoards";
import { useBoardContext } from "../context/BoardStateContext";

function useBoardDnD(boardId) {
    // Use Context instead of Store
    const { boardData, moveList, moveCard } = useBoardContext();
    const { lists, listOrder } = boardData;
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

    // Tìm List ID chứa Card ID
    const findListIdByCardId = useCallback((id) => {
        if (lists[id]) return id;

        const foundListId = Object.keys(lists).find(listId =>
            lists[listId].cardOrderIds.includes(id)
        );

        return foundListId || null;
    }, [lists]);

    const resolveOverListId = useCallback((over) => {
        if (!over) return null;
        return over.data.current?.listId || findListIdByCardId(over.id);
    }, [findListIdByCardId]);

    // Custom collision detection
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

        const activeId = active.id;
        const activeListId = findListIdByCardId(activeId);
        const overListId = resolveOverListId(over);

        if (!activeListId || !overListId) return;
        lastOverListIdRef.current = overListId;

        if (activeListId !== overListId) {
            const overCardId = over.data.current?.type === "card" ? over.id : null;
            moveCard(activeId, overCardId, activeListId, overListId);
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
                const activeListId = findListIdByCardId(active.id);
                const overListId = resolveOverListId(over) || lastOverListIdRef.current;

                if (!activeListId || !overListId || !sourceListId) return;

                const targetIds = [...(lists[overListId]?.cardOrderIds || [])]
                    .filter((id) => id !== active.id);
                const overCardId = overType === "card" && over.id !== active.id
                    ? over.id
                    : null;
                const overIndex = overCardId ? targetIds.indexOf(overCardId) : -1;
                const newIndex = overIndex < 0 ? targetIds.length : overIndex;
                targetIds.splice(newIndex, 0, active.id);

                if (sourceListId === overListId && active.id === over.id) return;
                moveCard(active.id, overCardId, activeListId, overListId);

                await cardApi.move(boardId, sourceListId, active.id, {
                    prevCardId: newIndex > 0 ? targetIds[newIndex - 1] : null,
                    nextCardId: newIndex < targetIds.length - 1 ? targetIds[newIndex + 1] : null,
                    destinationListId: overListId
                });
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
