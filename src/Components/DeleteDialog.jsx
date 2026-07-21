import { AlertTriangle, Loader2 } from "lucide-react"; // Icon cảnh báo
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from "./UI";
import { cn } from "@/lib/utils";

function DeleteDialog({
  title = "Bạn có chắc chắn không?",
  description = "Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn.",
  onConfirm,
  trigger,
  confirmLabel = "Xóa ngay",
  confirmVariant = "destructive",
  loadingLabel = "Đang xử lý...",
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
        await onConfirm();
        setOpen(false);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              confirmVariant === "destructive" ? "bg-destructive/10" : "bg-primary/10"
            )}>
              <AlertTriangle className={cn(
                "h-6 w-6",
                confirmVariant === "destructive" ? "text-destructive" : "text-primary"
              )} />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => setOpen(false)}
          >
            Hủy bỏ
          </Button>
          <Button 
            type="button" 
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{loadingLabel}</span>
                </div>
            ) : (
                confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialog;
