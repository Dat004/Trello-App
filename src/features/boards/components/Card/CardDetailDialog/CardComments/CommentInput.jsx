import { Loader2, Send, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage, Button, Input } from "@/Components/UI";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import { useBoardContext } from "@/features/boards/context/BoardStateContext";
import { useSocket } from "@/hooks";
import { cn } from "@/lib/utils";

function getMentionQuery(text, cursor) {
  const before = text.slice(0, cursor);
  const match = before.match(/(^|\s)@([^\s@]*)$/);
  if (!match) return null;
  return {
    query: match[2] || "",
    start: before.length - match[2].length - 1,
  };
}

// Render the comment text with @mentions wrapped in a highlight span. Used by the
// backdrop overlay so mentions appear highlighted inside the input field.
function renderHighlightedValue(text, labels) {
  if (!text) return null;
  if (!labels.length) return text;

  const sorted = [...labels].filter(Boolean).sort((a, b) => b.length - a.length);
  const matchesAt = (pos) => sorted.find((label) => text.startsWith(label, pos));

  const nodes = [];
  let i = 0;
  let key = 0;

  while (i < text.length) {
    const matched = matchesAt(i);
    if (matched) {
      nodes.push(
        <mark
          key={key++}
          className="rounded bg-primary/15 text-primary font-medium"
        >
          {matched}
        </mark>
      );
      i += matched.length;
    } else {
      const start = i;
      i += 1;
      while (i < text.length && !matchesAt(i)) i += 1;
      nodes.push(<span key={key++}>{text.slice(start, i)}</span>);
    }
  }

  return nodes;
}

function CommentInput({
  cardId,
  user,
  onSubmit,
  onCancel,
  isLoading,
  placeholder = "Viết bình luận...",
  replyToName = null,
  initialText = "",
  initialMentions = [],
  submitLabel,
}) {
  const [value, setValue] = useState(initialText);
  const [mentionIds, setMentionIds] = useState(() =>
    (initialMentions || []).map((m) => m._id || m).filter(Boolean)
  );
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStart, setMentionStart] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef(null);
  const { socket } = useSocket();
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const { boardData } = useBoardContext(false) || {};

  const boardMembers = useMemo(() => {
    return (boardData?.boardMembers || [])
      .map((member) => member.user || member)
      .filter((member) => member?._id && member._id !== user?._id);
  }, [boardData?.boardMembers, user?._id]);

  const filteredMembers = useMemo(() => {
    const q = mentionQuery.toLowerCase();
    return boardMembers
      .filter((member) =>
        (member.full_name || "").toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [boardMembers, mentionQuery]);

  const mentionLabels = useMemo(() => {
    return boardMembers
      .filter((member) => mentionIds.includes(member._id) && member.full_name)
      .map((member) => `@${member.full_name}`);
  }, [boardMembers, mentionIds]);

  const emitTyping = useCallback(
    (isTyping) => {
      if (!socket || !cardId || !user) return;

      if (isTyping) {
        if (!isTypingRef.current) {
          socket.emit(SOCKET_EVENTS.CARD_TYPING_START, { cardId, user });
          isTypingRef.current = true;
        }
      } else if (isTypingRef.current) {
        socket.emit(SOCKET_EVENTS.CARD_TYPING_STOP, { cardId, user });
        isTypingRef.current = false;
      }
    },
    [cardId, socket, user]
  );

  const updateMentionState = (text, cursor) => {
    const mention = getMentionQuery(text, cursor);
    if (!mention) {
      setMentionOpen(false);
      setMentionQuery("");
      setMentionStart(null);
      return;
    }
    setMentionOpen(true);
    setMentionQuery(mention.query);
    setMentionStart(mention.start);
    setActiveIndex(0);
  };

  const handleValueChange = (e) => {
    const val = e.target.value;
    const cursor = e.target.selectionStart ?? val.length;
    setValue(val);
    updateMentionState(val, cursor);

    emitTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 2000);
  };

  const insertMention = (member) => {
    if (mentionStart == null) return;
    const before = value.slice(0, mentionStart);
    const cursor = inputRef.current?.selectionStart ?? value.length;
    const after = value.slice(cursor);
    const inserted = `@${member.full_name} `;
    const next = `${before}${inserted}${after}`;
    setValue(next);
    setMentionIds((prev) =>
      prev.includes(member._id) ? prev : [...prev, member._id]
    );
    setMentionOpen(false);
    setMentionQuery("");
    setMentionStart(null);

    requestAnimationFrame(() => {
      const pos = before.length + inserted.length;
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(pos, pos);
    });
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      emitTyping(false);
    };
  }, [emitTyping]);

  const resolveMentionsForSubmit = () => {
    const lowerText = value.toLowerCase();
    return boardMembers
      .filter(
        (member) =>
          mentionIds.includes(member._id) &&
          lowerText.includes(`@${(member.full_name || "").toLowerCase()}`)
      )
      .map((member) => member._id);
  };

  const handleSubmit = () => {
    if (!value.trim()) return;

    onSubmit({
      text: value.trim(),
      mentions: resolveMentionsForSubmit(),
    });
    if (!initialText) {
      setValue("");
      setMentionIds([]);
    }
  };

  const handleKeyDown = (e) => {
    if (mentionOpen && filteredMembers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filteredMembers.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(
          (i) => (i - 1 + filteredMembers.length) % filteredMembers.length
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertMention(filteredMembers[activeIndex]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setMentionOpen(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape" && onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-2 relative">
      {replyToName && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Đang trả lời</span>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {replyToName}
          </span>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      <div className="flex gap-2 items-center relative">
        <div className="relative flex-1">
          {mentionLabels.length > 0 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-pre rounded-full px-4 py-2 text-sm text-foreground"
            >
              {renderHighlightedValue(value, mentionLabels)}
            </div>
          )}
          <Input
            ref={inputRef}
            value={value}
            onChange={handleValueChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={placeholder}
            className={cn(
              "rounded-full px-4 py-2 h-10",
              mentionLabels.length > 0 && "relative bg-transparent text-transparent caret-primary"
            )}
            autoFocus
          />

          {mentionOpen && filteredMembers.length > 0 && (
            <div className="absolute left-0 right-0 bottom-full mb-1 z-50 rounded-xl border border-border bg-popover shadow-lg overflow-hidden">
              {filteredMembers.map((member, index) => (
                <button
                  key={member._id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertMention(member);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted",
                    index === activeIndex && "bg-muted"
                  )}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar?.url} alt={member.full_name} />
                    <AvatarFallback className="text-[10px]">
                      {member.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium truncate">{member.full_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          className="rounded-full h-10 w-10 shrink-0"
          title={submitLabel || "Gửi"}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      <p className="text-[11px] text-muted-foreground px-1">
        Gõ @ để nhắc thành viên board
      </p>
    </div>
  );
}

export default CommentInput;
