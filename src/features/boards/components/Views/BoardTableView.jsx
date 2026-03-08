import { useMemo, useState } from "react";
import {
  Calendar,
  MessageSquare,
  Paperclip,
  Search
} from "lucide-react";
import { format } from "date-fns";

import { useBoardContext } from "../../context/BoardStateContext";
import { useFilteredCards } from "../../hooks/useFilteredCards";
import CardDetailDialog from "../Card/CardDetailDialog";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Input
} from "@/Components/UI";

function BoardTableView() {
  const { boardData } = useBoardContext();
  const { cards, lists, listOrder, currentBoard } = boardData;
  const [search, setSearch] = useState("");
  const [selectedCardId, setSelectedCardId] = useState(null);

  const allCards = useMemo(() => {
    const flattened = [];
    listOrder.forEach(listId => {
      const list = lists[listId];
      if (list && list.cardOrderIds) {
        list.cardOrderIds.forEach(cardId => {
          const card = cards[cardId];
          if (card) {
            flattened.push({
              ...card,
              listName: list.title
            });
          }
        });
      }
    });
    return flattened;
  }, [cards, lists, listOrder]);

  // Lấy danh sách thẻ đã lọc
  const globalFilteredCards = useFilteredCards(allCards);

  // Lọc theo tìm kiếm
  const filteredCards = globalFilteredCards.filter(card => 
    card.title.toLowerCase().includes(search.toLowerCase()) ||
    card.listName.toLowerCase().includes(search.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border shadow-sm overflow-hidden m-4">
      {/* Table Header / Filters */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card/50">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm thẻ..." 
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Hiển thị <strong>{filteredCards.length}</strong> thẻ
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="sticky top-0 bg-muted/50 text-muted-foreground uppercase text-[11px] font-semibold">
            <tr>
              <th className="px-6 py-3 border-b border-border min-w-[300px]">Thẻ công việc</th>
              <th className="px-6 py-3 border-b border-border">Danh sách</th>
              <th className="px-6 py-3 border-b border-border">Độ ưu tiên</th>
              <th className="px-6 py-3 border-b border-border">Hạn chót</th>
              <th className="px-6 py-3 border-b border-border">Thành viên</th>
              <th className="px-6 py-3 border-b border-border">Thống kê</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCards.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground italic">
                  Không tìm thấy thẻ nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredCards.map((card) => (
                <tr 
                  key={card._id} 
                  className="hover:bg-muted/30 transition-colors group cursor-pointer"
                  onClick={() => setSelectedCardId(card._id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {card.title}
                      </span>
                      {card.labels && card.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {card.labels.map(label => (
                            <Badge 
                              key={label._id} 
                              variant="outline" 
                              className="text-[10px] h-4 px-1.5 py-0 min-w-0"
                            >
                              {label.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="font-normal">
                      {card.listName}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={cn("capitalize border-none", getPriorityColor(card.priority))}>
                      {card.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {card.due_date ? (
                      <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(card.due_date), "dd/MM/yyyy")}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {card._membersCache?.map(member => (
                        <Avatar key={member._id} className="h-6 w-6 border-2 border-background shadow-sm">
                          <AvatarImage src={member.avatar?.url} />
                          <AvatarFallback className="text-[10px]">
                            {member.full_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                       <span className="flex items-center gap-1 text-[11px]" title="Bình luận">
                         <MessageSquare className="h-3 w-3" />
                         {card.comment_count || 0}
                       </span>
                       <span className="flex items-center gap-1 text-[11px]" title="Tệp đính kèm">
                         <Paperclip className="h-3 w-3" />
                         {card.attachment_count || 0}
                       </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CardDetailDialog 
        card={cards[selectedCardId]}
        cardId={selectedCardId}
        listId={cards[selectedCardId]?.listId}
        boardId={currentBoard?._id}
        open={!!selectedCardId}
        onOpenChange={(open) => !open && setSelectedCardId(null)}
      />
    </div>
  );
}

export default BoardTableView;
