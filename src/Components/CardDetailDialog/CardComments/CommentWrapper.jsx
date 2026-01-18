import { DEPTH_SPACE } from "@/constants/comments";
import { cn } from "@/lib/utils";

function CommentWrapper({ children, depth = 0, isReply = false }) {
    const marginLeft = depth * DEPTH_SPACE;

    return (
        <section className="relative">
            <section 
                className={cn("pt-1", { "pt-0": !isReply })}
                style={{ marginLeft: `${marginLeft}px` }}
            >
                {children}
            </section>
        </section>
    );
}

export default CommentWrapper;
