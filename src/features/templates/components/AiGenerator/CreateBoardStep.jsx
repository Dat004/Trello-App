import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Bot, ChevronRight, Layout, Loader2 } from "lucide-react";

import { useWorkspacesList } from "@/features/workspaces/api/useWorkspacesList";
import { WORKSPACE_KEYS } from "@/features/workspaces/api/useWorkspaceDetail";
import { BOARD_KEYS } from "@/features/boards/api/useBoards";
import { UserToast } from "@/context/ToastContext";
import { templatesApi } from "@/api/templates";
import {
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/UI";

function CreateBoardStep({ template, onBack, onCreated }) {
  const [boardTitle, setBoardTitle] = useState(`${template.name} - ${new Date().toLocaleDateString("vi-VN")}`);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { data: workspaces = [] } = useWorkspacesList();
  const queryClient = useQueryClient();
  const { addToast } = UserToast();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!boardTitle.trim()) {
      addToast({ type: "error", title: "Vui lòng nhập tên board!" });
      return;
    }

    setIsCreating(true);
    try {
      const workspaceId = (selectedWorkspace && selectedWorkspace !== 'none') ? selectedWorkspace : undefined;
      const res = await templatesApi.createBoardFromTemplate(template._id, {
        title: boardTitle,
        workspaceId,
      });

      if (res?.data?.success) {
        queryClient.invalidateQueries(BOARD_KEYS.all);
        if (workspaceId) {
          queryClient.invalidateQueries(WORKSPACE_KEYS.detail(workspaceId));
        }
        onCreated(res.data.data.board);
      } else {
        addToast({ type: "error", title: res?.data?.message || "Lỗi tạo bảng" });
      }
    } catch (err) {
      addToast({ type: "error", title: "Lỗi kết nối server" });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onSubmit={handleCreate} 
      className="space-y-6"
    >
      <div className="p-4 bg-muted/40 rounded-2xl flex items-center gap-4 border border-border/50">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-sm">
          <Layout className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-foreground truncate">{template.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Bot className="w-3 h-3" /> AI Generated Template
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ai-board-title" className="text-sm font-semibold">Tên Board mới</Label>
          <Input
            id="ai-board-title"
            placeholder="Ví dụ: Dự án Tiktok tháng 12"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            className="rounded-xl h-11 border-border/60"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai-workspace" className="text-sm font-semibold">Workspace đích</Label>
          <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
            <SelectTrigger className="rounded-xl h-11 border-border/60">
              <SelectValue placeholder="Chọn không gian làm việc..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="none" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-slate-400 shadow-sm" />
                  <span className="font-medium">Bảng cá nhân (Không có Workspace)</span>
                </div>
              </SelectItem>
              {workspaces.map((ws) => (
                <SelectItem key={ws._id} value={ws._id} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${ws.color || 'bg-blue-500'} shadow-sm`} />
                    <span className="font-medium">{ws.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="rounded-xl h-11 px-4 gap-2 border-border/60"
        >
          <ArrowLeft className="w-4 h-4" />
          Tiền độ
        </Button>
        <Button
          type="submit"
          disabled={!boardTitle.trim() || isCreating}
          className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/20 rounded-xl h-11 text-base font-semibold"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang hoàn tất...
            </>
          ) : (
            <>
              Tạo Board Ngay
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
}

export default CreateBoardStep;
