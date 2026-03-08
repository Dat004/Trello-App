import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { IlamyCalendar, useIlamyCalendarContext } from '@ilamy/calendar';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

import { useBoardContext } from "../../context/BoardStateContext";
import { useFilteredCards } from "../../hooks/useFilteredCards";
import CardDetailDialog from "../Card/CardDetailDialog";
import { Button } from '@/Components/UI';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(timezone);
dayjs.extend(utc);

function CustomHeader() {
  const { currentDate, nextPeriod, view, setView, prevPeriod } = useIlamyCalendarContext();

  return (
    <div className="flex justify-between flex-wrap items-center gap-2 p-1">
      <section>
        <span className="text-sm font-semibold">{currentDate.format('DD/MM/YYYY')}</span>
      </section>
      <section className="flex items-center gap-1">
        <Button className="h-8 px-3 rounded-md text-xs" variant="outline" onClick={prevPeriod}><ChevronLeft /></Button>
        <Button className="h-8 px-3 rounded-md text-xs" variant="outline" onClick={nextPeriod}><ChevronRight /></Button>
        <Button className="h-8 px-3 rounded-md text-xs" variant={view === 'week' ? 'default' : 'outline'} onClick={() => setView('week')}>Tuần</Button>
        <Button className="h-8 px-3 rounded-md text-xs" variant={view === 'month' ? 'default' : 'outline'} onClick={() => setView('month')}>Tháng</Button>
        <Button className="h-8 px-3 rounded-md text-xs" variant={view === 'year' ? 'default' : 'outline'} onClick={() => setView('year')}>Năm</Button>
      </section>
    </div>
  );
}

function BoardCalendarView() {
  const [selectedCardId, setSelectedCardId] = useState(null);

  const { boardData } = useBoardContext();
  const { cards, currentBoard } = boardData;

  const filteredCardsArray = useFilteredCards(Object.values(cards));

  const calendarEvents = useMemo(() => {
    return filteredCardsArray
      .filter(c => c.due_date)
      .map(c => {
        const start = dayjs(c.created_at);
        const end = dayjs(c.due_date);

        return {
          id: c._id,
          title: c.title,
          start,
          end,
          color: c.priority === 'high' ? '#ef4444' : 
                 c.priority === 'medium' ? '#f97316' : '#3b82f6',
          backgroundColor: c.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 
                           c.priority === 'medium' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(59, 130, 246, 0.1)',
          description: c.description,
        }
      })
  }, [cards]);

  const handleEventClick = (event) => {
    setSelectedCardId(event.id);
  };

  return (
    <div className="flex flex-col h-full bg-background p-4 relative">
      <div className="flex-1 bg-card rounded-xl border border-border shadow-md overflow-hidden ilamy-calendar-container">
        <IlamyCalendar 
          onEventClick={handleEventClick}
          onCellClick={(cell) => console.log(cell)}
          disableDragAndDrop
          stickyViewHeader
          timeFormat="24-hour"
          events={calendarEvents}
          headerComponent={<CustomHeader />}
          initialDate={dayjs()}
          initialView="month"
          locale="vi"
          eventSpacing={2}
          dayMaxEvents={3}
        />
      </div>

      <CardDetailDialog 
        card={Object.values(cards).find(c => c._id === selectedCardId)}
        cardId={selectedCardId}
        listId={Object.values(cards).find(c => c._id === selectedCardId)?.listId}
        boardId={currentBoard?._id}
        open={!!selectedCardId}
        onOpenChange={(open) => !open && setSelectedCardId(null)}
      />
    </div>
  );
}

export default BoardCalendarView;
