import { Trash2 } from "lucide-react";

import { Button, Checkbox } from "@/Components/UI";

function ChecklistItem({ item, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-2 group">
      <Checkbox
        checked={item.completed}
        onCheckedChange={() => onToggle(item._id)}
        id={`check-${item._id}`}
      />
      <label
        htmlFor={`check-${item._id}`}
        className={`flex-1 text-sm cursor-pointer ${
          item.completed
            ? "line-through text-gray-500"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {item.text}
      </label>
      <Button
        size="sm"
        variant="link"
        className="h-6 w-6 p-0 opacity-0 text-white hover:bg-none group-hover:opacity-100"
        onClick={() => onDelete(item._id)}
      >
        <Trash2 className="h-3 w-3 text-red-500" />
      </Button>
    </div>
  );
}

export default ChecklistItem;
