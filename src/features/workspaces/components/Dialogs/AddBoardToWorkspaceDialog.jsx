import { Check, LayoutGrid, Plus } from "lucide-react";
import { useState } from "react";

import { workspaceApi } from "@/api/workspace";
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextArea
} from "@/Components/UI";
import { BACKGROUND_COLORS } from "@/config/theme";
import { BOARD_KEYS, useCreateBoard, useMyBoards } from "@/features/boards/api/useBoards";
import { BOARD_KEYS as WORKSPACE_BOARD_KEYS } from "@/features/workspaces/api/useWorkspaceBoards";
import { getMyRole } from "@/helpers/role";
import { useZodForm } from "@/hooks";
import { boardSchema } from "@/schemas/boardSchema";
import { useAuthStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddBoardToWorkspaceDialog({ trigger, workspaceId }) {
  const [open, setOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(
    BACKGROUND_COLORS[0].class
  );
  const [selectedBoards, setSelectedBoards] = useState(new Set())
  
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  
  const { mutate: createBoard } = useCreateBoard();
  const { data: allBoards = [] } = useMyBoards();

  // Mutation to add existing boards
  const { mutateAsync: addBoardsToWorkspace } = useMutation({
    mutationFn: (data) => workspaceApi.addBoardsToWorkspace(workspaceId, data),
    onSuccess: () => {
         queryClient.invalidateQueries(WORKSPACE_BOARD_KEYS.list(workspaceId));
         queryClient.invalidateQueries(BOARD_KEYS.all);
    }
  });
  
  const availableBoards = allBoards.filter((board) => {
    // Phải là bảng chưa thuộc workspace nào
    if (board.workspace) return false;

    // Phải là owner hoặc admin của bảng đó
    const boardOwnerId = board.owner?._id || board.owner;
    const isOwner = boardOwnerId === user?._id;
    // Assuming board.members is array of objects with user and role
    const role = getMyRole(board.members);
    
    return isOwner || role === "admin";
  });
  
  const form = useZodForm(boardSchema);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const handleCreateNewBoard = (data) => {
    createBoard({
      ...data,
      color: selectedColor,
      visibility: "workspace",
      workspaceId: workspaceId,
    });

    // Reset
    reset();
    setOpen(false);
    setSelectedColor(BACKGROUND_COLORS[0].class);
  }

  const handleToggleBoardSelection = (boardId) => {
    const newSelected = new Set(selectedBoards)
    if (newSelected.has(boardId)) {
      newSelected.delete(boardId)
    } else {
      newSelected.add(boardId)
    }
    setSelectedBoards(newSelected)
  }

  const handleAddSelectedBoards = async () => {
    const boardIds = Array.from(selectedBoards);

    await addBoardsToWorkspace({
        boardIds
    });

    setSelectedBoards(new Set());
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex w-full gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Thêm bảng
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" />
            Thêm bảng vào workspace
          </DialogTitle>
          <DialogDescription>Tạo bảng mới hoặc thêm bảng sẵn có vào workspace này</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="new" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">Bảng mới</TabsTrigger>
            <TabsTrigger value="existing">Bảng sẵn có</TabsTrigger>
          </TabsList>

          {/* Tab: Create New Board */}
          <TabsContent value="new" className="space-y-4">
            <form onSubmit={handleSubmit(handleCreateNewBoard)}>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                    <section className="flex items-center justify-between">
                        <Label htmlFor="title">Tên bảng *</Label>
                        {errors.title?.message && (
                        <span className="ml-auto text-xs text-destructive">
                            {errors.title.message}
                        </span>
                        )}
                    </section>
                    <Input
                        id="title"
                        {...register("title")}
                        placeholder="Nhập tên bảng..."
                        className="focus-visible:ring-primary"
                    />
                    </div>
                    <div className="grid gap-2">
                    <section className="flex items-center justify-between">
                        <Label htmlFor="description">Mô tả</Label>
                        {errors.description?.message && (
                        <span className="ml-auto text-xs text-destructive">
                            {errors.description.message}
                        </span>
                        )}
                    </section>
                    <TextArea
                        rows={3}
                        id="description"
                        {...register("description")}
                        placeholder="Mô tả ngắn về bảng này..."
                        className="focus-visible:ring-primary"
                    />
                    </div>
                    <div className="grid gap-2">
                    <Label>Màu nền</Label>
                    <div className="flex gap-2 flex-wrap">
                        {BACKGROUND_COLORS.map((color) => (
                        <Button
                            type="button"
                            key={color.value}
                            className={`p-0 h-8 w-8 rounded-full hover:opacity-60 hover:${
                            color.class
                            } ${color.class} border-2 transition-all ${
                            selectedColor === color.class
                                ? "border-foreground scale-110"
                                : "border-transparent hover:scale-105"
                            }`}
                            onClick={() => setSelectedColor(color.class)}
                        />
                        ))}
                    </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                    className="leading-1.5"
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    >
                    Hủy
                    </Button>
                    <Button type="submit" className="leading-1.5">
                    Tạo bảng
                    </Button>
                </DialogFooter>
                </form>
          </TabsContent>

          {/* Tab: Add Existing Board */}
          <TabsContent value="existing" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Chọn bảng từ danh sách sẵn có:</p>
                {selectedBoards.size > 0 && (
                  <Badge className="rounded-xl">
                    {selectedBoards.size} được chọn
                  </Badge>
                )}
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {availableBoards.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">
                        Không có bảng nào khả dụng
                    </div>
                ) : (
                    availableBoards.map((board) => (
                    <div
                        key={board._id}
                        className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedBoards.has(board._id)
                            ? "border-primary bg-primary/5"
                            : "border-border/30 hover:border-border hover:bg-muted/30"
                        }`}
                        onClick={() => handleToggleBoardSelection(board._id)}
                    >
                        <div className="flex items-start gap-3">
                        <Checkbox
                            checked={selectedBoards.has(board._id)}
                            onCheckedChange={() => handleToggleBoardSelection(board._id)}
                            className="mt-0.5"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground">{board.title}</p>
                            <p className="text-xs text-muted-foreground">{board.description}</p>
                        </div>
                        {selectedBoards.has(board._id) && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        )}
                        </div>
                    </div>
                    ))
                )}
              </div>
            </div>

            <DialogFooter>
              <Button disabled={selectedBoards.size === 0} type="button" variant="outline" onClick={() => setSelectedBoards(new Set())}>
                Bỏ chọn { selectedBoards.size > 0 ? `(${selectedBoards.size})` : "" }
              </Button>
              <Button
                disabled={selectedBoards.size === 0}
                onClick={handleAddSelectedBoards}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Thêm vào workspace ({selectedBoards.size})
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AddBoardToWorkspaceDialog
