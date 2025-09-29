import { useState } from "react";
import { Copy, Building2 } from "lucide-react";

import {
  Button,
  Input,
  Label,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./UI";

function CreateBoardFromTemplateDialog({ template, children, onCreateBoard }) {
  const [open, setOpen] = useState(false);
  const [boardName, setBoardName] = useState(
    `${template.name} - ${new Date().toLocaleDateString()}`
  );
  const [selectedWorkspace, setSelectedWorkspace] = useState("1");

  // Mock workspaces data
  const workspaces = [
    { id: "1", name: "Công ty ABC", color: "bg-blue-500" },
    { id: "2", name: "Dự án cá nhân", color: "bg-green-500" },
    { id: "3", name: "Team Marketing", color: "bg-purple-500" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    onCreateBoard(template, boardName.trim(), selectedWorkspace);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <section
              className={`h-8 w-8 rounded-lg ${template.color} flex items-center justify-center`}
            >
              <div className="text-white text-sm">{<template.icon className="h-5 w-5" />}</div>
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
                <Badge key={list.id} variant="outline" className="text-xs">
                  {list.name}
                </Badge>
              ))}
            </section>
          </section>

          <div className="space-y-2">
            <Label htmlFor="boardName">Tên bảng</Label>
            <Input
              id="boardName"
              placeholder="Nhập tên bảng..."
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
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
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
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
              disabled={!boardName.trim()}
              className="leading-1.5 gap-2"
            >
              <Copy className="h-4 w-4" />
              Tạo bảng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateBoardFromTemplateDialog;
