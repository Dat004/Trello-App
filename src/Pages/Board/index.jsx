import { BoardAccessGuard } from "@/features/boards/components/BoardAccessGuard";
import BoardContent from "@/features/boards/components/Detail/BoardContent";

function Board() {
  return (
    <BoardAccessGuard>
      <BoardContent />
    </BoardAccessGuard>
  );
}

export default Board;
