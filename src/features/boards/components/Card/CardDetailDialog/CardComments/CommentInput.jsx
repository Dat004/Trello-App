import { Loader2, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button, Input } from "@/Components/UI";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import { useSocket } from "@/hooks";

function CommentInput({ 
  cardId,
  user,
  onSubmit, 
  onCancel, 
  isLoading, 
  placeholder = "Viết bình luận...", 
  replyTo = null,
  replyToName = null 
}) {
  const [value, setValue] = useState("");
  const { socket } = useSocket();
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const emitTyping = (isTyping) => {
    if (!socket || !cardId || !user) return;
    
    if (isTyping) {
        if (!isTypingRef.current) {
            socket.emit(SOCKET_EVENTS.CARD_TYPING_START, { cardId, user });
            isTypingRef.current = true;
        }
    } else {
        if (isTypingRef.current) {
            socket.emit(SOCKET_EVENTS.CARD_TYPING_STOP, { cardId, user });
            isTypingRef.current = false;
        }
    }
  };

  const handleValueChange = (e) => {
    const val = e.target.value;
    setValue(val);
    
    // Start typing
    emitTyping(true);
    
    // Debounce stop typing
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
        emitTyping(false);
    }, 2000);
  };

  // Cleanup typing on unmount
  useEffect(() => {
    return () => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        emitTyping(false);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape" && onCancel) {
      onCancel();
    }
  };

  const handleSubmit = () => {
    if (!value.trim()) return;

    onSubmit({
      text: value,
      mentions: [],
    });
    setValue("");
  };

  return (
    <div className="space-y-2">
      {/* Reply to indicator */}
      {replyToName && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Đang trả lời</span>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {replyToName}
          </span>
          {onCancel && (
            <button 
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
      
      {/* Input row */}
      <div className="flex gap-2 items-center">
        <Input
          value={value}
          onChange={handleValueChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={placeholder}
          className="rounded-full px-4 py-2 h-10"
          autoFocus
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          className="rounded-full h-10 w-10 shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default CommentInput;
