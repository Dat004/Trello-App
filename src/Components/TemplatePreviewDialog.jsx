import { useState } from "react";
import { Copy, Eye, Star } from "lucide-react";

import {
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./UI";

function TemplatePreviewDialog({ trigger, template }) {
  const [open, setOpen] = useState(false);

  const useTemplate = () => {
    console.log("Using template:", template.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <section
              className={`h-8 w-8 rounded-lg ${template.color} flex items-center justify-center`}
            >
              <div className="text-white text-sm">
                {<template.icon className="h-5 w-5" />}
              </div>
            </section>
            {template.name}
            {template.isPopular && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            )}
          </DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        <section className="space-y-4">
          {/* Template Info */}
          <section className="flex items-center gap-4">
            <Badge variant="secondary">{template.popularity}% phổ biến</Badge>
            <section className="flex gap-1">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </section>
          </section>

          {/* Board Preview */}
          <section className="border rounded-lg p-4 bg-muted/20 overflow-hidden">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Xem trước bảng
            </h4>

            <section className="flex gap-4 overflow-x-auto pb-2">
              <section className="flex gap-4 overflow-x-auto pb-2">
                {template.lists.map((listName) => (
                  <Card
                    key={listName.id}
                    className="min-w-[250px] bg-background"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        {listName.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {listName.example_cards.map((card) => (
                          <div
                            key={card.id}
                            className="p-2 bg-card border rounded text-xs text-card-foreground"
                          >
                            {card.title}
                          </div>
                        ))}
                        <div className="p-2 border-2 border-dashed border-muted-foreground/30 rounded text-xs text-muted-foreground text-center">
                          + Thêm thẻ
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </section>
            </section>
          </section>

          {/* Lists Overview */}
          <div>
            <h4 className="font-medium mb-3">
              Cấu trúc bảng ({template.lists.length} cột)
            </h4>
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {template.lists.map((list, index) => (
                <section
                  key={list.id}
                  className="flex items-center gap-2 p-2 border rounded"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">{list.name}</span>
                </section>
              ))}
            </section>
          </div>

          {/* Usage Tips */}
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <h4 className="font-medium mb-2">Gợi ý sử dụng</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Tùy chỉnh tên các cột theo nhu cầu của dự án</li>
              <li>• Thêm thành viên và phân công công việc</li>
              <li>• Sử dụng nhãn màu để phân loại thẻ</li>
              <li>• Đặt deadline cho các thẻ quan trọng</li>
            </ul>
          </div>
        </section>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Đóng
          </Button>
          <Button onClick={useTemplate} className="leading-1.5 gap-2">
            <Copy className="h-4 w-4" />
            Sử dụng mẫu này
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TemplatePreviewDialog;
