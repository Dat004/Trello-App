import { useState } from "react";
import { Filter, X, User, Clock, AlertCircle, CheckCircle2, Search } from "lucide-react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Checkbox,
  Input,
  Label,
  ScrollArea,
  Separator,
} from "@/Components/UI";
import { useBoardFilter } from "../../context/BoardFilterContext";
import { useBoardContext } from "../../context/BoardStateContext";
import { cn } from "@/lib/utils";

function BoardFilterDialog({ trigger }) {
  const [memberSearch, setMemberSearch] = useState("");
  const { 
    filters, 
    clearFilters, 
    toggleMemberFilter, 
    setPriorityFilter, 
    toggleOverdueFilter, 
    setCompletedFilter,
    isFiltering 
  } = useBoardFilter();
  
  const { boardData } = useBoardContext();
  const members = boardData?.boardMembers || [];

  const filteredMembers = members.filter(member => 
    member.user.full_name?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Filter className="h-5 w-5 text-primary" />
              Bộ lọc thẻ
            </DialogTitle>
            {isFiltering && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-8 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
              >
                Xóa tất cả
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] px-6 pb-6">
          <div className="space-y-6 py-4">
            {/* Members Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4 text-blue-500" />
                  Thành viên
                </h4>
                <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5">
                  {filters.memberIds.length} đã chọn
                </Badge>
              </div>
              
              <div className="relative" onMouseDown={(e) => e.stopPropagation()}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên thành viên..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl bg-muted/50 focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 gap-1 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <div 
                      key={member.user._id}
                      className="flex items-center space-x-3 p-2 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer select-none"
                      onClick={() => toggleMemberFilter(member.user._id)}
                    >
                      <Checkbox 
                        id={`member-${member.user._id}`}
                        checked={filters.memberIds.includes(member.user._id)}
                        className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary pointer-events-none"
                      />
                      <div className="flex items-center gap-3 flex-1">
                         <div className="h-7 w-7 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-500 flex-shrink-0">
                            {member.user.avatar.url ? (
                                <img src={member.user.avatar.url} alt={member.user.full_name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-white">
                                    {member.user.full_name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {member.user.full_name}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-muted-foreground italic">
                    Không tìm thấy thành viên nào
                  </div>
                )}
              </div>
            </div>

            {/* Time Filter */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4 text-orange-500" />
                Thời gian
              </h4>
              <div 
                className="flex items-center space-x-3 px-6 py-2 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer select-none"
                onClick={toggleOverdueFilter}
              >
                <Checkbox 
                  id="overdue" 
                  checked={filters.isOverdue}
                  className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 pointer-events-none"
                />
                <span className="text-sm font-medium flex-1">Thẻ quá hạn</span>
              </div>
            </div>

            <Separator />

            {/* Priority Filter */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Độ ưu tiên
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { id: 'high', label: 'Ưu tiên Cao', color: 'bg-red-500' },
                  { id: 'medium', label: 'Ưu tiên Trung bình', color: 'bg-yellow-500' },
                  { id: 'low', label: 'Ưu tiên Thấp', color: 'bg-blue-500' }
                ].map((p) => (
                  <div 
                    key={p.id}
                    className="flex items-center space-x-3 px-6 py-2 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer select-none"
                    onClick={() => setPriorityFilter(p.id)}
                  >
                    <Checkbox 
                      id={`prio-${p.id}`}
                      checked={filters.priority === p.id}
                      className={cn("rounded-md border-muted-foreground/30 pointer-events-none", filters.priority === p.id && p.color, filters.priority === p.id && "border-none")}
                    />
                    <div className="flex items-center gap-2 text-sm font-medium flex-1">
                       <div className={cn("h-2 w-2 rounded-full", p.color)} />
                       {p.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Status Filter */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Trạng thái
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { id: true, label: 'Đã hoàn thành' },
                  { id: false, label: 'Chưa hoàn thành' }
                ].map((s) => (
                  <div 
                    key={s.label}
                    className="flex items-center space-x-3 px-6 py-2 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer select-none"
                    onClick={() => setCompletedFilter(s.id)}
                  >
                    <Checkbox 
                      id={`status-${s.id}`}
                      checked={filters.isCompleted === s.id}
                      className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 pointer-events-none"
                    />
                    <span className="text-sm font-medium flex-1">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default BoardFilterDialog;
