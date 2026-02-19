import {
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { useCallback, useState } from "react";

import { cardApi } from "@/api/card";
import { listApi } from "@/api/list";
import { useBoardContext } from "../context/BoardStateContext";

function useBoardDnD(boardId) {
    // Use Context instead of Store
    const { boardData, moveList, moveCard } = useBoardContext();
    const { lists, listOrder } = boardData;

    const [activeId, setActiveId] = useState(null);
    const [activeType, setActiveType] = useState(null);
    const [activeData, setActiveData] = useState(null);
    const [sourceListId, setSourceListId] = useState(null);

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

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const overType = over.data.current?.type;

            if (activeType === "list" && (overType === "list" || over.id)) {
                // Sắp xếp lại trong local state context
                moveList(active.id, over.id);

                // Tính toán prev/next dựa trên listOrder mới nhất
                const oldIndex = listOrder.indexOf(active.id);
                const newIndex = listOrder.indexOf(over.id);
                const newListOrder = [...listOrder];
                const [movedItem] = newListOrder.splice(oldIndex, 1);
                newListOrder.splice(newIndex, 0, movedItem);

                const prevListId = newIndex > 0 ? newListOrder[newIndex - 1] : null;
                const nextListId = newIndex < newListOrder.length - 1 ? newListOrder[newIndex + 1] : null;

                // Call api
                await listApi.move(boardId, active.id, { prevListId, nextListId });

            } else {
                const activeListId = findListIdByCardId(active.id);
                const overListId = findListIdByCardId(over.id);

                if (activeListId && overListId) {
                    // Sắp xếp lại trong local state context
                    moveCard(active.id, over.id, activeListId, overListId);

                    // Tính toán prev/next dựa trên cardOrderIds mới nhất của destination list
                    const targetList = lists[overListId];
                    if (!targetList) return;

                    let newCardOrderIds;
                    let newIndex;

                    if (activeListId === overListId) {
                        newCardOrderIds = [...targetList.cardOrderIds];
                        const oldIndex = newCardOrderIds.indexOf(active.id);
                        newIndex = newCardOrderIds.indexOf(over.id);

                        // Xóa cũ chèn mới
                        if (oldIndex !== -1 && newIndex !== -1) {
                            const [movedId] = newCardOrderIds.splice(oldIndex, 1);
                            newCardOrderIds.splice(newIndex, 0, movedId);
                        }
                    } else {
                        newCardOrderIds = [...targetList.cardOrderIds];
                        newIndex = newCardOrderIds.indexOf(over.id);
                        if (newIndex === -1) newIndex = newCardOrderIds.length;

                        const activeIdx = newCardOrderIds.indexOf(active.id);
                        if (activeIdx !== -1) {
                            const [movedId] = newCardOrderIds.splice(activeIdx, 1);
                            newIndex = newCardOrderIds.indexOf(over.id);
                            if (newIndex === -1) newIndex = newCardOrderIds.length;
                            newCardOrderIds.splice(newIndex, 0, movedId);
                        } else {
                            newCardOrderIds.splice(newIndex, 0, active.id);
                        }
                    }

                    const prevCardId = newIndex > 0 ? newCardOrderIds[newIndex - 1] : null;
                    const nextCardId = newIndex < newCardOrderIds.length - 1 ? newCardOrderIds[newIndex + 1] : null;

                    // Call api
                    if (sourceListId) {
                        await cardApi.move(boardId, sourceListId, active.id, {
                            prevCardId,
                            nextCardId,
                            destinationListId: overListId
                        });
                    }
                }
            }
        } else {
            // Drop on empty or placeholder logic (if applicable)
            // Logic trong else của handleDragEnd cũ đang handle Drag Card lên empty placeholder?
            // ...
            // Giữ nguyên logic cũ
            const overListId = over.data.current?.listId;
            if (!overListId) return; // Guard clause

            const targetList = lists[overListId];
            const newCardOrderIds = [...targetList.cardOrderIds];
            const newIndex = newCardOrderIds.indexOf(over.id);
            const prevCardId = newIndex > 0 ? newCardOrderIds[newIndex - 1] : null;
            const nextCardId = newIndex < newCardOrderIds.length - 1 ? newCardOrderIds[newIndex + 1] : null;

            await cardApi.move(boardId, overListId, active.id, {
                prevCardId,
                nextCardId,
                destinationListId: overListId
            });
        }

        setActiveId(null);
        setActiveType(null);
        setActiveData(null);
        setSourceListId(null);
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
