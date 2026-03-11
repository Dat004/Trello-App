import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  History,
  Layout,
  Loader2,
  Search
} from "lucide-react";

import { searchApi } from "@/api/search";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dialog,
  DialogContent,
  DialogHeader,
  Input,
  ScrollArea,
} from "@/Components/UI";

const GlobalSearch = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    boards: [],
    cards: [],
    members: [],
  });
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 400);

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("trello_recent_searches");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Debounce search
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults({ boards: [], cards: [], members: [] });
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await searchApi.search(debouncedQuery);
        if (res?.data?.success) {
          setResults(res.data.data);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Lắng nghe phím tắt Ctrl/Cmd + K
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback((item) => {
    // Lấy dữ liệu xem gần đây từ localstorage
    const saved = localStorage.getItem("trello_recent_searches");
    const currentHistory = saved ? JSON.parse(saved) : [];
  
    // Lọc dữ liệu xem gần đây
    const filtered = currentHistory.filter(i => i._id !== item._id);
    const newHistory = [item, ...filtered].slice(0, 6);
    
    // Lưu dữ liệu xem gần đây vào localstorage
    localStorage.setItem("trello_recent_searches", JSON.stringify(newHistory));

    setRecentSearches(newHistory);
    setOpen(false);
    setQuery("");

    // Navigate
    if (item.type === "board") {
      navigate(`/board/${item._id}`);
    } else if (item.type === "card") {
      navigate(`/board/${item.boardId}`);
    } else if (item.type === "member") {
      navigate(`/settings/profile/${item._id}`);
    }
  }, [navigate]);

  const clearHistory = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("trello_recent_searches");
  };

  const hasResults = results.boards.length > 0 || results.cards.length > 0 || results.members.length > 0;

  return (
    <>
      <div onClick={() => setOpen(true)} className="relative group cursor-pointer w-full max-w-[280px]">
        {trigger || (
          <div className="flex items-center gap-2 px-3 py-1.5 h-9 w-64 rounded-md border border-input bg-muted/50 text-muted-foreground hover:bg-muted hover:border-primary/30 transition-all duration-200">
            <Search className="h-4 w-4" />
            <span className="text-sm flex-1">Tìm kiếm dữ liệu...</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 uppercase">
              <span className="text-[12px]">⌘</span>K
            </kbd>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 sm:max-w-[700px] gap-0 border-none bg-background shadow-2xl overflow-hidden rounded-xl">
          <DialogHeader className="p-4 border-b border-border bg-muted/20">
            <div className="relative flex items-center">
              {loading ? (
                 <Loader2 className="absolute left-3 h-5 w-5 text-primary animate-spin" />
              ) : (
                <Search className="absolute left-3 h-5 w-5 text-primary animate-in zoom-in-50 duration-300" />
              )}
              <Input
                placeholder="Gõ tên bảng hoặc thẻ..."
                className="pl-11 h-12 text-lg border-none bg-transparent placeholder:text-muted-foreground/60 w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] min-h-[350px] p-2">
            {!query && (
              <div className="p-2 space-y-6">
                <div className="px-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <History className="h-3 w-3" /> Truy cập gần đây
                    </h3>
                    {recentSearches.length > 0 && (
                        <button 
                            onClick={clearHistory}
                            className="text-[10px] text-muted-foreground hover:text-destructive transition-colors font-medium underline-offset-2 hover:underline"
                        >
                            Xóa lịch sử
                        </button>
                    )}
                  </div>
                  
                  {recentSearches.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-primary">
                        {recentSearches.map((item) => (
                        <SearchItem 
                            key={item._id} 
                            item={item} 
                            onClick={() => handleSelect(item)}
                        />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border border-dashed rounded-xl bg-muted/20">
                        <p className="text-xs text-muted-foreground">Chưa có lịch sử tìm kiếm gần đây.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {query && !loading && !hasResults && (
                <div className="px-3 py-20 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                        <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Không tìm thấy kết quả nào cho "{query}"</p>
                    <p className="text-xs text-muted-foreground mt-1">Hãy thử kiểm tra lại chính tả hoặc dùng từ khóa khác.</p>
                </div>
            )}

            {query && hasResults && (
              <div className="p-2 space-y-6">
                {results.boards.length > 0 && (
                  <SearchGroup title="Bảng (Boards)">
                    {results.boards.map(board => (
                      <SearchItem key={board._id} item={{...board, type: 'board'}} onClick={() => handleSelect({...board, type: 'board'})} />
                    ))}
                  </SearchGroup>
                )}

                {results.cards.length > 0 && (
                  <SearchGroup title="Thẻ công việc (Cards)">
                    {results.cards.map(card => (
                      <SearchItem key={card._id} item={{...card, type: 'card'}} onClick={() => handleSelect({...card, type: 'card'})} />
                    ))}
                  </SearchGroup>
                )}

                {results.members.length > 0 && (
                  <SearchGroup title="Thành viên (Members)">
                    {results.members.map(member => (
                      <SearchItem key={member._id} item={{...member, type: 'member'}} onClick={() => handleSelect({...member, type: 'member'})} />
                    ))}
                  </SearchGroup>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="p-3 border-t border-border bg-muted/10 flex items-center justify-between text-[11px] text-muted-foreground px-4 shrink-0">
            <div className="flex items-center gap-3 font-medium">
              <span className="flex items-center gap-1"><kbd className="px-1 border rounded bg-background">ESC</kbd> Đóng</span>
            </div>
            <div className="flex items-center gap-1 text-primary/70 font-semibold italic">
               Dữ liệu được cập nhật thời gian thực
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const SearchGroup = ({ title, children }) => (
    <div className="px-1">
        <h3 className="px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{title}</h3>
        <div className="space-y-1">{children}</div>
    </div>
);

const SearchItem = ({ item, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted cursor-pointer transition-all duration-200 border border-transparent hover:border-border active:scale-[0.98]"
    >
      <div className={cn(
        "h-10 w-10 rounded-lg flex items-center justify-center shadow-sm shrink-0 overflow-hidden",
        item.type === "card" ? "bg-primary/10 text-primary" : ""
      )}>
        {item.type === "board" ? (
          <div className={cn("w-full h-full flex items-center justify-center text-white", item.color)}>
            <Layout className="h-4 w-4" />
          </div>
        ) : item.type === "member" ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src={item.avatar} />
            <AvatarFallback>{item.displayName?.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <CreditCard className="h-4 w-4" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
            {item.type === "member" ? item.displayName : item.title}
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground truncate">
          {item.type === "board" ? "Không gian bảng" : 
           item.type === "member" ? item.email :
           `Nằm trong: ${item.boardTitle}`}
        </p>
        
        {item.type === "card" && item.labels?.length > 0 && (
           <div className="flex gap-1 mt-1">
              {item.labels.map((label, idx) => (
                <span key={idx} className="h-1 w-4 rounded-full bg-primary/30" />
              ))}
           </div>
        )}
      </div>

      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
    </div>
  );
};

export default GlobalSearch;
