import { Plus } from "lucide-react";

import BoardFormDialog from "@/Components/BoardFormDialog";

function CreateNewBoard() {
  return (
    <BoardFormDialog
      trigger={
        <div className="group h-full min-h-[220px] cursor-pointer relative overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 transition-all duration-300 hover:border-primary/40 hover:bg-primary/[0.02] hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-14 w-14 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:border-primary/30 transition-all duration-300">
                <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
            <h3 className="font-bold text-foreground mb-2 text-base group-hover:text-primary transition-colors">
              Tạo bảng mới
            </h3>
            <p className="text-xs text-muted-foreground max-w-[180px] leading-relaxed">
              Bắt đầu dự án mới và cộng tác cùng đồng đội
            </p>
          </div>
          
          {/* Subtle Corner Decoration */}
          <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
        </div>
      }
    />
  );
}

export default CreateNewBoard;
