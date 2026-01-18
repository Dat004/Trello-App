import { getLineCenter } from "@/constants/comments";
import { cn } from "@/lib/utils";

function ReplyLine({ className, isReply = false, depth = 0 }) {
    const LINE_CENTER = getLineCenter(depth);

    const replyLineStyles = cn("absolute top-0 border-t-transparent border-b-2 border-l-2 border-muted rounded-es-xl bg-transparent", {
        "h-1/2 w-[18px] -top-1/2 translate-y-1/2": isReply,
        "h-[20px] w-[24px]": !isReply,
        [className]: className,
    });

    const styles = {
        left: `${LINE_CENTER}px`,
    };

    return (
        <span className={replyLineStyles} style={styles}></span>
    );
}

export default ReplyLine;