import { Plus } from "lucide-react";

import BoardFormDialog from "@/Components/BoardFormDialog";

function CreateNewBoard() {
  return (
    <BoardFormDialog
      trigger={
        <div className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 rounded-lg p-4 sm:p-6 h-full min-h-[150px] sm:min-h-[200px]">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-medium text-foreground mb-1 sm:mb-2 text-sm sm:text-base">
              Tạo bảng mới
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Bắt đầu dự án mới với bảng làm việc
            </p>
          </div>
        </div>
      }
    />
  );
}

export default CreateNewBoard;
