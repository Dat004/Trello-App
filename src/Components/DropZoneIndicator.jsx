import { cn } from "@/lib/utils";

function DropZoneIndicator({ className, isActive, position }) {
  if (!isActive) return null;

  const positionClasses = {
    top: "top-0 left-0 right-0 h-1",
    bottom: "bottom-0 left-0 right-0 h-1",
    left: "left-0 top-0 bottom-0 w-1",
    right: "right-0 top-0 bottom-0 w-1",
  };

  return (
    <div
      className={cn(
        "absolute bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50",
        "before:absolute before:inset-0 before:bg-emerald-400 before:rounded-full before:animate-ping",
        positionClasses[position],
        className
      )}
    />
  );
}

export default DropZoneIndicator;
