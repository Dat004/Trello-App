import { Copy } from "lucide-react";
import { useState } from "react";

import { templatesApi } from "@/api/templates";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI";
import { UserToast } from "@/context/ToastContext";
import { BOARD_KEYS } from "@/features/boards/api/useBoards";
import { WORKSPACE_KEYS } from "@/features/workspaces/api/useWorkspaceDetail";
import { useWorkspacesList } from "@/features/workspaces/api/useWorkspacesList";
import { getCategoryIcon } from "@/helpers/fileIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreateBoardFromTemplateDialog({ template, trigger }) {
  const [open, setOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState(
    `${template.name} - ${new Date().toLocaleDateString()}`
  );
  const [selectedWorkspace, setSelectedWorkspace] = useState("");

  const ICON = getCategoryIcon[template.category] || Copy;
  
  // React Query Hooks
  const { data: workspaces = [] } = useWorkspacesList();
  const queryClient = useQueryClient();
  const { addToast } = UserToast();

  const { mutate: createBoardFromTemplate, isPending: isLoading } = useMutation({
    mutationFn: (data) => templatesApi.createBoardFromTemplate(template._id, data),
    onSuccess: (res) => {
        if(res?.data?.success) {
             queryClient.invalidateQueries(BOARD_KEYS.all);
             if (selectedWorkspace) {
                 queryClient.invalidateQueries(WORKSPACE_KEYS.detail(selectedWorkspace));
             }
             addToast({ type: "success", title: "Tạo bảng thành công" });
             setOpen(false);
        } else {
             addToast({ type: "error", title: res?.data?.message || "Có lỗi xảy ra" });
        }
    },
    onError: (err) => {
        addToast({ type: "error", title: "Có lỗi xảy ra khi tạo bảng" });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!boardTitle.trim()) return;

    createBoardFromTemplate({
      title: boardTitle,
      workspaceId: selectedWorkspace,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <section
              className={`h-8 w-8 rounded-lg ${template.color} flex items-center justify-center`}
            >
              <div className="text-white text-sm">{<ICON className="h-5 w-5" />}</div>
            </section>
            Tạo bảng từ mẫu
          </DialogTitle>
          <DialogDescription>
            Tạo bảng mới dựa trên mẫu "{template.name}" với{" "}
            {template.lists.length} cột được thiết kế sẵn.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Template Info */}
          <section className="p-3 bg-muted/50 rounded-lg">
            <section className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-sm">Mẫu được chọn:</h4>
              <Badge variant="secondary" className="text-xs">
                {template.usageCount?.toLocaleString()} lượt dùng
              </Badge>
            </section>
            <section className="flex flex-wrap gap-1">
              {template.lists.map((list) => (
                <Badge key={list._id} variant="outline" className="text-xs">
                  {list.name}
                </Badge>
              ))}
            </section>
          </section>

          <div className="space-y-2">
            <Label htmlFor="boardTitle">Tên bảng</Label>
            <Input
              id="boardTitle"
              placeholder="Nhập tên bảng..."
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              required
            />
          </div>

          <section className="space-y-2">
            <Label htmlFor="workspace">Workspace</Label>
            <Select
              value={selectedWorkspace}
              onValueChange={setSelectedWorkspace}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                    {/* Placeholder Icon */}
                    <SelectValue placeholder="Chọn workspace" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((workspace) => (
                  <SelectItem key={workspace._id} value={workspace._id}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${workspace.color}`}
                      />
                      {workspace.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="leading-1.5"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={!boardTitle.trim() || isLoading}
              className="leading-1.5 gap-2"
            >
              {isLoading ? "Đang tạo..." : (
                <>
                    <Copy className="h-4 w-4" />
                    Tạo bảng
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateBoardFromTemplateDialog;
