import {
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

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
    const [sourceListId, setSourceListId] = useState(null);

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

    // Custom collision detection
    const customCollisionDetectionStrategy = useCallback((args) => {
        if (activeType === "list") {
            return closestCorners({
                ...args,
                droppableContainers: args.droppableContainers.filter(
                    (container) => container.data.current?.type === "list"
                ),
            });
        }

        return closestCorners(args);
    }, [activeType]);

    const handleDragStart = (event) => {
        const { active } = event;
        const id = active.id;
        const type = active.data.current?.type;

        setActiveId(id);
        setActiveType(type);
        setActiveData(active.data.current);

        if (type === "card") {
            setSourceListId(findListIdByCardId(id));
        }
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over || activeType === "list") return;

        const activeId = active.id;
        const overId = over.id;
        const activeListId = findListIdByCardId(activeId);
        const overListId = findListIdByCardId(overId);

        if (!activeListId || !overListId) return;

        if (activeListId !== overListId) {
            moveCard(activeId, overId, activeListId, overListId);
        }
    };

    const resetDragState = () => {
        setActiveId(null);
        setActiveType(null);
        setActiveData(null);
        setSourceListId(null);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            resetDragState();
            return;
        }

        try {
            const overType = over.data.current?.type;

            if (activeType === "list" && (overType === "list" || over.id)) {
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
                const activeListId = findListIdByCardId(active.id);
                const overListId = findListIdByCardId(over.id);

                if (!activeListId || !overListId || !sourceListId) return;

                const targetIds = [...(lists[overListId]?.cardOrderIds || [])]
                    .filter((id) => id !== active.id);
                const overIndex = targetIds.indexOf(over.id);
                const newIndex = overIndex < 0 ? targetIds.length : overIndex;
                targetIds.splice(newIndex, 0, active.id);
                moveCard(active.id, over.id, activeListId, overListId);

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
        handleDragCancel: resetDragState,
    };
}

export default useBoardDnD;
