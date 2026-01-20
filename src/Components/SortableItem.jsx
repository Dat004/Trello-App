import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({
  id,
  children,
  type = "card",
  className = "",
  renderComponent,
  disabled = false,
  data = {},
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled,
    data: {
      type,
      ...data,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : "auto",
    touchAction: "none",
    position: "relative",
  };

  if (renderComponent) {
    return renderComponent({
      setNodeRef,
      style,
      isDragging,
      attributes,
      listeners,
    });
  }

  return (
    <div ref={setNodeRef} style={style} className={className} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default SortableItem;
