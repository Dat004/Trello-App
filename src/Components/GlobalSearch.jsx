import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { boardDetailPath } from "@/config/paths";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from "@/Components/UI";

const SEARCH_LIMIT = 8;
const EMPTY_RESULTS = {
  boards: [],
  cards: [],
  members: [],
  pagination: {
    skip: 0,
    limit: SEARCH_LIMIT,
    hasMoreBoards: false,
    hasMoreCards: false,
    nextSkip: 0,
  },
};

const GlobalSearch = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [results, setResults] = useState(EMPTY_RESULTS);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 400);
  const itemRefs = useRef([]);

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("trello_recent_searches");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const flatItems = useMemo(() => {
    if (!query.trim()) {
      return recentSearches.map((item) => ({
        ...item,
        key: `recent-${item.type}-${item._id}`,
      }));
    }

    return [
      ...results.boards.map((board) => ({
        ...board,
        type: "board",
        key: `board-${board._id}`,
      })),
      ...results.cards.map((card) => ({
        ...card,
        type: "card",
        key: `card-${card._id}`,
      })),
      ...results.members.map((member) => ({
        ...member,
        type: "member",
        key: `member-${member._id}`,
      })),
    ];
  }, [query, recentSearches, results]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery, open, recentSearches.length]);

  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el?.scrollIntoView) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, flatItems.length]);

  useEffect(() => {
    if (!open) return;

    if (!debouncedQuery.trim()) {
      setResults(EMPTY_RESULTS);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await searchApi.search(debouncedQuery, {
          limit: SEARCH_LIMIT,
          skip: 0,
        });
        if (!cancelled && res?.data?.success) {
          setResults({
            boards: res.data.data.boards || [],
            cards: res.data.data.cards || [],
            members: res.data.data.members || [],
            pagination: res.data.data.pagination || EMPTY_RESULTS.pagination,
          });
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchResults();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, open]);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback((item) => {
    const saved = localStorage.getItem("trello_recent_searches");
    const currentHistory = saved ? JSON.parse(saved) : [];
    const filtered = currentHistory.filter((i) => i._id !== item._id);
    const newHistory = [item, ...filtered].slice(0, 6);

    localStorage.setItem("trello_recent_searches", JSON.stringify(newHistory));
    setRecentSearches(newHistory);
    setOpen(false);
    setQuery("");

    if (item.type === "board") {
      navigate(boardDetailPath(item._id));
    } else if (item.type === "card") {
      navigate(boardDetailPath(item.boardId, item._id));
    } else if (item.type === "member") {
      navigate("/members");
    }
  }, [navigate]);

  const handleLoadMore = useCallback(async () => {
    if (!debouncedQuery.trim() || loadingMore) return;
    const { hasMoreBoards, hasMoreCards, nextSkip } = results.pagination || {};
    if (!hasMoreBoards && !hasMoreCards) return;

    setLoadingMore(true);
    try {
      const res = await searchApi.search(debouncedQuery, {
        limit: SEARCH_LIMIT,
        skip: nextSkip ?? SEARCH_LIMIT,
      });
      if (res?.data?.success) {
        const data = res.data.data;
        setResults((prev) => ({
          boards: [...prev.boards, ...(data.boards || [])],
          cards: [...prev.cards, ...(data.cards || [])],
          members: [...prev.members, ...(data.members || [])],
          pagination: data.pagination || prev.pagination,
        }));
      }
    } catch (error) {
      console.error("Search load more error:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [debouncedQuery, loadingMore, results.pagination]);

  const handleKeyDown = (e) => {
    if (!flatItems.length) {
      if (e.key === "Escape") setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flatItems.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flatItems.length) % flatItems.length);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(flatItems[activeIndex]);
      return;
    }
  };

  const clearHistory = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("trello_recent_searches");
  };

  const hasResults =
    results.boards.length > 0 ||
    results.cards.length > 0 ||
    results.members.length > 0;
  const canLoadMore =
    results.pagination?.hasMoreBoards || results.pagination?.hasMoreCards;

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
            <DialogTitle className="sr-only">Tìm kiếm bảng và thẻ</DialogTitle>
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
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-expanded={open}
                aria-controls="global-search-listbox"
                aria-activedescendant={
                  flatItems[activeIndex]
                    ? `search-option-${flatItems[activeIndex].key}`
                    : undefined
                }
                autoFocus
              />
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] min-h-[350px] p-2">
            <div
              id="global-search-listbox"
              role="listbox"
              aria-label="Kết quả tìm kiếm"
            >
              {!query && (
                <div className="p-2 space-y-6">
                  <div className="px-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <History className="h-3 w-3" /> Truy cập gần đây
                      </h3>
                      {recentSearches.length > 0 && (
                          <button
                              type="button"
                              onClick={clearHistory}
                              className="text-[10px] text-muted-foreground hover:text-destructive transition-colors font-medium underline-offset-2 hover:underline"
                          >
                              Xóa lịch sử
                          </button>
                      )}
                    </div>

                    {recentSearches.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-primary">
                          {flatItems.map((item, index) => (
                          <SearchItem
                              key={item.key}
                              ref={(el) => { itemRefs.current[index] = el; }}
                              id={`search-option-${item.key}`}
                              item={item}
                              active={index === activeIndex}
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setActiveIndex(index)}
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
                      {results.boards.map((board) => {
                        const item = { ...board, type: "board", key: `board-${board._id}` };
                        const index = flatItems.findIndex((i) => i.key === item.key);
                        return (
                          <SearchItem
                            key={item.key}
                            ref={(el) => { itemRefs.current[index] = el; }}
                            id={`search-option-${item.key}`}
                            item={item}
                            active={index === activeIndex}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIndex(index)}
                          />
                        );
                      })}
                    </SearchGroup>
                  )}

                  {results.cards.length > 0 && (
                    <SearchGroup title="Thẻ công việc (Cards)">
                      {results.cards.map((card) => {
                        const item = { ...card, type: "card", key: `card-${card._id}` };
                        const index = flatItems.findIndex((i) => i.key === item.key);
                        return (
                          <SearchItem
                            key={item.key}
                            ref={(el) => { itemRefs.current[index] = el; }}
                            id={`search-option-${item.key}`}
                            item={item}
                            active={index === activeIndex}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIndex(index)}
                          />
                        );
                      })}
                    </SearchGroup>
                  )}

                  {results.members.length > 0 && (
                    <SearchGroup title="Thành viên (Members)">
                      {results.members.map((member) => {
                        const item = { ...member, type: "member", key: `member-${member._id}` };
                        const index = flatItems.findIndex((i) => i.key === item.key);
                        return (
                          <SearchItem
                            key={item.key}
                            ref={(el) => { itemRefs.current[index] = el; }}
                            id={`search-option-${item.key}`}
                            item={item}
                            active={index === activeIndex}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIndex(index)}
                          />
                        );
                      })}
                    </SearchGroup>
                  )}

                  {canLoadMore && (
                    <div className="px-3 pb-2">
                      <button
                        type="button"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="w-full rounded-lg border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-60"
                      >
                        {loadingMore ? (
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Đang tải thêm...
                          </span>
                        ) : (
                          "Xem thêm kết quả"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-border bg-muted/10 flex items-center justify-between text-[11px] text-muted-foreground px-4 shrink-0">
            <div className="flex items-center gap-3 font-medium">
              <span className="flex items-center gap-1"><kbd className="px-1 border rounded bg-background">↑↓</kbd> Di chuyển</span>
              <span className="flex items-center gap-1"><kbd className="px-1 border rounded bg-background">Enter</kbd> Chọn</span>
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

const SearchItem = ({ item, onClick, active, id, onMouseEnter, ref }) => {
  return (
    <button
      ref={ref}
      id={id}
      type="button"
      role="option"
      aria-selected={active}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl border border-transparent p-2.5 text-left transition-all duration-200 hover:border-border hover:bg-muted active:scale-[0.98]",
        active && "border-border bg-muted"
      )}
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
    </button>
  );
};

export default GlobalSearch;
