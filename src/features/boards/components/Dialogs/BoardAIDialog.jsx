import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, Bot, User } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  ScrollArea,
} from "@/Components/UI";
import { aiApi } from "@/api/ai";
import { cn } from "@/lib/utils";
import { UserToast } from "@/context/ToastContext";

const QUICK_ACTIONS = [
  { id: "summarize", label: "Tóm tắt tình hình", query: "Hãy phân tích và tóm tắt ngắn gọn tình hình hiện tại của bảng này (tiến độ, số lượng thẻ của từng danh sách)." },
  { id: "urgent", label: "Việc khẩn cấp", query: "Bảng này có những thẻ công việc nào đang cận hạn, quá hạn hoặc có mức độ ưu tiên cao cần tập trung xử lý không?" },
  { id: "stuck", label: "Điểm nghẽn", query: "Phân tích xem bảng có dấu hiệu bị kẹt (nhiều thẻ tập trung ở một công đoạn) không, và đưa ra 1-2 lời khuyên cải thiện." },
];

function BoardAIDialog({ trigger, boardId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Chào bạn! Mình là AI Magic. Mình có thể đọc thông tin trên bảng này để giúp bạn tổng hợp, tìm việc trễ hạn, hoặc lên kế hoạch. Bạn cần mình giúp gì?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  
  const { addToast } = UserToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (query) => {
    const textToSend = query || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    // Hiển thị tin nhắn người dùng
    setMessages((prev) => [...prev, { role: "user", content: textToSend.trim() }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await aiApi.analyzeBoard(boardId, { query: textToSend.trim() });

      if (res?.data?.success) {
         setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.data.data.response },
        ]);
      } else {
         addToast({ type: "error", title: "Có lỗi xảy ra", duration: 3000 });
         setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res?.data?.message },
        ]);
      }
    } catch (error) {
      console.error("AI Assistant error:", error);
      addToast({ type: "error", title: "Lỗi kết nối", duration: 3000 });
       setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Lỗi kết nối." },
        ]);
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px] h-[85vh] sm:h-[600px] flex flex-col p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <DialogHeader className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
               <Sparkles className="h-4 w-4" />
            </span>
            AI Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col bg-background/50">
          {/* Vùng Thao Tác Nhanh */}
          <div className="p-3 border-b border-border bg-card/80 backdrop-blur-sm shrink-0">
             <div className="flex gap-2 relative overflow-x-auto pb-1 hide-scrollbar">
                {QUICK_ACTIONS.map(action => (
                   <Button 
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage(action.query)}
                      disabled={isLoading}
                      className="shrink-0 text-xs font-semibold rounded-full h-8 px-4 border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50"
                   >
                     {action.label}
                   </Button>
                ))}
             </div>
          </div>

          <ScrollArea className="flex-1 p-4">
             <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={cn("flex items-start gap-3 text-sm", msg.role === "user" ? "flex-row-reverse" : "")}>
                     <div className={cn(
                       "h-8 w-8 shrink-0 rounded-full flex items-center justify-center shadow-sm", 
                       msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                     )}>
                        {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                     </div>
                     <div className={cn(
                        "rounded-2xl px-4 py-2.5 max-w-[85%] whitespace-pre-wrap", 
                        msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm shadow-sm" : "bg-card border border-border rounded-tl-sm shadow-sm"
                      )}>
                       {msg.content}
                     </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start gap-3 text-sm">
                     <div className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center shadow-sm bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                     </div>
                     <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
                        <span className="h-1.5 w-1.5 bg-primary/60 rounded-full animate-bounce" />
                        <span className="h-1.5 w-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                     </div>
                  </div>
                )}
                <div ref={scrollRef} />
             </div>
          </ScrollArea>
        </div>

        <div className="p-4 border-t border-border bg-card shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-center gap-2"
          >
            <Input 
               placeholder="Nhập câu hỏi hoặc yêu cầu..."
               value={inputMessage}
               onChange={(e) => setInputMessage(e.target.value)}
               disabled={isLoading}
               className="flex-1 rounded-full px-4 border-primary/20 focus-visible:ring-primary/40 outline-none shadow-sm h-10"
            />
            <Button 
               type="submit" 
               size="icon" 
               disabled={!inputMessage.trim() || isLoading}
               className="rounded-full shrink-0 h-10 w-10 shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

      </DialogContent>
    </Dialog>
  );
}

export default BoardAIDialog;
