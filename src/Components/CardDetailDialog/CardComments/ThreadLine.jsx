import { getLineCenter } from "@/constants/comments";
import { cn } from "@/lib/utils";

function ThreadLine({ className, depth = 0 }) {
    const LINE_CENTER = getLineCenter(depth);
    
    const threadLineStyles = cn("absolute w-[2px] top-0 h-full bg-muted", className);

    const styles = {
        left: `${LINE_CENTER}px`,
    };

    return (
        <span className={threadLineStyles} style={styles}></span>
    );
}

export default ThreadLine;
