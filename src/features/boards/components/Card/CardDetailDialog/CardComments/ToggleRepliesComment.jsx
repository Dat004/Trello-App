import { ChevronDown, ChevronUp } from "lucide-react";

import CommentWrapper from "./CommentWrapper";
import ReplyLine from "./ReplyLine";
import ThreadLine from "./ThreadLine";

function ToggleRepliesComment({ comment, handleToggleReplies, showReplies, isLoadingThread }) {
    const hasReplies = comment.reply_count > 0;
    const repliesCount = comment.reply_count || 0;
    const depth = comment.depth;

    return (
        <CommentWrapper depth={depth}>
            {Array.from({ length: depth }).map((_, i) => (
                <ThreadLine key={i} depth={i} />
            ))}
            {repliesCount && <ReplyLine depth={depth} />}
            
            {hasReplies && (
                <div className="relative min-h-8 flex items-center">
                    <button
                        onClick={handleToggleReplies}
                        disabled={isLoadingThread}
                        className="ml-11 flex items-center gap-1 text-xs font-semibold text-primary hover:underline disabled:opacity-50"
                    >
                        {isLoadingThread ? (
                            <>Đang tải...</>
                        ) : showReplies ? (
                            <>
                                <ChevronUp className="h-3 w-3" />
                                Ẩn {repliesCount} câu trả lời
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-3 w-3" />
                                Xem {repliesCount} câu trả lời
                            </>
                        )}
                    </button>
                </div>
            )}
        </CommentWrapper>
    );
}

export default ToggleRepliesComment;