import { cn } from "@/lib/utils";
import {
    AlertCircle,
    BarChart,
    CheckSquare,
    Layout,
    PieChart,
    TrendingUp
} from "lucide-react";
import { useMemo } from "react";
import { useBoardContext } from "../../context/BoardStateContext";

function BoardAnalyticsView() {
  const { boardData } = useBoardContext();
  const { cards, lists, listOrder } = boardData;

  const stats = useMemo(() => {
    const allCards = Object.values(cards);
    const totalCards = allCards.length;
    
    // Cards by list
    const byList = listOrder.map(listId => ({
      name: lists[listId]?.title || 'Unknown',
      count: allCards.filter(c => (c.listId || c.list) === listId).length,
      color: lists[listId]?.color || 'blue'
    }));

    // Cards by priority
    const priorities = ['high', 'medium', 'low', 'none'];
    const byPriority = priorities.map(p => ({
      name: p === 'none' ? 'Không ưu tiên' : p.charAt(0).toUpperCase() + p.slice(1),
      count: allCards.filter(c => (c.priority || 'none') === p).length,
      key: p
    }));

    // Cards by members
    const memberCounts = {};
    allCards.forEach(card => {
        card.memberIds?.forEach(id => {
            memberCounts[id] = (memberCounts[id] || 0) + 1;
        });
    });

    const completionRate = totalCards > 0 
      ? Math.round((allCards.filter(c => c.listName?.toLowerCase().includes('xong') || c.listName?.toLowerCase().includes('done')).length / totalCards) * 100) 
      : 0;

    return { totalCards, byList, byPriority, completionRate, totalLists: listOrder.length };
  }, [cards, lists, listOrder]);

  return (
    <div className="p-6 h-full overflow-y-auto bg-muted/30">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Summary Cards */}
        <StatCard 
          title="Tổng số thẻ" 
          value={stats.totalCards} 
          icon={<CheckSquare className="h-5 w-5" />}
          color="blue"
        />
        <StatCard 
          title="Tổng danh sách" 
          value={stats.totalLists} 
          icon={<Layout className="h-5 w-5" />}
          color="purple"
        />
        <StatCard 
          title="Tỷ lệ hoàn thành" 
          value={`${stats.completionRate}%`} 
          icon={<TrendingUp className="h-5 w-5" />}
          color="emerald"
        />
        <StatCard 
          title="Thẻ quá hạn" 
          value={Object.values(cards).filter(c => c.due_date && new Date(c.due_date) < new Date()).length} 
          icon={<AlertCircle className="h-5 w-5" />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Cards by List Chart */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <BarChart className="h-4 w-4 text-primary" />
              Phân bổ thẻ theo danh sách
            </h3>
          </div>
          <div className="space-y-4">
            {stats.byList.map(item => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${stats.totalCards > 0 ? (item.count / stats.totalCards) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
           <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Mức độ ưu tiên
            </h3>
          </div>
          <div className="flex items-center justify-around h-64">
             {/* Visual "Donut" using pseudo circles if no library */}
             <div className="relative h-40 w-40 flex items-center justify-center rounded-full border-8 border-muted">
                <div className="text-center">
                    <div className="text-2xl font-bold">{stats.totalCards}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Tổng số</div>
                </div>
             </div>
             <div className="space-y-3">
                {stats.byPriority.map(item => (
                    <div key={item.key} className="flex items-center gap-3">
                        <div className={cn("w-3 h-3 rounded-full", 
                            item.key === 'high' ? 'bg-red-500' :
                            item.key === 'medium' ? 'bg-orange-500' :
                            item.key === 'low' ? 'bg-green-500' : 'bg-gray-400'
                        )} />
                        <span className="text-sm text-muted-foreground w-24">{item.name}</span>
                        <span className="text-sm font-bold">{item.count}</span>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
    const colors = {
        blue: "bg-blue-500/10 text-blue-600 border-blue-200",
        purple: "bg-purple-500/10 text-purple-600 border-purple-200",
        emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
        red: "bg-red-500/10 text-red-600 border-red-200",
    };

    return (
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-lg border", colors[color])}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-black text-foreground">{value}</h3>
            </div>
        </div>
    );
}

export default BoardAnalyticsView;
