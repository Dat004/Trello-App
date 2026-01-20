import { useCallback, useState } from "react";
import {
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import { useBoardDetailStore } from "@/store";

function useBoardDnD() {
    const lists = useBoardDetailStore((state) => state.lists);
    const moveList = useBoardDetailStore((state) => state.moveList);
    const moveCard = useBoardDetailStore((state) => state.moveCard);

    const [activeId, setActiveId] = useState(null);
    const [activeType, setActiveType] = useState(null); // 'list' hoặc 'card'
    const [activeData, setActiveData] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
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
        setActiveId(active.id);
        setActiveType(active.data.current?.type);
        setActiveData(active.data.current);
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

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const overType = over.data.current?.type;

            if (activeType === "list" && overType === "list") {
                moveList(active.id, over.id);
            } else if (activeType === "card") {
                const activeListId = findListIdByCardId(active.id);
                const overListId = findListIdByCardId(over.id);

                if (activeListId && overListId) {
                    moveCard(active.id, over.id, activeListId, overListId);
                }
            }
        }

        setActiveId(null);
        setActiveType(null);
        setActiveData(null);
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
    };
}

export default useBoardDnD;
