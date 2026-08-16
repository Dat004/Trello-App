import { Building2, LayoutGrid, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import BoardFormDialog from "@/features/boards/components/Dialogs/BoardFormDialog";
import { Button } from "@/Components/UI";

function QuickActionsBar() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-card border border-border shadow-xs">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
        Thao tác nhanh:
      </span>

      <BoardFormDialog
        trigger={
          <Button size="sm" className="h-9 px-3.5 text-xs font-medium inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Tạo bảng mới</span>
          </Button>
        }
      />

      <Button variant="outline" size="sm" className="h-9 px-3.5 text-xs font-medium" asChild>
        <Link to="/boards" className="inline-flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-primary" />
          <span>Tất cả bảng</span>
        </Link>
      </Button>

      <Button variant="outline" size="sm" className="h-9 px-3.5 text-xs font-medium" asChild>
        <Link to="/workspaces" className="inline-flex items-center gap-2">
          <Building2 className="h-4 w-4 text-blue-500" />
          <span>Workspace</span>
        </Link>
      </Button>
    </div>
  );
}

export default QuickActionsBar;
