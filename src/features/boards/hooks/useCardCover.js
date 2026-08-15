import { useUpdateCard } from "@/features/boards/api/useCards";
import { COVER_COLORS } from "../constants/coverConstants";

export function useCardCover({ card, boardId, listId }) {
  const { mutate: updateCard, isLoading: isUpdating } = useUpdateCard();

  const currentCover = card?.cover || null;

  const getCoverColorClass = (colorId) => {
    const found = COVER_COLORS.find((c) => c.id === colorId);
    return found ? found.bgClass : "bg-primary";
  };

  const handleSetCoverColor = (colorId) => {
    if (!card?._id || !boardId || !listId) return;
    updateCard({
      boardId,
      listId,
      id: card._id,
      data: {
        title: card.title,
        description: card.description || "",
        cover: {
          color: colorId,
          url: null,
          mode: "header",
        },
      },
    });
  };

  const handleSetCoverUrl = (url) => {
    if (!card?._id || !boardId || !listId || !url) return;
    updateCard({
      boardId,
      listId,
      id: card._id,
      data: {
        title: card.title,
        description: card.description || "",
        cover: {
          color: null,
          url,
          mode: "header",
        },
      },
    });
  };

  const handleRemoveCover = () => {
    if (!card?._id || !boardId || !listId) return;
    updateCard({
      boardId,
      listId,
      id: card._id,
      data: {
        title: card.title,
        description: card.description || "",
        cover: null,
      },
    });
  };

  return {
    currentCover,
    isUpdating,
    getCoverColorClass,
    handleSetCoverColor,
    handleSetCoverUrl,
    handleRemoveCover,
  };
}
